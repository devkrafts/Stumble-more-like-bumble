import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router';
import { clientA } from '../Client';
import { v4 as uuidv4 } from 'uuid';
import { restaurant } from '../constants/restaurant';
import './styles/room.css';

const Room = () => {

    const navigation = useNavigate();
    const handleDetailsNavigation = (id) => {
        navigation(`/details/${id}`)
    }

    const [channel, setChannel] = useState(null);
    const [swipeSession, setSwipeSession] = useState(false);
    const [rest, setRest] = useState(0);
    const [user1SwipedData, setUser1SwipedData] = useState([]);
    const [user2SwipedData, setUser2SwipedData] = useState([]);
    const [user1Data, setUser1Data] = useState('');
    const [user2Data, setUser2Data] = useState('');
    const params = useParams();

    const isAMatch = (restId) => {

        const restaurantToBechecked = user2SwipedData.find((obj) => obj.id === restId)
        if (restaurantToBechecked && restaurantToBechecked.swipedRight === true) {
            handleDetailsNavigation(restId)
        }
    }

    const isAMatchUser2 = (restId) => {
        const restToBeChecked = user1SwipedData.find((obj) => obj.id === restId)
        if (restToBeChecked && restToBeChecked.swipedRight === true) {
            handleDetailsNavigation(restId)
        }
    }

    // send a broadcast once user swipes - (eventname: swiped, payload: {id, swipedRight: true | false, userId }

    const handleSelected = () => {
        const payload = { id: restaurant[rest].id, swipedRight: true };
        channel.send({
            type: 'broadcast',
            event: 'swiped',
            payload: payload
        })
        
        setRest(rest + 1)
        
        
        setUser1SwipedData([...user1SwipedData, payload])
        isAMatch(payload.id)
    }

    const handleRejected = () => {
        const payload = { id: restaurant[rest].id, swipedRight: false };
        channel.send({
            type: 'broadcast',
            event: 'swiped',
            payload: payload
        })
        setRest(rest + 1)
        setUser1SwipedData([...user1SwipedData, payload])

    }

    // sends  broadcast session once 1 user clicks on "start swipping" button
    const handleStart = () => {
        channel.send({
            type: 'broadcast',
            event: 'start-swiping',
            payload: {
                message: 'sending message to user2'
            },
        })
        setSwipeSession(true)

    }

    useEffect(() => {
        const lastElemOfUser2Data = user2SwipedData[user2SwipedData.length - 1];
        if (lastElemOfUser2Data && lastElemOfUser2Data.swipedRight === true) {
            isAMatchUser2(lastElemOfUser2Data.id)

        }
    }, [user2SwipedData.length]);

    useEffect(() => {
        const channelA = clientA.channel(params.id)
        const currentUserId = uuidv4();

        channelA
            .on(
                'presence',
                { event: 'join' },
                ({ key, newPresences }) => {
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
                    setChannel(channelA)
                    setSwipeSession(true)
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
                ({ payload }) => {
                    // store payload in user2SwipedData as object , and then make list for each broadcast
                    setUser2SwipedData(user2SwipedData => [...user2SwipedData, payload])
                }
            )
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channelA.track({
                        user: 'user-1',
                        online_at: new Date().toISOString(),
                        userId: currentUserId,

                    })

                }
            })
        setChannel(channelA)
    }, [])


    if(rest === restaurant.length){
        return <div>
            <h3>Go touch the grass for today!</h3>
        </div>
    }

    const data = restaurant[rest]
   
    return swipeSession ?
        <div className="swipe-mode">
            <div>
                <img src={data.image} width={400} height={600} alt='detail' />
                <h2>{data.name}</h2>
                <h5>{data.ratings}</h5>
                <h2>{data.description}</h2>
                <button onClick={handleRejected}>✕</button>
                <button onClick={handleSelected}>✓</button>

            </div>
        </div>

        :

        <div className="waiting-room">
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
                {/* <option value="cafes">Cafes</option> */}
                <option value="restaurant">Restaurant</option>
                <option value="clubs">Clubs/Pubs</option>
                {/* <option value="attractions">Attractions</option> */}
            </select>

        </div>
}


export default Room;