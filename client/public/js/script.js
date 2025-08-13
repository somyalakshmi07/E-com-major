// Simple cart functionality
document.addEventListener('DOMContentLoaded', function() {
    let cartCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Add to cart button functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            cartCount++;
            cartCountElement.textContent = cartCount;
            
            // Animation for feedback
            this.textContent = 'Added!';
            this.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '#ff6b88';
            }, 1000);
            
            // In a real app, you would send this to your server
            console.log(`Product ${productId} added to cart`);
        });
    });
    
    // Category cards click event
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // In a real app, this would filter products by category
            alert(`Showing ${this.querySelector('h3').textContent} category`);
        });
    });
});

// Update the cart functionality to handle shop page
function updateCartCount() {
    const cartCount = localStorage.getItem('cartCount') || 0;
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Initialize cart count on page load
updateCartCount();

// Enhanced add to cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
            cartCount++;
            
            // Save to localStorage
            localStorage.setItem('cartCount', cartCount);
            
            // Update UI
            updateCartCount();
            
            // Animation for feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '#ff6b88';
            }, 1000);
            
            console.log(`Product ${productId} added to cart`);
        });
    });
});

// Add to wishlist functionality
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        
        fetch('/wishlist/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.textContent = data.inWishlist ? '❤️' : '♡';
                updateWishlistCount();
            }
        });
    });
});

function updateCartCount() {
    fetch('/cart/count')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.cart-count').textContent = data.count;
        });
}

function updateWishlistCount() {
    fetch('/wishlist/count')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.wishlist-count').textContent = data.count;
        });
}