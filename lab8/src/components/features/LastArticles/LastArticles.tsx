import React, { FC, useRef, useState, useEffect } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Article from "../../entities/Article/Article";
import articles from "./articlesData.json";
import DoctorItem from "../../entities/DoctorItem/DoctorItem";
import { useDoctors } from "../../context/DoctorsContext";

import bubble from '../../../images/bubble.svg';
import dots from '../../../images/dots.svg';

import './LastArticles.scss';

gsap.registerPlugin(ScrollTrigger);

const LastArticles: FC = () => {
    const { doctors } = useDoctors();
    const [counter, setCounter] = useState<number>(3);
    const ctxRef = useRef<gsap.Context | null>(null);
    const main = useRef<HTMLDivElement>(null);

    const handleShowMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setCounter(prevCounter => prevCounter + 3);
    }

    useEffect(() => {
        if (ctxRef.current) {
            ctxRef.current.revert();
        }

        ctxRef.current = gsap.context(() => {
            const articles = main.current?.querySelectorAll(".article");

            articles?.forEach((article, index) => {
                const animation = gsap.fromTo(article,
                    {
                        opacity: 0,
                        transform: 'translateY(10svh)'
                    },
                    {
                        opacity: 1,
                        transform: 'translateY(0px)',
                        ease: "power1.inOut",
                        delay: (index + 1) * 0.1,
                        scrollTrigger: {
                            trigger: article,
                            once: false,
                            start: 'top bottom 100%',
                            toggleActions: 'play none none reverse',
                            invalidateOnRefresh: true
                        }
                    });
                ScrollTrigger.create({
                    trigger: article,
                    start: 'top bottom',
                    onEnter: () => animation.restart(true),
                    onLeaveBack: () => animation.reverse(),
                });
            });
        }, main);

        return () => {
            if (ctxRef.current) {
                ctxRef.current.revert();
            }
        };
    }, [counter]);

    return (
        <section className="last-articles" ref={main}>
            <h2 className="h2">Check out our latest article</h2>
            <div className="line"></div>
            <div className="articles">
                {/*{articles.slice(0, counter).map(article => (*/}
                {/*    <Article key={article.id} {...article} />*/}
                {/*))}*/}
                {doctors.slice(0, counter).map(doctor => (
                    <Article
                        key={doctor.doctor_id}
                        id={doctor.doctor_id}
                        title={doctor.name}
                        description={doctor.description}
                        picture={doctor.picture}
                    />
                ))}
            </div>
            {counter < articles.length && (
                <a href='/' className="blue-btn small h6" onClick={handleShowMore}>Show more</a>
            )}
            <img className="bubble" src={bubble} alt="bubble" />
            <img className="dots" src={dots} alt='dots' />
        </section>
    );
};

export default LastArticles;
