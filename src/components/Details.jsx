import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { restaurant } from '../constants/restaurant';

const Details = () => {
    const params = useParams()
    const [rest, setRest] = useState('')

    useEffect(()=>{

        console.log(params, restaurant)
        setRest(restaurant.find((obj)=>`${obj.id}`===params.detailId)||{})
        console.log(rest)
    }, [params.detailId])

    return <div>
        <img src={rest.image}/>
        <h2> {rest.name}</h2>
        <h3>5 km away</h3>
        <h4>Cuisine: Mexican</h4>
        <h5>Closed/open</h5>
        <h3>{rest.ratings}</h3>
        <button>Directions</button>
    </div>

}

export default Details;