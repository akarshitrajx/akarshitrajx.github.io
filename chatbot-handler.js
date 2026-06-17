// chatbot-handler.js - Real AI Chatbot
// ============================================
const GEMINI_API_KEY = 'AQ.Ab8RN6KRBGq3CE4NwnEwRThduy5V4hB4thzgWGRSQLDXlDu-aA'; // Replace with your key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

let chatHistory = [];
let isTyping = false;

// ============================================
// Toggle Chat Widget
// ============================================
function toggleChat() {
    const chatWidget = document.getElementById('chat-widget');
    if (chatWidget) {
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active')) {
            const input = document.getElementById('chat-input');
            if (input) input.focus();
        }
    }
}

// ============================================
// Send Message
// ============================================
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    const sendBtn = document.getElementById('send-btn');

    const message = input.value.trim();
    if (!message || isTyping) return;

    // Add user message
    addChatMessage('user', message);
    input.value = '';

    // Show typing
    isTyping = true;
    showTypingIndicator();
    if (sendBtn) sendBtn.disabled = true;

    try {
        const context = `You are AR-AI, an expert coding assistant on Akarshit Raj's Coding Platform. Help students learn programming. Be friendly, encouraging, and provide clear code examples. Keep responses concise but helpful.

Conversation history:
` + chatHistory.slice(-10).map(h => `${h.role}: ${h.text}`).join('\n');

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: context + '\n\nUser: ' + message + '\n\nAR-AI:' }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                    topP: 0.9
                }
            })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process that. Please try again!';

        chatHistory.push({ role: 'user', text: message });
        chatHistory.push({ role: 'assistant', text: aiResponse });
        if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

        hideTypingIndicator();
        addChatMessage('ai', aiResponse);

    } catch (error) {
        console.error('Chat error:', error);
        hideTypingIndicator();
        addChatMessage('ai', '⚠️ Connection issue. Please check your internet and try again.');
    } finally {
        isTyping = false;
        if (sendBtn) sendBtn.disabled = false;
    }
}

// ============================================
// Add Message to Chat
// ============================================
function addChatMessage(role, text) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const formattedText = formatChatMessage(text);

    messageDiv.innerHTML = `
        <div class="message-avatar">${role === 'user' ? '👤' : '🤖'}</div>
        <div class="message-content">
            <div class="message-text">${formattedText}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ============================================
// Format Message
// ============================================
function formatChatMessage(text) {
    text = text.replace(/```(\w+)?
?([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/
/g, '<br>');
    return text;
}

// ============================================
// Typing Indicator
// ============================================
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message ai typing';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots"><span></span><span></span><span></span></div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// ============================================
// Initialize Chat
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }

    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer && messagesContainer.children.length === 0) {
        addChatMessage('ai', '👋 Hi! I am AR-AI, your coding assistant. Ask me anything about Python, C++, JavaScript, or any programming topic!');
    }
});

// Global exports
window.toggleChat = toggleChat;
window.sendChatMessage = sendChatMessage;

export { toggleChat, sendChatMessage };
