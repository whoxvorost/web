import React, { FC } from 'react';
import {Link, useParams} from 'react-router-dom';
import { useDoctors } from "../../context/DoctorsContext";
import starIcon from '../../../images/star.png';
import './ItemPage.scss';

const ItemPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const { doctors } = useDoctors();
    const doctor = doctors.find(d => d.doctor_id === Number(id));

    if (!doctor) {
        return <div className='item-page'>Doctor not found</div>;
    }

    return (
        <div className='item-page'>
            <div className='info'>
                <img className='avatar' src={doctor.picture} alt={doctor.name}/>
                <div className='details'>
                    <div className='filters'>
                        <div className='yellow'>
                            {doctor.rating}
                            <img width={20} height={20} src={starIcon} alt='stars'/>
                        </div>
                        <div className='blue'>{doctor.location}</div>
                    </div>
                    <h1 className='h2'>{doctor.name}</h1>
                    <h2 className={'h7'}>{doctor.description}</h2>
                </div>
            </div>

            <div className='navigation'>
                <h5 className='h4'>Price: {doctor.price} $</h5>
                <Link to={'/catalog'} className='blue-btn small'>Go back</Link>
            </div>

            {/*<h1>{doctor.name}</h1>*/}
            {/*<p>{doctor.description}</p>*/}
            {/*<p>Price: {doctor.price} $</p>*/}
            {/*<img src={doctor.picture} alt={doctor.name} />*/}
        </div>
    );
};

export default ItemPage;