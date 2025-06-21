import React, {FC, useRef} from 'react';
import arrow from '../../../images/arrow.svg';

import './Feedbacks.scss';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Feedbacks: FC = () => {
    const ctxRef = useRef<gsap.Context>(gsap.context());
    const main = useRef<HTMLDivElement>(document.createElement('div'));

    React.useEffect( () => {


        ctxRef.current = gsap.context(() => {

            const slider = main.current.querySelectorAll(".feedbacks .slider");

            gsap.to(slider,
                {
                    opacity: 1,
                    y: 0,
                    duration: .5,
                    scrollTrigger: {
                        trigger: slider,
                        start: "top 90%",
                        end: "top 30%",
                        scrub: true,
                        toggleActions: "play pause resume reset"
                    }

                });

        }, main);

        return () => {
            if (ctxRef.current) {
                ctxRef.current.revert();
            }
        };


    }, []);

    return (
        <section className="feedbacks" ref={main}>
            <div className="slider">
                <h2 className="h2">What our customers are saying</h2>
                <div className="line"></div>
                <div className="feedback">
                    <div className="bio">
                        <div className="logo"></div>
                        <div className="fio">
                            <h3 className="h3">Edward Newgate</h3>
                            <h4 className="h6">Founder Circle</h4>
                        </div>
                    </div>
                    <h5 className="h6">"Our dedicated patient engagement app and web portal allow you to access
                        information instantaneously (no tedious form, long calls, or administrative hassle) and
                        securely"</h5>
                </div>
            </div>
            <div className="pagination">
                <img src={arrow} alt="→"/>
                <div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
                <img src={arrow} alt="→"/>
            </div>
        </section>
    );
};

export default Feedbacks;