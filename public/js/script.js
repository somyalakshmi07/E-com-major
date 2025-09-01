// Simple JavaScript for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Quantity input validation
    const quantityInputs = document.querySelectorAll('input[type="number"]');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 1) this.value = 1;
            if (this.max && this.value > this.max) this.value = this.max;
        });
    });
    
    // Form validation for checkout
    const checkoutForm = document.querySelector('.checkout-form form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            const cardNumber = document.getElementById('cardNumber').value;
            const expDate = document.getElementById('expDate').value;
            const cvv = document.getElementById('cvv').value;
            
            // Simple validation
            if (cardNumber.replace(/\s/g, '').length !== 16) {
                e.preventDefault();
                alert('Please enter a valid 16-digit card number');
                return false;
            }
            
            if (!/^\d{2}\/\d{2}$/.test(expDate)) {
                e.preventDefault();
                alert('Please enter a valid expiration date (MM/YY)');
                return false;
            }
            
            if (!/^\d{3,4}$/.test(cvv)) {
                e.preventDefault();
                alert('Please enter a valid CVV (3 or 4 digits)');
                return false;
            }
        });
    }
});
// Simple JavaScript for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Quantity input validation
    const quantityInputs = document.querySelectorAll('input[type="number"]');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 1) this.value = 1;
            if (this.max && this.value > this.max) this.value = this.max;
        });
    });
    
    // Form validation for checkout
    const checkoutForm = document.querySelector('.checkout-form form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            const cardNumber = document.getElementById('cardNumber').value;
            const expDate = document.getElementById('expDate').value;
            const cvv = document.getElementById('cvv').value;
            
            // Simple validation
            if (cardNumber.replace(/\s/g, '').length !== 16) {
                e.preventDefault();
                alert('Please enter a valid 16-digit card number');
                return false;
            }
            
            if (!/^\d{2}\/\d{2}$/.test(expDate)) {
                e.preventDefault();
                alert('Please enter a valid expiration date (MM/YY)');
                return false;
            }
            
            if (!/^\d{3,4}$/.test(cvv)) {
                e.preventDefault();
                alert('Please enter a valid CVV (3 or 4 digits)');
                return false;
            }
        });
    }
    
    // Add animation to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
// Simple animation for fade-in elements
        document.addEventListener('DOMContentLoaded', function() {
            const fadeElements = document.querySelectorAll('.fade-in');
            
            const fadeInObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            
            fadeElements.forEach(element => {
                fadeInObserver.observe(element);
            });
        });