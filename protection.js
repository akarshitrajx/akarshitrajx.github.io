// ============================================
// COPY PROTECTION - Akarshit Raj Website
// ============================================

// Disable right-click
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showProtectionMessage();
    return false;
});

// Disable keyboard shortcuts for dev tools
document.addEventListener('keydown', function(e) {
    // F12
    if(e.key === 'F12') {
        e.preventDefault();
        showProtectionMessage();
        return false;
    }
    // Ctrl+Shift+I (Inspect)
    if(e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        showProtectionMessage();
        return false;
    }
    // Ctrl+Shift+J (Console)
    if(e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        showProtectionMessage();
        return false;
    }
    // Ctrl+U (View Source)
    if(e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        showProtectionMessage();
        return false;
    }
    // Ctrl+Shift+C (Inspect Element)
    if(e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        showProtectionMessage();
        return false;
    }
});

// Disable text selection
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

// Disable copy
document.addEventListener('copy', function(e) {
    e.preventDefault();
    showProtectionMessage();
    return false;
});

// Disable cut
document.addEventListener('cut', function(e) {
    e.preventDefault();
    return false;
});

// Disable drag
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

// DevTools detection via window size
let devToolsOpen = false;
setInterval(function() {
    const threshold = 160;
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    
    if(widthDiff > threshold || heightDiff > threshold) {
        if(!devToolsOpen) {
            devToolsOpen = true;
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#020617;color:#ef4444;font-size:2rem;font-weight:700;text-align:center;padding:2rem;font-family:sans-serif;">&#128683;<br>Developer Tools Detected<br><br>Access Denied.<br><span style="font-size:1rem;color:#94a3b8;margin-top:1rem;">This content is protected.</span></div>';
        }
    }
}, 1000);

// Console detection
(function() {
    const devtools = {open: false, orientation: null};
    const threshold = 160;
    
    setInterval(function() {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const orientation = widthThreshold ? 'vertical' : 'horizontal';
        
        if(!(heightThreshold && widthThreshold) && 
           ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || 
            widthThreshold || heightThreshold)) {
            if(!devtools.open || devtools.orientation !== orientation) {
                devtools.open = true;
                devtools.orientation = orientation;
            }
        } else {
            devtools.open = false;
            devtools.orientation = null;
        }
    }, 500);
})();

// Show protection message
function showProtectionMessage() {
    let overlay = document.getElementById('protectionOverlay');
    if(!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'protectionOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:99999;display:none;justify-content:center;align-items:center;flex-direction:column;gap:1rem;font-family:sans-serif;';
        overlay.innerHTML = '<h2 style="color:#ef4444;font-size:2.5rem;font-weight:800;">&#128683; Content Protected</h2><p style="color:#94a3b8;text-align:center;max-width:400px;padding:0 1rem;font-size:1rem;">This website content is protected. Copying, right-clicking, and developer tools are disabled.</p><button style="padding:12px 28px;border:none;border-radius:12px;background:#111827;color:#00ffff;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 0 10px #00ffff;margin-top:1rem;" onclick="document.getElementById(\'protectionOverlay\').style.display=\'none\'">I Understand</button>';
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

// Add copyright notice to console
console.log('%c STOP! ', 'color: white; background: #ef4444; font-size: 40px; font-weight: bold; padding: 10px; border-radius: 8px;');
console.log('%c This website content is protected by Akarshit Raj. ', 'color: #ef4444; font-size: 16px; font-weight: bold;');
console.log('%c Unauthorized copying or distribution is strictly prohibited. ', 'color: #94a3b8; font-size: 14px;');
