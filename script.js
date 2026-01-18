// ========================================
// WELCOME MODAL & VISITOR TRACKING
// ========================================

// Storage helper functions (using localStorage instead of cookies for local files)
function setStorage(name, value) {
    try {
        localStorage.setItem(name, value);
        // Also try cookies as backup
        const date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    } catch (e) {
        console.error('Storage error:', e);
    }
}

function getStorage(name) {
    try {
        // Try localStorage first (works with file://)
        const localValue = localStorage.getItem(name);
        if (localValue) return localValue;

        // Fallback to cookies
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
    } catch (e) {
        console.error('Storage error:', e);
    }
    return null;
}

// Format date/time for display
function formatLastVisit(timestamp) {
    const lastVisit = new Date(parseInt(timestamp));
    const now = new Date();
    const diffMs = now - lastVisit;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return lastVisit.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: lastVisit.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

// Create welcome modal
function createWelcomeModal(isReturningVisitor, visitorName = '', lastVisit = null) {
    const modal = document.createElement('div');
    modal.className = 'welcome-modal';

    let modalContent;

    if (isReturningVisitor) {
        // Returning visitor
        const lastVisitFormatted = formatLastVisit(lastVisit);
        modalContent = `
            <div class="welcome-content">
                <h2>👋 Welcome back, <span class="visitor-name">${visitorName}</span>!</h2>
                <p>
                    Great to see you again! 🎉<br>
                    Your last visit was <span class="last-visit-time">${lastVisitFormatted}</span>.<br><br>
                    I'm Ben Gutman - Full Stack Developer passionate about creating amazing web experiences.
                </p>
                <button class="welcome-button" onclick="closeWelcomeModal()">Explore My Portfolio</button>
            </div>
        `;
    } else {
        // First-time visitor
        modalContent = `
            <div class="welcome-content">
                <h2>👋 Hello there!</h2>
                <p>
                    Welcome to my portfolio!<br>
                    I'm <strong>Ben Gutman</strong> - Full Stack Developer.<br><br>
                    May I know your name?
                </p>
                <div class="welcome-input-group">
                    <label for="visitor-name">Your Name:</label>
                    <input type="text" id="visitor-name" placeholder="Enter your name" autocomplete="off">
                </div>
                <button class="welcome-button" onclick="saveVisitorName()">Let's Go!</button>
            </div>
        `;
    }

    modal.innerHTML = modalContent;
    document.body.appendChild(modal);

    // Focus on input if first-time visitor
    if (!isReturningVisitor) {
        setTimeout(() => {
            const input = document.getElementById('visitor-name');
            if (input) {
                input.focus();
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        saveVisitorName();
                    }
                });
            }
        }, 800);
    } else {
        // Auto-close after 5 seconds for returning visitors
        setTimeout(() => {
            closeWelcomeModal();
        }, 5000);
    }
}

// Save visitor name and close modal
window.saveVisitorName = function() {
    const input = document.getElementById('visitor-name');
    const name = input ? input.value.trim() : '';

    if (!name) {
        input.style.borderColor = '#ef4444';
        input.placeholder = 'Please enter your name';
        input.focus();
        return;
    }

    // Save to storage
    setStorage('visitorName', name);
    setStorage('lastVisit', Date.now().toString());

    console.log('Saved visitor:', name); // Debug

    closeWelcomeModal();
};

// Close welcome modal with animation
window.closeWelcomeModal = function() {
    const modal = document.querySelector('.welcome-modal');
    if (modal) {
        modal.style.animation = 'fadeOutModal 0.4s ease forwards';
        setTimeout(() => {
            modal.remove();
        }, 400);
    }
};

// Initialize welcome modal on page load
function initWelcomeModal() {
    const visitorName = getStorage('visitorName');
    const lastVisit = getStorage('lastVisit');

    console.log('Checking storage:', { visitorName, lastVisit }); // Debug

    if (visitorName && lastVisit) {
        // Returning visitor
        createWelcomeModal(true, visitorName, lastVisit);
        // Update last visit time
        setStorage('lastVisit', Date.now().toString());
    } else {
        // First-time visitor
        createWelcomeModal(false);
    }
}

// Add fadeOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOutModal {
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Run welcome modal after page loads
window.addEventListener('load', () => {
    setTimeout(initWelcomeModal, 500);
});

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
