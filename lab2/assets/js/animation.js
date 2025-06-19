gsap.registerPlugin(ScrollTrigger);

let mm = gsap.matchMedia();

gsap.to(".first-screen .h2", {opacity: 1, x: 0, duration: .6 });

// desktop anim
mm.add('(min-width: 878px)', () => {
    gsap.to(".first-screen .img-container", { opacity: 1, x: 0, duration: .5 });
})
gsap.to(".feedbacks .slider", 
    {
        opacity: 1,
        y: 0,
        duration: .5,
        scrollTrigger: {
            trigger: ".feedbacks .slider",
            start: "top 90%",
            end: "top 30%",
            scrub: true,
            toggleActions: "play pause resume reset" 
        }

    });

const articles = document.querySelectorAll(".article");
articles.forEach((article, index) => {
    const animation = gsap.fromTo(article, 
        {
            opacity: 0,
            transform: 'translateY(10svh)'
        },
        {
            opacity: 1,
            transform: 'translateY(0px)',
            ease: "power1.inOut",
            delay: (index + 1) * 0.2,

            scrollTrigger: {
                trigger: article,
                once: false,
                start: 'top, bottom 100%',
                toggleActions: 'play none none reverse',
                onEnter: () => animation.restart(true),
                onLeaveBack: () => animation.reverse(),
                invalidateOnRefresh: true
            }
    
        });
})