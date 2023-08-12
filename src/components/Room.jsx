import React, { useEffect, useState } from "react";
import { clientA } from '../Client';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router';

const Room = () => {

    const [channel, setChannel] = useState(null);
    const [swipeSession, setSwipSession] = useState(false);


    const params = useParams()
    console.log(params)


    const [user1Data, setUser1Data] = useState('')
    const [user2Data, setUser2Data] = useState('')


    useEffect(() => {

        const channelA = clientA.channel(params.id)
        console.log("::::::::", channelA)

        const currentUserId = uuidv4();


        channelA
            // .on(
            //     'presence',
            //     { event: 'sync' },
            //     () => {
            //         const newState = channelA.presenceState()
            //         console.log('sync', newState)
            //     }
            // )
            .on(
                'presence',
                { event: 'join' },
                ({ key, newPresences }) => {


                    ///  setUser1Data(newPresences[0].userId)
                    console.log('join', key, newPresences[0].userId)

                    if (currentUserId === newPresences[0].userId) {
                        setUser1Data(currentUserId)
                    } else {
                        setUser2Data(newPresences[0].userId)
                    }
                }
            )
            .on(
                'broadcast',
                { event: 'start-typing' },
                (payload) => {
                    console.log(payload)
                    setChannel(channelA)

                }
            )
            .on(
                'presence',
                { event: 'leave' },
                ({ key, leftPresences }) => {
                    console.log('leave', key, leftPresences)
                }
            )
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    const presenceTrackStatus = await channelA.track({
                        user: 'user-1',
                        online_at: new Date().toISOString(),
                        userId: currentUserId,

                    })
                    console.log(presenceTrackStatus)

                }
            })
        setChannel(channelA)
    }, [])


    // sends  broadcast session once 1 user clicks on "start swipping" button
    const handleStart = () => {
        channel.send({
            type: 'broadcast',
            event: 'start-typing',
            payload: {
                message: 'sending message to user2'
            },
        })
        setSwipSession(true)
        // console.log(broadcastMessage)

    }

    return swipeSession ?
        <div>
            <h4>Swipeeee</h4>
        </div>

        :

        <div>
            {
                !user2Data &&

                <h4>Waiting for the other user to join...</h4>
            }
            {user2Data &&
                <>
                    <h4>The other user has joined...</h4>
                    <button onClick={handleStart}>Start swiping</button>
                    <h3>Allow location </h3>
                    <h3>Select an activity</h3>
                </>
            }
            <select>
                <option value="cafes">Cafes</option>
                <option value="restaurant">Restaurant</option>
                <option value="clubs">Clubs/Pubs</option>
                <option value="attractions">Attractions</option>
            </select>

        </div>
}


export default Room;