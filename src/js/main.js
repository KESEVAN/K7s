// Logo pop-up on click
document.addEventListener('click', e => {
    const wrap = e.target.closest('.logo-wrap');
    if (wrap) {
        const img = wrap.querySelector('img');
        const overlay = document.createElement('div');
        overlay.className = 'logo-pop-overlay';
        overlay.innerHTML = `<img src="${img.src}" class="${img.classList.contains('logo-invert') ? 'logo-invert' : ''}">`;
        overlay.addEventListener('click', () => overlay.remove());
        document.body.appendChild(overlay);
    }
});

// Smooth scroll for nav anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Video background fade-in
const video = document.querySelector('.video-background');
if (video) {
    if (video.readyState >= 3) video.classList.add('loaded');
    video.addEventListener('loadeddata', () => video.classList.add('loaded'));
    video.addEventListener('play', () => video.classList.add('loaded'));
}

// Reveal timeline items on scroll
// rootMargin pulls the trigger point 60px above the bottom edge so items
// that are already in-view on direct nav-link jumps also become visible.
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.experience-details').forEach(el => revealObserver.observe(el));

// Fallback: if any item is already in the viewport on load, show it immediately
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.experience-details').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add('visible');
    });
}, { once: true });
