import React, {FC, useEffect, useState} from 'react';
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Article from "../../entities/Article/Article";

import bubble from '../../../images/bubble.svg';
import dots from '../../../images/dots.svg';

import './LastArticles.scss';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, getDoctors, RootState} from "../../../store";
import {defaultSearchOptions} from "../../../interfaces/commonInterfaces";

gsap.registerPlugin(ScrollTrigger);

const LastArticles: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        doctors,
    } = useSelector((state: RootState) => state.doctorsReducer);
    const [counter, setCounter] = useState<number>(3);

    useEffect(() => {
        dispatch(getDoctors(defaultSearchOptions));
    }, []);
    const handleShowMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setCounter(prevCounter => prevCounter + 3);
    }

    return (
        <section className="last-articles">
            <h2 className="h2">Check out our latest article</h2>
            <div className="line"></div>
            <div className="articles">
                {doctors?.slice(0, counter).map(doctor => (
                    <Article
                        key={doctor.doctor_id}
                        {...doctor}
                    />
                ))}
            </div>
            {doctors && counter < doctors.length && (
                <a href='/' className="blue-btn small h6" onClick={handleShowMore}>Show more</a>
            )}
            <img className="bubble" src={bubble} alt="bubble"/>
            <img className="dots" src={dots} alt='dots'/>
        </section>
    );
};

export default LastArticles;
