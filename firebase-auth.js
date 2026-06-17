/* ============================================================
   AR. CODING PLATFORM — Firebase Auth + Firestore
   Real backend: Google Firebase (free tier)
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ─── CONFIG ─── */
const firebaseConfig = {
  apiKey: "AIzaSyAtoP0gtg3KW7scunVfmA-feCoS8cZIghk",
  authDomain: "akarshit-web.firebaseapp.com",
  projectId: "akarshit-web",
  storageBucket: "akarshit-web.firebasestorage.app",
  messagingSenderId: "559932819732",
  appId: "1:559932819732:web:ff3cae1992d947e59c9a01",
  measurementId: "G-7L9HEK8FEJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const XP_PER_LEVEL = 1000;

/* ============================================================
   HELPERS
   ============================================================ */
function showNotif(msg) {
  if (window.showNotification) window.showNotification(msg);
  else console.log(msg);
}
function showAuthError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearAuthError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}
function setSubmitLoading(formId, loading) {
  const btn = document.querySelector(`#${formId} .auth-submit`);
  if (!btn) return;
  btn.disabled = loading;
  btn.style.opacity = loading ? '0.7' : '1';
  if (formId === 'loginForm') btn.textContent = loading ? '⏳ Logging in...' : '🔐 Login to Platform';
  if (formId === 'signupForm') btn.textContent = loading ? '⏳ Creating...' : '✨ Create Free Account';
}

/* ============================================================
   FIRESTORE USER DOC
   ============================================================ */
async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}
async function createUserDoc(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    xp: 0,
    level: 1,
    streak: 0,
    lastVisit: null,
    joinDate: new Date().toLocaleDateString('en-IN'),
    createdAt: serverTimestamp()
  });
}
async function updateUserDoc(uid, data) {
  await updateDoc(doc(db, 'users', uid), data);
}

/* ============================================================
   XP + STREAK SYSTEM (Cloud-persisted)
   ============================================================ */
async function addXP(amount, reason) {
  const user = auth.currentUser;
  if (!user) return;
  const data = await getUserDoc(user.uid);
  if (!data) return;
  const newXP = (data.xp || 0) + amount;
  const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
  await updateUserDoc(user.uid, { xp: newXP, level: newLevel });
  showNotif(`+${amount} XP — ${reason}!`);
  if (newLevel > (data.level || 1) && window.triggerAchievement) {
    window.triggerAchievement('⬆️', 'Level Up!', `Now Level ${newLevel}`);
  }
  updateNavUser({ ...data, xp: newXP, level: newLevel });
}
window.addXP = addXP;

async function checkStreak(uid, data) {
  const today = new Date().toDateString();
  if (data.lastVisit === today) return data;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  let newStreak = 1;
  if (data.lastVisit === yesterday) newStreak = (data.streak || 0) + 1;
  await updateUserDoc(uid, { streak: newStreak, lastVisit: today });
  if (newStreak > 1 && window.triggerAchievement) {
    window.triggerAchievement('🔥', `${newStreak} Day Streak!`, 'Keep coding daily!');
  }
  return { ...data, streak: newStreak, lastVisit: today };
}

/* ============================================================
   SIGNUP
   ============================================================ */
async function handleSignup(e) {
  e.preventDefault();
  clearAuthError('signupError');
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass = document.getElementById('signupPass').value;
  setSubmitLoading('signupForm', true);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    await createUserDoc(cred.user.uid, { name, email });
    showNotif(`🎉 Welcome, ${name}! Account created.`);
    if (window.triggerAchievement) window.triggerAchievement('🎉', 'Welcome!', `Hello, ${name}!`);
    closeAuthModal();
  } catch (err) {
    showAuthError('signupError', firebaseErrMsg(err.code));
  } finally {
    setSubmitLoading('signupForm', false);
  }
}

/* ============================================================
   LOGIN
   ============================================================ */
async function handleLogin(e) {
  e.preventDefault();
  clearAuthError('loginError');
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  setSubmitLoading('loginForm', true);
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    showNotif(`👋 Welcome back!`);
    closeAuthModal();
  } catch (err) {
    showAuthError('loginError', firebaseErrMsg(err.code));
  } finally {
    setSubmitLoading('loginForm', false);
  }
}

/* ============================================================
   LOGOUT
   ============================================================ */
async function handleLogout() {
  closeProfileDropdown();
  await signOut(auth);
  showNotif('👋 Logged out successfully!');
  const area = document.getElementById('navAuthArea');
  if (area) area.innerHTML = `<button class="nav-cta" onclick="openAuthModal('login')"><span>🔐</span><span>Login</span></button>`;
}

/* ============================================================
   PASSWORD RESET
   ============================================================ */
async function handlePasswordReset() {
  const email = document.getElementById('loginEmail').value.trim();
  if (!email) { showAuthError('loginError', '⚠️ Enter your email first.'); return; }
  try {
    await sendPasswordResetEmail(auth, email);
    showNotif(`📧 Reset link sent to ${email}!`);
  } catch (err) {
    showAuthError('loginError', firebaseErrMsg(err.code));
  }
}
window.handlePasswordReset = handlePasswordReset;

/* ============================================================
   AUTH STATE OBSERVER (runs on every page load)
   ============================================================ */
onAuthStateChanged(auth, async (user) => {
  if (user) {
    let data = await getUserDoc(user.uid);
    if (!data) {
      await createUserDoc(user.uid, { name: user.displayName || 'Coder', email: user.email });
      data = await getUserDoc(user.uid);
    }
    data = await checkStreak(user.uid, data);
    updateNavUser(data);
    await addXP(50, 'Daily Login');
    // Seed default bookmarks once per user
    await seedDefaultBookmarks(user.uid);
  } else {
    const area = document.getElementById('navAuthArea');
    if (area) area.innerHTML = `<button class="nav-cta" onclick="openAuthModal('login')"><span>🔐</span><span>Login</span></button>`;
  }
});

/* ============================================================
   UPDATE NAVBAR UI
   ============================================================ */
function updateNavUser(data) {
  const area = document.getElementById('navAuthArea');
  if (!area || !data) return;
  const initials = (data.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  area.innerHTML = `<button class="nav-user-btn" onclick="toggleProfileDropdown()"><div class="nav-user-avatar">${initials}</div><span>${(data.name||'Coder').split(' ')[0]}</span><span style="font-size:.7rem;color:var(--primary);">Lv.${data.level||1}</span></button>`;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('pdAvatar', initials);
  set('pdName', data.name || 'Coder');
  set('pdEmail', data.email || '');
  set('pdXP', (data.xp || 0).toLocaleString());
  set('pdLevel', data.level || 1);
  set('pdStreak', data.streak || 0);
  const bar = document.getElementById('pdXpBar');
  if (bar) bar.style.width = (((data.xp || 0) % XP_PER_LEVEL) / XP_PER_LEVEL * 100) + '%';
}

/* ============================================================
   NOTES SYSTEM — Firestore
   ============================================================ */
async function addNote() {
  const user = auth.currentUser;
  if (!user) { showNotif('🔐 Please login to save notes!'); openAuthModal('login'); return; }
  const title = document.getElementById('noteTitleInput').value.trim();
  const content = document.getElementById('noteContentInput').value.trim();
  const tag = document.getElementById('noteTagSelect').value;
  if (!title && !content) { showNotif('⚠️ Kuch likho pehle!'); return; }
  try {
    await addDoc(collection(db, 'users', user.uid, 'notes'), {
      title: title || 'Untitled', content, tag,
      date: new Date().toLocaleDateString('en-IN'),
      createdAt: serverTimestamp()
    });
    document.getElementById('noteTitleInput').value = '';
    document.getElementById('noteContentInput').value = '';
    renderNotes();
    showNotif('📒 Note saved to cloud!');
    addXP(5, 'Note Added');
  } catch (err) { showNotif('❌ Note save failed: ' + err.message); }
}

async function deleteNote(id) {
  const user = auth.currentUser;
  if (!user) return;
  await deleteDoc(doc(db, 'users', user.uid, 'notes', id));
  renderNotes();
  showNotif('🗑️ Note deleted!');
}

const TAG_ICONS = { general:'📌', python:'🐍', cpp:'⚡', javascript:'🌐', dsa:'📊', webdev:'🌍' };

async function renderNotes() {
  const list = document.getElementById('notesList');
  if (!list) return;
  const user = auth.currentUser;
  if (!user) {
    list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">🔐</span><p>Login karo notes dekhne ke liye!</p></div>`;
    return;
  }
  list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">⏳</span><p>Loading...</p></div>`;
  try {
    const q = query(collection(db, 'users', user.uid, 'notes'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) {
      list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">📒</span><p>No notes yet. Add your first note!</p></div>`;
      return;
    }
    list.innerHTML = snap.docs.map(d => {
      const n = d.data();
      return `<div class="note-item">
        <div class="note-item-header">
          <div class="note-item-title">${escHtml(n.title)}</div>
          <div style="display:flex;align-items:center;gap:.4rem;">
            <span class="note-item-tag">${TAG_ICONS[n.tag]||'📌'} ${n.tag}</span>
            <button class="note-delete" onclick="deleteNote('${d.id}')" title="Delete">🗑️</button>
          </div>
        </div>
        ${n.content ? `<div class="note-item-content">${escHtml(n.content)}</div>` : ''}
        <div class="note-item-date">${n.date || ''}</div>
      </div>`;
    }).join('');
  } catch (err) {
    list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">❌</span><p>Load failed. Check connection.</p></div>`;
  }
}

/* ============================================================
   BOOKMARKS SYSTEM — Firestore
   ============================================================ */
let currentBFilter = 'all';

async function seedDefaultBookmarks(uid) {
  const seedRef = doc(db, 'users', uid, 'meta', 'bookmarkSeeded');
  const snap = await getDoc(seedRef);
  if (snap.exists()) return;
  const defaults = [
    { title:'Python Full Course', url:'https://youtube.com/@AkarshitRaj', type:'course', icon:'🐍' },
    { title:'C++ Full Course', url:'https://youtube.com/@AkarshitRaj', type:'course', icon:'⚡' },
    { title:'JavaScript Course', url:'https://youtube.com/@AkarshitRaj', type:'course', icon:'🌐' },
    { title:'LeetCode Practice', url:'https://leetcode.com', type:'tool', icon:'🏆' },
    { title:'GeeksForGeeks', url:'https://geeksforgeeks.org', type:'tool', icon:'📘' },
    { title:'Programiz Compiler', url:'https://programiz.com/python-programming/online-compiler/', type:'tool', icon:'🔧' },
  ];
  for (const bm of defaults) {
    await addDoc(collection(db, 'users', uid, 'bookmarks'), { ...bm, createdAt: serverTimestamp() });
  }
  await setDoc(seedRef, { done: true });
}

async function addCustomBookmark() {
  const user = auth.currentUser;
  if (!user) { showNotif('🔐 Login karo bookmarks save karne ke liye!'); openAuthModal('login'); return; }
  const title = document.getElementById('bmTitleInput').value.trim();
  const url = document.getElementById('bmUrlInput').value.trim();
  if (!title || !url) { showNotif('⚠️ Title aur URL dono chahiye!'); return; }
  if (!url.startsWith('http')) { showNotif('⚠️ Valid URL daalo (https://...)'); return; }
  await addDoc(collection(db, 'users', user.uid, 'bookmarks'), { title, url, type: 'custom', icon: '⭐', createdAt: serverTimestamp() });
  document.getElementById('bmTitleInput').value = '';
  document.getElementById('bmUrlInput').value = '';
  renderBookmarks();
  showNotif('🔖 Bookmark saved to cloud!');
}

async function deleteBookmark(id) {
  const user = auth.currentUser;
  if (!user) return;
  await deleteDoc(doc(db, 'users', user.uid, 'bookmarks', id));
  renderBookmarks();
  showNotif('🗑️ Bookmark removed!');
}

function filterBookmarks(type) {
  currentBFilter = type;
  document.querySelectorAll('[data-bfilter]').forEach(b => b.classList.toggle('active', b.dataset.bfilter === type));
  renderBookmarks();
}

async function renderBookmarks() {
  const list = document.getElementById('bookmarksList');
  if (!list) return;
  const user = auth.currentUser;
  if (!user) {
    list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">🔐</span><p>Login karo bookmarks dekhne ke liye!</p></div>`;
    return;
  }
  list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">⏳</span><p>Loading...</p></div>`;
  try {
    const q = query(collection(db, 'users', user.uid, 'bookmarks'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    let docs = snap.docs;
    if (currentBFilter !== 'all') docs = docs.filter(d => d.data().type === currentBFilter);
    if (!docs.length) {
      list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">🔖</span><p>No bookmarks ${currentBFilter !== 'all' ? 'in this category' : 'yet'}.</p></div>`;
      return;
    }
    list.innerHTML = docs.map(d => {
      const b = d.data();
      return `<a href="${b.url}" target="_blank" rel="noopener" class="bookmark-item">
        <div class="bm-icon">${b.icon||'🔗'}</div>
        <div style="flex:1;min-width:0;">
          <div class="bm-title">${escHtml(b.title)}</div>
          <div class="bm-url">${b.url}</div>
        </div>
        <button class="bm-delete" onclick="event.preventDefault();event.stopPropagation();deleteBookmark('${d.id}')" title="Remove">✕</button>
      </a>`;
    }).join('');
  } catch (err) {
    list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">❌</span><p>Load failed. Check connection.</p></div>`;
  }
}

/* ============================================================
   OPEN / CLOSE PANELS (expose to HTML onclick)
   ============================================================ */
function openNotes() {
  document.getElementById('notesOverlay').classList.add('active');
  document.getElementById('notesPanel').classList.add('active');
  renderNotes();
}
function closeNotes() {
  document.getElementById('notesOverlay').classList.remove('active');
  document.getElementById('notesPanel').classList.remove('active');
}
function openBookmarks() {
  document.getElementById('bookmarksOverlay').classList.add('active');
  document.getElementById('bookmarksPanel').classList.add('active');
  renderBookmarks();
}
function closeBookmarks() {
  document.getElementById('bookmarksOverlay').classList.remove('active');
  document.getElementById('bookmarksPanel').classList.remove('active');
}

/* ============================================================
   FIREBASE ERROR MESSAGES (Hindi-friendly)
   ============================================================ */
function firebaseErrMsg(code) {
  const msgs = {
    'auth/email-already-in-use': '❌ Yeh email already registered hai. Login karo!',
    'auth/invalid-email': '❌ Valid email address daalo.',
    'auth/weak-password': '❌ Password kam se kam 6 characters ka hona chahiye.',
    'auth/user-not-found': '❌ Is email se koi account nahi mila.',
    'auth/wrong-password': '❌ Wrong password. Dobara try karo.',
    'auth/too-many-requests': '⚠️ Bahut zyada attempts. Thodi der baad try karo.',
    'auth/network-request-failed': '⚠️ Internet connection check karo.',
    'auth/invalid-credential': '❌ Email ya password galat hai.',
  };
  return msgs[code] || `❌ Error: ${code}`;
}

/* ============================================================
   UTILS
   ============================================================ */
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ============================================================
   PROFILE DROPDOWN
   ============================================================ */
function toggleProfileDropdown() {
  document.getElementById('profileDropdown').classList.toggle('active');
}
function closeProfileDropdown() {
  document.getElementById('profileDropdown').classList.remove('active');
}
document.addEventListener('click', e => {
  if (!e.target.closest('#profileDropdown') && !e.target.closest('#navAuthArea')) {
    closeProfileDropdown();
  }
});

/* ============================================================
   OPEN AUTH MODAL
   ============================================================ */
function openAuthModal(tab) {
  document.getElementById('authModalOverlay').classList.add('active');
  document.getElementById('authModal').classList.add('active');
  switchAuthTab(tab || 'login');
}
function closeAuthModal() {
  document.getElementById('authModalOverlay').classList.remove('active');
  document.getElementById('authModal').classList.remove('active');
}
function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('loginForm').style.display = isLogin ? 'block' : 'none';
  document.getElementById('signupForm').style.display = isLogin ? 'none' : 'block';
  document.getElementById('loginTab').classList.toggle('active', isLogin);
  document.getElementById('signupTab').classList.toggle('active', !isLogin);
  clearAuthError('loginError'); clearAuthError('signupError');
}
function togglePassView(id, btn) {
  const inp = document.getElementById(id);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁️' : '🙈';
}
document.getElementById('signupPass')?.addEventListener('input', function() {
  const v = this.value, el = document.getElementById('passStrength');
  if (!el) return;
  if (v.length < 6) el.dataset.level = 'weak';
  else if (v.length >= 10 && /[A-Z]/.test(v) && /[0-9]/.test(v) && /[^a-zA-Z0-9]/.test(v)) el.dataset.level = 'strong';
  else el.dataset.level = 'medium';
});

/* ============================================================
   WRAP original runCode + sendAIMessage to award XP
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  const origRun = window.runCode;
  window.runCode = function() {
    origRun && origRun();
    if (auth.currentUser) setTimeout(() => addXP(10, 'Code Executed'), 1200);
  };
  const origAI = window.sendAIMessage;
  window.sendAIMessage = function(p) {
    origAI && origAI(p);
    if (auth.currentUser) setTimeout(() => addXP(5, 'AI Chat'), 1000);
  };
});

/* ============================================================
   EXPOSE TO GLOBAL (HTML onclick attributes)
   ============================================================ */
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleLogout = handleLogout;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.togglePassView = togglePassView;
window.toggleProfileDropdown = toggleProfileDropdown;
window.closeProfileDropdown = closeProfileDropdown;
window.openNotes = openNotes;
window.closeNotes = closeNotes;
window.addNote = addNote;
window.deleteNote = deleteNote;
window.openBookmarks = openBookmarks;
window.closeBookmarks = closeBookmarks;
window.addCustomBookmark = addCustomBookmark;
window.deleteBookmark = deleteBookmark;
window.filterBookmarks = filterBookmarks;
