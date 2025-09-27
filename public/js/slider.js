// public/js/slider.js - Enhanced Bootstrap Slider Functionality

/**
 * Debounce utility to limit how often a function gets called.
 */
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

document.addEventListener('DOMContentLoaded', () => {
    const mainSliderEl = document.getElementById('productSlider');
    if (!mainSliderEl) return;

    // Bootstrap's carousel is often auto-initialized via data attributes.
    // We can get the instance to add custom event listeners.
    const mainSlider = bootstrap.Carousel.getOrCreateInstance(mainSliderEl);

    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.classList.add('visually-hidden'); // Use Bootstrap's screen-reader class
    mainSliderEl.appendChild(liveRegion);
    
    // --- Custom Enhancements ---

    // 1. Analytics and Accessibility on Slide Change
    mainSliderEl.addEventListener('slid.bs.carousel', event => {
        const currentIndex = event.to + 1;
        const totalSlides = event.target.querySelectorAll('.carousel-item').length;

        // Accessibility: Announce slide change to screen readers
        liveRegion.textContent = `Slide ${currentIndex} of ${totalSlides} shown.`;

        // Analytics: Log to console and send to Google Analytics
        console.log(`Slide changed to: ${currentIndex}`);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'slide_view', {
                'event_category': 'engagement',
                'event_label': `slide_${currentIndex}`,
            });
        }
    });

    // 2. Lazy Loading Images within the Slider
    const lazyImages = mainSliderEl.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    // 3. (Optional) Equal Slide Heights to prevent content reflow
    const setSlideHeights = () => {
        const slides = mainSliderEl.querySelectorAll('.carousel-item');
        if (window.innerWidth < 768) { // Only apply on mobile if needed
             slides.forEach(slide => slide.style.minHeight = 'auto');
             return;
        }
        let maxHeight = 0;
        slides.forEach(slide => {
            slide.style.minHeight = 'auto'; // Reset before calculating
            if (slide.offsetHeight > maxHeight) {
                maxHeight = slide.offsetHeight;
            }
        });
        slides.forEach(slide => slide.style.minHeight = `${maxHeight}px`);
    };
    
    // Set heights on load and on window resize (debounced)
    window.addEventListener('load', setSlideHeights);
    window.addEventListener('resize', debounce(setSlideHeights, 250));
});