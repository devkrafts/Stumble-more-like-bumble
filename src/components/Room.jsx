import React, { useEffect, useState } from "react";
import { clientA } from '../Client';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router';
import { restaurant } from '../constants/restaurant';

const Room = () => {


    const [channel, setChannel] = useState(null);
    const [swipeSession, setSwipSession] = useState(false);
    const [rest, setRest] = useState(0);
    const [user1SwipedData, setUser1SwipedData] = useState('');
    const [user2SwipedData, seUser2SwipedData] = useState('');


    // send a broadcast once user swipes - (eventname: swiped, payload: {id, swipedRight: true | false, userId }

    const handleSelected = () => {
        channel.send({
            type: 'broadcast',
            event: 'swiped',
            payload: {
                id: restaurant[rest].id,
                swipedRight: true,
            }
        })
        setRest(rest + 1)
    }


    const handleRejected = () => {
        channel.send({
            type: 'broadcast',
            event: 'swiped',
            payload: {
                id: restaurant[rest].id,
                swipedRight: false,
            }
        })
        setRest(rest + 1)

    }

    const params = useParams()
    console.log(params)


    const [user1Data, setUser1Data] = useState('')
    const [user2Data, setUser2Data] = useState('')


    useEffect(() => {

        const channelA = clientA.channel(params.id)

        const currentUserId = uuidv4();

        channelA
            .on(
                'presence',
                { event: 'join' },
                ({ key, newPresences }) => {
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
                { event: 'start-swiping' },
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
            .on(
                'broadcast',
                { event: 'swiped' },
                (payload) => {
                    console.log(payload)
                    // store payload in user1SwipedData as object , and then make list for each broadcast
                    setUser1SwipedData(user1SwipedData)

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
            event: 'start-swiping',
            payload: {
                message: 'sending message to user2'
            },
        })
        setSwipSession(true)
    }

    const data = restaurant[rest] // restaurant[i]
    return swipeSession ?
        <div>
            <div>
                <img src={data.image} width={400} height={600} />
                <h2>{data.name}</h2>
                <h5>{data.ratings}</h5>
                <h2>{data.description}</h2>
                <button onClick={handleRejected}>✕</button>
                <button onClick={handleSelected}>✓</button>

            </div>
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