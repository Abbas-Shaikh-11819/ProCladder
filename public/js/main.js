// public/js/main.js - Main JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
    initializeNotifications();
    initializeLazyLoading();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Smooth scrolling and scroll effects
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    

}


// Contact form functionality
function initializeContactForm() {
    const contactForm = document.querySelector('#contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm(this)) {
            submitContactForm(this);
        }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validate contact form
function validateContactForm(form) {
    let isValid = true;
    
    // Name validation
    const name = form.querySelector('[name="name"]');
    if (!name.value.trim()) {
        showFieldError(name, 'Name is required');
        isValid = false;
    }
    
    // Email validation
    const email = form.querySelector('[name="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showFieldError(email, 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation (optional but format check)
    const phone = form.querySelector('[name="phone"]');
    if (phone.value.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phone.value.replace(/\s+/g, ''))) {
            showFieldError(phone, 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    // Project type validation
    const projectType = form.querySelector('[name="projectType"]');
    if (!projectType.value) {
        showFieldError(projectType, 'Please select a project type');
        isValid = false;
    }
    
    // Message validation
    const message = form.querySelector('[name="message"]');
    if (!message.value.trim()) {
        showFieldError(message, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFieldError(message, 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const name = field.getAttribute('name');
    
    switch(name) {
        case 'name':
            if (!field.value.trim()) {
                showFieldError(field, 'Name is required');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value.trim()) {
                showFieldError(field, 'Email is required');
                return false;
            } else if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'message':
            if (!field.value.trim()) {
                showFieldError(field, 'Message is required');
                return false;
            } else if (field.value.trim().length < 10) {
                showFieldError(field, 'Message must be at least 10 characters long');
                return false;
            }
            break;
    }
    
    clearFieldError(field);
    return true;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('is-invalid');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Submit contact form
async function submitContactForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitButton.disabled = true;
    
    try {
        const formData = new FormData(form);
        const response = await fetch('/contact', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showNotification('success', 'Thank you! Your message has been sent successfully.');
            form.reset();
            
            // Redirect to success page after a delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('error', 'Sorry, there was an error sending your message. Please try again.');
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Notification system
function initializeNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }
}

// Show notification
function showNotification(type, message) {
    const container = document.querySelector('.notification-container');
    const notification = document.createElement('div');
    
    const typeClasses = {
        success: 'alert-success',
        error: 'alert-danger',
        warning: 'alert-warning',
        info: 'alert-info'
    };
    
    const typeIcons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.className = `alert ${typeClasses[type]} alert-dismissible fade show`;
    notification.innerHTML = `
        <i class="fas ${typeIcons[type]} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    container.appendChild(notification);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 150);
        }
    }, 5000);
}

// Lazy loading for images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Animation on scroll
function initializeAnimations() {
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            animationObserver.observe(el);
        });
    }
}

// Utility functions
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
    }
}

// Product filter functionality (for products page)
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.classList.add('animate-fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('#productSearch');
    if (!searchInput) return;
    
    const searchProducts = debounce(function() {
        const query = this.value.toLowerCase().trim();
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-text').textContent.toLowerCase();
            
            if (query === '' || title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }, 300);
    
    searchInput.addEventListener('input', searchProducts);
}

// Initialize filters and search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProductFilters();
    initializeSearch();
});

// Notify me functionality for upcoming products
function notifyMe(productTitle) {
    const email = prompt('Enter your email to be notified when ' + productTitle + ' is available:');
    
    if (email && validateEmail(email)) {
        // Here you would typically send this to your backend
        showNotification('success', 'Thank you! We\'ll notify you when ' + productTitle + ' is available.');
        
        // Store in localStorage for demo purposes
        const notifications = JSON.parse(localStorage.getItem('productNotifications') || '[]');
        notifications.push({
            email: email,
            product: productTitle,
            date: new Date().toISOString()
        });
        localStorage.setItem('productNotifications', JSON.stringify(notifications));
    } else if (email) {
        showNotification('error', 'Please enter a valid email address.');
    }
}

// Email validation helper
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Print functionality
function printPage() {
    window.print();
}

// Share functionality
function shareProduct(productId, productTitle) {
    if (navigator.share) {
        navigator.share({
            title: productTitle,
            text: 'Check out this 3D cladding service: ' + productTitle,
            url: window.location.origin + '/products/' + productId
        });
    } else {
        // Fallback - copy to clipboard
        const url = window.location.origin + '/products/' + productId;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('success', 'Product link copied to clipboard!');
        });
    }
}

// Cookie consent (if needed)
function initializeCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    
    if (!consent) {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner alert alert-info';
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 9999;
            margin: 0;
            border-radius: 0;
            text-align: center;
        `;
        
        banner.innerHTML = `
            <div class="container">
                <span>We use cookies to improve your experience on our website. By continuing to browse, you agree to our use of cookies.</span>
                <button class="btn btn-sm btn-primary ms-3" onclick="acceptCookies()">Accept</button>
            </div>
        `;
        
        document.body.appendChild(banner);
    }
}

// Accept cookies
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    const banner = document.querySelector('.cookie-banner');
    if (banner) {
        banner.remove();
    }
}

// Initialize cookie consent
document.addEventListener('DOMContentLoaded', function() {
    initializeCookieConsent();
});

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = '/images/placeholder.jpg'; // Fallback image
        });
    });
});