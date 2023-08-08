import React, { useEffect } from "react";
import { clientA, clientB } from '../Client';

import { useParams } from 'react-router';

const Room = () => {

    const params = useParams()
    console.log(params)


    useEffect(() => {

        const channelA = clientA.channel(params.id)


        channelA
            .on(
                'presence',
                { event: 'sync' },
                () => {
                    const newState = channelA.presenceState()
                    console.log('sync', newState)
                }
            )
            .on(
                'presence',
                { event: 'join' },
                ({ key, newPresences }) => {
                    console.log('join', key, newPresences)
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
                    })
                    console.log(presenceTrackStatus)
                }
            })


    }, [])





    return <div>
        <h4>Waiting for User1 to join...</h4>
        <h3>Anushka is online</h3>
        <h3>Enter your display name</h3>
        <input></input>
        <button>Start swiping</button>
        <h3>Allow location </h3>
        <h3>Select an activity</h3>
        <select>
            <option value="cafes">Cafes</option>
            <option value="restaurant">Restaurant</option>
            <option value="clubs">Clubs/Pubs</option>
            <option value="attractions">Attractions</option>
        </select>
    </div>
}

export default Room;