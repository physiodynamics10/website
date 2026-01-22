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