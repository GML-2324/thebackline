const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('nav-active');

    // Burger Animation
    burger.classList.toggle('toggle');
});

// Close nav when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if(nav.classList.contains('nav-active')) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
        }
    });
});

// Navbar scroll state - transparent in hero, solid after
const navbar = document.querySelector('.navbar');
const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    if (window.scrollY >= hero.offsetHeight - 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hero Carousel Random Sequencing
const carouselImages = [
    "assets/The Backline EP2 -16.jpg",
    "assets/The Backline EP2 -18.jpg",
    "assets/The Backline EP2 -3.jpg",
    "assets/The Backline EP2 -8.jpg",
    "assets/The Backline EP3-11.png",
    "assets/The Backline EP3-15.png",
    "assets/The Backline EP3-2.png",
    "assets/The Backline EP3-5.png",
    "assets/Vol 1-11.jpg",
    "assets/Vol 1-114.jpg",
    "assets/Vol 1-12.jpg",
    "assets/Vol 1-41.jpg",
    "assets/Vol 1-43.jpg",
    "assets/Vol 1-53.jpg",
    "assets/Vol 1-55.jpg",
    "assets/Vol 1-56.jpg",
    "assets/Vol 1-59.jpg",
    "assets/Vol 1-6.jpg",
    "assets/Vol 1-60.jpg",
    "assets/Vol 1-74.jpg",
    "assets/Vol 1-77.jpg",
    "assets/Vol 1-79.jpg",
    "assets/Vol 1-9.jpg",
    "assets/Vol 4-20.jpg",
    "assets/Vol 4-29.jpg",
    "assets/Vol 4-32.jpg",
    "assets/Vol 4-4.jpg",
    "assets/Vol 4-44.jpg",
    "assets/Vol 4-5.jpg",
    "assets/Vol 4-55.jpg",
    "assets/Vol 4-6.jpg"
];

// Shuffle array function
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Read the pre-shuffled images from window if available (initialized in head)
const shuffledImages = window.shuffledCarouselImages || shuffle([...carouselImages]);
let currentImageIndex = window.currentCarouselIndex !== undefined ? window.currentCarouselIndex : 0;

const layer1 = document.getElementById('slide-layer-1');
const layer2 = document.getElementById('slide-layer-2');
let activeLayer = layer1;

// Function to preload a specific image index
function preloadImage(index) {
    const nextUrl = shuffledImages[index % shuffledImages.length];
    const img = new Image();
    img.src = nextUrl;
}

// Initialize and begin carousel rotation
if (layer1 && layer2) {
    // If the background wasn't set inline, set it now as a fallback
    if (!layer1.style.backgroundImage) {
        layer1.style.backgroundImage = `url('${shuffledImages[0]}')`;
    }
    
    // We are currently showing image 0. Point index to next image (1) and preload it immediately.
    currentImageIndex++;
    preloadImage(currentImageIndex);

    setInterval(() => {
        const nextImageUrl = shuffledImages[currentImageIndex % shuffledImages.length];
        const nextLayer = activeLayer === layer1 ? layer2 : layer1;
        
        nextLayer.style.backgroundImage = `url('${nextImageUrl}')`;
        nextLayer.classList.add('active');
        activeLayer.classList.remove('active');
        
        activeLayer = nextLayer;
        
        // Move to the next image slot
        currentImageIndex++;
        
        // Preload the next image 2.5 seconds before the transition fires
        setTimeout(() => {
            preloadImage(currentImageIndex);
        }, 2500);
        
    }, 5000); // 5 seconds per slide
}

// Services Carousel - Infinite Loop
const servicesTrack = document.querySelector('.services-track');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

if (servicesTrack && prevBtn && nextBtn) {
    const carouselContainer = document.querySelector('.services-carousel');
    const originalCards = Array.from(servicesTrack.children);
    const totalOriginal = originalCards.length;
    let isTransitioning = false;

    // Clone all cards and append/prepend for seamless loop
    originalCards.forEach(card => {
        const cloneFront = card.cloneNode(true);
        servicesTrack.appendChild(cloneFront);
    });
    for (let i = totalOriginal - 1; i >= 0; i--) {
        const cloneBack = originalCards[i].cloneNode(true);
        servicesTrack.prepend(cloneBack);
    }

    // Set explicit card widths based on carousel container
    function sizeCards() {
        const w = carouselContainer.offsetWidth;
        const allCards = servicesTrack.querySelectorAll('.service-card');
        allCards.forEach(card => {
            card.style.width = w + 'px';
            card.style.minWidth = w + 'px';
        });
    }

    function getCardWidth() {
        return carouselContainer.offsetWidth;
    }

    // Start at the first real card (after prepended clones)
    let currentIndex = totalOriginal;

    function setPositionInstant(index) {
        servicesTrack.style.transition = 'none';
        servicesTrack.style.transform = `translateX(-${index * getCardWidth()}px)`;
        servicesTrack.offsetHeight;
    }

    function slideTo(index) {
        servicesTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        servicesTrack.style.transform = `translateX(-${index * getCardWidth()}px)`;
    }

    // Initialize
    sizeCards();
    setPositionInstant(currentIndex);

    nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        slideTo(currentIndex);
    });

    prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        slideTo(currentIndex);
    });

    servicesTrack.addEventListener('transitionend', () => {
        isTransitioning = false;
        // Scrolled into the appended clones — jump back to equivalent real card
        if (currentIndex >= totalOriginal * 2) {
            currentIndex -= totalOriginal;
            setPositionInstant(currentIndex);
        }
        // Scrolled into the prepended clones — jump forward to equivalent real card
        if (currentIndex < totalOriginal) {
            currentIndex += totalOriginal;
            setPositionInstant(currentIndex);
        }
    });

    // Reset on resize
    window.addEventListener('resize', () => {
        sizeCards();
        currentIndex = totalOriginal;
        setPositionInstant(currentIndex);
    });
}

// Lazy load elements with CSS background-images (like TEAM.png) when they enter the viewport
document.addEventListener('DOMContentLoaded', () => {
    const lazyBgElements = document.querySelectorAll('.lazy-bg');
    if ('IntersectionObserver' in window) {
        const lazyBgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const bgUrl = el.getAttribute('data-bg');
                    if (bgUrl) {
                        el.style.backgroundImage = `url('${bgUrl}')`;
                        el.classList.add('lazy-bg-loaded');
                    }
                    observer.unobserve(el);
                }
            });
        }, {
            rootMargin: '100px 0px', // Start loading 100px before entry for seamless experience
            threshold: 0.01
        });
        lazyBgElements.forEach(el => lazyBgObserver.observe(el));
    } else {
        // Fallback for older browsers
        lazyBgElements.forEach(el => {
            const bgUrl = el.getAttribute('data-bg');
            if (bgUrl) {
                el.style.backgroundImage = `url('${bgUrl}')`;
                el.classList.add('lazy-bg-loaded');
            }
        });
    }
});
