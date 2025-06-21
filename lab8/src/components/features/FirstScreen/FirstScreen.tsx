import React, {FC, useRef} from 'react';
import arrow from '../../../images/arrow.svg';
import dots from '../../../images/dots.svg';

import './FirstScreen.scss';
import gsap from "gsap";
const FirstScreen: FC = () => {
    const ctxRef = useRef<gsap.Context>(gsap.context());
    const main = useRef<HTMLDivElement>(document.createElement('div'));

    React.useEffect( () => {


        ctxRef.current = gsap.context(() => {
            let mm = gsap.matchMedia();

            const heroText = main.current.querySelectorAll(".first-screen .h2");
            const imgContainer = main.current.querySelectorAll(".first-screen .img-container");

            gsap.to(heroText, {opacity: 1, x: 0, duration: .6 });

            // desktop anim
            mm.add('(min-width: 878px)', () => {
                gsap.to(imgContainer, { opacity: 1, x: 0, duration: .5 });
            })

        }, main);

        return () => {
            if (ctxRef.current) {
                ctxRef.current.revert();
            }
        };


    }, []);

    return (
        <section className="first-screen" ref={main}>
            <div className="info">
                <h2 className="h2">Download our mobile apps</h2>
                <div></div>
                <h3 className="h4">Our dedicated patient engagement app and web portal allow you to access information
                    instantaneously (no tedious form, long calls, or administrative hassle) and securely</h3>
                <a href='/' className="blue-btn h4">Download <img src={arrow} alt="→"/></a>
            </div>
            <div className="img-container">
                <img src={dots} alt='dots'/>
            </div>
        </section>
    );
};

export default FirstScreen;