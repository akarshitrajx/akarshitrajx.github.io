// auth-handler.js - Complete Authentication Handler
// ============================================
import { 
    auth, db, 
    onAuthStateChanged, signOut, 
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup, updateProfile,
    doc, setDoc, getDoc, updateDoc, increment, serverTimestamp 
} from './firebase-config.js';

// Global state
let currentUser = null;
let userData = null;

// ============================================
// Initialize Auth
// ============================================
function initAuth() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            await loadUserData(user.uid);
            showLoggedInUI(user);
        } else {
            currentUser = null;
            userData = null;
            showLoggedOutUI();
        }
    });
}

// ============================================
// Load User Data
// ============================================
async function loadUserData(uid) {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            userData = userSnap.data();
            await updateDoc(userRef, { lastActive: serverTimestamp() });
        } else {
            userData = {
                uid: uid,
                email: currentUser.email,
                displayName: currentUser.displayName || 'Coder',
                photoURL: currentUser.photoURL || '',
                xp: 0,
                level: 1,
                streak: 0,
                lastActive: serverTimestamp(),
                problemsSolved: 0,
                coursesCompleted: 0,
                quizzesTaken: 0,
                totalScore: 0,
                badges: ['newcomer'],
                createdAt: serverTimestamp()
            };
            await setDoc(userRef, userData);
        }
        updateProgressUI();
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// ============================================
// Show Logged In UI
// ============================================
function showLoggedInUI(user) {
    const navAuth = document.getElementById('nav-auth');
    const userMenu = document.getElementById('user-menu');
    const userProgress = document.getElementById('user-progress');

    if (navAuth) navAuth.style.display = 'none';
    if (userMenu) {
        userMenu.style.display = 'flex';
        const avatar = document.getElementById('nav-avatar');
        const username = document.getElementById('nav-username');
        if (avatar) avatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Coder')}&background=6366f1&color=fff`;
        if (username) username.textContent = user.displayName || user.email.split('@')[0];
    }
    if (userProgress) userProgress.style.display = 'block';
}

// ============================================
// Show Logged Out UI
// ============================================
function showLoggedOutUI() {
    const navAuth = document.getElementById('nav-auth');
    const userMenu = document.getElementById('user-menu');
    const userProgress = document.getElementById('user-progress');

    if (navAuth) navAuth.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
    if (userProgress) userProgress.style.display = 'none';
}

// ============================================
// Update Progress UI
// ============================================
function updateProgressUI() {
    if (!userData) return;

    const levelEl = document.getElementById('user-level');
    const titleEl = document.getElementById('user-title');
    const xpEl = document.getElementById('user-xp');
    const problemsEl = document.getElementById('user-problems');
    const quizzesEl = document.getElementById('user-quizzes');
    const streakEl = document.getElementById('user-streak');
    const scoreEl = document.getElementById('user-score');
    const currentXpEl = document.getElementById('current-xp');
    const nextLevelEl = document.getElementById('next-level');
    const xpFill = document.getElementById('xp-fill');

    const level = userData.level || 1;
    const xp = userData.xp || 0;
    const xpForNext = level * 1000;
    const xpInCurrent = xp % 1000;
    const progress = (xpInCurrent / 1000) * 100;

    const titles = ['Beginner', 'Novice', 'Coder', 'Developer', 'Expert', 'Master', 'Legend'];
    const title = titles[Math.min(level - 1, titles.length - 1)] || 'Beginner';

    if (levelEl) levelEl.textContent = level;
    if (titleEl) titleEl.textContent = title;
    if (xpEl) xpEl.textContent = xp.toLocaleString() + ' XP';
    if (problemsEl) problemsEl.textContent = userData.problemsSolved || 0;
    if (quizzesEl) quizzesEl.textContent = userData.quizzesTaken || 0;
    if (streakEl) streakEl.textContent = userData.streak || 0;
    if (scoreEl) scoreEl.textContent = userData.totalScore || 0;
    if (currentXpEl) currentXpEl.textContent = xpInCurrent + ' XP';
    if (nextLevelEl) nextLevelEl.textContent = (xpForNext - xpInCurrent) + ' XP to Level ' + (level + 1);
    if (xpFill) xpFill.style.width = progress + '%';
}

// ============================================
// Login Handler
// ============================================
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    try {
        errorEl.textContent = '';
        await signInWithEmailAndPassword(auth, email, password);
        closeAuthModal();
    } catch (error) {
        errorEl.textContent = getErrorMessage(error.code);
    }
}

// ============================================
// Signup Handler
// ============================================
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const errorEl = document.getElementById('signup-error');

    if (password !== confirm) {
        errorEl.textContent = 'Passwords do not match!';
        return;
    }
    if (password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters!';
        return;
    }

    try {
        errorEl.textContent = '';
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });

        await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: email,
            displayName: name,
            photoURL: '',
            xp: 0,
            level: 1,
            streak: 0,
            lastActive: serverTimestamp(),
            problemsSolved: 0,
            coursesCompleted: 0,
            quizzesTaken: 0,
            totalScore: 0,
            badges: ['newcomer'],
            createdAt: serverTimestamp()
        });

        closeAuthModal();
    } catch (error) {
        errorEl.textContent = getErrorMessage(error.code);
    }
}

// ============================================
// Google Sign In
// ============================================
async function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Coder',
                photoURL: user.photoURL || '',
                xp: 0,
                level: 1,
                streak: 0,
                lastActive: serverTimestamp(),
                problemsSolved: 0,
                coursesCompleted: 0,
                quizzesTaken: 0,
                totalScore: 0,
                badges: ['newcomer'],
                createdAt: serverTimestamp()
            });
        }

        closeAuthModal();
    } catch (error) {
        console.error('Google sign in error:', error);
        alert('Google sign in failed: ' + error.message);
    }
}

// ============================================
// Logout
// ============================================
async function logoutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// ============================================
// Modal Functions
// ============================================
function openLoginModal() {
    const modal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (modal) modal.classList.add('active');
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
}

function openSignupModal() {
    const modal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (modal) modal.classList.add('active');
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
}

function showSignup() {
    openSignupModal();
}

function showLogin() {
    openLoginModal();
}

// ============================================
// Error Messages
// ============================================
function getErrorMessage(code) {
    const messages = {
        'auth/invalid-email': 'Invalid email address!',
        'auth/user-disabled': 'This account has been disabled!',
        'auth/user-not-found': 'No account found with this email!',
        'auth/wrong-password': 'Incorrect password!',
        'auth/email-already-in-use': 'An account already exists with this email!',
        'auth/weak-password': 'Password should be at least 6 characters!',
        'auth/invalid-credential': 'Invalid email or password!',
        'auth/popup-closed-by-user': 'Sign in popup was closed!',
        'auth/network-request-failed': 'Network error. Check your connection!'
    };
    return messages[code] || 'An error occurred. Please try again!';
}

// ============================================
// Add XP
// ============================================
async function addXP(amount) {
    if (!currentUser || !userData) return;

    try {
        const userRef = doc(db, 'users', currentUser.uid);
        const newXP = (userData.xp || 0) + amount;
        const newLevel = Math.floor(newXP / 1000) + 1;

        await updateDoc(userRef, {
            xp: increment(amount),
            level: newLevel,
            lastActive: serverTimestamp()
        });

        userData.xp = newXP;
        userData.level = newLevel;
        updateProgressUI();
        showXPNotification(amount);
    } catch (error) {
        console.error('Error adding XP:', error);
    }
}

// ============================================
// XP Notification
// ============================================
function showXPNotification(amount) {
    const notif = document.createElement('div');
    notif.className = 'xp-notification';
    notif.innerHTML = `+${amount} XP`;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add('show'), 100);
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// ============================================
// Global Exports
// ============================================
window.openLoginModal = openLoginModal;
window.openSignupModal = openSignupModal;
window.closeAuthModal = closeAuthModal;
window.showSignup = showSignup;
window.showLogin = showLogin;
window.logoutUser = logoutUser;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleGoogleSignIn = handleGoogleSignIn;
window.addXP = addXP;

// Initialize
document.addEventListener('DOMContentLoaded', initAuth);

export { currentUser, userData, addXP };
