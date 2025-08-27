gsap.registerPlugin(ScrollTrigger);

// Header Animations
gsap.from('.nav-logo', { duration: 1, y: -50, opacity: 0, ease: 'power3.out' });
gsap.from('.nav-link', { duration: 1, y: -20, opacity: 0, stagger: 0.1, ease: 'power3.out', delay: 0.2 });

// Hero Animations
gsap.from('.hero-img', { duration: 1.5, y: 100, scale: 0.8, opacity: 0, ease: 'power3.out', delay: 0.2 });
gsap.from('.hero-title', { duration: 1.5, delay: 0.7, y: 50, opacity: 0, ease: 'power3.out' });
gsap.from('.hero-subtitle', { duration: 1.5, delay: 1, y: 50, opacity: 0, ease: 'power3.out' });
gsap.from('#hero a', { duration: 1, delay: 1.5, y: 30, opacity: 0, ease: 'power2.out' });
gsap.to('.parallax-bg', { y: '30%', ease: 'none', scrollTrigger: { trigger: '#hero', scrub: true } });

// Subtle floating animation for hero image
gsap.to('.hero-img', { 
    y: -10, 
    repeat: -1, 
    yoyo: true, 
    ease: 'sine.inOut', 
    duration: 3, 
    delay: 2 // Start after initial animation
});

// Rotating role tagline
const roles = ['Financial Modeling', 'Equity Research', 'Market Research', 'Valuation'];
const roleEl = document.querySelector('.role-rotator');
let roleIndex = 0;
if (roleEl) {
    const swapRole = () => {
        roleIndex = (roleIndex + 1) % roles.length;
        gsap.to(roleEl, { opacity: 0, y: -8, duration: 0.25, onComplete: () => {
            roleEl.textContent = roles[roleIndex];
            gsap.fromTo(roleEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 });
        }});
    };
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) setInterval(swapRole, 2200);
}

// Scroll cue to About
const scrollDownBtn = document.getElementById('scroll-down');
if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
        document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
    });
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links'); // Assuming nav-links is your desktop menu

// Remove the initial setting of innerHTML as icons are now in HTML
// menuToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Start with bars icon

menuToggle.addEventListener('click', () => {
    const isActive = mobileMenu.classList.toggle('active');
    
    // Update aria-expanded attribute for accessibility
    menuToggle.setAttribute('aria-expanded', isActive);

    // Toggle icon classes for animation
    const barsIcon = menuToggle.querySelector('.fa-bars');
    const timesIcon = menuToggle.querySelector('.fa-times');

    if (isActive) {
        barsIcon.classList.add('opacity-0', 'rotate-90');
        timesIcon.classList.remove('opacity-0', 'rotate-90');
        // Hide desktop menu if it's visible on smaller screens (should already be hidden by CSS on mobile, but for safety)
        if (navLinks) navLinks.classList.add('hidden'); 
    } else {
        barsIcon.classList.remove('opacity-0', 'rotate-90');
        timesIcon.classList.add('opacity-0', 'rotate-90');
        // Show desktop menu only if on desktop and it was previously hidden by mobile menu activation
        if (navLinks && window.innerWidth >= 768) navLinks.classList.remove('hidden');
    }
    
    // Animate mobile menu sliding from right
    if (isActive) {
        gsap.to(mobileMenu, { duration: 0.4, right: 0, ease: 'power2.inOut' });
    } else {
        gsap.to(mobileMenu, { duration: 0.4, right: '-100%', ease: 'power2.inOut' });
    }
});

// Auto-close mobile menu when a navigation link is clicked
mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        // Only close if the mobile menu is currently active
        if (mobileMenu.classList.contains('active')) {
            menuToggle.click(); // This will trigger the toggle logic and animation
        }
    });
});

// Handle window resize to ensure correct menu state
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        // If desktop, ensure mobile menu is hidden and desktop menu is visible
        mobileMenu.classList.remove('active');
        mobileMenu.style.right = '-100%'; // Reset inline style from GSAP
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.querySelector('.fa-bars').classList.remove('opacity-0', 'rotate-90');
        menuToggle.querySelector('.fa-times').classList.add('opacity-0', 'rotate-90');
        if (navLinks) navLinks.classList.remove('hidden');
    } else {
        // If mobile, ensure desktop menu is hidden if mobile menu is active
        if (mobileMenu.classList.contains('active')) {
             if (navLinks) navLinks.classList.add('hidden');
        }
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Dynamic Section Highlighting on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinksList = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinksList.forEach(link => {
        link.classList.remove('text-indigo-600'); // Remove active color
        link.classList.remove('font-bold'); // Remove bold class
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('text-indigo-600'); // Add active color
            link.classList.add('font-bold'); // Add bold class
        }
    });
});

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selected = button.dataset.filter;

        // Update active state on buttons
        filterButtons.forEach(b => {
            b.setAttribute('aria-pressed', b === button ? 'true' : 'false');
        });

        // Filter cards
        projectCards.forEach(card => {
            const categories = (card.dataset.category || '').split(',');
            const show = selected === 'all' || categories.includes(selected);
            card.classList.toggle('hidden', !show);
            card.style.display = show ? '' : 'none'; // Ensure display consistency with Tailwind's hidden
        });

        // Animate visible cards if GSAP is available
        if (typeof gsap !== 'undefined') {
            const visibleCards = Array.from(projectCards).filter(c => !c.classList.contains('hidden'));
            gsap.from(visibleCards, { duration: 0.25, y: 12, opacity: 0, stagger: 0.06, ease: 'power2.out' });
        }
    });
});

// Project Modals
document.querySelectorAll('.project-readmore').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.style.display = 'flex'; // Use flex to center content
        if (typeof gsap !== 'undefined') {
            gsap.from(`#${modalId} .modal-content`, { duration: 0.4, scale: 0.94, opacity: 0, ease: 'power3.out' });
        }
    });
});

document.querySelectorAll('.modal .close').forEach(close => {
    close.addEventListener('click', () => {
        const modal = close.closest('.modal');
        if (typeof gsap !== 'undefined') {
            gsap.to(modal.querySelector('.modal-content'), {
                duration: 0.25,
                scale: 0.96,
                opacity: 0,
                ease: 'power2.in',
                onComplete: () => {
                    modal.style.display = 'none';
                }
            });
        } else {
            modal.style.display = 'none';
        }
    });
});

window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
        const modal = e.target;
        if (typeof gsap !== 'undefined') {
            gsap.to(modal.querySelector('.modal-content'), {
                duration: 0.25,
                scale: 0.96,
                opacity: 0,
                ease: 'power2.in',
                onComplete: () => {
                    modal.style.display = 'none';
                }
            });
        } else {
            modal.style.display = 'none';
        }
    }
});

// Additional accessibility: Close modal with Escape key
window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="display: flex"]');
        openModals.forEach(modal => {
            if (typeof gsap !== 'undefined') {
                gsap.to(modal.querySelector('.modal-content'), {
                    duration: 0.25,
                    scale: 0.96,
                    opacity: 0,
                    ease: 'power2.in',
                    onComplete: () => {
                        modal.style.display = 'none';
                    }
                });
            } else {
                modal.style.display = 'none';
            }
        });
    }
});

// Skill Bars Animation
document.querySelectorAll('.skill-fill').forEach((bar, index) => {
    const level = parseInt(bar.dataset.level, 10) || 0;
    gsap.fromTo(bar, { width: '0%' }, {
        width: `${level}%`,
        duration: 1.4,
        delay: index * 0.05,
        ease: 'power2.out',
        scrollTrigger: { trigger: bar, start: 'top 90%' }
    });
});

// Projects section removed. Filtering, modals, and animations deleted.

// Back to Top Button Functionality
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) { // Show button after scrolling 300px
        gsap.to(backToTopButton, { duration: 0.3, opacity: 1, scale: 1, ease: 'back.out(1.7)' });
    } else {
        gsap.to(backToTopButton, { duration: 0.3, opacity: 0, scale: 0, ease: 'back.in(1.7)' });
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Section Animations
gsap.from('#about *', { duration: 1, y: 50, opacity: 0, stagger: 0.2, scrollTrigger: { trigger: '#about', start: 'top 80%' } });
gsap.from('#education > div > div', { duration: 1, y: 50, opacity: 0, stagger: 0.2, scrollTrigger: { trigger: '#education', start: 'top 80%' } });
gsap.from('#skills .bg-gray-50', { duration: 0.8, y: 30, opacity: 0, stagger: 0.1, scrollTrigger: { trigger: '#skills', start: 'top 85%' } });
gsap.from('#contact form > *', { duration: 1, y: 50, opacity: 0, stagger: 0.1, scrollTrigger: { trigger: '#contact', start: 'top 80%' } });

// KPI Counters in About
document.querySelectorAll('.kpi').forEach(kpiEl => {
    const target = parseInt(kpiEl.dataset.target, 10);
    let started = false;
    ScrollTrigger.create({
        trigger: kpiEl,
        start: 'top 90%',
        onEnter: () => {
            if (started) return;
            started = true;
            const counter = { value: 0 };
            gsap.to(counter, {
                value: target,
                duration: 1.5,
                ease: 'power2.out',
                onUpdate: () => {
                    kpiEl.textContent = Math.round(counter.value);
                }
            });
        }
    });
});



