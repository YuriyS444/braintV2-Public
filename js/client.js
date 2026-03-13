const CONFIG = {
    API_URL: sessionStorage.getItem('brain_api_url') || localStorage.getItem('brain_api_url') || 'https://brain-t0.up.railway.app',
    API_KEY: sessionStorage.getItem('brain_api_key') || '',
    ARCHITECT_KEY: sessionStorage.getItem('brain_architect_key') || '',
    OWNER_WALLET: localStorage.getItem('brain_owner_wallet') || '',
    PROVIDER: localStorage.getItem('brain_provider') || 'deepseek',
    THEME: localStorage.getItem('brain_theme') || 'dark'
};

let wallet = null;
let token = sessionStorage.getItem('brain_token');
let isArchitect = false;
let crystals = [];
let history = [];
let currentFilter = 'all';
let currentSearch = '';
let abortController = null;
let attackCount = 0;
let searchTimeout = null;

const elements = {
    themeToggle: document.querySelector('.theme-toggle'),
    threatIndicator: document.getElementById('threatIndicator'),
    architectBadge: document.getElementById('architectBadge'),
    levelSelect: document.getElementById('levelSelect'),
    providerSelect: document.getElementById('providerSelect'),
    walletBtn: document.getElementById('walletBtn'),
    crystalList: document.getElementById('crystalList'),
    crystalCount: document.getElementById('crystalCount'),
    messages: document.getElementById('messages'),
    userInput: document.getElementById('userInput'),
    sendBtn: document.getElementById('sendBtn'),
    stopBtn: document.getElementById('stopBtn'),
    streamToggle: document.getElementById('streamToggle'),
    suggestLevel: document.getElementById('suggestLevel'),
    searchInput: document.getElementById('searchInput'),
    statTotal: document.getElementById('statTotal'),
    statDiamonds: document.getElementById('statDiamonds'),
    statVerified: document.getElementById('statVerified'),
    statVirus: document.getElementById('statVirus'),
    progressBar: document.querySelector('.progress-bar')
};


// ============================================================
// Индикатор угроз — показывает уровень атак из attack_logs
// ============================================================
async function updateThreatIndicator() {
    const el = elements.threatIndicator;
    if (!el) return;
    try {
        if (!token) {
            el.textContent = '🟢';
            el.title = 'Нет активных угроз';
            return;
        }
        const res = await fetch(`${CONFIG.API_URL}/api/auth/threat`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const { level, count } = await res.json();
        const map = {
            low:    { icon: '🟢', title: 'Угрозы не обнаружены' },
            medium: { icon: '🟡', title: `Подозрительная активность: ${count} попыток` },
            high:   { icon: '🔴', title: `Высокая угроза: ${count} атак за час` }
        };
        const info = map[level] || map.low;
        el.textContent = info.icon;
        el.title = info.title;
    } catch { /* silent — не мешаем UI */ }
}

async function init() {
    document.documentElement.setAttribute('data-theme', CONFIG.THEME);
    
    if (token) {
        await verifyToken();
    }
    
    await loadCrystals();
    
    elements.userInput.addEventListener('input', debounce(handleInput, 500));
    elements.userInput.addEventListener('keydown', handleKeyDown);
    elements.searchInput.addEventListener('input', handleSearch);
    
    setInterval(updateThreatIndicator, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

async function connectWallet() {
    if (!window.ethereum) {
        showNotification('Установите MetaMask', 'error');
        return;
    }
    
    try {
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        wallet = accounts[0];
        elements.walletBtn.textContent = `🦊 ${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
        elements.walletBtn.classList.add('connected');
        
        showNotification('✅ MetaMask подключён', 'success');
        
        const nonceRes = await fetch(`${CONFIG.API_URL}/api/auth/nonce?wallet=${wallet}`);
        const { nonce, message } = await nonceRes.json();
        
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, wallet]
        });
        
        sessionStorage.setItem('wallet_nonce', nonce);
        sessionStorage.setItem('wallet_signature', signature);
        
        if (CONFIG.API_KEY) {
            await login();
        }
        
    } catch (error) {
        showNotification('Ошибка подключения: ' + error.message, 'error');
    }
}

async function login() {
    try {
        const nonce = sessionStorage.getItem('wallet_nonce');
        const signature = sessionStorage.getItem('wallet_signature');
        
        const response = await fetch(`${CONFIG.API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apiKey: CONFIG.API_KEY,
                wallet,
                signature,
                nonce
            })
        });
        
        if (!response.ok) {
            throw new Error('Login failed');
        }
        
        const data = await response.json();
        token = data.token;
        isArchitect = data.isArchitect;
        
        sessionStorage.setItem('brain_token', token);
        
        sessionStorage.removeItem('wallet_nonce');
        sessionStorage.removeItem('wallet_signature');
        
        if (isArchitect) {
            elements.architectBadge.style.display = 'inline-block';
            showNotification('👑 Режим архитектора активирован', 'success');
        }
        
        await loadCrystals();
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Ошибка аутентификации', 'error');
    }
}

async function verifyToken() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            token = null;
            sessionStorage.removeItem('brain_token');
        }
    } catch {
        token = null;
        sessionStorage.removeItem('brain_token');
    }
}

async function loadCrystals(page = 1) {
    if (!token) return;
    
    try {
        const params = new URLSearchParams({
            page,
            limit: 50
        });
        
        if (currentFilter !== 'all') {
            if (currentFilter === 'diamond') {
                params.append('emoji', '💎');
            } else {
                params.append('status', currentFilter);
            }
        }
        
        const response = await fetch(`${CONFIG.API_URL}/api/crystals?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to load crystals');
        
        const data = await response.json();
        crystals = data.data;
        
        renderCrystals();
        updateStats();
        
    } catch (error) {
        console.error('Load crystals error:', error);
    }
}

function renderCrystals() {
    if (!elements.crystalList) return;
    
    const filtered = crystals.filter(c => {
        if (currentSearch) {
            const q = currentSearch.toLowerCase();
            return (c.question || '').toLowerCase().includes(q) || 
                   (c.answer || '').toLowerCase().includes(q);
        }
        return true;
    });
    
    if (filtered.length === 0) {
        elements.crystalList.innerHTML = `
            <div class="empty-state">
                ${currentSearch ? '🔍 Ничего не найдено' : '💎 Кристаллы появятся после диалога'}
            </div>
        `;
        elements.crystalCount.textContent = crystals.length;
        return;
    }
    
    elements.crystalList.innerHTML = filtered.map(c => `
        <div class="crystal-item ${c.status || ''}" onclick="showCrystal('${c.id}')">
            <span class="crystal-emoji">${c.emoji || '💨'}</span>
            <div class="crystal-question">${escapeHtml(c.question || '')}</div>
            <div class="crystal-answer">${escapeHtml((c.answer || '').slice(0, 60))}…</div>
            <div class="crystal-status ${c.status || ''}">
                ${c.status === 'verified' ? '✅' : 
                  c.status === 'quarantine' ? '🔬' : 
                  c.status === 'virus' ? '🦠' : '⚠️'} · ${c.level || 'S0'}
            </div>
        </div>
    `).join('');
    
    elements.crystalCount.textContent = crystals.length;
}

function updateStats() {
    if (!elements.statTotal) return;
    
    const total = crystals.length;
    const diamonds = crystals.filter(c => c.emoji === '💎').length;
    const verified = crystals.filter(c => c.status === 'verified').length;
    const virus = crystals.filter(c => c.status === 'virus').length;
    
    elements.statTotal.textContent = total;
    elements.statDiamonds.textContent = diamonds;
    elements.statVerified.textContent = verified;
    elements.statVirus.textContent = virus;
}

function setFilter(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadCrystals();
}

function handleSearch() {
    currentSearch = elements.searchInput.value;
    renderCrystals();
}

async function syncFromDB() {
    if (!token || !wallet) {
        showNotification('Подключите кошелёк', 'warning');
        return;
    }
    
    showNotification('Синхронизация...', 'info');
    await loadCrystals();
    showNotification('✅ Синхронизировано', 'success');
}

function exportCrystals() {
    const data = JSON.stringify(crystals, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crystals-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('📥 Экспорт готов', 'success');
}

function importCrystals() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        const text = await file.text();
        
        try {
            const imported = JSON.parse(text);
            
            const response = await fetch(`${CONFIG.API_URL}/api/crystals/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ crystals: imported })
            });
            
            const result = await response.json();
            showNotification(`✅ Импортировано ${result.imported} кристаллов`, 'success');
            
            await loadCrystals();
            
        } catch (error) {
            showNotification('❌ Ошибка импорта', 'error');
        }
    };
    
    input.click();
}

async function sendMessage() {
    const question = elements.userInput.value.trim();
    if (!question) return;
    
    if (!CONFIG.API_URL || !CONFIG.API_KEY) {
        openSettings();
        return;
    }
    
    const level = elements.levelSelect.value;
if (!token && level !== 'S0') {
    await login();
    if (!token) return;
}
    
    const useStream = elements.streamToggle.checked;
    
    elements.userInput.value = '';
    autoResize(elements.userInput);
    
    addUserMessage(question);
    addTypingIndicator();
    
    if (elements.progressBar) {
        elements.progressBar.style.display = 'block';
    }
    
    elements.sendBtn.style.display = 'none';
    elements.stopBtn.style.display = 'flex';
    
    abortController = new AbortController();
    
    try {
        let txHash = null;
        // Получаем актуальный конфиг уровней из API (цены управляются архитектором)
        let levelConfig = {};
        try {
            const cfgRes = await fetch(`${CONFIG.API_URL}/api/levels`);
            const cfgData = await cfgRes.json();
            levelConfig = cfgData.levels || {};
        } catch { /* fallback — используем дефолтные цены */ }

        const cfg = levelConfig[level] || {};
        const price = parseFloat(cfg.price || 0);

        // Платим только если цена > 0 и пользователь не архитектор
        if (price > 0 && !isArchitect) {
            txHash = await processPayment(level, price);
            if (!txHash) {
                removeTypingIndicator();
                if (elements.progressBar) elements.progressBar.style.display = 'none';
                elements.sendBtn.style.display = 'flex';
                elements.stopBtn.style.display = 'none';
                return;
            }
        }
        
        try {
            const suggestRes = await fetch(`${CONFIG.API_URL}/api/suggest?q=${encodeURIComponent(question)}`);
            const suggestData = await suggestRes.json();
            elements.suggestLevel.textContent = suggestData.level;
        } catch (error) {
        }
        
        if (useStream) {
            await sendStreamMessage(question, level, txHash);
        } else {
            await sendNormalMessage(question, level, txHash);
        }
        
    } catch (error) {
        if (error.name !== 'AbortError') {
            removeTypingIndicator();
            addErrorMessage(error.message);
        }
    } finally {
        if (elements.progressBar) {
            elements.progressBar.style.display = 'none';
        }
        elements.sendBtn.style.display = 'flex';
        elements.stopBtn.style.display = 'none';
        abortController = null;
    }
}

async function sendNormalMessage(question, level, txHash) {
    const response = await fetch(`${CONFIG.API_URL}/api/ask`, {
        method: 'POST',
        signal: abortController.signal,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            question,
            level,
            provider: CONFIG.PROVIDER,
            tx_hash: txHash,
            history: history.slice(-10)
        })
    });
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));

        // Лимит исчерпан
        if (response.status === 429) {
            const msg = error.limit
                ? `⏳ Лимит ${error.level}: ${error.used}/${error.limit} запросов/день.\nОбновится в полночь UTC.`
                : error.error;
            throw new Error(msg);
        }

        // Требуется оплата (не должно случаться т.к. мы уже платим, но на всякий случай)
        if (response.status === 402) {
            throw new Error(`Требуется оплата: $${error.price} для уровня ${error.level}`);
        }

        throw new Error(error.error || 'Request failed');
    }
    
    const data = await response.json();
    removeTypingIndicator();
    addAssistantMessage(data.answer, data.crystal, data.level, data.suggestedLevel);
    
    if (data.crystal) {
        crystals.unshift({
            id: Date.now(),
            ...data.crystal
        });
        renderCrystals();
        updateStats();
    }
    
    history.push({ role: 'user', content: question });
    history.push({ role: 'assistant', content: data.answer });
}

async function sendStreamMessage(question, level, txHash) {
    const response = await fetch(`${CONFIG.API_URL}/api/ask`, {
        method: 'POST',
        signal: abortController.signal,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            question,
            level,
            provider: CONFIG.PROVIDER,
            tx_hash: txHash,
            history: history.slice(-10),
            stream: true
        })
    });
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(error.error || 'Request failed');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    let answer = '';
    let buffer = '';
    
    const messageId = addAssistantMessage('', null, level);
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
            if (line.startsWith('data:')) {
                const dataStr = line.slice(5).trim();
                if (!dataStr) continue;
                
                try {
                    const data = JSON.parse(dataStr);
                    
                    if (data.chunk) {
                        answer += data.chunk;
                        updateAssistantMessage(messageId, answer);
                    }
                    
                    if (data.done) {
                        removeTypingIndicator();
                        
                        if (data.crystal) {
                            crystals.unshift({
                                id: Date.now(),
                                ...data.crystal
                            });
                            renderCrystals();
                            updateStats();
                        }
                        
                        finalizeAssistantMessage(messageId, data.crystal);
                    }
                    
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    
                } catch (e) {
                    if (e.message && !e.message.includes('JSON')) {
                        throw e;
                    }
                }
            }
        }
    }
}

function stopGeneration() {
    if (abortController) {
        abortController.abort();
    }
}

async function processPayment(level, price) {
    if (!price || price <= 0) return null;

    if (!wallet) {
        await connectWallet();
        if (!wallet) return null;
    }

    const confirmed = confirm(
        `💳 Оплата уровня ${level}\n\n` +
        `Сумма: $${price} (в ETH по текущему курсу)\n` +
        `Получатель: ${CONFIG.OWNER_WALLET}\n\n` +
        `После оплаты ответ будет получен автоматически.\nПродолжить?`
    );
    if (!confirmed) return null;

    try {
        const wei = '0x' + Math.floor(price * 1e18).toString(16);

        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{ from: wallet, to: CONFIG.OWNER_WALLET, value: wei }]
        });

        showNotification('⏳ Ожидание подтверждения транзакции...', 'info');

        for (let i = 0; i < 12; i++) {
            await new Promise(r => setTimeout(r, 5000));
            const verifyRes = await fetch(
                `${CONFIG.API_URL}/api/payments/verify?tx_hash=${txHash}&level=${level}&wallet=${wallet}`
            );
            const verifyData = await verifyRes.json();
            if (verifyData.ok) {
                showNotification('✅ Платёж подтверждён', 'success');
                return txHash;
            }
            if (verifyData.reason && !verifyData.reason.includes('not found')) {
                showNotification('❌ ' + verifyData.reason, 'error');
                return null;
            }
        }

        showNotification('⏱️ Таймаут подтверждения. Попробуйте позже.', 'warning');
        return null;

    } catch (error) {
        if (error.code === 4001) {
            showNotification('Платёж отменён', 'info');
        } else {
            showNotification('❌ Ошибка: ' + error.message, 'error');
        }
        return null;
    }
}

function addUserMessage(text) {
    removeWelcomeMessage();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">
            <div class="message-bubble">${escapeHtml(text)}</div>
        </div>
    `;
    
    elements.messages.appendChild(messageDiv);
    scrollToBottom();
}

function addAssistantMessage(text, crystal, level, suggestedLevel) {
    removeWelcomeMessage();
    
    const messageId = 'msg_' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    messageDiv.id = messageId;
    
    let metaHtml = `
        <div class="message-meta">
            <span class="message-level">${level || 'S0'}</span>
    `;
    
    if (crystal && crystal.status) {
        metaHtml += `
            <span class="message-status ${crystal.status}">
                ${crystal.status === 'verified' ? '✅' : 
                  crystal.status === 'quarantine' ? '🔬' : 
                  crystal.status === 'virus' ? '🦠' : '⚠️'}
            </span>
        `;
    }
    
    if (suggestedLevel && suggestedLevel !== level) {
        metaHtml += `
            <span class="suggest-link" onclick="applyLevel('${suggestedLevel}')">
                → рек. ${suggestedLevel}
            </span>
        `;
    }
    
    metaHtml += '</div>';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">🧠</div>
        <div class="message-content">
            <div class="message-bubble">${formatMessage(text)}</div>
            ${metaHtml}
            <div class="message-actions">
                <button class="message-action" onclick="copyMessage('${messageId}')">📋</button>
                <button class="message-action" onclick="regenerateMessage('${messageId}')">↺</button>
            </div>
        </div>
    `;
    
    elements.messages.appendChild(messageDiv);
    scrollToBottom();
    
    return messageId;
}

function regenerateMessage(messageId) {
    const userMessages = document.querySelectorAll('.message.user');
    if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1];
        const text = lastUserMessage.querySelector('.message-bubble').innerText;
        elements.userInput.value = text;
        
        const msg = document.getElementById(messageId);
        if (msg) msg.remove();
        
        sendMessage();
    }
}

function addTypingIndicator() {
    removeWelcomeMessage();
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🧠</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    elements.messages.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

function addErrorMessage(text) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message assistant';
    errorDiv.innerHTML = `
        <div class="message-avatar">❌</div>
        <div class="message-content">
            <div class="message-bubble" style="color: var(--error);">
                ⚠️ ${escapeHtml(text)}
            </div>
        </div>
    `;
    
    elements.messages.appendChild(errorDiv);
    scrollToBottom();
    
    attackCount++;
    updateThreatIndicator();
}

function removeWelcomeMessage() {
    const welcome = document.getElementById('welcomeMessage');
    if (welcome) welcome.remove();
}

function updateAssistantMessage(id, text) {
    const message = document.getElementById(id);
    if (!message) return;
    
    const bubble = message.querySelector('.message-bubble');
    if (bubble) {
        bubble.innerHTML = formatMessage(text);
    }
}

function finalizeAssistantMessage(id, crystal) {
    const message = document.getElementById(id);
    if (!message) return;
    
    removeTypingIndicator();
    
    if (crystal && crystal.status) {
        const meta = message.querySelector('.message-meta');
        if (meta) {
            const statusSpan = document.createElement('span');
            statusSpan.className = `message-status ${crystal.status}`;
            statusSpan.innerHTML = crystal.status === 'verified' ? '✅' : 
                                   crystal.status === 'quarantine' ? '🔬' : 
                                   crystal.status === 'virus' ? '🦠' : '⚠️';
            meta.appendChild(statusSpan);
        }
    }
}


// ============================================================
// v5.0: Debounce [F11]
// ============================================================
// debounce определён выше

// Применяем debounce к input
// ============================================================
// УТИЛИТЫ — escapeHtml, showNotification, scrollToBottom, etc.
// ============================================================

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatMessage(text) {
    if (!text) return '';
    text = escapeHtml(text);
    // Markdown-lite: **bold**, `code`, переносы строк
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications') || (() => {
        const div = document.createElement('div');
        div.id = 'notifications';
        div.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
        document.body.appendChild(div);
        return div;
    })();

    const note = document.createElement('div');
    note.className = `notification notification-${type}`;
    note.textContent = message;
    note.style.cssText = `
        padding: 10px 16px; border-radius: 8px; color: #fff; font-size: 14px;
        background: ${ type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6' };
        box-shadow: 0 4px 12px rgba(0,0,0,.3); cursor: pointer; max-width: 320px;
        animation: slideIn .2s ease;
    `;
    note.onclick = () => note.remove();
    container.appendChild(note);
    setTimeout(() => note.remove(), 4000);
}

function scrollToBottom() {
    const messages = elements.messages;
    if (messages) messages.scrollTop = messages.scrollHeight;
}

function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function autoResize(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

function copyMessage(messageId) {
    const msg = document.getElementById(messageId);
    if (!msg) return;
    const text = msg.querySelector('.message-bubble')?.textContent || '';
    navigator.clipboard.writeText(text)
        .then(() => showNotification('✅ Скопировано', 'success'))
        .catch(() => showNotification('❌ Ошибка копирования', 'error'));
}

function showCrystal(crystalId) {
    const crystal = crystals.find(c => c.id === crystalId);
    if (!crystal) return;
    showNotification(`💎 ${crystal.question?.slice(0, 60) || 'Кристалл'}`, 'info');
}

function applyLevel(level) {
    if (elements.levelSelect) elements.levelSelect.value = level;
}

// openSettings — определена ниже с loadSavedKeys


document.addEventListener('DOMContentLoaded', () => {
    checkTermsAgreement();
    init();
    loadLevelOptions(); // загружаем актуальные цены в селект
});

// Загружает актуальные цены/лимиты из API и обновляет селект уровней
async function loadLevelOptions() {
    try {
        const res = await fetch(`${CONFIG.API_URL}/api/levels`);
        const data = await res.json();
        const levels = data.levels || {};
        const select = document.getElementById('levelSelect');
        if (!select) return;

        select.innerHTML = Object.entries(levels).map(([lvl, cfg]) => {
            const price = parseFloat(cfg.price || 0);
            const limit = cfg.daily_limit || 0;
            let label = lvl;
            if (price === 0) {
                label += limit > 0 ? ` Free (${limit}/день)` : ' Free';
            } else {
                label += ` $${price}`;
            }
            return `<option value="${lvl}" ${lvl === 'S3' ? 'selected' : ''}>${label}</option>`;
        }).join('');
    } catch { /* оставляем статичные опции из HTML */ }
}

// ============================================================
// v5.0: Пользовательское соглашение
// ============================================================
const TERMS_VERSION = 'v5.0-2026-03-11';

async function loadTerms(lang = 'ru') {
    const termsContent = document.getElementById('termsContent');
    if (!termsContent) return;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(lang === 'ru' ? 'langRu' : 'langEn').classList.add('active');
    try {
        const response = await fetch(`docs/TERMS_OF_USE${lang === 'en' ? '_EN' : ''}.md`);
        if (!response.ok) throw new Error('Failed to load terms');
        let text = await response.text();
        text = text
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/^- (.*)$/gm, '<li>$1</li>')
            .replace(/\n\n/g, '<br>');
        termsContent.innerHTML = text;
    } catch (error) {
        termsContent.innerHTML = '<div style="color:var(--error);text-align:center;padding:20px;">❌ Ошибка загрузки соглашения.</div>';
    }
}

function checkTermsAgreement() {
    const accepted = localStorage.getItem('terms_accepted');
    const version  = localStorage.getItem('terms_version');
    if (!accepted || version !== TERMS_VERSION) showTermsModal();
}

function showTermsModal() {
    const modal    = document.getElementById('termsModal');
    const overlay  = document.getElementById('termsOverlay');
    const checkbox = document.getElementById('termsAgreeCheckbox');
    const acceptBtn = document.getElementById('termsAcceptBtn');
    if (modal && overlay) {
        modal.style.display = 'flex';
        overlay.style.display = 'block';
        if (checkbox) { checkbox.checked = false; acceptBtn.disabled = true; }
        document.body.style.overflow = 'hidden';
        loadTerms('ru');

        checkbox?.addEventListener('change', function() {
            acceptBtn.disabled = !this.checked;
        });
    }
}

function hideTermsModal() {
    const modal   = document.getElementById('termsModal');
    const overlay = document.getElementById('termsOverlay');
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function acceptTerms() {
    localStorage.setItem('terms_accepted', 'true');
    localStorage.setItem('terms_version', TERMS_VERSION);
    localStorage.setItem('terms_date', new Date().toISOString());
    hideTermsModal();
    if (typeof showNotification === 'function') showNotification('✅ Соглашение принято', 'success');
}

function declineTerms() {
    window.location.href = 'https://google.com';
}

// ============================================================
// handleInput — обновляет рекомендуемый уровень при вводе
// ============================================================
async function handleInput() {
    const question = document.getElementById('userInput')?.value?.trim();
    if (!question || question.length < 3) return;
    try {
        const res = await fetch(`${CONFIG.API_URL}/api/suggest?q=${encodeURIComponent(question)}`);
        if (!res.ok) return;
        const data = await res.json();
        const el = document.getElementById('suggestLevel');
        if (el && data.level) el.textContent = data.level;
    } catch { /* silent */ }
}

// ============================================================
// SETTINGS — closeSettings, saveSettings, loadSavedKeys
// ============================================================

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = 'none';
}

async function saveSettings() {
    const serverUrl   = document.getElementById('serverUrl')?.value?.trim();
    const apiKey      = document.getElementById('apiKey')?.value?.trim();
    const archKey     = document.getElementById('architectKey')?.value?.trim();
    const ownerWallet = document.getElementById('ownerWallet')?.value?.trim();
    const provider    = document.getElementById('keyProvider')?.value || 'deepseek';

    // Сохраняем локально
    if (serverUrl)    { localStorage.setItem('brain_api_url', serverUrl);   CONFIG.API_URL = serverUrl; }
    if (ownerWallet)  { localStorage.setItem('brain_owner_wallet', ownerWallet); CONFIG.OWNER_WALLET = ownerWallet; }
    if (archKey)      { sessionStorage.setItem('brain_architect_key', archKey); CONFIG.ARCHITECT_KEY = archKey; }

    // Сохраняем API ключ на сервер через PUT /api/auth/keys/:provider
    if (apiKey && token) {
        try {
            const res = await fetch(`${CONFIG.API_URL}/api/auth/keys/${provider}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key: apiKey })
            });
            const data = await res.json();
            if (res.ok) {
                showNotification(`✅ Ключ ${provider} сохранён на сервер`, 'success');
                document.getElementById('apiKey').value = '';
                await loadSavedKeys();
            } else {
                showNotification(`❌ ${data.error || 'Ошибка сохранения ключа'}`, 'error');
            }
        } catch (err) {
            showNotification('❌ Нет связи с сервером', 'error');
        }
    } else if (apiKey) {
        // Без авторизации — только в sessionStorage
        sessionStorage.setItem('brain_api_key', apiKey);
        CONFIG.API_KEY = apiKey;
        showNotification('✅ Ключ сохранён локально (подключите кошелёк для сохранения на сервер)', 'info');
    } else {
        showNotification('✅ Настройки сохранены', 'success');
    }

    closeSettings();
}

async function loadSavedKeys() {
    const container = document.getElementById('savedKeysList');
    if (!container || !token) {
        if (container) container.textContent = 'Подключите кошелёк для управления ключами';
        return;
    }
    try {
        const res = await fetch(`${CONFIG.API_URL}/api/auth/keys`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) { container.textContent = 'Ошибка загрузки'; return; }
        const data = await res.json();
        const providers = data.providers || {};
        const saved = Object.entries(providers).filter(([, v]) => v);

        if (saved.length === 0) {
            container.textContent = 'Нет сохранённых ключей';
            return;
        }
        container.innerHTML = saved.map(([p]) =>
            `<span>${p} <span class="del-key" onclick="deleteKey('${p}')" title="Удалить">✕</span></span>`
        ).join('');
    } catch {
        container.textContent = 'Ошибка загрузки';
    }
}

async function deleteKey(provider) {
    if (!token) return;
    try {
        const res = await fetch(`${CONFIG.API_URL}/api/auth/keys/${provider}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            showNotification(`✅ Ключ ${provider} удалён`, 'success');
            await loadSavedKeys();
        }
    } catch {
        showNotification('❌ Ошибка удаления', 'error');
    }
}

// Показать текущие значения при открытии настроек
openSettings = function() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    // Заполнить поля текущими значениями
    const su = document.getElementById('serverUrl');
    const ow = document.getElementById('ownerWallet');
    if (su) su.value = CONFIG.API_URL || '';
    if (ow) ow.value = CONFIG.OWNER_WALLET || '';
    modal.style.display = 'flex';
    loadSavedKeys();
};

// ============================================================
// THEME — toggleTheme
// ============================================================

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('brain_theme', next);
    CONFIG.THEME = next;
}

// ============================================================
// HISTORY — clearHistory
// ============================================================

function clearHistory() {
    const messages = elements.messages;
    if (!messages) return;
    // Оставляем только welcome-message
    const welcome = document.getElementById('welcomeMessage');
    messages.innerHTML = '';
    if (welcome) messages.appendChild(welcome);
    else {
        messages.innerHTML = '<div class="welcome-message" id="welcomeMessage"><div class="welcome-icon">🧠</div><h1>BRAIN T₀ v5.0</h1></div>';
    }
    history.length = 0;
    showNotification('🗑️ История очищена', 'info');
}

// ============================================================
// SUGGEST — applySuggestedLevel
// ============================================================

function applySuggestedLevel() {
    const suggestEl = document.getElementById('suggestLevel');
    const levelEl   = elements.levelSelect;
    if (!suggestEl || !levelEl) return;
    const level = suggestEl.textContent.trim();
    if (level && levelEl.querySelector(`option[value="${level}"]`)) {
        levelEl.value = level;
        showNotification(`✅ Уровень ${level} применён`, 'success');
    }
}

// ============================================================
// WEBSOCKET — подключение и live-обновления кристаллов
// ============================================================

let ws = null;
let wsReconnectTimer = null;
let wsReconnectAttempts = 0;

function connectWebSocket() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

    const wsUrl = (CONFIG.API_URL || window.location.origin)
        .replace('https://', 'wss://')
        .replace('http://', 'ws://');

    setWsIndicator('connecting');

    try {
        ws = new WebSocket(wsUrl);
    } catch {
        setWsIndicator('error');
        return;
    }

    ws.onopen = () => {
        wsReconnectAttempts = 0;
        setWsIndicator('connected');
        // Авторизуемся если есть токен
        if (token) {
            ws.send(JSON.stringify({ type: 'auth', token }));
        }
        // Подписываемся на обновления кристаллов
        ws.send(JSON.stringify({ type: 'subscribe', channel: 'crystals' }));
    };

    ws.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
            handleWsMessage(msg);
        } catch { /* ignore malformed */ }
    };

    ws.onerror = () => setWsIndicator('error');

    ws.onclose = () => {
        setWsIndicator('error');
        // Реконнект с экспоненциальной задержкой, макс 30с
        const delay = Math.min(1000 * Math.pow(2, wsReconnectAttempts), 30000);
        wsReconnectAttempts++;
        wsReconnectTimer = setTimeout(connectWebSocket, delay);
    };
}

function handleWsMessage(msg) {
    switch (msg.type) {
        case 'welcome':
            // Сервер приветствует — ничего
            break;
        case 'auth':
            if (msg.status === 'success' && msg.role === 'architect') {
                isArchitect = true;
                if (elements.architectBadge) elements.architectBadge.style.display = 'flex';
            }
            break;
        case 'crystal:update':
            // Живое обновление — перезагружаем список
            loadCrystals();
            break;
        case 'pong':
            // heartbeat OK
            break;
        case 'error':
            console.warn('WS error:', msg.message);
            break;
    }
}

function setWsIndicator(state) {
    const el = document.getElementById('wsIndicator');
    if (!el) return;
    const states = {
        connected:  { icon: '🟢', title: 'WebSocket подключён', cls: 'connected' },
        connecting: { icon: '🟡', title: 'Подключение...', cls: 'connecting' },
        error:      { icon: '🔴', title: 'WebSocket отключён', cls: 'error' },
    };
    const s = states[state] || states.error;
    el.textContent = s.icon;
    el.title = s.title;
    el.className = `ws-indicator ${s.cls}`;
}

// WS heartbeat — пингуем каждые 25с чтобы соединение не закрылось
setInterval(() => {
    if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
    }
}, 25000);

// ============================================================
// INIT — патч: добавить WS + openSettings после загрузки
// ============================================================
const _origInit = init;
init = async function() {
    await _origInit();
    // Запускаем WS если есть API_URL
    if (CONFIG.API_URL) {
        connectWebSocket();
    }
};

// ============================================================
// 👑 КАБИНЕТ АРХИТЕКТОРА
// ============================================================

function openAdminPanel() {
    if (!token) return showNotification('Необходима авторизация через MetaMask', 'warning');
    document.getElementById('adminPanel').style.display = 'flex';
    showAdminTab('stats');
}

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    const btn = [...document.querySelectorAll('.admin-tab')].find(t => t.onclick.toString().includes(`'${tab}'`));
    if (btn) btn.classList.add('active');

    const body = document.getElementById('adminBody');
    body.innerHTML = '<div class="admin-loading">⏳ Загрузка...</div>';

    const loaders = {
        stats:    loadAdminStats,
        users:    loadAdminUsers,
        levels:   loadAdminLevels,
        crystals: loadAdminCrystals,
        attacks:  loadAdminAttacks,
        prompts:  loadAdminPrompts,
        economy:  loadAdminEconomy
    };
    if (loaders[tab]) loaders[tab]();
}

async function adminFetch(path, opts = {}) {
    const res = await fetch(`${CONFIG.API_URL}${path}`, {
        ...opts,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(opts.headers || {})
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// ─── СТАТИСТИКА ──────────────────────────────────────────────
async function loadAdminStats() {
    try {
        const d = await adminFetch('/api/admin/stats');
        const mk = d.master_key;
        const mkPct = Math.round(mk.used_today / mk.limit * 100);

        document.getElementById('adminBody').innerHTML = `
        <div class="admin-grid">
            <div class="admin-card">
                <div class="admin-card-title">👥 Пользователи</div>
                <div class="admin-stat-row"><span>Всего</span><b>${d.users.total}</b></div>
                <div class="admin-stat-row"><span>Активны сегодня</span><b>${d.users.active_today}</b></div>
                <div class="admin-stat-row"><span>Новых сегодня</span><b>${d.users.new_today}</b></div>
                <div class="admin-stat-row"><span>Архитекторов</span><b>${d.users.architects}</b></div>
                <div class="admin-stat-row warn"><span>Заблокировано</span><b>${d.users.blocked}</b></div>
                <div class="admin-stat-row"><span>Запросов всего</span><b>${d.users.total_queries}</b></div>
                <div class="admin-stat-row"><span>Потрачено ($)</span><b>${parseFloat(d.users.total_spent || 0).toFixed(2)}</b></div>
            </div>

            <div class="admin-card">
                <div class="admin-card-title">💎 Кристаллы</div>
                <div class="admin-stat-row"><span>Всего</span><b>${d.crystals.total}</b></div>
                <div class="admin-stat-row"><span>Новых сегодня</span><b>${d.crystals.new_today}</b></div>
                <div class="admin-stat-row"><span>💎 Алмазы</span><b>${d.crystals.diamonds}</b></div>
                <div class="admin-stat-row ok"><span>✅ Verified</span><b>${d.crystals.verified}</b></div>
                <div class="admin-stat-row warn"><span>🔬 Quarantine</span><b>${d.crystals.quarantine}</b></div>
                <div class="admin-stat-row danger"><span>🦠 Virus</span><b>${d.crystals.virus}</b></div>
                <div class="admin-stat-row"><span>🌐 Глобальных</span><b>${d.crystals.global}</b></div>
            </div>

            <div class="admin-card">
                <div class="admin-card-title">🛡️ Атаки (24ч)</div>
                <div class="admin-stat-row danger"><span>Всего</span><b>${d.attacks.total_24h}</b></div>
                <div class="admin-stat-row"><span>Уникальных IP</span><b>${d.attacks.unique_ips}</b></div>
                <div class="admin-stat-row warn"><span>Jailbreak</span><b>${d.attacks.jailbreak}</b></div>
                <div class="admin-stat-row warn"><span>Extraction</span><b>${d.attacks.extraction}</b></div>
            </div>

            <div class="admin-card">
                <div class="admin-card-title">🔑 Мастер-ключ</div>
                <div class="admin-stat-row"><span>Использовано сегодня</span><b>${mk.used_today} / ${mk.limit}</b></div>
                <div class="admin-progress-bar">
                    <div class="admin-progress-fill ${mkPct > 80 ? 'danger' : mkPct > 50 ? 'warn' : ''}" style="width:${mkPct}%"></div>
                </div>
                <div class="admin-stat-row"><span>Осталось</span><b>${mk.limit - mk.used_today}</b></div>
            </div>

            <div class="admin-card">
                <div class="admin-card-title">💰 Экономика</div>
                <div class="admin-stat-row ok"><span>Подтверждено</span><b>${d.payments.confirmed}</b></div>
                <div class="admin-stat-row"><span>Выручка ($)</span><b>${parseFloat(d.payments.revenue || 0).toFixed(2)}</b></div>
                <div class="admin-stat-row"><span>Redis ключей</span><b>${d.redis_keys}</b></div>
            </div>
        </div>
        <div style="color:var(--text-3-dark);font-size:11px;margin-top:8px">
            Обновлено: ${new Date(d.generated_at).toLocaleTimeString()}
            <button class="admin-btn-sm" onclick="loadAdminStats()" style="margin-left:8px">🔄 Обновить</button>
        </div>`;
    } catch(e) {
        document.getElementById('adminBody').innerHTML = `<div class="admin-error">❌ ${e.message}</div>`;
    }
}

// ─── ПОЛЬЗОВАТЕЛИ ────────────────────────────────────────────
async function loadAdminUsers(search = '', blocked = '') {
    try {
        const qs = new URLSearchParams({ limit: 100, ...(search && {search}), ...(blocked && {blocked}) });
        const d = await adminFetch(`/api/admin/users?${qs}`);

        document.getElementById('adminBody').innerHTML = `
        <div class="admin-toolbar">
            <input id="userSearch" class="admin-input" placeholder="🔍 Поиск по кошельку..." value="${search}" oninput="loadAdminUsers(this.value)">
            <select class="admin-input" onchange="loadAdminUsers(document.getElementById('userSearch').value, this.value)" style="width:auto">
                <option value="">Все</option>
                <option value="false" ${blocked==='false'?'selected':''}>Активные</option>
                <option value="true" ${blocked==='true'?'selected':''}>Заблокированные</option>
            </select>
            <span class="admin-count">Найдено: ${d.total}</span>
        </div>
        <div class="admin-table-wrap">
        <table class="admin-table">
            <thead><tr>
                <th>ID</th><th>Кошелёк</th><th>Роль</th><th>Запросов</th>
                <th>Кристаллов</th><th>Потрачено</th><th>Последний вход</th><th>Действия</th>
            </tr></thead>
            <tbody>${d.users.map(u => `
            <tr class="${u.is_blocked ? 'row-blocked' : ''}">
                <td>${u.id}</td>
                <td class="wallet-cell" title="${u.wallet}">${u.wallet?.slice(0,8)}...${u.wallet?.slice(-4)}</td>
                <td>${u.is_architect ? '👑' : '👤'}</td>
                <td>${u.total_queries}</td>
                <td>${u.crystal_count}</td>
                <td>$${parseFloat(u.total_spent || 0).toFixed(2)}</td>
                <td>${u.last_login ? new Date(u.last_login).toLocaleDateString() : '—'}</td>
                <td class="action-cell">
                    <button class="admin-btn-sm ${u.is_blocked ? 'ok' : 'danger'}" onclick="adminToggleBlock(${u.id}, ${!u.is_blocked})">
                        ${u.is_blocked ? '✅ Разблок' : '🚫 Блок'}
                    </button>
                    <button class="admin-btn-sm" onclick="adminToggleRole(${u.id}, ${!u.is_architect})">
                        ${u.is_architect ? '👤 Понизить' : '👑 Повысить'}
                    </button>
                </td>
            </tr>`).join('')}
            </tbody>
        </table></div>`;
    } catch(e) {
        document.getElementById('adminBody').innerHTML = `<div class="admin-error">❌ ${e.message}</div>`;
    }
}

async function adminToggleBlock(userId, block) {
    const reason = block ? (prompt('Причина блокировки:') || '') : '';
    try {
        await adminFetch(`/api/admin/users/${userId}/block`, { method: 'PATCH', body: { block, reason } });
        loadAdminUsers();
    } catch(e) { alert('Ошибка: ' + e.message); }
}

async function adminToggleRole(userId, is_architect) {
    if (!confirm(`${is_architect ? 'Повысить' : 'Понизить'} пользователя ${userId}?`)) return;
    try {
        await adminFetch(`/api/admin/users/${userId}/role`, { method: 'PATCH', body: { is_architect } });
        loadAdminUsers();
    } catch(e) { alert('Ошибка: ' + e.message); }
}

// ─── КРИСТАЛЛЫ ───────────────────────────────────────────────
async function loadAdminCrystals(status = '', global_only = false) {
    try {
        const qs = new URLSearchParams({ limit: 100, ...(status && {status}), ...(global_only && {is_global: 'true'}) });
        const d = await adminFetch(`/api/admin/crystals?${qs}`);

        document.getElementById('adminBody').innerHTML = `
        <div class="admin-toolbar">
            <select class="admin-input" onchange="loadAdminCrystals(this.value)" style="width:auto">
                <option value="">Все статусы</option>
                <option value="verified" ${status==='verified'?'selected':''}>✅ Verified</option>
                <option value="quarantine" ${status==='quarantine'?'selected':''}>🔬 Quarantine</option>
                <option value="virus" ${status==='virus'?'selected':''}>🦠 Virus</option>
                <option value="unverified" ${status==='unverified'?'selected':''}>❓ Unverified</option>
            </select>
            <button class="admin-btn-sm ok" onclick="loadAdminCrystals('', true)">🌐 Глобальные</button>
            <span class="admin-count">Найдено: ${d.total}</span>
        </div>
        <div class="admin-table-wrap">
        <table class="admin-table">
            <thead><tr><th>ID</th><th>Кошелёк</th><th>Вопрос</th><th>Статус</th><th>Emoji</th><th>Глоб.</th><th>Действия</th></tr></thead>
            <tbody>${d.crystals.map(c => `
            <tr>
                <td>${c.id}</td>
                <td title="${c.wallet}">${c.wallet?.slice(0,6)}...</td>
                <td class="question-cell" title="${c.question}">${c.question?.slice(0, 60)}${c.question?.length > 60 ? '...' : ''}</td>
                <td><span class="status-badge ${c.status}">${c.status}</span></td>
                <td>${c.emoji}</td>
                <td>${c.is_global ? '🌐' : '—'}</td>
                <td class="action-cell">
                    <select class="admin-input-sm" onchange="adminSetCrystalStatus(${c.id}, this.value)">
                        <option value="">Статус</option>
                        <option value="verified">✅</option>
                        <option value="quarantine">🔬</option>
                        <option value="virus">🦠</option>
                        <option value="unverified">❓</option>
                    </select>
                    <button class="admin-btn-sm ${c.is_global ? 'warn' : 'ok'}" onclick="adminToggleGlobal(${c.id}, ${!c.is_global})">
                        ${c.is_global ? '📌 Убрать' : '🌐 Глоб.'}
                    </button>
                    <button class="admin-btn-sm danger" onclick="adminDeleteCrystal(${c.id})">🗑️</button>
                </td>
            </tr>`).join('')}
            </tbody>
        </table></div>`;
    } catch(e) {
        document.getElementById('adminBody').innerHTML = `<div class="admin-error">❌ ${e.message}</div>`;
    }
}

async function adminSetCrystalStatus(id, status) {
    if (!status) return;
    try {
        await adminFetch(`/api/admin/crystals/${id}/status`, { method: 'PATCH', body: { status } });
        loadAdminCrystals();
    } catch(e) { alert('Ошибка: ' + e.message); }
}

async function adminToggleGlobal(id, is_global) {
    try {
        await adminFetch(`/api/admin/crystals/${id}/global`, { method: 'PATCH', body: { is_global } });
        loadAdminCrystals();
    } catch(e) { alert('Ошибка: ' + e.message); }
}

async function adminDeleteCrystal(id) {
    if (!confirm(`Удалить кристалл #${id}?`)) return;
    try {
        await adminFetch(`/api/admin/crystals/${id}`, { method: 'DELETE' });
        loadAdminCrystals();
    } catch(e) { alert('Ошибка: ' + e.message); }
}

// ─── АТАКИ ───────────────────────────────────────────────────
async function loadAdminAttacks() {
    try {
        const d = await adminFetch('/api/admin/attacks?hours=24');

        document.getElementById('adminBody').innerHTML = `
        <div class="admin-section-title">🔴 Топ атакующих IP (24ч)</div>
        <div class="admin-table-wrap">
        <table class="admin-table">
            <thead><tr><th>IP</th><th>Атак</th><th>Категории</th><th>Последняя</th><th>Действия</th></tr></thead>
            <tbody>${d.top_ips.map(ip => `
            <tr>
                <td><code>${ip.ip}</code></td>
                <td><b class="${ip.total > 10 ? 'text-danger' : ''}">${ip.total}</b></td>
                <td>${ip.attack_types?.join(', ')}</td>
                <td>${new Date(ip.last_seen).toLocaleTimeString()}</td>
                <td>
                    <button class="admin-btn-sm danger" onclick="adminBlockIp('${ip.ip}')">🚫 Блок</button>
                </td>
            </tr>`).join('')}
            </tbody>
        </table></div>

        <div class="admin-section-title" style="margin-top:16px">🔒 Заблокированные IP</div>
        <div class="admin-table-wrap">
        <table class="admin-table">
            <thead><tr><th>IP</th><th>Причина</th><th>До</th><th></th></tr></thead>
            <tbody>${d.blocked_ips.length ? d.blocked_ips.map(b => `
            <tr>
                <td><code>${b.ip}</code></td>
                <td>${b.reason || '—'}</td>
                <td>${b.expires_at ? new Date(b.expires_at).toLocaleDateString() : '∞'}</td>
                <td><button class="admin-btn-sm ok" onclick="adminUnblockIp('${b.ip}')">✅ Снять</button></td>
            </tr>`).join('') : '<tr><td colspan="4" style="text-align:center;opacity:.5">Нет заблокированных IP</td></tr>'}
            </tbody>
        </table></div>

        <div style="margin-top:12px">
            <button class="admin-btn-sm" onclick="adminBlockIp()">➕ Заблокировать IP вручную</button>
        </div>`;
    } catch(e) {
        document.getElementById('adminBody').innerHTML = `<div class="admin-error">❌ ${e.message}</div>`;
    }
}

async function adminBlockIp(ip) {
    const targetIp = ip || prompt('IP адрес:');
    if (!targetIp) return;
    const reason = prompt('Причина (необязательно):') || '';
    const hours = prompt('Часов блокировки (пусто = бессрочно):');
    try {
        await adminFetch('/api/admin/attacks/block-ip', {
            method: 'POST',
            body: { ip: targetIp, reason, ...(hours && { expires_hours: parseInt(hours) }) }
        });
        loadAdminAttacks();
    } catch(e) { alert('Ошибка: ' + e.message); }
}

async function adminUnblockIp(ip) {
    try {
        await adminFetch(`/api/admin/attacks/block-ip/${encodeURIComponent(ip)}`, { method: 'DELETE' });
        loadAdminAttacks();
    } catch(e) { alert('Ошибка: ' + e.message); }
}

// ─── ПРОМПТЫ ─────────────────────────────────────────────────
async function loadAdminPrompts() {
    try {
        const d = await adminFetch('/api/admin/prompts');

        document.getElementById('adminBody').innerHTML = `
        <div class="admin-prompts">
            ${d.prompts.map(p => `
            <div class="admin-prompt-block">
                <div class="admin-prompt-key">
                    <code>${p.key}</code>
                    <span class="admin-version">v${p.version}</span>
                    ${p.updated_at ? `<span class="admin-updated">${new Date(p.updated_at).toLocaleString()}</span>` : ''}
                </div>
                <textarea id="prompt_${p.key}" class="admin-textarea">${p.value}</textarea>
                <button class="admin-btn-sm ok" onclick="adminSavePrompt('${p.key}')">💾 Сохранить</button>
            </div>`).join('')}
            <div class="admin-prompt-block">
                <div class="admin-prompt-key"><code>+ Новый промпт</code></div>
                <input id="newPromptKey" class="admin-input" placeholder="Ключ (напр. S4_deep)">
                <textarea id="newPromptValue" class="admin-textarea" placeholder="Текст промпта..."></textarea>
                <button class="admin-btn-sm ok" onclick="adminCreatePrompt()">➕ Создать</button>
            </div>
        </div>`;
    } catch(e) {
        document.getElementById('adminBody').innerHTML = `<div class="admin-error">❌ ${e.message}</div>`;
    }
}

async function adminSavePrompt(key) {
    const value = document.getElementById(`prompt_${key}`)?.value;
    if (!value?.trim()) return alert('Промпт не может быть пустым');
    try {
        await adminFetch(`/api/admin/prompts/${key}`, { method: 'PATCH', body: { value } });
        loadAdminPrompts();
    } catch(e) { alert('Ошибка: ' + e.message); }
}

async function adminCreatePrompt() {
    const key = document.getElementById('newPromptKey')?.value?.trim();
    const value = document.getElementById('newPromptValue')?.value?.trim();
    if (!key || !value) return alert('Заполните ключ и значение');
    try {
        await adminFetch(`/api/admin/prompts/${key}`, { method: 'PATCH', body: { value } });
        loadAdminPrompts();
    } catch(e) { alert('Ошибка: ' + e.message); }
}

// ─── ЭКОНОМИКА ───────────────────────────────────────────────
async function loadAdminEconomy() {
    try {
        const [payments, masterKey] = await Promise.all([
            adminFetch('/api/admin/payments?limit=50'),
            adminFetch('/api/admin/master-key')
        ]);

        document.getElementById('adminBody').innerHTML = `
        <div class="admin-grid" style="margin-bottom:16px">
            <div class="admin-card">
                <div class="admin-card-title">💰 Платежи</div>
                <div class="admin-stat-row ok"><span>Подтверждено</span><b>${payments.summary.confirmed}</b></div>
                <div class="admin-stat-row warn"><span>Pending</span><b>${payments.summary.pending}</b></div>
                <div class="admin-stat-row"><span>Выручка</span><b>$${parseFloat(payments.summary.total_revenue || 0).toFixed(2)}</b></div>
            </div>
            <div class="admin-card">
                <div class="admin-card-title">🔑 Мастер-ключ сегодня</div>
                ${masterKey.today.slice(0,5).map(u => `
                <div class="admin-stat-row">
                    <span title="${u.wallet}">${u.wallet?.slice(0,10)}...</span>
                    <b>${u.requests_today}</b>
                </div>`).join('')}
                <div class="admin-stat-row" style="border-top:1px solid rgba(255,255,255,.1);margin-top:4px;padding-top:4px">
                    <span><b>Итого / лимит</b></span>
                    <b>${masterKey.total_today} / ${masterKey.limit}</b>
                </div>
            </div>
        </div>
        <div class="admin-section-title">Последние транзакции</div>
        <div class="admin-table-wrap">
        <table class="admin-table">
            <thead><tr><th>ID</th><th>Кошелёк</th><th>TX Hash</th><th>Сумма</th><th>Уровень</th><th>Статус</th><th>Дата</th></tr></thead>
            <tbody>${payments.payments.map(p => `
            <tr>
                <td>${p.id}</td>
                <td title="${p.wallet}">${p.wallet?.slice(0,8)}...</td>
                <td><a href="https://etherscan.io/tx/${p.tx_hash}" target="_blank" style="color:var(--accent)">${p.tx_hash?.slice(0,10)}...</a></td>
                <td>$${p.amount}</td>
                <td>${p.level}</td>
                <td><span class="status-badge ${p.status}">${p.status}</span></td>
                <td>${new Date(p.created_at).toLocaleDateString()}</td>
            </tr>`).join('')}
            </tbody>
        </table></div>`;
    } catch(e) {
        document.getElementById('adminBody').innerHTML = `<div class="admin-error">❌ ${e.message}</div>`;
    }
}

// ─── УРОВНИ (вкладка кабинета архитектора) ───────────────────
async function loadAdminLevels() {
    try {
        const d = await adminFetch('/api/admin/levels');

        document.getElementById('adminBody').innerHTML = `
        <div class="levels-hint">
            💡 <b>Цена 0</b> = бесплатно &nbsp;·&nbsp;
            <b>Лимит 0</b> = безлимит &nbsp;·&nbsp;
            Изменения применяются немедленно без редеплоя
        </div>
        <div class="admin-table-wrap">
        <table class="admin-table levels-table">
            <thead><tr>
                <th>Уровень</th>
                <th>Описание</th>
                <th>Цена ($)</th>
                <th>Токены</th>
                <th>Лимит/день</th>
                <th>Обновлён</th>
                <th></th>
            </tr></thead>
            <tbody>${d.levels.map(l => `
            <tr id="level-row-${l.level}">
                <td><b class="level-badge level-${l.level}">${l.level}</b></td>
                <td>
                    <input class="admin-input level-input" id="desc_${l.level}"
                        value="${l.description || ''}" placeholder="Описание">
                </td>
                <td>
                    <input class="admin-input level-input level-num" id="price_${l.level}"
                        type="number" min="0" step="0.01"
                        value="${parseFloat(l.price).toFixed(2)}"
                        placeholder="0.00">
                </td>
                <td>
                    <input class="admin-input level-input level-num" id="tokens_${l.level}"
                        type="number" min="100" step="100"
                        value="${l.tokens}"
                        placeholder="300">
                </td>
                <td>
                    <input class="admin-input level-input level-num" id="limit_${l.level}"
                        type="number" min="0" step="1"
                        value="${l.daily_limit}"
                        placeholder="0 = ∞">
                </td>
                <td style="font-size:11px;opacity:.5">
                    ${l.updated_at ? new Date(l.updated_at).toLocaleDateString() : '—'}
                </td>
                <td>
                    <button class="admin-btn-sm ok" onclick="adminSaveLevel('${l.level}')">
                        💾 Сохранить
                    </button>
                </td>
            </tr>`).join('')}
            </tbody>
        </table></div>
        <div class="levels-info">
            <div class="levels-info-row">
                <span>🆓 Бесплатный уровень</span>
                <span>Цена = 0, лимит > 0</span>
            </div>
            <div class="levels-info-row">
                <span>💰 Платный уровень</span>
                <span>Цена > 0, разовая оплата ETH</span>
            </div>
            <div class="levels-info-row">
                <span>♾️ Безлимитный</span>
                <span>Лимит = 0</span>
            </div>
        </div>`;
    } catch(e) {
        document.getElementById('adminBody').innerHTML = `<div class="admin-error">❌ ${e.message}</div>`;
    }
}

async function adminSaveLevel(level) {
    const price      = document.getElementById(`price_${level}`)?.value;
    const tokens     = document.getElementById(`tokens_${level}`)?.value;
    const daily_limit = document.getElementById(`limit_${level}`)?.value;
    const description = document.getElementById(`desc_${level}`)?.value;

    if (parseFloat(price) < 0) return alert('Цена не может быть отрицательной');
    if (parseInt(tokens) < 100) return alert('Минимум 100 токенов');
    if (parseInt(daily_limit) < 0) return alert('Лимит не может быть отрицательным');

    try {
        const row = document.getElementById(`level-row-${level}`);
        if (row) row.style.opacity = '0.5';

        await adminFetch(`/api/admin/levels/${level}`, {
            method: 'PATCH',
            body: {
                price:       parseFloat(price),
                tokens:      parseInt(tokens),
                daily_limit: parseInt(daily_limit),
                description
            }
        });

        if (row) row.style.opacity = '1';
        // Обновляем селект уровней в основном интерфейсе
        updateLevelSelect(level, parseFloat(price));
    } catch(e) {
        alert('Ошибка: ' + e.message);
        const row = document.getElementById(`level-row-${level}`);
        if (row) row.style.opacity = '1';
    }
}

// Обновляем подписи в главном селекте уровней после изменения цены
function updateLevelSelect(level, price) {
    const opt = document.querySelector(`#levelSelect option[value="${level}"]`);
    if (!opt) return;
    const label = price === 0 ? `${level} Free` : `${level} $${price}`;
    opt.textContent = label;
}

// ============================================================
// 👤 ЛИЧНЫЙ КАБИНЕТ ПОЛЬЗОВАТЕЛЯ
// ============================================================

async function openProfile() {
    if (!token) {
        showNotification('Подключите MetaMask для входа', 'info');
        await connectWallet();
        return;
    }
    document.getElementById('profileModal').style.display = 'flex';
    loadProfile();
}

function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
}

async function loadProfile() {
    const body = document.getElementById('profileBody');
    body.innerHTML = '<div style="text-align:center;padding:40px;opacity:.5">⏳ Загрузка...</div>';

    try {
        const res = await fetch(`${CONFIG.API_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Не удалось загрузить профиль');
        const d = await res.json();
        const p = d.profile;
        const c = d.crystals;

        // Дневные лимиты
        const limitsHtml = Object.entries(d.limits || {}).map(([lvl, l]) => {
            const pct = Math.round(l.used / l.limit * 100);
            const color = pct >= 100 ? '#f87171' : pct >= 70 ? '#fbbf24' : '#4ade80';
            return `
            <div class="profile-limit-row">
                <span class="level-badge level-${lvl}">${lvl}</span>
                <div class="profile-limit-bar">
                    <div class="profile-limit-fill" style="width:${pct}%;background:${color}"></div>
                </div>
                <span class="profile-limit-text">${l.used} / ${l.limit}</span>
            </div>`;
        }).join('') || '<div class="profile-empty">Нет ограничений на сегодня</div>';

        // История платежей
        const paymentsHtml = d.payments.length
            ? d.payments.map(p => `
            <div class="profile-payment-row">
                <span class="status-badge ${p.status}">${p.status}</span>
                <span class="level-badge level-${p.level}">${p.level}</span>
                <span class="profile-payment-amount">$${p.amount}</span>
                <span class="profile-payment-date">${new Date(p.created_at).toLocaleDateString()}</span>
                <a href="https://etherscan.io/tx/${p.tx_hash}" target="_blank" class="profile-tx-link" title="${p.tx_hash}">
                    🔗 TX
                </a>
            </div>`).join('')
            : '<div class="profile-empty">Платежей пока нет</div>';

        body.innerHTML = `
        <div class="profile-grid">

            <!-- Профиль -->
            <div class="profile-card">
                <div class="profile-wallet">
                    <span class="profile-avatar">${p.is_architect ? '👑' : '👤'}</span>
                    <div>
                        <div class="profile-wallet-addr" title="${p.wallet}">
                            ${p.wallet?.slice(0,10)}...${p.wallet?.slice(-6)}
                        </div>
                        <div class="profile-role">${p.is_architect ? 'Архитектор' : 'Пользователь'}</div>
                    </div>
                    <button class="profile-copy-btn" onclick="copyToClipboard('${p.wallet}')" title="Скопировать адрес">📋</button>
                </div>
                <div class="profile-stat-row">
                    <span>📅 Регистрация</span>
                    <b>${new Date(p.created_at).toLocaleDateString()}</b>
                </div>
                <div class="profile-stat-row">
                    <span>🕐 Последний вход</span>
                    <b>${p.last_login ? new Date(p.last_login).toLocaleDateString() : '—'}</b>
                </div>
                <div class="profile-stat-row">
                    <span>❓ Всего запросов</span>
                    <b>${p.total_queries}</b>
                </div>
                <div class="profile-stat-row highlight">
                    <span>💸 Потрачено</span>
                    <b>$${p.total_spent}</b>
                </div>
            </div>

            <!-- Кристаллы -->
            <div class="profile-card">
                <div class="profile-card-title">💎 Мои кристаллы</div>
                <div class="profile-crystals-grid">
                    <div class="profile-crystal-stat">
                        <span class="profile-crystal-num">${c.total}</span>
                        <span class="profile-crystal-label">всего</span>
                    </div>
                    <div class="profile-crystal-stat diamonds">
                        <span class="profile-crystal-num">${c.diamonds}</span>
                        <span class="profile-crystal-label">💎</span>
                    </div>
                    <div class="profile-crystal-stat verified">
                        <span class="profile-crystal-num">${c.verified}</span>
                        <span class="profile-crystal-label">✅</span>
                    </div>
                    <div class="profile-crystal-stat quarantine">
                        <span class="profile-crystal-num">${c.quarantine}</span>
                        <span class="profile-crystal-label">🔬</span>
                    </div>
                    <div class="profile-crystal-stat virus">
                        <span class="profile-crystal-num">${c.virus}</span>
                        <span class="profile-crystal-label">🦠</span>
                    </div>
                    <div class="profile-crystal-stat today">
                        <span class="profile-crystal-num">${c.today}</span>
                        <span class="profile-crystal-label">сегодня</span>
                    </div>
                </div>
            </div>

            <!-- Дневные лимиты -->
            <div class="profile-card">
                <div class="profile-card-title">📊 Лимиты сегодня</div>
                <div class="profile-limits">${limitsHtml}</div>
                <div class="profile-reset-hint">🔄 Сбрасываются в полночь UTC</div>
            </div>

            <!-- История платежей -->
            <div class="profile-card profile-card-wide">
                <div class="profile-card-title">💰 История платежей</div>
                <div class="profile-payments">${paymentsHtml}</div>
            </div>

        </div>`;

    } catch(e) {
        body.innerHTML = `<div style="color:#f87171;text-align:center;padding:40px">❌ ${e.message}</div>`;
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showNotification('📋 Скопировано', 'success'));
}
