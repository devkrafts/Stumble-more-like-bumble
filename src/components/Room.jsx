import React, { useEffect, useState } from "react";
import { clientA } from '../Client';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router';
import { restaurant } from '../constants/restaurant';
import { useNavigate } from "react-router";

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

    useEffect(() => {
        const lastElemOfUser2Data = user2SwipedData[user2SwipedData.length - 1];
        console.log("last elem ", lastElemOfUser2Data)
        if (lastElemOfUser2Data && lastElemOfUser2Data.swipedRight === true) {
            isAMatchUser2(lastElemOfUser2Data.id)

        }
    }, [user2SwipedData.length])


    const isAMatch = (restId) => {

        const restaurantToBechecked = user2SwipedData.find((obj) => obj.id === restId)
        //  console.log(":::::::::::::::::;", restaurantToBechecked, user2SwipedData, restId)
        if (restaurantToBechecked && restaurantToBechecked.swipedRight === true) {
            //  console.log("------matched-----")
            handleDetailsNavigation(restId)
        }
    }

    const isAMatchUser2 = (restId) => {
        const restToBeChecked = user1SwipedData.find((obj) => obj.id === restId)
        console.log("***********", restToBeChecked, user1SwipedData, restId)
        if (restToBeChecked && restToBeChecked.swipedRight === true) {
            console.log("____its a match___")
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

    const params = useParams()
    //console.log(params)


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
                    //console.log('join', key, newPresences[0].userId)

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
                    //console.log(payload)
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
                    console.log(payload)

                    // store payload in user1SwipedData as object , and then make list for each broadcast
                    setUser2SwipedData(user2SwipedData => [...user2SwipedData, payload])
                    console.log("@@@@@@@@ user1 swiped data", payload)
                    // isAMatchUser2(payload.id)

                }
            )
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    const presenceTrackStatus = await channelA.track({
                        user: 'user-1',
                        online_at: new Date().toISOString(),
                        userId: currentUserId,

                    })
                    // console.log(presenceTrackStatus)

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
        setSwipeSession(true)

    }
     if(rest===restaurant.length){
        return <div>
            <h3>Go touch the grass for today!</h3>
        </div>
    }

    const data = restaurant[rest]

    console.log("user 1 swiped data--", user1SwipedData)// returns array containing  payload objects
    console.log("user 2 swiped data--", user2SwipedData)



   
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