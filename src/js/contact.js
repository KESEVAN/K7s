// Initialize EmailJS
(function() {
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init("84pCnLqlZtZNSOeHt");
})();

// Get DOM elements
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Form submission handler
contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Hide any existing messages
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Send email using EmailJS
    // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS service and template IDs
    emailjs.send('service_g21ucoi', 'template_sd3mval', {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: 'Kesevan', // Your name
    })
    .then(function() {
        // Show success message
        successMessage.classList.remove('hidden');
        // Reset form
        contactForm.reset();
    })
    .catch(function(error) {
        // Show error message
        console.error('EmailJS error:', error);
        errorMessage.classList.remove('hidden');
    });
});
