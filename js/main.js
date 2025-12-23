// ===== CUSTOM CURSOR =====
// Cursore personalizzato disabilitato
// const cursorDot = document.querySelector('.cursor-dot');
// const cursorOutline = document.querySelector('.cursor-outline');

// ===== DARK MODE TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark-mode');
    }
    
    // Toggle theme with smooth transition
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            htmlElement.classList.toggle('dark-mode');
            const isDarkMode = htmlElement.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%);
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }

    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            const isOpen = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ===== TILT EFFECT FOR CARDS =====
    const tiltElements = document.querySelectorAll('[data-tilt], .feature-card, .service-card, .category-card');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    tiltElements.forEach(el => {
        // Skip tilt on mobile for elements explicitly marked
        if (isMobile && el.classList.contains('no-tilt-mobile')) {
            el.style.transform = 'perspective(1150px) rotateX(0) rotateY(0) translateZ(0)';
            return;
        }

        el.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 28; // inclinazione ancora più morbida
            const rotateY = (centerX - x) / 28;
            
            this.style.transform = `perspective(1150px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(3px)`;
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1150px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for scroll animation
    document.querySelectorAll('.feature-card, .service-card, .info-item, .social-card, .category-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        observer.observe(el);
    });

    // ===== PARALLAX EFFECT WITH SMOOTH SCROLL =====
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.gradient-ball');
                
                parallaxElements.forEach((el, index) => {
                    const speed = 0.3 + (index * 0.1);
                    const offsetX = scrolled * speed * 0.5;
                    const offsetY = scrolled * speed;
                    const scale = 1 + scrolled * 0.00005;
                    el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
                });

                // Hide/show scroll indicator with smooth fade
                const scrollIndicator = document.querySelector('.scroll-indicator');
                if (scrollIndicator) {
                    const targetOpacity = scrolled > 100 ? '0' : '1';
                    scrollIndicator.style.transition = 'opacity 0.3s ease';
                    scrollIndicator.style.opacity = targetOpacity;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ===== FORM VALIDATION & ANIMATION =====
    const contactForm = document.getElementById('contactForm');
    const quoteForm = document.getElementById('quoteForm');
    const form = contactForm || quoteForm;
    
    if (form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Add focus animations
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (this.parentElement.classList.contains('form-group')) {
                    this.parentElement.style.transform = 'scale(1.02)';
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.parentElement.classList.contains('form-group')) {
                    this.parentElement.style.transform = 'scale(1)';
                }
            });

            // Real-time validation
            input.addEventListener('input', function() {
                if (this.type === 'text' && this.checkValidity()) {
                    this.style.borderColor = 'var(--primary)';
                } else if (this.value.length > 0 && !this.checkValidity()) {
                    this.style.borderColor = '#ef4444';
                }
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                // Check required fields
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                    input.style.animation = 'shake 0.4s ease';
                    setTimeout(() => input.style.animation = '', 400);
                } else if (input.type === 'email' && input.value && !input.checkValidity()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = '';
                }
            });

            // Check privacy checkbox if it exists
            const privacyCheckbox = form.querySelector('#privacy');
            if (privacyCheckbox && !privacyCheckbox.checked) {
                isValid = false;
                privacyCheckbox.style.borderColor = '#ef4444';
            }

            if (isValid) {
                const button = this.querySelector('.btn-primary');
                const originalText = button.innerHTML;
                
                button.innerHTML = '<span style="display: flex; align-items: center; gap: 0.5rem;"><span style="animation: spin 0.6s linear infinite; display: inline-block;">⚡</span> Elaborazione...</span>';
                button.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    button.innerHTML = '<span style="display: flex; align-items: center; gap: 0.5rem;">✓ Inviato con successo!</span>';
                    button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                    
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.background = '';
                        button.style.pointerEvents = '';
                        this.reset();
                        
                        // Reset input styles
                        inputs.forEach(input => {
                            input.style.borderColor = '';
                        });

                        // Scroll to top with success message
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 2500);
                }, 1500);
            }
        });

        // Manage select value state so labels behave
        const selects = form.querySelectorAll('select');
        selects.forEach(sel => {
            const updateSelectState = () => {
                // Mirror current value as attribute for CSS selector
                sel.setAttribute('value', sel.value);
                // Hide base label when a non-empty option is selected
                const fg = sel.closest('.form-group');
                if (fg) fg.classList.toggle('select-filled', sel.value !== '');
            };
            updateSelectState();
            sel.addEventListener('change', updateSelectState);
            sel.addEventListener('blur', updateSelectState);
        });
    }

    // ===== TYPING EFFECT FOR HERO SUBTITLE =====
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && !sessionStorage.getItem('typingDone')) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.opacity = '1';
        
        let index = 0;
        const typeSpeed = 50;
        
        function type() {
            if (index < text.length) {
                heroSubtitle.textContent += text.charAt(index);
                index++;
                setTimeout(type, typeSpeed);
            } else {
                sessionStorage.setItem('typingDone', 'true');
            }
        }
        
        setTimeout(type, 800);
    }

    // ===== HEADER SCROLL EFFECT =====
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.padding = '1rem 0';
            header.style.boxShadow = 'none';
        }
        
        // Hide header on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // ===== ADD CSS ANIMATIONS =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        header {
            transition: all 0.3s ease;
        }
        
        .form-group {
            transition: transform 0.2s ease;
        }
    `;
    document.head.appendChild(style);

    // ===== LOGO CLICK EASTER EGG =====
    const logo = document.querySelector('.logo');
    let clickCount = 0;
    
    if (logo) {
        logo.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 5) {
                logo.style.animation = 'none';
                setTimeout(() => {
                    logo.style.animation = 'spin 0.5s ease';
                    setTimeout(() => {
                        logo.style.animation = 'float 3s ease-in-out infinite';
                    }, 500);
                }, 10);
                clickCount = 0;
            }
        });
    }

    console.log('🎨 Pinizzotto - Website loaded successfully!');
    
    // ===== PLASTICATURA: sincronizza select e opzioni radio (Opaca/Lucida) =====
    const plastSelect = document.getElementById('plasticatura');
    const radioOpaca = document.getElementById('plastica-opaca');
    const radioLucida = document.getElementById('plastica-lucida');

    if (plastSelect && radioOpaca && radioLucida) {
        const applyFromSelect = () => {
            const v = plastSelect.value;
            if (v === 'opaca') {
                radioOpaca.checked = true;
                radioLucida.checked = false;
            } else if (v === 'lucida') {
                radioLucida.checked = true;
                radioOpaca.checked = false;
            } else {
                radioOpaca.checked = false;
                radioLucida.checked = false;
            }
        };

        const applyFromRadio = () => {
            if (radioOpaca.checked) plastSelect.value = 'opaca';
            else if (radioLucida.checked) plastSelect.value = 'lucida';
        };

        // Init from current select value
        applyFromSelect();

        // Listeners
        plastSelect.addEventListener('change', applyFromSelect);
        radioOpaca.addEventListener('change', applyFromRadio);
        radioLucida.addEventListener('change', applyFromRadio);
    }

    // ===== PRIVACY MODAL =====
    const privacyLink = document.getElementById('privacyLink');
    const privacyModal = document.getElementById('privacyModal');
    const privacyClose = document.getElementById('privacyClose');

    // Helper to open/close privacy modal; works on touch and delegated triggers
    const openPrivacy = (e) => {
        if (!privacyModal) return;
        if (e) e.preventDefault();
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closePrivacy = () => {
        if (!privacyModal) return;
        privacyModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (privacyModal) {
        if (privacyClose) {
            privacyClose.addEventListener('click', closePrivacy);
        }

        privacyModal.addEventListener('click', function(e) {
            if (e.target === privacyModal) closePrivacy();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && privacyModal.classList.contains('active')) {
                closePrivacy();
            }
        });

        // Attach to any element marked for privacy modal (anchor or button), plus legacy #privacyLink
        const privacyTriggers = Array.from(document.querySelectorAll('[data-privacy-link], #privacyLink'));
        privacyTriggers.forEach(trigger => {
            trigger.addEventListener('click', openPrivacy);
        });
    }

    // ===== Reveal on Scroll (site-wide smooth entrances) =====
    const revealTargets = document.querySelectorAll(
        '.feature-card, .service-card, .contact-form, .contact-info, .quote-container, .page-header, .social-card, .features, .cta-buttons'
    );

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        });

        revealTargets.forEach((el, idx) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${Math.min(idx * 60, 360)}ms`;
            io.observe(el);
        });
    } else {
        // Fallback: show immediately
        revealTargets.forEach((el) => el.classList.add('in-view'));
    }

    // ===== ANIMATED COUNTERS =====
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
    
    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => statsObserver.observe(stat));
    }

    // ===== PORTFOLIO CAROUSEL (infinite forward loop) =====
    const carousel = document.querySelector('.portfolio-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const originalSlides = Array.from(track.children);
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');

        const SLIDE_COUNT = originalSlides.length;
        if (SLIDE_COUNT === 0) return;

        // Clone first and last for seamless wrap
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[SLIDE_COUNT - 1].cloneNode(true);
        track.insertBefore(lastClone, originalSlides[0]);
        track.appendChild(firstClone);

        // Internal index uses range [0..SLIDE_COUNT+1], where 0 = lastClone, 1..SLIDE_COUNT = real slides, SLIDE_COUNT+1 = firstClone
        let index = 1; // start on first real slide

        // Ensure transition style exists
        const transitionCSS = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transition = transitionCSS;
        track.style.transform = `translateX(-${index * 100}%)`;

        // Indicators for real slides
        originalSlides.forEach((_, i) => {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToRealSlide(i));
            indicatorsContainer.appendChild(indicator);
        });
        const indicators = Array.from(indicatorsContainer.children);

        function setActiveIndicator() {
            const visibleRealIndex = (index - 1 + SLIDE_COUNT) % SLIDE_COUNT; // map 1..SLIDE_COUNT to 0..SLIDE_COUNT-1
            indicators.forEach((dot, i) => dot.classList.toggle('active', i === visibleRealIndex));
        }

        function snapWithoutTransition(toIndex) {
            // Temporarily disable transition to avoid backward visual motion
            track.style.transition = 'none';
            index = toIndex;
            track.style.transform = `translateX(-${index * 100}%)`;
            // Force reflow, then restore transition
            void track.offsetHeight;
            track.style.transition = transitionCSS;
            setActiveIndicator();
        }

        function goToRealSlide(realIndex) {
            // realIndex is 0..SLIDE_COUNT-1, map to internal index realIndex+1
            index = realIndex + 1;
            track.style.transform = `translateX(-${index * 100}%)`;
            setActiveIndicator();
        }

        function nextSlide() {
            index += 1;
            track.style.transform = `translateX(-${index * 100}%)`;
            setActiveIndicator();

            // If we moved onto the firstClone, snap forward to first real slide
            if (index === SLIDE_COUNT + 1) {
                track.addEventListener('transitionend', function handleNextWrap() {
                    track.removeEventListener('transitionend', handleNextWrap);
                    snapWithoutTransition(1);
                });
            }
        }

        function prevSlide() {
            index -= 1;
            track.style.transform = `translateX(-${index * 100}%)`;
            setActiveIndicator();

            // If we moved onto the lastClone, snap backward to last real slide
            if (index === 0) {
                track.addEventListener('transitionend', function handlePrevWrap() {
                    track.removeEventListener('transitionend', handlePrevWrap);
                    snapWithoutTransition(SLIDE_COUNT);
                });
            }
        }

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Auto-play
        let autoplayInterval = setInterval(nextSlide, 5000);
        carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        carousel.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(nextSlide, 5000);
        });

        // Mobile/touch: tap to toggle overlay visibility and center text
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        if (isTouch) {
            track.querySelectorAll('.portfolio-item').forEach(item => {
                item.addEventListener('click', () => {
                    item.classList.toggle('overlay-visible');
                });
            });
        }
    }

    // ===== PARALLAX SCROLLING =====
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrolled;
            const sectionHeight = rect.height;
            
            if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
                const offset = (scrolled - (sectionTop - window.innerHeight)) * 0.3;
                section.style.transform = `translateY(${offset}px)`;
            }
        });
    });

    // ===== SCROLL TO TOP BUTTON =====
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ============================================
// COOKIE BANNER
// ============================================
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookies = document.getElementById('acceptCookies');
const declineCookies = document.getElementById('declineCookies');
const customizeCookies = document.getElementById('customizeCookies');
const cookiePrivacyLink = document.getElementById('cookiePrivacyLink');
const cookiePolicyLink = document.getElementById('cookiePolicyLink');

// Controlla se l'utente ha già fatto una scelta
function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        // Mostra il banner dopo un piccolo ritardo
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }
}

// Apri modale privacy dal cookie banner
if (cookiePrivacyLink) {
    cookiePrivacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        const privacyLink = document.getElementById('privacyLink');
        if (privacyLink) {
            privacyLink.click();
        }
    });
}

// Apri modale cookie policy dal cookie banner
if (cookiePolicyLink) {
    cookiePolicyLink.addEventListener('click', (e) => {
        e.preventDefault();
        const privacyLink = document.getElementById('privacyLink');
        if (privacyLink) {
            privacyLink.click();
        }
    });
}

// Personalizza cookie (apre modale privacy)
if (customizeCookies) {
    customizeCookies.addEventListener('click', () => {
        const privacyLink = document.getElementById('privacyLink');
        if (privacyLink) {
            privacyLink.click();
        }
    });
}

// Accetta i cookie
if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
        console.log('Cookie accettati');
    });
}

// Rifiuta i cookie
if (declineCookies) {
    declineCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
        console.log('Cookie rifiutati');
    });
}

// Verifica al caricamento della pagina
checkCookieConsent();
