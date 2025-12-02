/**
 * 🖼️ IMAGE LAZY LOADING
 * Optimizes image loading performance
 */

export const ImageLazyLoader = {
  /**
   * Load image with lazy loading
   */
  lazyLoadImage: (imagePath, placeholder = null) => {
    if (typeof window === 'undefined') return imagePath;

    const img = new Image();
    img.onload = () => {
      img.className = 'loaded';
    };
    img.onerror = () => {
      img.src =
        placeholder ||
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3C/svg%3E';
    };
    img.src = imagePath;
    return img.src;
  },

  /**
   * Create optimized image URLs
   */
  optimizeImageUrl: (url, width = 400, quality = 80) => {
    if (!url) return '';
    if (url.includes('placeholder')) return url;

    // Add query params for image optimization
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=${quality}`;
  },

  /**
   * Generate responsive image srcset
   */
  generateSrcSet: (baseUrl, sizes = [320, 640, 960, 1280]) => {
    return sizes
      .map((size) => `${ImageLazyLoader.optimizeImageUrl(baseUrl, size)} ${size}w`)
      .join(', ');
  },

  /**
   * Preload critical images
   */
  preloadImage: (url) => {
    if (typeof window === 'undefined') return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  },

  /**
   * Intersection Observer for lazy loading
   */
  observeLazyImages: () => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const images = document.querySelectorAll('img[data-lazy]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.lazy;
            img.removeAttribute('data-lazy');
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    images.forEach((img) => observer.observe(img));
    return observer;
  },
};

export default ImageLazyLoader;
