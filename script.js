gsap.registerPlugin(ScrollTrigger);

// 1. Hero Image slight zoom on scroll
gsap.to('.hero-bg-img', {
    scale: 1.15,
    ease: "none",
    scrollTrigger: {
        trigger: '.hero-wrapper',
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// 2. Hero Text Blur Effect (Smooth Bell Curve Animation)
const scrollLines = document.querySelectorAll('.scroll-line');
scrollLines.forEach(line => {
    
    // We use a single timeline to control both entering and leaving the center!
    // This entirely prevents the overlapping bugs that made texts sporadically opaque or blurry.
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: line,
            start: "top 75%",     // the element starts animating as it crosses 75% height of the screen
            end: "bottom 25%",    // the element finishes its animation when it crosses 25% height of the screen
            scrub: true           // smoothly syncs with the scrollbar
        }
    });

    // 1st Half: Fade IN + Clear UP (0% to 50% of the movement)
    tl.fromTo(line, 
        { opacity: 0.15, filter: 'blur(12px)', scale: 0.9 },
        { opacity: 1, filter: 'blur(0px)', scale: 1, ease: "power2.inOut", duration: 1 }
    )
    // 2nd Half: Fade OUT + Blur DOWN (50% to 100% of the movement)
    .to(line, 
        { opacity: 0.15, filter: 'blur(12px)', scale: 0.9, ease: "power2.inOut", duration: 1 }
    );
});

// 3. 4 Malzeme — directional stagger scroll-in
if (document.querySelector('.ingredients-section')) {

    // Label soldan gelir
    gsap.fromTo('.ing-label',
        { opacity: 0, x: -30 },
        {
            opacity: 1, x: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.ingredients-section',
                start: "top 78%",
                toggleActions: "play none none none"
            }
        }
    );

    // Her kart farklı yönden + hafif rotasyon
    const ingItems = document.querySelectorAll('.ing-item');
    const fromVars = [
        { opacity: 0, y: 90,  x: -30, rotation: -4 },  // UN  — sol-alttan
        { opacity: 0, y: -80, x: 0,   rotation:  2 },  // SU  — üstten
        { opacity: 0, y: 90,  x: 0,   rotation: -2 },  // TUZ — alttan
        { opacity: 0, y: -60, x: 30,  rotation:  4 },  // ZAMAN — sağ-üstten
    ];

    ingItems.forEach((item, i) => {
        gsap.fromTo(item,
            fromVars[i],
            {
                opacity: 1, y: 0, x: 0, rotation: 0,
                duration: 1,
                ease: "power3.out",
                delay: i * 0.12,
                scrollTrigger: {
                    trigger: '.ingredients-section',
                    start: "top 72%",
                    toggleActions: "play none none none"
                }
            }
        );

        // Büyük isim (UN, SU...) ayrıca scale-in
        const name = item.querySelector('.ing-name');
        if (name) {
            gsap.fromTo(name,
                { scale: 0.65, opacity: 0 },
                {
                    scale: 1, opacity: 1,
                    duration: 0.8,
                    ease: "back.out(1.4)",
                    delay: i * 0.12 + 0.2,
                    scrollTrigger: {
                        trigger: '.ingredients-section',
                        start: "top 72%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }

        // Altın çizgi genişler
        const line = item.querySelector('.ing-line');
        if (line) {
            gsap.fromTo(line,
                { width: 0, opacity: 0 },
                {
                    width: 36, opacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    delay: i * 0.12 + 0.45,
                    scrollTrigger: {
                        trigger: '.ingredients-section',
                        start: "top 72%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    });
}

// 4. Tilted Images parallax
gsap.utils.toArray('.tilted-img').forEach((img, i) => {
    gsap.to(img, {
        y: -30 * (i % 2 === 0 ? 1 : -1),
        scrollTrigger: {
            trigger: '.tilted-grid-section',
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });
});

// 5. Video Reveal Parallax & Playback
const vrWrapper = document.querySelector('.video-reveal-wrapper');
const realVideo = document.getElementById('bread-video');
const playBtn = document.getElementById('play-pause-btn');

if (vrWrapper && realVideo) {
    // Autoplay when scrolling into view
    ScrollTrigger.create({
        trigger: vrWrapper,
        start: "top bottom",
        onEnter: () => realVideo.play().catch(() => {}),
        onLeaveBack: () => realVideo.pause()
    });

    if(playBtn) {
        // Since video is playing auto, change button to toggle sound
        playBtn.innerText = "SESİ AÇ";
        playBtn.addEventListener('click', () => {
            if (realVideo.muted) {
                realVideo.muted = false;
                playBtn.innerText = "SESİ KIS";
            } else {
                realVideo.muted = true;
                playBtn.innerText = "SESİ AÇ";
            }
        });
    }
}
