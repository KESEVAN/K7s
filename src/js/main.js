// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Parallax scrolling effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            if (entry.target.classList.contains('animate-on-scroll')) {
                entry.target.classList.add('animate-slide-up');
            }
        }
    });
}, observerOptions);

// Observe all sections and animated elements
document.querySelectorAll('section, .animate-on-scroll').forEach(element => {
    observer.observe(element);
});

// Form handling with animation
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Add loading state
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'SENDING...';
        
        // Simulate form submission (replace with actual form handling)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            button.textContent = 'MESSAGE SENT';
            button.style.backgroundColor = '#10B981';
            form.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 3000);
        } catch (error) {
            button.textContent = 'ERROR - TRY AGAIN';
            button.style.backgroundColor = '#EF4444';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 3000);
        }
    });
}

// Dynamic text animation for the hero section
const heroText = document.querySelector('.text-gradient');
if (heroText) {
    const text = heroText.textContent;
    heroText.style.opacity = '0';
    heroText.textContent = '';
    
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            heroText.textContent += text[index];
            index++;
        } else {
            clearInterval(interval);
            heroText.style.opacity = '1';
        }
    }, 100);
}

// Handle video background
const video = document.querySelector('.video-background');
if (video) {
    // Add loaded class immediately if video is already loaded
    if (video.readyState >= 3) {
        video.classList.add('loaded');
    }

    video.addEventListener('loadeddata', () => {
        video.classList.add('loaded');
    });
    
    // Ensure video stays visible
    video.addEventListener('play', () => {
        if (!video.classList.contains('loaded')) {
            video.classList.add('loaded');
        }
    });
}

// Experience section animations
const experienceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const details = entry.target.querySelector('.experience-details');
            const image = entry.target.querySelector('.experience-image');
            
            if (details) details.classList.add('visible');
            if (image) image.classList.add('visible');
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

document.querySelectorAll('.experience-item').forEach(item => {
    experienceObserver.observe(item);
});
