import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { restaurant } from '../constants/restaurant';
import { Star } from 'react-feather';
import './styles/details.css';


const Details = () => {
    const params = useParams()
    const [rest, setRest] = useState('')

    useEffect(() => {

        console.log(params, restaurant)
        setRest(restaurant.find((obj) => `${obj.id}` === params.detailId) || {})
        console.log(rest)
    }, [params.detailId])

    return <div>
        <div className="detail__header">Stumble</div>
        <div className='card'>
        
            <div className='detail-card'>
                <div className='img-container'>
                    <img src={rest.image} />
                </div>

                <div className='layout'>
                    <div className='header-name'>
                        <h2>{rest.name}</h2>
                    </div>
                    <h3 className='rating'>5 

                        {rest.rating &&
                            Array.from({ length: Number(rest.rating) }).map(() => <Star width={20} fill={'var(--secondary)'} />)
                        }

                    </h3>
                    <h3 className='address'>{rest.address}</h3>
                    <h3 className='contact'>{rest.phone} </h3>

                   

                </div>
                <h2 className='match-txt'>It's a match! </h2>

            </div>
        </div>





    </div>

}

export default Details;