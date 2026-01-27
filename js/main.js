// =============================================
// Physio Dynamics - Main JavaScript File
// =============================================

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// =============================================
// MAIN INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Physio Dynamics website loaded');
    
    // Initialize all components
    initAnimations();
    initTestimonialsCarousel();
    initContactForm();
    initDropdownBehavior();
    initFloatingButtons();
    initSmoothScroll();
});

// =============================================
// ANIMATIONS
// =============================================
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements with animate-fade-in class
    document.querySelectorAll('.animate-fade-in').forEach(el => observer.observe(el));
}

// =============================================
// TESTIMONIALS CAROUSEL
// =============================================
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonialsTrack');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-arrow.prev');
    const nextBtn = document.querySelector('.testimonial-arrow.next');
    const dotsContainer = document.getElementById('testimonialDots');
    
    if (!track || slides.length === 0) {
        console.log('Testimonials carousel not found on this page');
        return;
    }
    
    console.log(`Initializing carousel with ${slides.length} testimonials`);
    
    let currentIndex = 0;
    let isAnimating = false;
    
    // Calculate how many slides to show based on screen width
    function getSlidesPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;      // Mobile
        if (width < 992) return 2;      // Tablet
        if (width < 1400) return 3;     // Small desktop
        return 4;                       // Large desktop
    }
    
    // Create dot indicators
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        const slidesPerView = getSlidesPerView();
        const totalDots = Math.ceil(slides.length / slidesPerView);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            dot.setAttribute('aria-label', `Go to testimonial group ${i + 1}`);
            dot.setAttribute('data-dot-index', i);
            
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(i * slidesPerView);
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update the active dot
    function updateDots() {
        if (!dotsContainer) return;
        
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        const slidesPerView = getSlidesPerView();
        const activeDotIndex = Math.floor(currentIndex / slidesPerView);
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }
    
    // Move carousel to specific slide
    function goToSlide(index) {
        if (isAnimating) return;
        
        const slidesPerView = getSlidesPerView();
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        
        // Clamp the index to valid range
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        updateCarousel();
    }
    
    // Update carousel position
    function updateCarousel() {
        if (isAnimating) return;
        isAnimating = true;
        
        const slidesPerView = getSlidesPerView();
        const slideWidth = slides[0].offsetWidth;
        const gap = 25; // Should match CSS gap value
        
        // Calculate maximum valid index
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        currentIndex = Math.min(currentIndex, maxIndex);
        
        // Calculate offset
        const offset = currentIndex * (slideWidth + gap);
        
        // Apply transform
        track.style.transform = `translateX(-${offset}px)`;
        track.style.transition = 'transform 0.5s ease';
        
        // Update button states
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentIndex >= maxIndex;
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
            nextBtn.style.cursor = currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
        }
        
        // Update dots
        updateDots();
        
        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    // Next slide function
    function nextSlide() {
        const slidesPerView = getSlidesPerView();
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        
        if (currentIndex < maxIndex) {
            currentIndex = Math.min(currentIndex + slidesPerView, maxIndex);
            updateCarousel();
        }
    }
    
    // Previous slide function
    function prevSlide() {
        const slidesPerView = getSlidesPerView();
        
        if (currentIndex > 0) {
            currentIndex = Math.max(0, currentIndex - slidesPerView);
            updateCarousel();
        }
    }
    
    // Event listeners for arrow buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        // Minimum swipe distance
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide(); // Swipe left
            } else {
                prevSlide(); // Swipe right
            }
        }
    }, { passive: true });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const oldSlidesPerView = getSlidesPerView();
            // Recreate dots if slides per view changed
            createDots();
            // Reset to first slide on major resize
            if (window.innerWidth < 768 || window.innerWidth > 1400) {
                currentIndex = 0;
            }
            updateCarousel();
        }, 250);
    });
    
    // Initialize carousel
    createDots();
    updateCarousel();
    
    console.log('Testimonials carousel initialized successfully');
}

// =============================================
// CONTACT FORM HANDLING
// =============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        if (submitText) submitText.textContent = 'Sending...';
        if (submitSpinner) submitSpinner.classList.remove('d-none');
        if (submitBtn) submitBtn.disabled = true;
        
        // In a real application, you would send data to a server here
        // For now, we'll simulate a successful submission
        
        setTimeout(function() {
            // Hide loading state
            if (submitText) submitText.textContent = 'Send Message';
            if (submitSpinner) submitSpinner.classList.add('d-none');
            if (submitBtn) submitBtn.disabled = false;
            
            // Show success message
            if (successMessage) {
                successMessage.classList.remove('d-none');
                if (errorMessage) errorMessage.classList.add('d-none');
            }
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(function() {
                if (successMessage) successMessage.classList.add('d-none');
            }, 5000);
        }, 1500);
    });
}

// =============================================
// DROPDOWN BEHAVIOR
// =============================================
function initDropdownBehavior() {
    // Close dropdowns on mobile when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 992) {
            const dropdowns = document.querySelectorAll('.dropdown-menu.show');
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(e.target) && !dropdown.previousElementSibling.contains(e.target)) {
                    const bsDropdown = bootstrap.Dropdown.getInstance(dropdown.previousElementSibling);
                    if (bsDropdown) bsDropdown.hide();
                }
            });
        }
    });
    
    // Close dropdown on mobile when clicking dropdown items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                const dropdown = this.closest('.dropdown');
                const toggle = dropdown.querySelector('[data-bs-toggle="dropdown"]');
                if (toggle) {
                    const bsDropdown = bootstrap.Dropdown.getInstance(toggle);
                    if (bsDropdown) bsDropdown.hide();
                }
            }
        });
    });
}

// =============================================
// SMOOTH SCROLL
// =============================================
function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate header height for offset
                const headerHeight = document.querySelector('.modern-header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =============================================
// FLOATING BUTTONS
// =============================================
function initFloatingButtons() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    // Show/hide back to top button
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    }
    
    window.addEventListener('scroll', toggleBackToTop);
    
    // Back to top functionality
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Initialize on load
    toggleBackToTop();
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =============================================
// WINDOW LOAD EVENT
// =============================================
window.addEventListener('load', function() {
    console.log('Page fully loaded');
    
    // Add loaded class to body for any post-load animations
    document.body.classList.add('page-loaded');
    
    // Initialize any lazy-loaded content here
});

// =============================================
// ERROR HANDLING
// =============================================
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.message, 'at', e.filename, 'line', e.lineno);
});

// Log initialization complete
console.log('Physio Dynamics JavaScript loaded successfully');