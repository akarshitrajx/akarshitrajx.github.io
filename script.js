/* ============================================================
   AKARSHIT RAJ — CODING PLATFORM — MAIN SCRIPT
   ============================================================ */
'use strict';

/* ============================================================
   LOADING SCREEN
   ============================================================ */
(function initLoader() {
  const bar = document.getElementById('loaderBar');
  const screen = document.getElementById('loadingScreen');
  const text = document.getElementById('loaderText');
  const msgs = ['Initializing AI...', 'Loading Editor...', 'Preparing Platform...', 'Almost Ready...'];
  let progress = 0, msgIndex = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 22 + 8;
    if (progress > 100) progress = 100;
    if (bar) bar.style.width = progress + '%';
    if (text && msgIndex < msgs.length) text.textContent = msgs[Math.floor(msgIndex)];
    msgIndex += 0.4;
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (screen) { screen.classList.add('hidden'); }
        triggerAchievement('🎉', 'Welcome!', 'Platform Loaded');
      }, 300);
    }
  }, 120);
})();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
  function animRing() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animRing); }
  animRing();
  document.querySelectorAll('a, button, [role="button"], .cursor-hover').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
})();

/* ============================================================
   PARTICLE SYSTEM
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };
  const COUNT = window.innerWidth < 768 ? 40 : 80;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  function Particle() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4; this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = ['#06b6d4','#3b82f6','#8b5cf6','#ffd700'][Math.floor(Math.random()*4)];
  }
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill();
    });
    ctx.globalAlpha = 0.06;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath(); ctx.strokeStyle = '#06b6d4';
          ctx.globalAlpha = 0.06 * (1 - dist/120);
          ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   NAVBAR SCROLL
   ============================================================ */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  const scrollTop = document.getElementById('scrollTopBtn');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  if (scrollTop) scrollTop.classList.toggle('visible', window.scrollY > 400);
  checkScrollAnimations();
}, { passive: true });

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
function checkScrollAnimations() {
  document.querySelectorAll('.anim, .anim-left, .anim-right').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) el.classList.add('visible');
  });
}
window.addEventListener('load', checkScrollAnimations);

/* ============================================================
   SIDEBAR
   ============================================================ */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('sidebarOverlay').classList.toggle('active');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('active');
  document.getElementById('sidebarOverlay').classList.remove('active');
}
function goToSection(id) {
  closeSidebar();
  const el = document.getElementById(id);
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.goToSection = goToSection;

/* ============================================================
   MOBILE NAV
   ============================================================ */
function toggleMobileNav() {
  const nl = document.getElementById('navLinks');
  if (nl) nl.classList.toggle('mobile-open');
}
window.toggleMobileNav = toggleMobileNav;

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''));
  const suffix = el.dataset.suffix || '';
  const duration = 2000; const step = duration / 60;
  let current = 0;
  const increment = target / (duration / step);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, step);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting && !entry.target.dataset.counted) { entry.target.dataset.counted = '1'; animateCounter(entry.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number, .counter').forEach(el => counterObserver.observe(el));

/* ============================================================
   PISTON CODE RUNNER
   ============================================================ */
const PISTON_API = 'https://emkc.org/api/v2/piston/execute';
const LANG_CONFIG = {
  python:     { language: 'python',     version: '3.10.0' },
  cpp:        { language: 'cpp',        version: '10.2.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  java:       { language: 'java',       version: '15.0.2' },
  csharp:     { language: 'csharp',     version: '6.12.0' },
  php:        { language: 'php',        version: '8.2.0' },
  kotlin:     { language: 'kotlin',     version: '1.8.20' },
  swift:      { language: 'swift',      version: '5.3.3' },
  go:         { language: 'go',         version: '1.18.0' },
  rust:       { language: 'rust',       version: '1.68.2' },
  html:       { language: 'html',       version: 'latest' },
};
const CODE_TEMPLATES = {
  python: `# 🐍 Python Code\nprint("Hello, World!")\nname = "Akarshit"\nprint(f"Welcome to {name}'s Coding Platform!")\n\n# Try a loop:\nfor i in range(1, 6):\n    print(f"Count: {i}")`,
  cpp: `// ⚡ C++ Code\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    string name = "Akarshit";\n    cout << "Welcome to " << name << "'s Platform!" << endl;\n    \n    // Loop example:\n    for (int i = 1; i <= 5; i++) {\n        cout << "Count: " << i << endl;\n    }\n    return 0;\n}`,
  javascript: `// ✨ JavaScript Code\nconsole.log("Hello, World!");\nconst name = "Akarshit";\nconsole.log(\`Welcome to \${name}'s Coding Platform!\`);\n\n// Array example:\nconst nums = [1, 2, 3, 4, 5];\nnums.forEach(n => console.log("Count:", n));`,
  java: `// ☕ Java Code\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        String name = "Akarshit";\n        System.out.println("Welcome to " + name + "'s Platform!");\n        \n        for (int i = 1; i <= 5; i++) {\n            System.out.println("Count: " + i);\n        }\n    }\n}`,
  csharp: `// C# Code\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n        string name = "Akarshit";\n        Console.WriteLine($"Welcome to {name}'s Platform!");\n        for (int i = 1; i <= 5; i++) {\n            Console.WriteLine($"Count: {i}");\n        }\n    }\n}`,
  php: `<?php\necho "Hello, World!\\n";\n$name = "Akarshit";\necho "Welcome to {$name}'s Platform!\\n";\nfor ($i = 1; $i <= 5; $i++) {\n    echo "Count: {$i}\\n";\n}`,
  kotlin: `// Kotlin Code\nfun main() {\n    println("Hello, World!")\n    val name = "Akarshit"\n    println("Welcome to $name's Platform!")\n    for (i in 1..5) { println("Count: $i") }\n}`,
  go: `// Go Code\npackage main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, World!")\n    name := "Akarshit"\n    fmt.Printf("Welcome to %s's Platform!\\n", name)\n    for i := 1; i <= 5; i++ { fmt.Printf("Count: %d\\n", i) }\n}`,
  rust: `// Rust Code\nfn main() {\n    println!("Hello, World!");\n    let name = "Akarshit";\n    println!("Welcome to {}'s Platform!", name);\n    for i in 1..=5 { println!("Count: {}", i); }\n}`,
  swift: `// Swift Code\nprint("Hello, World!")\nlet name = "Akarshit"\nprint("Welcome to \\(name)'s Platform!")\nfor i in 1...5 { print("Count: \\(i)") }`,
  html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Hello!</title>\n  <style>\n    body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n    h1 { color: #06b6d4; font-size: 2.5rem; text-align: center; }\n    p { color: #94a3b8; text-align: center; }\n    .btn { display: inline-block; padding: 12px 28px; background: linear-gradient(135deg,#06b6d4,#0891b2); color: white; text-decoration: none; border-radius: 12px; font-weight: 700; margin-top: 1rem; }\n  </style>\n</head>\n<body>\n  <div>\n    <h1>Hello, World! ✨</h1>\n    <p>Welcome to Akarshit's Coding Platform</p>\n    <a href="#" class="btn">Get Started</a>\n  </div>\n</body>\n</html>`,
};
let currentLang = 'python';

function selectLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  const area = document.getElementById('codeInput');
  if (area && CODE_TEMPLATES[lang]) area.value = CODE_TEMPLATES[lang];
  const outputArea = document.getElementById('codeOutput');
  if (outputArea) outputArea.innerHTML = '<span style="color:#475569;">// Output will appear here after running code...</span>';
}
window.selectLang = selectLang;

function runCode() {
  const output = document.getElementById('codeOutput');
  const btn = document.getElementById('runBtn');
  const code = document.getElementById('codeInput')?.value || '';
  if (!code.trim()) { showNotification('⚠️ Please write some code first!'); return; }
  btn.disabled = true; btn.innerHTML = '<span>⏳</span> Running...';
  output.innerHTML = '<div style="display:flex;align-items:center;gap:.5rem;color:#94a3b8;"><span style="animation:spin 1s linear infinite;display:inline-block;">⚙️</span> Executing code...</div>';
  if (currentLang === 'javascript') {
    try {
      let logs = [];
      const mockConsole = { log: (...a) => logs.push(a.join(' ')), error: (...a) => logs.push('❌ Error: '+a.join(' ')), warn: (...a) => logs.push('⚠️ '+a.join(' ')), info: (...a) => logs.push('ℹ️ '+a.join(' ')) };
      new Function('console', code)(mockConsole);
      output.innerHTML = `<pre style="margin:0;color:#c9d1d9;white-space:pre-wrap;">${escapeHtml(logs.join('\n') || '✅ Executed (no output)')}</pre>`;
    } catch(e) { output.innerHTML = `<pre style="margin:0;color:#f87171;">❌ ${escapeHtml(e.message)}</pre>`; }
    finishRun(btn);
  } else if (currentLang === 'html') {
    const ifr = document.createElement('iframe');
    ifr.style.cssText = 'width:100%;height:100%;border:none;background:white;';
    ifr.srcdoc = code; output.innerHTML = ''; output.appendChild(ifr);
    finishRun(btn);
  } else {
    const cfg = LANG_CONFIG[currentLang];
    if (!cfg) { output.innerHTML = '<pre style="color:#f87171;">Language not supported in online runner.</pre>'; finishRun(btn); return; }
    fetch(PISTON_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ language: cfg.language, version: cfg.version, files: [{ content: code }] }) })
      .then(r => r.json())
      .then(data => {
        if (data.run) {
          let out = '';
          if (data.run.stdout) out += escapeHtml(data.run.stdout);
          if (data.run.stderr) out += `<span style="color:#f87171;">${escapeHtml(data.run.stderr)}</span>`;
          output.innerHTML = `<pre style="margin:0;color:#c9d1d9;white-space:pre-wrap;">${out || '✅ Executed (no output)'}</pre>`;
          if (!data.run.stderr) showNotification('✅ Code ran successfully!');
        } else { output.innerHTML = `<pre style="color:#f87171;">${data.message||'Unknown error'}</pre>`; }
        finishRun(btn);
      })
      .catch(e => { output.innerHTML = `<pre style="color:#f87171;">❌ Network error: ${escapeHtml(e.message)}</pre>`; finishRun(btn); });
  }
}
function finishRun(btn) { btn.disabled = false; btn.innerHTML = '<span>▶</span> Run Code'; }
function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
window.runCode = runCode;

function saveCodeFile() {
  const code = document.getElementById('codeInput')?.value || '';
  const extMap = { python:'py', cpp:'cpp', javascript:'js', java:'java', csharp:'cs', html:'html', php:'php', kotlin:'kt', swift:'swift', go:'go', rust:'rs' };
  const blob = new Blob([code], { type: 'text/plain' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `code.${extMap[currentLang]||'txt'}` });
  a.click(); URL.revokeObjectURL(a.href);
  showNotification('💾 File saved!');
}
function loadCodeFile(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { const area = document.getElementById('codeInput'); if (area) area.value = e.target.result; showNotification(`📂 Loaded: ${file.name}`); };
  reader.readAsText(file); input.value = '';
}
function copyCode() {
  const code = document.getElementById('codeInput')?.value || '';
  navigator.clipboard.writeText(code).then(() => showNotification('📋 Code copied!')).catch(() => { const t = document.getElementById('codeInput'); t.select(); document.execCommand('copy'); showNotification('📋 Copied!'); });
}
function clearCode() {
  const area = document.getElementById('codeInput'); if (area) area.value = CODE_TEMPLATES[currentLang] || '';
  const out = document.getElementById('codeOutput'); if (out) out.innerHTML = '<span style="color:#475569;">// Output cleared. Ready to code!</span>';
  showNotification('🗑️ Editor reset!');
}
window.saveCodeFile = saveCodeFile; window.loadCodeFile = loadCodeFile;
window.copyCode = copyCode; window.clearCode = clearCode;

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ============================================================
   TESTIMONIAL SLIDER
   ============================================================ */
(function initSlider() {
  const track = document.getElementById('testimonialTrack');
  if (!track) return;
  let index = 0;
  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  function slide(dir) {
    index = (index + dir + total) % total;
    const cardW = cards[0]?.offsetWidth || 340;
    track.style.transform = `translateX(-${index * (cardW + 24)}px)`;
  }
  window.slideTestimonials = slide;
  setInterval(() => slide(1), 4500);
})();

/* ============================================================
   AI CHAT MODAL
   ============================================================ */
const AI_RESPONSES = {
  python: "🐍 **Python** is great for beginners! Here's a quick tip:\n\n```python\n# List comprehension (Pythonic way)\nnumbers = [x**2 for x in range(1, 6)]\nprint(numbers)  # [1, 4, 9, 16, 25]\n```\n\nPython is used in AI/ML, web development, automation, and data science. Want me to help with a specific Python topic?",
  javascript: "⚡ **JavaScript** is the language of the web! Modern JS tip:\n\n```javascript\n// Arrow functions + destructuring\nconst greet = ({ name, role }) => `Hello, ${name}! You are a ${role}.`;\nconsole.log(greet({ name: 'Akarshit', role: 'Developer' }));\n```\n\nJS runs in browsers, Node.js servers, and even mobile apps. What aspect of JavaScript would you like to explore?",
  cpp: "⚡ **C++** is powerful for competitive programming! Key tip:\n\n```cpp\n#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    vector<int> v = {3,1,4,1,5,9};\n    sort(v.begin(), v.end());\n    for(int x : v) cout << x << \" \";\n}\n```\n\nC++ is essential for systems programming and competitive coding. Need help with STL or algorithms?",
  java: "☕ **Java** - Write Once, Run Anywhere! OOP example:\n\n```java\nclass Student {\n    String name; int marks;\n    Student(String n, int m) { name=n; marks=m; }\n    String grade() { return marks>=90?\"A\":marks>=80?\"B\":\"C\"; }\n}\n```\n\nJava is widely used in enterprise apps and Android development. What Java topic can I help with?",
  html: "🌐 **HTML** is the skeleton of every website. Modern HTML5 tip:\n\n```html\n<!-- Semantic HTML5 structure -->\n<header><nav>Navigation</nav></header>\n<main>\n  <article><h1>My Article</h1><p>Content...</p></article>\n  <aside>Sidebar</aside>\n</main>\n<footer>Footer</footer>\n```\n\nAlways use semantic tags for better SEO and accessibility!",
  css: "🎨 **CSS** makes websites beautiful! Modern CSS trick:\n\n```css\n/* CSS Grid - powerful layout tool */\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1.5rem;\n}\n```\n\nCSS Grid and Flexbox are must-know for modern web design. Want tips on animations or responsive design?",
  dsa: "📊 **DSA** (Data Structures & Algorithms) is crucial for interviews!\n\nMost important topics:\n• Arrays, Strings, Linked Lists\n• Stacks, Queues, Trees, Graphs\n• Sorting, Searching, Recursion\n• Dynamic Programming, Greedy\n\n**Top platforms to practice:**\n• LeetCode, HackerRank, CodeChef\n• Codeforces, GeeksForGeeks\n\nStart with Arrays and move to Linked Lists. Want a study roadmap?",
  roadmap: "🗺️ **Complete Coding Roadmap:**\n\n**Phase 1 - Basics (2-3 months)**\n• Pick one language: Python or C++\n• Learn variables, loops, functions, OOP\n\n**Phase 2 - DSA (3-4 months)**\n• Arrays, Strings, Recursion\n• Trees, Graphs, DP\n\n**Phase 3 - Web Dev (2-3 months)**\n• HTML, CSS, JavaScript\n• React.js or Node.js\n\n**Phase 4 - Projects + Jobs**\n• Build 3-4 projects\n• Practice system design\n• Apply for internships!\n\nWhich phase are you currently in?",
  interview: "🎯 **Top Coding Interview Tips:**\n\n1. **Think aloud** - explain your approach before coding\n2. **Start with brute force**, then optimize\n3. **Consider edge cases** - null, empty, large inputs\n4. **Time complexity** - always mention Big O\n5. **Clean code** - meaningful variable names\n\n**Most asked topics:**\n• Two pointers, Sliding window\n• BFS/DFS, Dynamic Programming\n• HashMap, Binary Search\n\nWant me to give you a practice problem?",
  error: "🔍 **Debugging Tips:**\n\n1. **Read the error message** carefully - it usually tells you exactly what's wrong\n2. **Print debugging** - add print statements to trace values\n3. **Check line numbers** - error usually points to the problem area\n4. **Google the error** - Stack Overflow is your best friend!\n5. **Rubber duck debugging** - explain your code line by line\n\n**Common errors:**\n• IndentationError (Python) - check spacing\n• NullPointerException (Java) - check null checks\n• Segmentation fault (C++) - check array bounds\n\nShare your error message and I'll help debug it!",
  github: "🐙 **GitHub Basics for Students:**\n\n```bash\n# Initialize repo\ngit init\ngit add .\ngit commit -m \"First commit\"\ngit branch -M main\ngit remote add origin YOUR_REPO_URL\ngit push -u origin main\n\n# Daily workflow\ngit add .\ngit commit -m \"Add feature X\"\ngit push\n```\n\n**GitHub Pages** - Free website hosting!\n1. Create repo named `yourusername.github.io`\n2. Upload HTML/CSS/JS files\n3. Go to Settings > Pages > Enable\n4. Your site is live! 🎉",
  default: "👋 I'm **AR-AI**, your intelligent coding assistant! I can help you with:\n\n🐍 **Programming Languages** - Python, C++, Java, JavaScript, and more\n📊 **Data Structures & Algorithms** - from basics to advanced\n🌐 **Web Development** - HTML, CSS, JavaScript, React\n🗺️ **Learning Roadmaps** - personalized study plans\n🎯 **Interview Prep** - coding questions and tips\n🔍 **Debugging** - fixing errors in your code\n🐙 **GitHub** - version control basics\n\n**Quick Tips:** Just ask me things like:\n- *\"Explain Python lists\"*\n- *\"How to reverse a string in C++\"*\n- *\"Give me a DSA roadmap\"*\n- *\"How to host on GitHub Pages\"*\n\nWhat would you like to learn today? 🚀"
};

function getAIResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('python') || q.includes('🐍')) return AI_RESPONSES.python;
  if (q.includes('javascript') || q.includes('js')) return AI_RESPONSES.javascript;
  if (q.includes('c++') || q.includes('cpp')) return AI_RESPONSES.cpp;
  if (q.includes('java') && !q.includes('javascript')) return AI_RESPONSES.java;
  if (q.includes('html')) return AI_RESPONSES.html;
  if (q.includes('css') || q.includes('style')) return AI_RESPONSES.css;
  if (q.includes('dsa') || q.includes('data structure') || q.includes('algorithm') || q.includes('leetcode')) return AI_RESPONSES.dsa;
  if (q.includes('roadmap') || q.includes('path') || q.includes('plan') || q.includes('guide')) return AI_RESPONSES.roadmap;
  if (q.includes('interview') || q.includes('job') || q.includes('placement')) return AI_RESPONSES.interview;
  if (q.includes('error') || q.includes('bug') || q.includes('debug') || q.includes('fix')) return AI_RESPONSES.error;
  if (q.includes('github') || q.includes('git') || q.includes('host') || q.includes('deploy')) return AI_RESPONSES.github;
  return AI_RESPONSES.default;
}

function formatAIMsg(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<div class="ai-code-block"><pre>$2</pre></div>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(255,255,255,0.08);padding:0.1rem 0.35rem;border-radius:4px;font-family:monospace;font-size:0.88em;">$1</code>')
    .replace(/\n/g, '<br>');
}

function openAIChat() { document.getElementById('aiChatModal').classList.add('active'); document.getElementById('aiInput').focus(); }
function closeAIChat() { document.getElementById('aiChatModal').classList.remove('active'); }
window.openAIChat = openAIChat; window.closeAIChat = closeAIChat;

function appendAIMsg(role, content) {
  const body = document.getElementById('aiBody');
  const msg = document.createElement('div');
  msg.className = `ai-message ${role}`;
  const isAI = role === 'ai';
  msg.innerHTML = `<div class="ai-msg-avatar">${isAI ? '🤖' : '👤'}</div><div class="ai-bubble">${isAI ? formatAIMsg(content) : escapeHtml(content)}</div>`;
  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
}

function showAITyping() {
  const body = document.getElementById('aiBody');
  const d = document.createElement('div'); d.id = 'aiTyping'; d.className = 'ai-message ai';
  d.innerHTML = `<div class="ai-msg-avatar">🤖</div><div class="ai-bubble"><div class="ai-typing"><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div></div></div>`;
  body.appendChild(d); body.scrollTop = body.scrollHeight;
}
function removeAITyping() { document.getElementById('aiTyping')?.remove(); }

function sendAIMessage(preset) {
  const input = document.getElementById('aiInput');
  const msg = preset || input?.value?.trim();
  if (!msg) return;
  if (input) input.value = '';
  appendAIMsg('user', msg);
  showAITyping();
  setTimeout(() => {
    removeAITyping();
    appendAIMsg('ai', getAIResponse(msg));
    triggerAchievement('🤖', 'AI Mastery', 'Asked the AI Mentor');
  }, 800 + Math.random() * 600);
}
function handleAIInput(e) { if (e.key === 'Enter') sendAIMessage(); }
window.sendAIMessage = sendAIMessage; window.handleAIInput = handleAIInput;

/* ============================================================
   FAQ TOGGLE
   ============================================================ */
document.addEventListener('click', e => {
  const q = e.target.closest('.faq-question');
  if (q) {
    const item = q.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }
});

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const result = document.getElementById('formResult');
    btn.disabled = true; btn.textContent = 'Sending...';
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(contactForm) });
      const data = await res.json();
      if (data.success) {
        if (result) { result.style.display = 'block'; result.style.color = '#10b981'; result.textContent = '✅ Message sent successfully! I\'ll reply soon.'; }
        contactForm.reset(); showNotification('✅ Message sent!');
      } else { throw new Error(data.message); }
    } catch(err) {
      if (result) { result.style.display = 'block'; result.style.color = '#ef4444'; result.textContent = '❌ Something went wrong. Please try again.'; }
    }
    btn.disabled = false; btn.textContent = 'Send Message ✉️';
  });
}

/* ============================================================
   NEWSLETTER
   ============================================================ */
function subscribeNewsletter() {
  const input = document.getElementById('newsletterInput');
  const val = input?.value?.trim();
  if (!val || !val.includes('@')) { showNotification('⚠️ Enter a valid email!'); return; }
  input.value = '';
  showNotification('🎉 Subscribed successfully!');
  triggerAchievement('📧', 'Newsletter!', 'You\'re subscribed');
}
window.subscribeNewsletter = subscribeNewsletter;

/* ============================================================
   VIDEO MODAL
   ============================================================ */
function openVideo(videoId) {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoFrame');
  if (frame) frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  if (modal) modal.classList.add('active');
}
function closeModal() {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoFrame');
  if (frame) frame.src = '';
  if (modal) modal.classList.remove('active');
}
window.openVideo = openVideo; window.closeModal = closeModal;

/* ============================================================
   NOTIFICATION SYSTEM
   ============================================================ */
function showNotification(msg) {
  const n = document.getElementById('notification');
  if (!n) return;
  n.textContent = msg; n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3000);
}
window.showNotification = showNotification;

/* ============================================================
   ACHIEVEMENT POPUP
   ============================================================ */
const achievedSet = new Set();
function triggerAchievement(emoji, title, name) {
  const key = name;
  if (achievedSet.has(key)) return;
  achievedSet.add(key);
  const pop = document.getElementById('achievementPopup');
  if (!pop) return;
  pop.querySelector('.ach-icon').textContent = emoji;
  pop.querySelector('.ach-title').textContent = title;
  pop.querySelector('.ach-name').textContent = name;
  pop.classList.add('show');
  setTimeout(() => pop.classList.remove('show'), 3500);
}
window.triggerAchievement = triggerAchievement;

/* ============================================================
   NAV SEARCH (filter courses)
   ============================================================ */
const navSearch = document.getElementById('navSearch');
if (navSearch) {
  navSearch.addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    if (!q) { document.querySelectorAll('.course-card, .feature-card').forEach(c => c.style.display = ''); return; }
    document.querySelectorAll('.course-card').forEach(c => { c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none'; });
    document.querySelectorAll('.feature-card').forEach(c => { c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none'; });
  });
}

/* ============================================================
   PROGRESS BARS ANIMATION
   ============================================================ */
const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-bar').forEach(bar => {
        const target = bar.dataset.width || '0%';
        setTimeout(() => { bar.style.width = target; }, 200);
      });
      entry.target.querySelectorAll('.xp-bar').forEach(bar => { setTimeout(() => { bar.style.width = '68%'; }, 300); });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.progress-card, .xp-card').forEach(el => progressObserver.observe(el));

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Enter') { runCode(); }
  if (e.ctrlKey && e.key === 's') { e.preventDefault(); saveCodeFile(); }
  if (e.key === 'Escape') { closeAIChat(); closeModal(); closeSidebar(); }
  if (e.ctrlKey && e.shiftKey && e.key === 'A') { openAIChat(); }
});

/* ============================================================
   YEAR AUTO-UPDATE
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   SMOOTH SCROLL for nav links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ============================================================
   LANGUAGE TOGGLE (courses section)
   ============================================================ */
function toggleLanguageSection() {
  const d = document.getElementById('languagesDropdown');
  const arrow = document.getElementById('toggleArrow');
  if (!d) return;
  const open = d.dataset.open === '1';
  d.dataset.open = open ? '0' : '1';
  d.style.maxHeight = open ? '0' : '3000px';
  d.style.opacity = open ? '0' : '1';
  d.style.marginTop = open ? '0' : '2rem';
  if (arrow) arrow.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
}
window.toggleLanguageSection = toggleLanguageSection;

/* ============================================================
   INIT
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  selectLang('python');
  checkScrollAnimations();
  const aiBody = document.getElementById('aiBody');
  if (aiBody && aiBody.children.length === 0) appendAIMsg('ai', AI_RESPONSES.default);
});

console.log('%c🚀 Akarshit Raj Coding Platform', 'color:#06b6d4;font-size:1.5rem;font-weight:900;');
console.log('%cBuilt with ❤️ for coding enthusiasts', 'color:#94a3b8;font-size:0.9rem;');

/* ============================================================
   DARK / LIGHT MODE TOGGLE
   ============================================================ */
function applyTheme(theme) {
  document.body.classList.toggle('light-mode', theme === 'light');
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = theme === 'light' ? '☀️' : '🌙';
  localStorage.setItem('ar_theme', theme);
}
function toggleTheme() {
  const current = localStorage.getItem('ar_theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}
window.toggleTheme = toggleTheme;
(function initTheme() {
  const saved = localStorage.getItem('ar_theme') || 'dark';
  applyTheme(saved);
})();

/* ============================================================
   PWA INSTALL
   ============================================================ */
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = document.getElementById('pwaInstallBtn');
  if (btn) { btn.style.display = 'flex'; btn.title = 'Install AR. Platform as App'; }
});
function installPWA() {
  if (!deferredInstallPrompt) { showNotification('ℹ️ Already installed or not supported!'); return; }
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(r => {
    if (r.outcome === 'accepted') { showNotification('📱 App installed successfully!'); triggerAchievement('📱', 'App Installed!', 'AR. Platform on device'); }
    deferredInstallPrompt = null;
    const btn = document.getElementById('pwaInstallBtn');
    if (btn) btn.style.display = 'none';
  });
}
window.addEventListener('appinstalled', () => showNotification('✅ AR. Platform installed!'));
window.installPWA = installPWA;
/* NOTE: Auth, XP, Notes, Bookmarks handled by firebase-auth.js (ES Module) */
