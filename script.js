// ============================================
// CODING MASTER - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });

    // Active sidebar link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.background = '#ccc';
            link.style.fontWeight = '700';
        }
    });

    // Active nav link highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.background = '#04AA6D';
            link.style.color = '#fff';
        }
    });

    // Search functionality
    const searchBox = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box button');

    if (searchBox && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchBox.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }

    function performSearch() {
        const query = searchBox.value.toLowerCase().trim();
        if (!query) return;

        // Simple search - redirect to relevant page
        const pages = {
            'html': 'html-tutorial.html',
            'css': 'css-tutorial.html',
            'javascript': 'js-tutorial.html',
            'js': 'js-tutorial.html',
            'python': 'python-tutorial.html',
            'sql': 'sql-tutorial.html',
            'react': 'react-tutorial.html',
            'node': 'nodejs-tutorial.html',
            'bootstrap': 'bootstrap-tutorial.html',
            'php': 'php-tutorial.html',
            'java': 'java-tutorial.html',
            'quiz': 'daily-quiz.html',
            'practice': 'practice.html',
            'challenge': 'daily-challenges.html',
            'compiler': 'compiler.html'
        };

        for (let key in pages) {
            if (query.includes(key)) {
                window.location.href = pages[key];
                return;
            }
        }

        alert('Tutorial not found! Try: HTML, CSS, JavaScript, Python, SQL, React, etc.');
    }

    // Color picker interaction
    const colorBoxes = document.querySelectorAll('.color-box');
    colorBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const color = this.style.background;
            navigator.clipboard.writeText(color).then(() => {
                showToast('Color copied: ' + color);
            });
        });
    });

    // Toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInUp 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Progress bar animation on scroll
    const progressBars = document.querySelectorAll('.progress-fill');
    const animateProgress = () => {
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                bar.style.width = bar.style.width || '0%';
            }
        });
    };

    window.addEventListener('scroll', animateProgress);

    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

});
