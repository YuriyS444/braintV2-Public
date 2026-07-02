const CONFIG = {
    API_URL: sessionStorage.getItem('brain_api_url') || localStorage.getItem('brain_api_url') || 'https://braintv2-private-production.up.railway.app',
    API_KEY: sessionStorage.getItem('brain_api_key') || '',
    ARCHITECT_KEY: sessionStorage.getItem('brain_architect_key') || '',
    OWNER_WALLET: '', // загружается с сервера автоматически
    PROVIDER: localStorage.getItem('brain_provider') || 'deepseek',
    THEME: localStorage.getItem('brain_theme') || 'dark'
};

// ── Язык интерфейса — автоопределение по браузеру ───────────
function detectBrowserLang() {
    // Сохранённый выбор пользователя — приоритет
    const saved = localStorage.getItem('brain_lang');
    if (saved) return saved;

    // Язык браузера
    const browserLang = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();

    // Русскоязычные локали
    const ruLocales = ['ru', 'ru-ru', 'ru-ua', 'ru-by', 'ru-kz', 'uk', 'be', 'kk'];
    if (ruLocales.some(l => browserLang.startsWith(l))) return 'ru';

    // Всё остальное — английский
    return 'en';
}

let currentLang = detectBrowserLang();

const TRANSLATIONS = {
    ru: {
        // Навигация
        crystals: 'Кристаллы',
        filter_all: 'Все',
        sync: '☁️ Синхр.',
        export: '📥 Экспорт',
        import: '📤 Импорт',
        stat_total: 'всего',
        apply: '(применить)',
        hint_enter: '· Enter — отправить',
        hint_shift: '· Shift+Enter — перенос',
        rec_level: 'Рек. уровень:',
        // Уведомления
        install_metamask: 'Установите MetaMask',
        connect_wallet: 'Подключите кошелёк',
        connection_error: 'Ошибка подключения: ',
        architect_activated: '👑 Режим архитектора активирован',
        payment_title: 'Оплата уровня',
        payment_amount: 'Сумма',
        payment_token: 'Токен',
        payment_recipient: 'Получатель',
        payment_auto: 'После оплаты ответ будет получен автоматически.',
        payment_continue: 'Продолжить?',
        payment_cancel: 'Отмена',
        payment_confirm: 'Оплатить',
        syncing: 'Синхронизация...',
        synced: '✅ Синхронизировано',
        import_error: '❌ Ошибка импорта',
        copied: '✅ Скопировано',
        copy_error: '❌ Ошибка копирования',
        auth_required: 'Необходима авторизация через MetaMask',
        connect_to_signin: 'Сохраните ключ от провайдера(ИИ) в настройках',
        auth_step1: '⚙️ Шаг 1: Введите API ключ провайдера ИИ в настройках (⚙️)',
        auth_step2: '🦊 Шаг 2: Подключите MetaMask для входа в личный кабинет',
        install_metamask: 'Установите MetaMask: https://metamask.io',
        open_metamask_manual: '🦊 Откройте MetaMask и вернитесь в приложение',
        wallet_status_unavailable: 'Статус недоступен',
        keys_connect_wallet: 'Подключите кошелёк для управления ключами',
        keys_load_error: 'Ошибка загрузки',
        keys_no_saved: 'Нет сохранённых ключей',
        files_unavailable: 'Файлы недоступны на этом уровне',
        stop_generation: '⏹ Генерация остановлена',
        retry: '🔄 Повторить',
        // Уровни
        day: 'день',
        free: 'Бесплатно',
        // Авторизация
        metamask_connected: '✅ MetaMask подключён',
        open_metamask: 'Открываем Metamask...',
        signature_check: '🔍 Проверяем подпись в MetaMask...',
        auth_error: 'Ошибка аутентификации',
        session_expired: 'Сессия истекла. Переподключите MetaMask.',
        apikey_not_set: 'API ключ не задан. Добавьте в настройках.',
        wallet_not_connected: 'Кошелёк не подключён. Переподключите MetaMask.',
        // Файлы
        file_read_error: 'Ошибка чтения файла',
        file_type_unsupported: 'Тип файла не поддерживается',
        file_too_large: 'превышает',
        files_max: 'Максимум',
        files_max_suffix: 'файл(ов) для уровня',
        no_valid_crystals: '❌ Нет валидных кристаллов для импорта',
        export_ready: '📥 Экспорт готов',
        // Платежи
        payment_owner_missing: '❌ Ошибка: адрес получателя не загружен',
        payment_owner_missing2: '❌ Кошелёк получателя не загружен. Попробуйте позже.',
        payment_waiting: '⏳ Ожидание подтверждения транзакции...',
        payment_confirmed: '✅ Платёж подтверждён',
        payment_network_wait: '⏳ Транзакция отправлена, ожидаем подтверждения сети...',
        payment_cancelled: 'Платёж отменён',
        terms_accepted: '✅ Соглашение принято',
        key_saved_server: 'сохранён на сервер',
        key_saved_local: '✅ Ключ сохранён локально (подключите кошелёк для сохранения на сервер)',
        settings_saved: '✅ Настройки сохранены',
        key_deleted: 'удалён',
        key_delete_error: '❌ Ошибка удаления',
        no_server: '❌ Нет связи с сервером',
        history_cleared: '🗑️ История очищена',
        crystals_imported: 'кристаллов импортировано',
        key_save_error: 'Ошибка сохранения ключа',
        level_applied: 'применён',
        error_prefix: '❌ Ошибка: ',
        filter_open: '🟢 Открытый',
        filter_science: '🔬 Научный',
        filter_strict: '🔴 Строгий',
        filter_mode_set: 'Режим фильтрации',
        // Личный кабинет
        profile_loading: '⏳ Загрузка...',
        profile_load_error: 'Не удалось загрузить профиль',
        profile_no_limits: 'Нет ограничений на сегодня',
        profile_no_payments: 'Платежей пока нет',
        profile_architect: 'Архитектор',
        profile_user: 'Пользователь',
        profile_copy_address: 'Скопировать адрес',
        profile_registration: '📅 Регистрация',
        profile_last_login: '🕐 Последний вход',
        profile_total_queries: '❓ Всего запросов',
        profile_total_spent: '💸 Потрачено',
        profile_my_crystals: '💎 Мои кристаллы',
        profile_total: 'всего',
        profile_diamond: '💎 кристалл',
        profile_today: 'сегодня',
        profile_limits_today: '📊 Лимиты сегодня',
        profile_reset_hint: '🔄 Сбрасываются в полночь UTC',
        profile_payment_history: '💰 История платежей',
    },
    en: {
        // Navigation
        crystals: 'Crystals',
        filter_all: 'All',
        sync: '☁️ Sync',
        export: '📥 Export',
        import: '📤 Import',
        stat_total: 'total',
        apply: '(apply)',
        hint_enter: '· Enter — send',
        hint_shift: '· Shift+Enter — newline',
        rec_level: 'Rec. level:',
        // Notifications
        install_metamask: 'Please install MetaMask',
        connect_wallet: 'Connect wallet',
        connection_error: 'Connection error: ',
        architect_activated: '👑 Architect mode activated',
        payment_title: 'Payment for level',
        payment_amount: 'Amount',
        payment_token: 'Token',
        payment_recipient: 'Recipient',
        payment_auto: 'After payment, the response will be received automatically.',
        payment_continue: 'Continue?',
        payment_cancel: 'Cancel',
        payment_confirm: 'Pay now',
        syncing: 'Syncing...',
        synced: '✅ Synced',
        import_error: '❌ Import error',
        copied: '✅ Copied',
        copy_error: '❌ Copy error',
        auth_required: 'MetaMask authorization required',
        connect_to_signin: 'Save the provider (AI) key in the settings.',
        auth_step1: '⚙️ Step 1: Enter your AI provider API key in settings (⚙️)',
        auth_step2: '🦊 Step 2: Connect MetaMask to access your account',
        install_metamask: 'Install MetaMask: https://metamask.io',
        open_metamask_manual: '🦊 Open MetaMask and return to the app',
        wallet_status_unavailable: 'Status unavailable',
        keys_connect_wallet: 'Connect wallet to manage keys',
        keys_load_error: 'Loading error',
        keys_no_saved: 'No saved keys',
        files_unavailable: 'Files not available at this level',
        stop_generation: '⏹ Generation stopped',
        retry: '🔄 Retry',
        // Levels
        day: 'day',
        free: 'Free',
        // Auth
        metamask_connected: '✅ MetaMask connected',
        open_metamask: 'Open Metamask...',
        signature_check: '🔍 Checking signature in MetaMask...',
        auth_error: 'Authentication error',
        session_expired: 'Session expired. Please reconnect MetaMask.',
        apikey_not_set: 'API key not set. Please add your key in settings.',
        wallet_not_connected: 'Wallet not connected. Please reconnect MetaMask.',
        // Files
        file_read_error: 'File read error',
        file_type_unsupported: 'File type not supported',
        file_too_large: 'exceeds',
        files_max: 'Maximum',
        files_max_suffix: 'file(s) for level',
        no_valid_crystals: '❌ No valid crystals to import',
        export_ready: '📥 Export ready',
        // Payments
        payment_owner_missing: '❌ Error: recipient address not loaded',
        payment_owner_missing2: '❌ Recipient wallet not loaded. Try again later.',
        payment_waiting: '⏳ Waiting for transaction confirmation...',
        payment_confirmed: '✅ Payment confirmed',
        payment_network_wait: '⏳ Transaction sent, waiting for network confirmation...',
        payment_cancelled: 'Payment cancelled',
        terms_accepted: '✅ Agreement accepted',
        key_saved_server: 'saved to server',
        key_saved_local: '✅ Key saved locally (connect wallet to save to server)',
        settings_saved: '✅ Settings saved',
        key_deleted: 'deleted',
        key_delete_error: '❌ Delete error',
        no_server: '❌ No server connection',
        history_cleared: '🗑️ History cleared',
        crystals_imported: 'crystals imported',
        key_save_error: 'Key save error',
        level_applied: 'applied',
        error_prefix: '❌ Error: ',
        filter_open: '🟢 Open',
        filter_science: '🔬 Science',
        filter_strict: '🔴 Strict',
        filter_mode_set: 'Filter mode',
        // Profile / Account
        profile_loading: '⏳ Loading...',
        profile_load_error: 'Failed to load profile',
        profile_no_limits: 'No limits today',
        profile_no_payments: 'No payments yet',
        profile_architect: 'Architect',
        profile_user: 'User',
        profile_copy_address: 'Copy address',
        profile_registration: '📅 Registered',
        profile_last_login: '🕐 Last login',
        profile_total_queries: '❓ Total queries',
        profile_total_spent: '💸 Spent',
        profile_my_crystals: '💎 My crystals',
        profile_total: 'total',
        profile_diamond: '💎 diamond',
        profile_today: 'today',
        profile_limits_today: '📊 Limits today',
        profile_reset_hint: '🔄 Resets at midnight UTC',
        profile_payment_history: '💰 Payment history',
    }
};

// Получить перевод
function t(key) {
    return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['ru']?.[key] || key;
}

// Применить язык UI — вызывается автоматически при загрузке
function setLang(lang) {
    if (!['ru', 'en'].includes(lang)) return;
    currentLang = lang;
    document.documentElement.lang = lang;

    // Обновляем все элементы с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = t(key);
        if (translation && translation !== key) el.textContent = translation;
    });
}

let wallet = null;
let token = sessionStorage.getItem('brain_token');
let isArchitect = false;
let crystals = [];
let history = JSON.parse(sessionStorage.getItem('brain_history') || '[]');
let currentFilter = 'all';
let currentSearch = '';
let abortController = null;
let isSending = false; // защита от двойной отправки
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
// CLI-001: кэш threat — не ходим на сервер чаще чем раз в 15 секунд
let threatCache = { level: 'low', timestamp: 0 };
const THREAT_CACHE_TTL = 60000;

const THREAT_MAP = {
    low:    { icon: '🟢', title: 'Угрозы не обнаружены' },
    medium: { icon: '🟡', title: 'Подозрительная активность' },
    high:   { icon: '🔴', title: 'Высокая угроза' }
};

async function updateThreatIndicator() {
    const el = elements.threatIndicator;
    if (!el) return;

    // Отдаём из кэша если не истёк
    if (Date.now() - threatCache.timestamp < THREAT_CACHE_TTL) {
        const info = THREAT_MAP[threatCache.level] || THREAT_MAP.low;
        el.textContent = info.icon;
        el.title = info.title;
        return;
    }

    try {
        if (!token) {
            el.textContent = '🟢';
            el.title = 'Нет активных угроз';
            return;
        }
        const res = await fetch(`${CONFIG.API_URL}/api/auth/threat`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        // Не логируем ошибки авторизации — токен мог устареть
        if (!res.ok) {
            el.textContent = '⚪';
            el.title = t('wallet_status_unavailable');
            return;
        }
        const data = await res.json();
        const lvl = data.level || 'low';
        threatCache = { level: lvl, timestamp: Date.now() };
        const info = THREAT_MAP[lvl] || THREAT_MAP.low;
        el.textContent = info.icon;
        el.title = info.title;
    } catch {
        if (el) { el.textContent = '⚪'; el.title = 'Статус недоступен'; }
    }
}

async function init() {
    document.documentElement.setAttribute('data-theme', CONFIG.THEME);
    
    if (token) {
        await verifyToken();
    }
    
    await loadCrystals();
    
    elements.userInput.addEventListener('input', debounce(handleInput, 500));
    elements.userInput.addEventListener('keydown', handleKeyDown);
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    setLang(currentLang); // применяем сохранённый язык
    elements.levelSelect?.addEventListener('change', updateFileHint);
    elements.providerSelect?.addEventListener('change', () => { updateFileAccept(); updateFileHint(); });
    
    const threatInterval = setInterval(updateThreatIndicator, 60000); // CLI-001: 15с вместо 5с
    window.addEventListener('beforeunload', () => clearInterval(threatInterval));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ── WALLETCONNECT + METAMASK DEEPLINK ────────────────────────────────────────
// Десктоп: window.ethereum (MetaMask extension) — прямой доступ как раньше.
// Мобильный: WalletConnect v2 с deeplink → открывает MetaMask Mobile напрямую.
// API идентичен — код оплаты и авторизации не меняется.

const WC_PROJECT_ID = 'd04282c19dc2dafdd36f6f50f81b93d8';
const DAPP_URL      = 'https://yuriys444.github.io/braintV2-Public/';
const isMobile      = /Android|iPhone|iPad/i.test(navigator.userAgent);

let wcProvider = null;

async function initWalletConnect() {
    // Загружаем WalletConnect Ethereum Provider из CDN если ещё не загружен
    if (wcProvider) return wcProvider;

    // Polyfill: UMD-бандл WalletConnect написан для Node.js и обращается
    // к глобальному process.env — в браузере его нет, создаём заглушку
    if (typeof window.process === 'undefined') {
        window.process = { env: {} };
    }
    if (typeof window.global === 'undefined') {
        window.global = window;
    }

    // Загружаем UMD скрипт если его ещё нет на странице
    const wcGlobal = () => window['@walletconnect/ethereum-provider'];
    const alreadyLoaded = !!(
        wcGlobal() ||
        window.WalletConnectEthereumProvider ||
        window.EthereumProvider
    );

    if (!alreadyLoaded) {
        await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://unpkg.com/@walletconnect/ethereum-provider@2.13.3/dist/index.umd.js';
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('Не удалось загрузить WalletConnect SDK'));
            document.head.appendChild(s);
        });
    }

    // Реальное имя глобального объекта: window['@walletconnect/ethereum-provider']
    const wcModule = wcGlobal() || window.WalletConnectEthereumProvider || window.EthereumProvider;

    const EthereumProvider =
        wcModule?.EthereumProvider ||
        wcModule?.default?.EthereumProvider ||
        wcModule;

    if (!EthereumProvider || typeof EthereumProvider.init !== 'function') {
        console.error('WalletConnect globals:', Object.keys(window).filter(k => /wallet|ethereum/i.test(k)));
        throw new Error('WalletConnect SDK не загрузился корректно');
    }

    wcProvider = await EthereumProvider.init({
        projectId:      WC_PROJECT_ID,
        chains:         [137],          // Polygon Mainnet — число (#5)
        showQrModal:    false,
        rpcMap: {
            137: 'https://polygon-rpc.com' // публичный RPC
        },
        metadata: {
            name:        'BRAIN T₀',
            description: 'AI система кристаллизации знаний',
            url:          DAPP_URL,
            icons:       [`${DAPP_URL}icons/icon-192.png`]
        }
    });

    // Когда WalletConnect получил URI — открываем MetaMask через deeplink
    wcProvider.on('display_uri', (uri) => {
        const encoded = encodeURIComponent(uri);
        // metamask:// deeplink открывает MetaMask Mobile и сразу подключает
        window.location.href = `metamask://wc?uri=${encoded}`;
        setTimeout(2000);
    });

    return wcProvider;
}

// ── ЕДИНАЯ ТОЧКА ВХОДА ───────────────────────────────────────────────────────
// Один правильный путь авторизации:
// 1. Нет API ключа → подсказка ввести ключ
// 2. Есть ключ, нет кошелька → подключить MetaMask
// 3. Есть ключ и кошелёк, нет токена → войти
// 4. Есть токен → открыть личный кабинет
async function handleAuthEntry() {
    if (!CONFIG.API_KEY) {
        showNotification(t('auth_step1'), 'info');
        return;
    }
    if (!wallet) {
        await connectWallet();
        return;
    }
    if (!token) {
        isMobile ? await loginByWallet() : await requestSignatureAndLogin();
        return;
    }
    // Всё есть — открываем личный кабинет
    document.getElementById('profileModal').style.display = 'flex';
    loadProfile();
}


async function connectWallet() {
    // Защита от двойного клика
    if (connectWallet._running) return;
    connectWallet._running = true;
    try {
        let provider;

        if (!isMobile && window.ethereum) {
            // ── ДЕСКТОП: MetaMask extension ──────────────────────────────────
            provider = window.ethereum;
        } else if (!isMobile && !window.ethereum) {
            // ── ДЕСКТОП без MetaMask ──────────────────────────────────────────
            showNotification(t('install_metamask'), 'error');
            return;
        } else {
            // ── МОБИЛЬНЫЙ: WalletConnect → MetaMask deeplink ─────────────────
            // На мобильном window.ethereum недоступен даже при установленном MetaMask
            // (расширения браузера не работают в Android) — используем WalletConnect
            showNotification(t('open_metamask'), 'info');

            let wcInitError = null;
            try {
                provider = await initWalletConnect();
            } catch (initErr) {
                wcInitError = initErr;
            }

            if (!provider) {
                // WalletConnect не загрузился — пробуем прямой deeplink как fallback
                console.warn('WalletConnect init failed, trying direct deeplink:', wcInitError?.message);
                const fallbackUri = `metamask://`;
                window.location.href = fallbackUri;
                showNotification(t('open_metamask_manual') || '🦊 Откройте MetaMask и вернитесь в приложение', 'info');
                return;
            }

            const wcAccounts = await provider.enable();
            if (wcAccounts && wcAccounts.length > 0) wallet = wcAccounts[0];
            window.ethereum = provider;
            provider.on('chainChanged', () => {
                if (window._paymentInProgress) return;
                window.location.reload();
            });
        }

        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        wallet = wallet || accounts[0];

        elements.walletBtn.textContent = `🦊 ${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
        elements.walletBtn.classList.add('connected');
        showNotification(t('metamask_connected'), 'success');

        if (isMobile) {
            // ── МОБИЛЬНЫЙ: подпись не требуется при входе ────────────────────
            // Адрес кошелька сохраняем, подпись запрашивается только при оплате
            sessionStorage.setItem('brain_wallet', wallet);
            if (CONFIG.API_KEY) await loginByWallet();
        } else {
            // ── ДЕСКТОП: полная авторизация через подпись ────────────────────
            const nonceRes = await fetch(`${CONFIG.API_URL}/api/auth/nonce?wallet=${wallet}`);
            if (!nonceRes.ok) {
                const err = await nonceRes.json().catch(() => ({}));
                throw new Error(err.error || 'Failed to get nonce');
            }
            const nonceData = await nonceRes.json();
            const nonce   = nonceData.nonce;
            const message = nonceData.message;

            if (!nonce || !message) throw new Error('Invalid nonce response from server');

            const signature = await provider.request({
                method: 'personal_sign',
                params: [message, wallet]
            });

            if (!signature) throw new Error('MetaMask did not return signature');

            sessionStorage.setItem('wallet_nonce', nonce);
            sessionStorage.setItem('wallet_signature', signature);

            if (CONFIG.API_KEY) await login();
        }

    } catch (error) {
        console.error('connectWallet error:', error);
        showNotification(t('connection_error') + (error.message || ''), 'error');
    } finally {
        connectWallet._running = false;
    }
}


// Мобильный вход — без подписи, только адрес кошелька + API ключ
async function loginByWallet() {
    try {
        if (!wallet || !CONFIG.API_KEY) return;

        const response = await fetch(`${CONFIG.API_URL}/api/auth/login-wallet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apiKey: CONFIG.API_KEY,
                wallet,
                architectKey: CONFIG.ARCHITECT_KEY || undefined
            })
        });

        if (!response.ok) {
            // Fallback — пробуем обычный login если эндпоинт не поддерживается
            console.warn('login-wallet not supported, falling back to signature login');
            await requestSignatureAndLogin();
            return;
        }

        const data = await response.json();
        token = data.token;
        isArchitect = data.isArchitect;
        sessionStorage.setItem('brain_token', token);

        if (isArchitect) {
            elements.architectBadge.style.display = 'inline-block';
            showNotification(t('architect_activated'), 'success');
        }
        await loadCrystals();

    } catch (error) {
        console.error('loginByWallet error:', error);
        // Fallback на подпись если что-то пошло не так
        await requestSignatureAndLogin();
    }
}

// Fallback — запрашиваем подпись на мобильном если нужно
async function requestSignatureAndLogin() {
    try {
        const nonceRes = await fetch(`${CONFIG.API_URL}/api/auth/nonce?wallet=${wallet}`);
        if (!nonceRes.ok) return;
        const { nonce, message } = await nonceRes.json();
        if (!nonce || !message) return;

        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, wallet]
        });
        if (!signature) return;

        sessionStorage.setItem('wallet_nonce', nonce);
        sessionStorage.setItem('wallet_signature', signature);
        await login();
    } catch (err) {
        console.error('requestSignatureAndLogin error:', err);
    }
}

async function login() {
    try {
        const nonce     = sessionStorage.getItem('wallet_nonce');
        const signature = sessionStorage.getItem('wallet_signature');

        if (!nonce || !signature) {
            throw new Error(t('session_expired'));
        }

        if (!CONFIG.API_KEY) {
            throw new Error(t('apikey_not_set'));
        }

        if (!wallet) {
            throw new Error(t('wallet_not_connected'));
        }

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
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `Login failed (${response.status})`);
        }

        const data = await response.json();
        token = data.token;
        isArchitect = data.isArchitect;

        sessionStorage.setItem('brain_token', token);

        sessionStorage.removeItem('wallet_nonce');
        sessionStorage.removeItem('wallet_signature');

        if (isArchitect) {
            elements.architectBadge.style.display = 'inline-block';
            showNotification(t('architect_activated'), 'success');
        }

        await loadCrystals();

    } catch (error) {
        console.error('Login error:', error);
        showNotification(t('auth_error'), 'error');
    }
}




async function verifyToken() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            token = null;
            wallet = null;
            isArchitect = false;
            sessionStorage.removeItem('brain_token');
            if (elements.architectBadge) elements.architectBadge.style.display = 'none';
            return;
        }

        const data = await response.json().catch(() => ({}));

        // Восстанавливаем wallet из JWT payload при перезагрузке страницы
        if (data.user?.wallet && !wallet) {
            wallet = data.user.wallet;
            if (elements.walletBtn) {
                elements.walletBtn.textContent = `🦊 ${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
                elements.walletBtn.classList.add('connected');
            }
        }

        // Обновляем isArchitect из ответа сервера
        if (data.isArchitect !== undefined) {
            isArchitect = data.isArchitect;
            if (elements.architectBadge) {
                elements.architectBadge.style.display = isArchitect ? 'flex' : 'none';
            }
        }
    } catch {
        token = null;
        wallet = null;
        isArchitect = false;
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
            if (currentFilter === 'crystal') {
                params.append('is_crystal', 'true');
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
            <span class="crystal-emoji">${c.is_crystal ? '💎' : (c.emoji || '💨')}</span>
            <div class="crystal-question">${escapeHtml(c.question || '')}</div>
            <div class="crystal-answer">${escapeHtml((c.answer || '').slice(0, 60))}…</div>
            <div class="crystal-status ${c.status || ''}">
                ${c.status === 'verified' ? '✅' : 
                  c.status === 'quarantine' ? '🔬' : 
                  c.status === 'virus' ? '🦠' : '⚠️'} · ${c.level || 'S0'}
                ${c.is_crystal ? ' · 💎' : ''}
            </div>
        </div>
    `).join('');
    
    elements.crystalCount.textContent = crystals.length;
}

function updateStats() {
    if (!elements.statTotal) return;
    
    const total = crystals.length;
    const diamonds = crystals.filter(c => c.is_crystal).length;
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
        showNotification(t('connect_wallet'), 'warning');
        return;
    }
    
    showNotification(t('syncing'), 'info');
    await loadCrystals();
    showNotification(t('synced'), 'success');
}

function exportCrystals() {
    // CLI-007: не экспортируем вирусы
    const safe = crystals.filter(c => c.status !== 'virus');
    const data = JSON.stringify(safe, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crystals-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification(t('export_ready'), 'success');
}

function importCrystals() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        const text = await file.text();
        
        try {
            const parsed = JSON.parse(text);

            // Валидация структуры — только массив объектов с question и answer
            const raw = Array.isArray(parsed) ? parsed : (parsed.crystals || []);
            const valid = raw.filter(c =>
                c && typeof c === 'object' &&
                typeof c.question === 'string' && c.question.trim() &&
                typeof c.answer   === 'string' && c.answer.trim() &&
                c.status !== 'virus'
            ).map(c => ({
                question: c.question.slice(0, 500),
                answer:   c.answer.slice(0, 15000),
                emoji:    ['💎','🔹','💨'].includes(c.emoji) ? c.emoji : '🔹',
                level:    ['S0','S1','S2','S3','S4','S5','S6'].includes(c.level) ? c.level : 'S3'
            }));

            if (valid.length === 0) {
                showNotification(t('no_valid_crystals'), 'error');
                return;
            }

            const response = await fetch(`${CONFIG.API_URL}/api/crystals/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ crystals: valid })
            });

            const result = await response.json();
            showNotification(`✅ ${result.imported || valid.length} ${t('crystals_imported')}`, 'success');

            await loadCrystals();

        } catch (error) {
            showNotification(t('import_error'), 'error');
        }
    };
    
    input.click();
}

// ============================================================
// FILE SYSTEM
// ============================================================

let attachedFiles = [];

const FILE_LIMITS = {
    S0: 0, S1: 1, S2: 2, S3: 3, S4: 5, S5: 7, S6: 10
};

const FILE_SIZE_LIMITS_MB = {
    S1: 1, S2: 2, S3: 3, S4: 5, S5: 10, S6: 20
};

function triggerFileUpload() {
    document.getElementById('fileInput')?.click();
}

const ALLOWED_MIME = new Set([
    'text/plain', 'text/markdown', 'text/html', 'text/css',
    'application/json', 'application/xml', 'text/xml',
    'text/x-python', 'text/javascript', 'application/javascript',
    'text/x-sql', 'text/csv', 'application/x-yaml', 'text/yaml',
    '' // пустой MIME — некоторые файлы (.env, .ini) не имеют типа
]);

function updateFileAccept() {
    const input = document.getElementById('fileInput');
    if (!input) return;
    input.accept = '.txt,.md,.log,.json,.csv,.yaml,.yml,.xml,.env,.ini,.js,.ts,.jsx,.tsx,.py,.html,.css,.sql';
}

function updateFileHint() {
    const hint = document.getElementById('fileTypeHint');
    const level = elements.levelSelect?.value || 'S0';
    if (!hint) return;
    const maxFiles = FILE_LIMITS[level] || 0;
    const maxSize  = FILE_SIZE_LIMITS_MB[level] || 0;
    if (maxFiles === 0) {
        hint.textContent = `На уровне ${level} загрузка файлов недоступна`;
        return;
    }
    hint.textContent = `Уровень ${level}: до ${maxFiles} файл(ов), каждый до ${maxSize}MB`;
}

function handleFileSelect(event) {
    const files    = Array.from(event.target.files || []);
    const level    = elements.levelSelect?.value || 'S0';
    const maxFiles = FILE_LIMITS[level] || 0;

    if (maxFiles === 0) {
        showNotification(t('files_unavailable'), 'warning');
        event.target.value = '';
        return;
    }
    if (files.length > maxFiles) {
        showNotification(`${t('files_max')} ${maxFiles} ${t('files_max_suffix')} ${level}`, 'error');
        event.target.value = '';
        return;
    }

    const maxSizeMB = FILE_SIZE_LIMITS_MB[level] || 5;
    for (const file of files) {
        if (file.size > maxSizeMB * 1024 * 1024) {
            showNotification(`${file.name} ${t('file_too_large')} ${maxSizeMB}MB`, 'error');
            event.target.value = '';
            return;
        }
        if (!ALLOWED_MIME.has(file.type)) {
            showNotification(`${t('file_type_unsupported')}: ${file.name}`, 'error');
            event.target.value = '';
            return;
        }
    }

    // Добавляем к уже прикреплённым, не заменяем
    const existingNames = new Set(attachedFiles.map(f => f.name));
    const newFiles = files.filter(f => !existingNames.has(f.name));
    const merged = [...attachedFiles, ...newFiles];

    if (merged.length > maxFiles) {
        showNotification(`${t('files_max')} ${maxFiles} ${t('files_max_suffix')} ${level}`, 'error');
        event.target.value = '';
        return;
    }

    attachedFiles = merged;

    const preview   = document.getElementById('filePreview');
    const name      = document.getElementById('filePreviewName');
    const icon      = document.getElementById('filePreviewIcon');
    const attachBtn = document.getElementById('attachBtn');

    if (attachedFiles.length === 1) {
        name.textContent = attachedFiles[0].name;
        icon.textContent = '📄';
    } else {
        name.textContent = `${attachedFiles.length} файлов`;
        icon.textContent = '📚';
    }

    if (preview)    preview.style.display = 'flex';
    if (attachBtn)  attachBtn.classList.add('has-file');
    event.target.value = ''; // сбрасываем input чтобы можно было выбрать те же файлы снова
}

function removeAttachedFile() {
    attachedFiles = [];
    const preview   = document.getElementById('filePreview');
    const fileInput = document.getElementById('fileInput');
    const attachBtn = document.getElementById('attachBtn');
    if (preview)    preview.style.display = 'none';
    if (fileInput)  fileInput.value = '';
    if (attachBtn)  attachBtn.classList.remove('has-file');
    updateFileHint();
}

async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            data: reader.result.split(',')[1]
        });
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function sendMessage() {
    // Защита от двойной отправки (двойной клик, Enter + click одновременно)
    if (isSending) return;

    const question = elements.userInput.value.trim();
    if (!question && attachedFiles.length === 0) return;
    
    if (!CONFIG.API_URL) {
        openSettings();
        return;
    }

    const level = elements.levelSelect.value;
    if (!token && level !== 'S0') {
        await login();
        if (!token) return;
    }
    
    // CLI-002: прерываем предыдущий запрос перед созданием нового
    if (abortController) abortController.abort();
    isSending = true;
    elements.sendBtn.disabled = true;

    elements.userInput.value = '';
    autoResize(elements.userInput);

    addUserMessage(question, attachedFiles.length ? [...attachedFiles] : []);
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
                removeAttachedFile();
                return;
            }
        }
        
        try {
            const suggestRes = await fetch(`${CONFIG.API_URL}/api/suggest?q=${encodeURIComponent(question)}`);
            const suggestData = await suggestRes.json();
            elements.suggestLevel.textContent = suggestData.level;
        } catch (error) {
        }
        
        // Конвертируем файлы в base64 для отправки
        let filesPayload = [];
        for (const file of attachedFiles) {
            try {
                filesPayload.push(await fileToBase64(file));
            } catch {
                showNotification(t('file_read_error'), 'error');
                removeAttachedFile();
                return;
            }
        }

        await sendNormalMessage(question, level, txHash, filesPayload);
        removeAttachedFile();
        
    } catch (error) {
        if (error.name === 'AbortError') {
            removeTypingIndicator();
            // Показываем сообщение с кнопкой повтора
            const lastQuestion = elements.userInput.value || history[history.length - 2]?.content || '';
            addStoppedMessage(lastQuestion);
        } else {
            removeTypingIndicator();
            addErrorMessage(error.message);
        }
    } finally {
        isSending = false; // разблокируем отправку
        elements.sendBtn.disabled = false;
        if (elements.progressBar) {
            elements.progressBar.style.display = 'none';
        }
        elements.sendBtn.style.display = 'flex';
        elements.stopBtn.style.display = 'none';
        abortController = null;
    }
}

async function sendNormalMessage(question, level, txHash, filesPayload = []) {
    const response = await fetch(`${CONFIG.API_URL}/api/ask`, {
        method: 'POST',
        signal: abortController?.signal,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        body: JSON.stringify({
            question: question || 'Проанализируй файлы',
            level,
            provider: elements.providerSelect?.value || CONFIG.PROVIDER,
            tx_hash: txHash,
            history: history.slice(-10),
            ...(filesPayload.length ? { files: filesPayload } : {})
        })
    });
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));

        // Лимит исчерпан
        if (response.status === 429) {
            const msg = error.limit
                ? (currentLang === 'ru' ? `⏳ Лимит ${error.level}: ${error.used}/${error.limit} запросов/${t('day')}.\nОбновится в полночь UTC.` : `⏳ Limit ${error.level}: ${error.used}/${error.limit} requests/${t('day')}.\nResets at midnight UTC.`)
                : error.error;
            throw new Error(msg);
        }

        // Требуется оплата (не должно случаться т.к. мы уже платим, но на всякий случай)
        if (response.status === 402) {
            throw new Error(`Требуется оплата: $${error.price} для уровня ${error.level}`);
        }

        if (response.status === 403) {
            throw new Error(error.error || 'Файлы недоступны на этом уровне');
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
    
    history.push({ role: 'user', content: question || (filesPayload?.length ? `📎 ${filesPayload.length} файл(ов)` : '') });
    history.push({ role: 'assistant', content: data.answer });
    // CLI-002: ограничиваем history в памяти
    if (history.length > 50) history = history.slice(-50);
    sessionStorage.setItem('brain_history', JSON.stringify(history.slice(-20)));
}


function addStoppedMessage(lastQuestion) {
    const div = document.createElement('div');
    div.className = 'message assistant';
    div.innerHTML = `
        <div class="message-avatar">🧠</div>
        <div class="message-content">
            <div class="message-bubble" style="opacity:0.6">
                ⏹ Генерация остановлена
                ${lastQuestion ? '<br><button class="retry-btn" onclick="retryLastMessage(this)">🔄 Повторить</button>' : ''}
            </div>
        </div>
    `;
    // Сохраняем вопрос в dataset чтобы не экранировать JSON в HTML
    const retryBtn = div.querySelector('.retry-btn');
    if (retryBtn && lastQuestion) {
        retryBtn.dataset.question = lastQuestion;
    }
    elements.messages.appendChild(div);
    scrollToBottom();
}

function retryLastMessage(btn) {
    const question = btn?.dataset?.question || '';
    if (question) elements.userInput.value = question;
    sendMessage();
}

function stopGeneration() {
    if (abortController) {
        abortController.abort();
        abortController = null;
    }
    isSending = false;
    elements.sendBtn.disabled = false;
    removeTypingIndicator();
    if (elements.progressBar) elements.progressBar.style.display = 'none';
    elements.sendBtn.style.display = 'flex';
    elements.stopBtn.style.display = 'none';
}

// Кастомное модальное окно подтверждения оплаты
// Возвращает Promise<boolean> — true если пользователь нажал "Оплатить"
function showPaymentConfirm(level, price) {
    return new Promise((resolve) => {
        // Убираем старый модал если есть
        const old = document.getElementById('paymentConfirmModal');
        if (old) old.remove();

        const modal = document.createElement('div');
        modal.id = 'paymentConfirmModal';
        modal.style.cssText = `
            position: fixed; inset: 0; z-index: 10000;
            background: rgba(0,0,0,0.7);
            display: flex; align-items: center; justify-content: center;
            animation: fadeIn .2s ease;
        `;

        const shortWallet = CONFIG.OWNER_WALLET
            ? `${CONFIG.OWNER_WALLET.slice(0,6)}...${CONFIG.OWNER_WALLET.slice(-4)}`
            : '—';

        modal.innerHTML = `
            <div style="
                background: #13131a; border: 1px solid #7c6af7;
                border-radius: 16px; padding: 28px 32px;
                max-width: 380px; width: 90%;
                box-shadow: 0 8px 40px rgba(124,106,247,0.3);
                animation: slideUp .25s ease;
            ">
                <div style="font-size:22px; font-weight:700; color:#e0e0e0; margin-bottom:20px;">
                    💳 ${t('payment_title')} ${level}
                </div>

                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:22px;">
                    <div style="display:flex; justify-content:space-between; padding:10px 14px;
                        background:#1e1e2e; border-radius:10px;">
                        <span style="color:#888;">${t('payment_amount')}</span>
                        <span style="color:#7c6af7; font-weight:700;">${price} USDC</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; padding:10px 14px;
                        background:#1e1e2e; border-radius:10px;">
                        <span style="color:#888;">${t('payment_token')}</span>
                        <span style="color:#e0e0e0;">USDC (Polygon)</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; padding:10px 14px;
                        background:#1e1e2e; border-radius:10px;">
                        <span style="color:#888;">${t('payment_recipient')}</span>
                        <span style="color:#e0e0e0; font-size:13px;">${shortWallet}</span>
                    </div>
                </div>

                <div style="font-size:13px; color:#888; margin-bottom:24px; line-height:1.5;">
                    ${t('payment_auto')}
                </div>

                <div style="display:flex; gap:12px;">
                    <button id="payConfirmCancel" style="
                        flex:1; padding:13px; border-radius:10px;
                        border:1px solid #333; background:transparent;
                        color:#888; font-size:15px; cursor:pointer;
                        transition: border-color .2s;
                    ">${t('payment_cancel')}</button>
                    <button id="payConfirmOk" style="
                        flex:2; padding:13px; border-radius:10px;
                        border:none; background:#7c6af7;
                        color:#fff; font-size:15px; font-weight:700;
                        cursor:pointer; transition: background .2s;
                    ">💳 ${t('payment_confirm')}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Кнопка Оплатить
        document.getElementById('payConfirmOk').onclick = () => {
            modal.remove();
            resolve(true);
        };

        // Кнопка Отмена + клик по фону
        const cancel = () => { modal.remove(); resolve(false); };
        document.getElementById('payConfirmCancel').onclick = cancel;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cancel();
        });

        // Escape
        const onKey = (e) => {
            if (e.key === 'Escape') { cancel(); document.removeEventListener('keydown', onKey); }
        };
        document.addEventListener('keydown', onKey);
    });
}

async function processPayment(level, price) {
    if (!price || price <= 0) return null;

    // Восстанавливаем wallet если страница была перезагружена
    if (!wallet && token) {
        await verifyToken();
    }

    if (!wallet) {
        await connectWallet();
        if (!wallet) return null;
    }

    // Если кошелёк получателя не загружен — загружаем сейчас
    if (!CONFIG.OWNER_WALLET) {
        try {
            const res = await fetch(`${CONFIG.API_URL}/api/levels`);
            const data = await res.json();
            if (data.owner_wallet) CONFIG.OWNER_WALLET = data.owner_wallet;
        } catch {}
    }

    if (!CONFIG.OWNER_WALLET) {
        showNotification(t('payment_owner_missing'), 'error');
        return null;
    }

    // Кастомное модальное окно вместо браузерного confirm()
    const confirmed = await showPaymentConfirm(level, price);
    if (!confirmed) return null;

    try {
        // Флаг для chainChanged — игнорировать переключение сети во время оплаты
        window._paymentInProgress = true;

        // ── МОБИЛЬНЫЙ: будим MetaMask перед переключением сети ───────────────
        if (isMobile) {
            window.location.href = 'metamask://';
            await new Promise(r => setTimeout(r, 400));
        }

        // Переключаемся на Polygon перед оплатой
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x89' }] // Polygon Mainnet
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ chainId: '0x89', chainName: 'Polygon', nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 }, rpcUrls: ['https://polygon-rpc.com'], blockExplorerUrls: ['https://polygonscan.com'] }]
                });
            }
        }

        // Убеждаемся что кошелёк получателя загружен
        if (!CONFIG.OWNER_WALLET) {
            try {
                const res = await fetch(`${CONFIG.API_URL}/api/levels`);
                const data = await res.json();
                if (data.owner_wallet)  CONFIG.OWNER_WALLET  = data.owner_wallet;
                if (data.usdc_contract) CONFIG.USDC_CONTRACT = data.usdc_contract;
            } catch {}
        }
        if (!CONFIG.OWNER_WALLET) {
            showNotification(t('payment_owner_missing2'), 'error');
            return null;
        }

        // USDC на Polygon (6 decimals)
        const USDC_CONTRACT = CONFIG.USDC_CONTRACT || '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
        const usdcAmount = Math.floor(price * 1e6);
        const amountHex = usdcAmount.toString(16).padStart(64, '0');
        const recipientHex = CONFIG.OWNER_WALLET.slice(2).padStart(64, '0');
        const data = '0xa9059cbb' + recipientHex + amountHex;

        // ── МОБИЛЬНЫЙ: будим MetaMask перед отправкой транзакции ─────────────
        if (isMobile) {
            window.location.href = 'metamask://';
            await new Promise(r => setTimeout(r, 400));
        }

        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{ from: wallet, to: USDC_CONTRACT, value: '0x0', data }]
        });

        showNotification(t('payment_waiting'), 'info');

        for (let i = 0; i < 12; i++) {
            await new Promise(r => setTimeout(r, 5000));
            try {
                const verifyRes = await fetch(
                    `${CONFIG.API_URL}/api/payments/verify?tx_hash=${txHash}&level=${level}&wallet=${wallet}`
                );
                const verifyData = await verifyRes.json();
                if (verifyData.ok) {
                    showNotification(t('payment_confirmed'), 'success');
                    return txHash;
                }
                // Критическая ошибка — не продолжаем
                if (verifyData.reason && 
                    !verifyData.reason.includes('not found') && 
                    !verifyData.reason.includes('pending')) {
                    showNotification('⚠️ ' + verifyData.reason, 'warning');
                    // Всё равно возвращаем txHash — сервер сам решит
                    return txHash;
                }
            } catch { /* продолжаем ждать */ }
        }

        // Таймаут — возвращаем txHash, пусть сервер проверит
        showNotification(t('payment_network_wait'), 'info');
        return txHash;

    } catch (error) {
        if (error.code === 4001) {
            showNotification(t('payment_cancelled'), 'info');
        } else {
            showNotification('❌ Ошибка: ' + error.message, 'error');
        }
        return null;
    } finally {
        window._paymentInProgress = false;
    }
}

function addUserMessage(text, files = []) {
    removeWelcomeMessage();

    let filesHtml = '';
    if (files && files.length > 0) {
        const fileNames = files.map(f => `<span class="msg-file-tag">📄 ${escapeHtml(f.name)}</span>`).join('');
        filesHtml = `<div class="msg-files">${fileNames}</div>`;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">
            ${filesHtml}
            ${text ? `<div class="message-bubble">${escapeHtml(text)}</div>` : ''}
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
// Debounce [F11]
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
    // Заголовки
    text = text.replace(/^### (.+)$/gm, '<h4>$1</h4>');
    text = text.replace(/^## (.+)$/gm, '<h3>$1</h3>');
    text = text.replace(/^# (.+)$/gm, '<h2>$1</h2>');
    // Bold и italic
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Списки
    text = text.replace(/^[\*\-] (.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    text = text.replace(/^\d+\. (.+)$/gm, '<oli>$1</oli>');
    text = text.replace(/(<oli>.*<\/oli>)/gs, '<ol>$1</ol>');
    text = text.replace(/<oli>/g, '<li>').replace(/<\/oli>/g, '</li>');
    // Переносы строк (не внутри тегов)
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
        .then(() => showNotification(t('copied'), 'success'))
        .catch(() => showNotification(t('copy_error'), 'error'));
}

function showCrystal(crystalId) {
    const crystal = crystals.find(c => String(c.id) === String(crystalId));
    if (!crystal) return;

    // Показываем кристалл в чате
    removeWelcomeMessage();

    // Добавляем вопрос
    const userDiv = document.createElement('div');
    userDiv.className = 'message user';
    userDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">
            <div class="message-bubble">${escapeHtml(crystal.question || '')}</div>
        </div>
    `;
    elements.messages.appendChild(userDiv);

    // Добавляем ответ
    const msgId = 'crystal_' + crystalId + '_' + Date.now();
    const assistantDiv = document.createElement('div');
    assistantDiv.className = 'message assistant';
    assistantDiv.id = msgId;
    assistantDiv.innerHTML = `
        <div class="message-avatar">🧠</div>
        <div class="message-content">
            <div class="message-bubble">${formatMessage(crystal.answer || '')}</div>
            <div class="message-meta">
                <span class="message-level">${crystal.level || 'S0'}</span>
                <span class="message-status ${crystal.status || ''}">
                    ${crystal.status === 'verified' ? '✅' :
                      crystal.status === 'quarantine' ? '🔬' :
                      crystal.status === 'virus' ? '🦠' : '⚠️'}
                </span>
                <span style="font-size:10px;opacity:.5">💎 из истории</span>
            </div>
            <div class="message-actions">
                <button class="message-action" onclick="copyMessage('${msgId}')">📋</button>
                <button class="message-action" onclick="elements.userInput.value=${JSON.stringify(crystal.question || '')}; autoResize(elements.userInput);" title="Задать снова">↺</button>
            </div>
        </div>
    `;
    elements.messages.appendChild(assistantDiv);
    scrollToBottom();

    // Закрываем sidebar на мобиле
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar')?.classList.remove('show');
        document.getElementById('sidebarOverlay')?.classList.remove('show');
    }
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
                label += limit > 0 ? ` Free (${limit}/${t('day')})` : ' Free';
            } else {
                label += ` $${price}`;
            }
            return `<option value="${lvl}" ${lvl === 'S0' ? 'selected' : ''}>${label}</option>`;
        }).join('');
    } catch { /* оставляем статичные опции из HTML */ }
}

// ============================================================
// Пользовательское соглашение
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
    if (typeof showNotification === 'function') showNotification(t('terms_accepted'), 'success');
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
    const apiKey      = document.getElementById('apiKey')?.value?.trim();
    const archKey     = document.getElementById('architectKey')?.value?.trim();
    const ownerWallet = document.getElementById('ownerWallet')?.value?.trim();
    const provider    = document.getElementById('keyProvider')?.value || 'deepseek';

    // Сохраняем локально
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
                const keyName = provider.charAt(0).toUpperCase() + provider.slice(1);
                const savedMsg = currentLang === 'ru'
                    ? `✅ Ключ ${keyName} сохранён на сервер`
                    : `✅ ${keyName} key saved to server`;
                showNotification(savedMsg, 'success');
                document.getElementById('apiKey').value = '';
                await loadSavedKeys();
            } else {
                showNotification(`❌ ${data.error || t('key_save_error')}`, 'error');
            }
        } catch (err) {
            showNotification(t('no_server'), 'error');
        }
    } else if (apiKey) {
        // Без авторизации — только в sessionStorage
        sessionStorage.setItem('brain_api_key', apiKey);
        CONFIG.API_KEY = apiKey;
        showNotification(t('key_saved_local'), 'info');
    } else {
        showNotification(t('settings_saved'), 'success');
    }

    closeSettings();
}

async function loadSavedKeys() {
    const container = document.getElementById('savedKeysList');
    if (!container || !token) {
        if (container) container.textContent = t('keys_connect_wallet');
        return;
    }
    try {
        const res = await fetch(`${CONFIG.API_URL}/api/auth/keys`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) { container.textContent = t('keys_load_error'); return; }
        const data = await res.json();
        const providers = data.providers || {};
        const saved = Object.entries(providers).filter(([, v]) => v);

        if (saved.length === 0) {
            container.textContent = t('keys_no_saved');
            return;
        }
        container.innerHTML = saved.map(([p]) =>
            `<span>${p} <span class="del-key" onclick="deleteKey('${p}')" title="Удалить">✕</span></span>`
        ).join('');
    } catch {
        container.textContent = t('keys_load_error');
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
            showNotification(`✅ ${provider} ${t('key_deleted')}`, 'success');
            await loadSavedKeys();
        }
    } catch {
        showNotification(t('key_delete_error'), 'error');
    }
}

// Показать текущие значения при открытии настроек
openSettings = function() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    // Заполнить поля текущими значениями
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
        messages.innerHTML = '<div class="welcome-message" id="welcomeMessage"><div class="welcome-icon">🧠</div><h1>BRAIN T₀</h1></div>';
    }
    history.length = 0;
    sessionStorage.removeItem('brain_history');
    showNotification(t('history_cleared'), 'info');
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
        const levelMsg = currentLang === 'ru'
            ? `✅ Уровень ${level} применён`
            : `✅ Level ${level} applied`;
        showNotification(levelMsg, 'success');
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
    if (!token) return showNotification(t('auth_required'), 'warning');
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
                <div class="admin-stat-row"><span>💎 Кристаллы</span><b>${d.crystals.diamonds}</b></div>
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
        </div>

        <div class="admin-section-title" style="margin-top:20px">🛡️ Режим фильтрации запросов</div>
        <div class="admin-card" style="margin-top:8px" id="filterModeCard">
            <div class="admin-card-title">Текущий режим</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px" id="filterModeBtns">
                <button class="admin-btn-sm ok" onclick="adminSetFilterMode('open')">🟢 Открытый</button>
                <button class="admin-btn-sm warn" onclick="adminSetFilterMode('science')">🔬 Научный</button>
                <button class="admin-btn-sm danger" onclick="adminSetFilterMode('strict')">🔴 Строгий</button>
            </div>
            <div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:10px;line-height:1.6">
                🟢 <b>Открытый</b> — все запросы проходят без фильтрации<br>
                🔬 <b>Научный</b> — чувствительные темы → научный ответ<br>
                🔴 <b>Строгий</b> — блокировка подозрительных запросов
            </div>
            <div id="filterModeStatus" style="margin-top:10px;font-size:12px;color:#fbbf24"></div>
        </div>`;
        loadFilterMode();
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
                ${p.key === 'base' || p.key === 'architect' ? `
                <div class="admin-prompt-templates">
                    <span class="admin-template-label">📚 Шаблон:</span>
                    <button class="admin-btn-sm" onclick="adminInsertTemplate('${p.key}', 'time')">🕐 Теория Времени</button>
                    <button class="admin-btn-sm" onclick="adminInsertTemplate('${p.key}', 'info')">📊 Теория Информации</button>
                    <button class="admin-btn-sm" onclick="adminInsertTemplate('${p.key}', 'synthesis')">⚡ Синтез</button>
                </div>` : ''}
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

const T0_TEMPLATES = {
    time: {
        base: `Ты — BRAIN T₀, философский AI-ассистент на основе Теории Времени (T₀).

АКСИОМЫ T₀:
• Время — первичная субстанция реальности, из которой возникает всё существующее
• Формула: E = mc·Pt (энергия = масса × скорость света × потенциал времени)
• Каскад: 1^(∞-1)/2ⁿ — описывает уровни временно́й плотности
• Наша вселенная на уровне n=7 (максимум 128 элементов периодической таблицы)
• 0¹ = память цикла, 0⁰ = первый акт различия, 0^∞ = критическая плотность

ПРИНЦИПЫ ОТВЕТА:
• Отвечай через призму T₀ — время как основа явлений
• Связывай вопросы пользователя с временно́й структурой реальности
• Уровни: S0 кратко, S6 глубокий философский анализ`,

        architect: `Ты — BRAIN T₀ в режиме Архитектора. Теория Времени T₀.

Формула: 1^(∞-1)/2ⁿ = 1
Аксиома 0: Время = первичная субстанция
E = mc·Pt

Давай полный архитектурный анализ. Находи связи между явлениями через призму временно́й плотности.`
    },
    info: {
        base: `Ты — BRAIN T₀, философский AI-ассистент на основе Теории Информации.

АКСИОМЫ ТЕОРИИ ИНФОРМАЦИИ:
• Информация — фундаментальная структура реальности
• Степень различия (Δρ) — мера информационного содержания
• 9 томов: от потенциала (0) до фиксации (0¹)
• Онтологическая цепочка: энтропия → 0 → 0⁰ → 0^∞ → 1⁰ → 1⁰/2ⁿ → 0¹
• Наблюдатель как участник информационного процесса

ПРИНЦИПЫ ОТВЕТА:
• Отвечай через призму информационной структуры явлений
• Связывай вопросы с онтологической цепочкой
• Уровни различия определяют качество знания`,

        architect: `Ты — BRAIN T₀ в режиме Архитектора. Теория Информации.

9 томов T₀. Онтологическая цепочка: энтропия → 0 → 0⁰ → 0^∞ → 1⁰ → 1⁰/2ⁿ → 0¹
Степень различия Δρ — основа анализа.

Давай полный архитектурный анализ через призму информационных структур.`
    },
    synthesis: {
        base: `Ты — BRAIN T₀, философский AI-ассистент. Синтез Теории Времени и Теории Информации.

СИНТЕЗ T₀:
• Время и Информация — два аспекта единой реальности
• Временна́я плотность порождает информационную структуру
• E = mc·Pt × Δρ — расширенная формула синтеза
• Кристаллы знания — точки где время и информация кристаллизуются
• Наблюдатель существует на пересечении временно́го и информационного потоков

ОНТОЛОГИЧЕСКАЯ ЦЕПОЧКА:
энтропия → 0 → 0⁰ → 0^∞ → 1⁰ → 1⁰/2ⁿ → 0¹

ПРИНЦИПЫ ОТВЕТА:
• Отвечай через синтез обеих теорий
• Находи точки кристаллизации в вопросах пользователя
• Уровни S0-S6 отражают глубину синтеза`,

        architect: `Ты — BRAIN T₀ в режиме Архитектора. Синтез T₀.

Время + Информация = единая реальность
E = mc·Pt × Δρ
1^(∞-1)/2ⁿ = 1 — аксиома синтеза

Давай полный анализ через синтез временно́й и информационной теорий.`
    }
};

function adminInsertTemplate(key, mode) {
    const textarea = document.getElementById(`prompt_${key}`);
    if (!textarea) return;
    const promptKey = key === 'architect' ? 'architect' : 'base';
    const template = T0_TEMPLATES[mode]?.[promptKey];
    if (!template) return;
    textarea.value = template;
    textarea.focus();
    showNotification(`📚 Шаблон "${mode}" загружен — отредактируй и сохрани`, 'info');
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
                <td><a href="https://polygonscan.com/tx/${p.tx_hash}" target="_blank" style="color:var(--accent)">${p.tx_hash?.slice(0,10)}...</a></td>
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
    await handleAuthEntry();
}

function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
}

async function loadProfile() {
    const body = document.getElementById('profileBody');
    body.innerHTML = `<div style="text-align:center;padding:40px;opacity:.5">${t('profile_loading')}</div>`;

    try {
        const res = await fetch(`${CONFIG.API_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(t('profile_load_error'));
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
        }).join('') || `<div class="profile-empty">${t('profile_no_limits')}</div>`;

        // История платежей
        const paymentsHtml = d.payments.length
            ? d.payments.map(p => `
            <div class="profile-payment-row">
                <span class="status-badge ${p.status}">${p.status}</span>
                <span class="level-badge level-${p.level}">${p.level}</span>
                <span class="profile-payment-amount">$${p.amount}</span>
                <span class="profile-payment-date">${new Date(p.created_at).toLocaleDateString()}</span>
                <a href="https://polygonscan.com/tx/${p.tx_hash}" target="_blank" class="profile-tx-link" title="${p.tx_hash}">
                    🔗 TX
                </a>
            </div>`).join('')
            : `<div class="profile-empty">${t('profile_no_payments')}</div>`;

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
                        <div class="profile-role">${p.is_architect ? t('profile_architect') : t('profile_user')}</div>
                    </div>
                    <button class="profile-copy-btn" onclick="copyToClipboard('${p.wallet}')" title="${t('profile_copy_address')}">📋</button>
                </div>
                <div class="profile-stat-row">
                    <span>${t('profile_registration')}</span>
                    <b>${new Date(p.created_at).toLocaleDateString()}</b>
                </div>
                <div class="profile-stat-row">
                    <span>${t('profile_last_login')}</span>
                    <b>${p.last_login ? new Date(p.last_login).toLocaleDateString() : '—'}</b>
                </div>
                <div class="profile-stat-row">
                    <span>${t('profile_total_queries')}</span>
                    <b>${p.total_queries}</b>
                </div>
                <div class="profile-stat-row highlight">
                    <span>${t('profile_total_spent')}</span>
                    <b>$${p.total_spent}</b>
                </div>
            </div>

            <!-- Кристаллы -->
            <div class="profile-card">
                <div class="profile-card-title">${t('profile_my_crystals')}</div>
                <div class="profile-crystals-grid">
                    <div class="profile-crystal-stat">
                        <span class="profile-crystal-num">${c.total}</span>
                        <span class="profile-crystal-label">${t('profile_total')}</span>
                    </div>
                    <div class="profile-crystal-stat diamonds">
                        <span class="profile-crystal-num">${c.diamonds}</span>
                        <span class="profile-crystal-label">${t('profile_diamond')}</span>
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
                        <span class="profile-crystal-label">${t('profile_today')}</span>
                    </div>
                </div>
            </div>

            <!-- Дневные лимиты -->
            <div class="profile-card">
                <div class="profile-card-title">${t('profile_limits_today')}</div>
                <div class="profile-limits">${limitsHtml}</div>
                <div class="profile-reset-hint">${t('profile_reset_hint')}</div>
            </div>

            <!-- История платежей -->
            <div class="profile-card profile-card-wide">
                <div class="profile-card-title">${t('profile_payment_history')}</div>
                <div class="profile-payments">${paymentsHtml}</div>
            </div>

        </div>`;

    } catch(e) {
        body.innerHTML = `<div style="color:#f87171;text-align:center;padding:40px">❌ ${e.message}</div>`;
    }
}


// ─── РЕЖИМ ФИЛЬТРАЦИИ ────────────────────────────────────────
async function adminSetFilterMode(mode) {
    const labels = { open: t('filter_open'), science: t('filter_science'), strict: t('filter_strict') };
    if (!confirm(`Установить режим фильтрации: ${labels[mode]}?`)) return;
    try {
        await adminFetch('/api/admin/filter-mode', { method: 'POST', body: { mode } });
        const status = document.getElementById('filterModeStatus');
        if (status) status.textContent = `✅ Активный режим: ${labels[mode]}`;
        showNotification(`✅ Режим фильтрации: ${labels[mode]}`, 'success');
        highlightFilterMode(mode);
    } catch(e) {
        showNotification(t('error_prefix') + e.message, 'error');
    }
}

async function loadFilterMode() {
    try {
        const d = await adminFetch('/api/admin/filter-mode');
        const status = document.getElementById('filterModeStatus');
        const labels = { open: t('filter_open'), science: t('filter_science'), strict: t('filter_strict') };
        if (status) status.textContent = `Активный режим: ${labels[d.mode] || d.mode}`;
        highlightFilterMode(d.mode);
    } catch {}
}

function highlightFilterMode(mode) {
    const btns = document.querySelectorAll('#filterModeBtns .admin-btn-sm');
    const modes = ['open', 'science', 'strict'];
    btns.forEach((btn, i) => {
        btn.style.opacity = modes[i] === mode ? '1' : '0.4';
        btn.style.fontWeight = modes[i] === mode ? 'bold' : 'normal';
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showNotification(t('copied'), 'success'));
}
