import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useNavigate } from 'react-router';
import { PlayCircle, Check, X, Star, Send } from 'react-feather';
import { SwipeCard } from 'solid-swipe-card';
import { clientA } from '../Client';
import { v4 as uuidv4 } from 'uuid';
import { restaurant } from '../constants/restaurant';
import './styles/room.css';

const Room = () => {
    const screenRef = useRef(null);

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
        const channelA = clientA.channel(params.id);
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
                    if (currentUserId === leftPresences[0].userId) {
                        setUser1Data('')
                    } else {
                        setUser2Data('')
                    }
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
                        userId: currentUserId
                    })

                }
            });

        setChannel(channelA)
    }, []);

    useLayoutEffect(() => {
        if(screenRef.current && window.innerHeight) {
            screenRef.current.style.height = `${window.innerHeight}px`;
        }
      }, []);


    if(rest === restaurant.length){
        return <div>
            <h3>Go touch the grass for today!</h3>
        </div>
    }

    const data = restaurant[rest]
   
    return (
        <div className="room" ref={screenRef}>
            <div className="room__header">Stumble</div>
            {
                swipeSession ?
                <div className="room__swipe-mode">
                    {/* <SwipeCard> */}
                        <div className="room__swipe-mode__item">
                            <div className="room__swipe-mode__item__image-container">
                                <img className="room__swipe-mode__item__image" src={data.image} alt='detail' />
                                <div className="room__swipe-mode__item__details-container">
                                    <div className="room__swipe-mode__item__name"><strong>{data.name}</strong><Send /></div>
                                    <div className="room__swipe-mode__item__rating">
                                        {
                                            data.rating &&
                                            Array.from({length: Number(data.rating)}).map(() => <Star width={20} fill={'var(--secondary)'}/>)
                                        }
                                    </div>
                                    <div className="room__swipe-mode__item__description">{data.address}</div>
                                    <div className="room__swipe-mode__item__description-2">{data["address line 2"]}</div>
                                </div>
                            </div>
                            <div className="room__swipe-mode__item__actions">
                                <button className="room__swipe-mode__item__swipe-left" onClick={handleRejected}><X width={30} height={30}/></button>
                                <button className="room__swipe-mode__item__swipe-right" onClick={handleSelected}><Check width={30} height={30}/></button>
                            </div>

                        </div>
                    {/* </SwipeCard> */}
                </div>
                :
                <div className="room__waiting-room">
                    {
                        !user2Data ?
                        <div className="room__waiting-room__waiting">Waiting for your friend to join...</div>
                        :
                        <div className="room__waiting-room__waiting">Your friend has joined, let's go!</div>
                    }
                    <div className="room__waiting-room__select-section">
                        <div className="room__waiting-room__select-text">Let's pick a</div>
                        <select className="room__waiting-room__select">
                            {/* <option value="cafes">cafe</option> */}
                            <option value="restaurant">restaurant</option>
                            <option value="clubs">club</option>
                            {/* <option value="attractions">attraction</option> */}
                        </select>
                    </div>

                    {
                        user2Data &&
                        <button className="room__waiting-room__start" onClick={handleStart}>Let's go<PlayCircle /></button>
                    }
                </div>
            }
        </div>
    )
}


export default Room;