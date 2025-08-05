document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = submitBtn.querySelector('.submit-text');
    const spinner = submitBtn.querySelector('.spinner-border');
    const successAlert = document.querySelector('.alert-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate reCAPTCHA
            if (grecaptcha.getResponse().length === 0) {
                alert('Please complete the reCAPTCHA verification');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitText.textContent = 'Sending...';
            spinner.classList.remove('d-none');

            // Simulate form submission (replace with actual AJAX call)
            setTimeout(function () {
                // Hide loading state
                submitBtn.disabled = false;
                submitText.textContent = 'Send Message';
                spinner.classList.add('d-none');

                // Show success message
                successAlert.classList.remove('d-none');
                contactForm.reset();
                grecaptcha.reset();

                // Hide success message after 5 seconds
                setTimeout(function () {
                    successAlert.classList.add('d-none');
                }, 5000);
            }, 2000);
        });
    }

    // Initialize form labels for Bootstrap floating labels
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('input', function () {
            if (this.value) {
                this.nextElementSibling.classList.add('active');
            } else {
                this.nextElementSibling.classList.remove('active');
            }
        });
    });
});