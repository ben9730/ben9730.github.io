// ========================================
// ADDITIONAL INTERACTIVE FEATURES
// ========================================

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add scroll progress indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, #2563eb, #1e40af);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createScrollProgress();

// Dynamic year in footer
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer p');
if (footerText) {
    footerText.textContent = `© ${currentYear} Ben Gutman. All rights reserved.`;
}

// Console greeting
console.log('%c👋 Hi! I\'m Ben Gutman', 'font-size: 20px; color: #2563eb; font-weight: bold;');
console.log('%cFull Stack Developer | Python | JavaScript | Node.js', 'font-size: 14px; color: #6b7280;');
console.log('%cFeel free to explore the code!', 'font-size: 12px; color: #9ca3af;');
