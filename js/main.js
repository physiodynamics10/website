// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Add scroll animation and other functionality
document.addEventListener('DOMContentLoaded', function () {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements with the animate-fade-in class
    const elementsToAnimate = document.querySelectorAll('.animate-fade-in');
    elementsToAnimate.forEach(el => observer.observe(el));

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Show loading state
            submitText.textContent = 'Sending...';
            submitSpinner.classList.remove('d-none');
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(function () {
                // Hide loading state
                submitText.textContent = 'Send Message';
                submitSpinner.classList.add('d-none');
                submitBtn.disabled = false;

                // Show success message
                successMessage.classList.remove('d-none');
                errorMessage.classList.add('d-none');

                // Reset form
                contactForm.reset();

                // Hide success message after 5 seconds
                setTimeout(function () {
                    successMessage.classList.add('d-none');
                }, 5000);
            }, 1500);
        });
    }

    // Smooth scroll for anchor links in dropdown
    document.querySelectorAll('.dropdown-item[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === "#") return;

            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });

                    // Close dropdown on mobile after click
                    if (window.innerWidth < 992) {
                        const dropdown = document.getElementById('servicesDropdown');
                        if (dropdown && typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
                            const bsDropdown = bootstrap.Dropdown.getInstance(dropdown);
                            if (bsDropdown) {
                                bsDropdown.hide();
                            }
                        }
                    }
                }
            }
        });
    });

    // Close dropdown on mobile when clicking any dropdown item
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth < 992) {
                const dropdown = this.closest('.dropdown')?.querySelector('[data-bs-toggle="dropdown"]');
                if (dropdown && typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
                    const bsDropdown = bootstrap.Dropdown.getInstance(dropdown);
                    if (bsDropdown) {
                        bsDropdown.hide();
                    }
                }
            }
        });
    });
});

// Back to top button
const backToTopBtn = document.querySelector('.back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Testimonials Carousel Function
function initTestimonialsCarousel() {
    const testimonialsSection = document.querySelector('.testimonials-carousel-section');
    if (!testimonialsSection) return;

    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const leftArrow = document.querySelector('.testimonial-arrow-left');
    const rightArrow = document.querySelector('.testimonial-arrow-right');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || !slides.length) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let slideWidth = 0;
    let autoAdvanceInterval = null;
    
    // Initialize slider
    function initSlider() {
        // Calculate slide width dynamically
        if (slides[0]) {
            const slideStyle = window.getComputedStyle(slides[0]);
            const slideMarginRight = parseInt(slideStyle.marginRight || '0');
            slideWidth = slides[0].offsetWidth + slideMarginRight;
        } else {
            slideWidth = 350 + 30; // fallback
        }
        
        updateDots();
        updateArrows();
        moveToSlide(currentIndex);
    }
    
    // Calculate how many slides are visible
    function getVisibleSlides() {
        const containerWidth = track.parentElement.clientWidth;
        return Math.max(1, Math.floor(containerWidth / slideWidth));
    }
    
    // Update dots
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Update arrow states
    function updateArrows() {
        const visibleSlides = getVisibleSlides();
        const maxIndex = Math.max(0, totalSlides - visibleSlides);
        
        if (leftArrow) {
            leftArrow.disabled = currentIndex === 0;
        }
        
        if (rightArrow) {
            rightArrow.disabled = currentIndex >= maxIndex;
        }
    }
    
    // Move to specific slide
    function moveToSlide(index) {
        const visibleSlides = getVisibleSlides();
        const maxIndex = Math.max(0, totalSlides - visibleSlides);
        currentIndex = Math.min(Math.max(0, index), maxIndex);
        const translateX = -currentIndex * slideWidth;
        
        track.style.transform = `translateX(${translateX}px)`;
        updateDots();
        updateArrows();
    }
    
    // Next slide
    function nextSlide() {
        const visibleSlides = getVisibleSlides();
        const maxIndex = Math.max(0, totalSlides - visibleSlides);
        
        if (currentIndex < maxIndex) {
            moveToSlide(currentIndex + 1);
        } else {
            moveToSlide(0); // Loop back to start
        }
    }
    
    // Previous slide
    function prevSlide() {
        const visibleSlides = getVisibleSlides();
        const maxIndex = Math.max(0, totalSlides - visibleSlides);
        
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        } else {
            moveToSlide(maxIndex); // Loop to end
        }
    }
    
    // Start auto-advance
    function startAutoAdvance() {
        if (autoAdvanceInterval) clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = setInterval(nextSlide, 5000);
    }
    
    // Stop auto-advance
    function stopAutoAdvance() {
        if (autoAdvanceInterval) {
            clearInterval(autoAdvanceInterval);
            autoAdvanceInterval = null;
        }
    }
    
    // Initialize event listeners
    function initEventListeners() {
        // Arrow navigation
        if (leftArrow) {
            leftArrow.addEventListener('click', () => {
                stopAutoAdvance();
                prevSlide();
                setTimeout(startAutoAdvance, 5000);
            });
        }
        
        if (rightArrow) {
            rightArrow.addEventListener('click', () => {
                stopAutoAdvance();
                nextSlide();
                setTimeout(startAutoAdvance, 5000);
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoAdvance();
                moveToSlide(index);
                setTimeout(startAutoAdvance, 5000);
            });
        });
        
        // Pause auto-advance on hover
        testimonialsSection.addEventListener('mouseenter', stopAutoAdvance);
        testimonialsSection.addEventListener('mouseleave', startAutoAdvance);
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        testimonialsSection.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoAdvance();
        }, { passive: true });
        
        testimonialsSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            setTimeout(startAutoAdvance, 5000);
        }, { passive: true });
        
        // Handle window resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                initSlider();
            }, 250);
        });
    }
    
    // Initialize everything
    initSlider();
    initEventListeners();
    startAutoAdvance();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize testimonials carousel
    initTestimonialsCarousel();
});