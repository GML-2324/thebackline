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

const shuffledImages = shuffle([...carouselImages]);
let currentImageIndex = 0;

const layer1 = document.getElementById('slide-layer-1');
const layer2 = document.getElementById('slide-layer-2');
let activeLayer = layer1;

// Initialize first image
if (layer1 && layer2) {
    layer1.style.backgroundImage = `url('${shuffledImages[0]}')`;
    currentImageIndex++;

    setInterval(() => {
        const nextImageUrl = shuffledImages[currentImageIndex];
        const nextLayer = activeLayer === layer1 ? layer2 : layer1;
        
        nextLayer.style.backgroundImage = `url('${nextImageUrl}')`;
        nextLayer.classList.add('active');
        activeLayer.classList.remove('active');
        
        activeLayer = nextLayer;
        
        currentImageIndex++;
        if (currentImageIndex >= shuffledImages.length) {
            shuffle(shuffledImages);
            currentImageIndex = 0;
        }
    }, 5000); // 5 seconds per slide
}

// Services Carousel - Infinite Loop
const servicesTrack = document.querySelector('.services-track');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

if (servicesTrack && prevBtn && nextBtn) {
    const originalCards = Array.from(servicesTrack.children);
    const totalOriginal = originalCards.length;
    let isTransitioning = false;

    // Clone all cards and append/prepend for seamless loop
    originalCards.forEach(card => {
        const cloneFront = card.cloneNode(true);
        const cloneBack = card.cloneNode(true);
        servicesTrack.appendChild(cloneFront);
    });
    // Prepend clones at start
    for (let i = totalOriginal - 1; i >= 0; i--) {
        const cloneBack = originalCards[i].cloneNode(true);
        servicesTrack.prepend(cloneBack);
    }

    function getCardWidth() {
        const card = servicesTrack.querySelector('.service-card');
        const style = getComputedStyle(servicesTrack);
        const gap = parseInt(style.gap) || 24;
        return card.offsetWidth + gap;
    }

    // Start at the first real card (after prepended clones)
    let currentIndex = totalOriginal;

    function setPositionInstant(index) {
        servicesTrack.style.transition = 'none';
        servicesTrack.style.transform = `translateX(-${index * getCardWidth()}px)`;
        // Force reflow
        servicesTrack.offsetHeight;
    }

    function slideTo(index) {
        servicesTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        servicesTrack.style.transform = `translateX(-${index * getCardWidth()}px)`;
    }

    // Initialize position
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
        currentIndex = totalOriginal;
        setPositionInstant(currentIndex);
    });
}
