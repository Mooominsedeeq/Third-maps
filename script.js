document.addEventListener("DOMContentLoaded", () => {
    /* ==========================================================================
       1. Lenis Smooth Scroll Initialization
       ========================================================================== */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /* ==========================================================================
       2. Luxury Loader
       ========================================================================== */
    window.addEventListener("load", () => {
        const loader = document.getElementById("loader");
        const loaderText = document.querySelector(".loader-text");
        const progressBar = document.querySelector(".progress-bar");
        
        const tl = gsap.timeline();
        
        tl.to(progressBar, { width: "100%", duration: 1.5, ease: "power2.inOut" })
          .to(loaderText, { opacity: 1, y: 0, duration: 0.5 }, "-=0.5")
          .to(loader, { y: "-100%", duration: 0.8, ease: "power4.inOut", delay: 0.5 })
          .from(".hero-title .title-line", { y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=0.2")
          .from(".hero-subtitle, .hero-actions", { y: 30, opacity: 0, duration: 0.8, stagger: 0.2 }, "-=0.5")
          .from(".hero-athlete", { x: 100, opacity: 0, duration: 1, ease: "power3.out" }, "-=1")
          .to(".scroll-down-indicator", { opacity: 1, duration: 1 });
    });

    /* ==========================================================================
       3. Navbar & Scroll Progress
       ========================================================================== */
    const navbar = document.querySelector(".navbar");
    const scrollProgress = document.querySelector(".scroll-progress");
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        // Navbar Scrolled State
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Scroll Progress Indicator
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";

        // Back to top button visibility
        if (window.scrollY > 500) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    });

    backToTop.addEventListener("click", () => {
        lenis.scrollTo(0, { duration: 1.5 });
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-links a");

    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        const icon = menuBtn.querySelector("i");
        if(mobileMenu.classList.contains("active")) {
            icon.classList.remove("ri-menu-4-line");
            icon.classList.add("ri-close-line");
            lenis.stop(); // Stop scroll when menu is open
        } else {
            icon.classList.remove("ri-close-line");
            icon.classList.add("ri-menu-4-line");
            lenis.start();
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            mobileMenu.classList.remove("active");
            menuBtn.querySelector("i").classList.replace("ri-close-line", "ri-menu-4-line");
            lenis.start();
            const target = link.getAttribute("href");
            lenis.scrollTo(target, { offset: -80 });
        });
    });

    // Desktop Nav Links Lenis Scroll
    document.querySelectorAll('.nav-links a, .hero-actions a[href^="#"], .footer-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                lenis.scrollTo(href, { offset: -80 });
            }
        });
    });

    /* ==========================================================================
       4. GSAP ScrollTrigger Animations
       ========================================================================== */
    gsap.registerPlugin(ScrollTrigger);

    // Hero Parallax
    gsap.to(".hero-bg-img", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".hero-athlete", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Reveal Up Elements
    gsap.utils.toArray('.reveal-up').forEach(elem => {
        gsap.to(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleClass: "active"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Reveal Left Elements
    gsap.utils.toArray('.reveal-left').forEach(elem => {
        gsap.to(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
            },
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Reveal Right Elements
    gsap.utils.toArray('.reveal-right').forEach(elem => {
        gsap.to(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
            },
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Animated Counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,
            onEnter: () => {
                const target = +counter.getAttribute('data-target');
                const isFloat = target % 1 !== 0;
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerHTML: isFloat ? 0.1 : 1 },
                    onUpdate: function() {
                        counter.innerHTML = isFloat ? Number(this.targets()[0].innerHTML).toFixed(1) : Math.round(this.targets()[0].innerHTML);
                    }
                });
            }
        });
    });

    /* ==========================================================================
       5. Magnetic Button Effect
       ========================================================================== */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    /* ==========================================================================
       6. 3D Card Tilt Effect
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });

    /* ==========================================================================
       7. Swiper Initialization (Trainers & Reviews)
       ========================================================================== */
    const trainersSwiper = new Swiper('.trainers-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        }
    });

    const reviewsSwiper = new Swiper('.reviews-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        }
    });

    /* ==========================================================================
       8. Image Gallery Modal
       ========================================================================== */
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const captionText = document.getElementById("modalCaption");
    const closeBtn = document.querySelector(".close-modal");
    const galleryItems = document.querySelectorAll(".masonry-item");

    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const img = item.querySelector("img");
            const caption = item.querySelector("span").innerText;
            
            modal.style.display = "flex";
            modalImg.src = img.src;
            captionText.innerHTML = caption;
            lenis.stop(); // Prevent scrolling while modal is open
        });
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        lenis.start();
    });

    window.addEventListener("click", (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
            lenis.start();
        }
    });

    /* ==========================================================================
       9. Before/After Transformation Slider
       ========================================================================== */
    const slider = document.getElementById("baSlider");
    const imgBefore = document.querySelector(".img-before");
    const sliderBtn = document.querySelector(".slider-button");

    if (slider) {
        slider.addEventListener("input", (e) => {
            const val = e.target.value;
            imgBefore.style.width = `${val}%`;
            sliderBtn.style.left = `${val}%`;
        });
    }

    /* ==========================================================================
       10. FAQ Accordion
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content').style.maxHeight = null;
                i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            });

            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                const content = item.querySelector('.accordion-content');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    /* ==========================================================================
       11. Background Particles Canvas (Floating Dust/Stars)
       ========================================================================== */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }

            draw() {
                ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            let numParticles = window.innerWidth < 768 ? 50 : 100;
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }
});
