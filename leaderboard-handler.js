// leaderboard-handler.js - Real-time Leaderboard
// ============================================
import { db, collection, query, orderBy, limit, getDocs } from './firebase-config.js';

// ============================================
// Load Leaderboard
// ============================================
async function loadLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;

    try {
        tbody.innerHTML = '<div class="leaderboard-row"><div style="grid-column:1/-1;text-align:center;padding:20px;color:#888;">Loading top coders...</div></div>';

        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('xp', 'desc'), limit(10));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            tbody.innerHTML = '<div class="leaderboard-row"><div style="grid-column:1/-1;text-align:center;padding:20px;color:#888;">No data yet. Be the first to start coding!</div></div>';
            return;
        }

        let html = '';
        let rank = 1;

        snapshot.forEach((doc) => {
            const user = doc.data();
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
            const streak = user.streak || 0;
            const streakIcon = streak >= 30 ? '🔥' : streak >= 7 ? '⚡' : '';

            html += `
                <div class="leaderboard-row rank-${rank}">
                    <div class="rank">${medal}</div>
                    <div class="user-cell">
                        <img src="${user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Coder')}&background=6366f1&color=fff`}" alt="${user.displayName || 'Coder'}">
                        <span>${user.displayName || 'Anonymous'}</span>
                    </div>
                    <div class="xp-cell">${(user.xp || 0).toLocaleString()} XP</div>
                    <div class="streak-cell">${streakIcon} ${streak} days</div>
                </div>
            `;
            rank++;
        });

        tbody.innerHTML = html;

    } catch (error) {
        console.error('Error loading leaderboard:', error);
        tbody.innerHTML = '<div class="leaderboard-row"><div style="grid-column:1/-1;text-align:center;padding:20px;color:#ef4444;">Failed to load leaderboard.</div></div>';
    }
}

// ============================================
// Load Global Stats
// ============================================
async function loadGlobalStats() {
    try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);

        let totalStudents = 0;
        let totalProblems = 0;

        snapshot.forEach((doc) => {
            const user = doc.data();
            totalStudents++;
            totalProblems += user.problemsSolved || 0;
        });

        const studentsEl = document.getElementById('stat-students');
        const studentsEl2 = document.getElementById('stat-students-2');
        const problemsEl = document.getElementById('stat-problems');

        if (studentsEl) studentsEl.textContent = totalStudents.toLocaleString() + '+';
        if (studentsEl2) studentsEl2.textContent = totalStudents.toLocaleString() + '+';
        if (problemsEl) problemsEl.textContent = totalProblems.toLocaleString() + '+';

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
    loadGlobalStats();
});

export { loadLeaderboard, loadGlobalStats };
