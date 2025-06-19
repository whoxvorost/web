import React, {FC, useCallback, useEffect, useState} from 'react';
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Article from "../../entities/Article/Article";

import bubble from '../../../images/bubble.svg';
import dots from '../../../images/dots.svg';

import './LastArticles.scss';
import {IDoctor} from "../../../interfaces/doctorInterfaces";
import DoctorServices from "../../../services/DoctorServices";

gsap.registerPlugin(ScrollTrigger);

const LastArticles: FC = () => {
    const [doctors, setDoctors] = useState<IDoctor[]>([])
    const [counter, setCounter] = useState<number>(3);

    const fetchDoctors = useCallback(async () => {
        const { data } = await DoctorServices.getDoctors(null);
        setDoctors(data);
    }, [setDoctors])

    useEffect(() => {
        fetchDoctors().then();
    }, [fetchDoctors]);

    const handleShowMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setCounter(prevCounter => prevCounter + 3);
    }

    return (
        <section className="last-articles">
            <h2 className="h2">Check out our latest article</h2>
            <div className="line"></div>
            <div className="articles">
                {doctors.slice(0, counter).map(doctor => (
                    <Article
                        key={doctor.doctor_id}
                        {...doctor}
                    />
                ))}
            </div>
            {counter < doctors.length && (
                <a href='/' className="blue-btn small h6" onClick={handleShowMore}>Show more</a>
            )}
            <img className="bubble" src={bubble} alt="bubble" />
            <img className="dots" src={dots} alt='dots' />
        </section>
    );
};

export default LastArticles;
