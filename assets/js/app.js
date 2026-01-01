(function () {
    const baseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const faAlphabet = [
        '\u0622', '\u0627', '\u0628', '\u067e', '\u062a', '\u062b', '\u062c', '\u0686',
        '\u062d', '\u062e', '\u062f', '\u0630', '\u0631', '\u0632', '\u0698', '\u0633',
        '\u0634', '\u0635', '\u0636', '\u0637', '\u0638', '\u0639', '\u063a', '\u0641',
        '\u0642', '\u06a9', '\u06af', '\u0644', '\u0645', '\u0646', '\u0648', '\u0647',
        '\u06cc', '\u0621', '\u0623', '\u0625', '\u0671', '\u0624', '\u0626', '\u0629',
        '\u06c0', '\u0649', '\u064a', '\u06d5', '\u06c2', '\u06c6', '\u06c7', '\u06c8',
        '\u06c9', '\u06d0', '\u06cd', '\u06ce', '\u06a4', '\u06a6', '\u06a7', '\u06a8',
        '\u06ac', '\u06ad', '\u06b3', '\u06b7', '\u06b5', '\u06b8', '\u06b9', '\u06ba'
    ];

    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const hasWebCrypto = typeof crypto !== 'undefined' && !!crypto.subtle && window.isSecureContext;
    let installedVersion = localStorage.getItem('mixer_installed_version') || '';
    let installedVid = localStorage.getItem('mixer_installed_vid') || localStorage.getItem('mixer_installed_uuid') || '';
    let latestVersionInfo = null;
    let updateAvailable = false;
    const VERSION_CACHE_KEY = 'mixer_latest_version_info';
    const ALERT_CACHE_KEY = 'mixer_latest_alert_info';
    const ALERT_DISMISS_KEY = 'mixer_alert_dismissed_aid';
    let alertInfo = null;
    let dismissedAlertAid = localStorage.getItem(ALERT_DISMISS_KEY) || '';
    let alertCheckInFlight = null;
    let lastAlertCheck = 0;
    const ALERT_CHECK_INTERVAL = 30000;
    let updateCheckInFlight = null;
    let lastUpdateCheck = 0;
    const UPDATE_CHECK_INTERVAL = 30000;

    const faToIndexMap = {};
    faAlphabet.forEach((ch, idx) => {
        faToIndexMap[ch] = idx;
    });

    let currentLang = localStorage.getItem('mixer_lang') || 'fa';
    let currentTheme = localStorage.getItem('mixer_theme') || 'dark';
    let pinRecord = loadStoredPin();
    let lockSatisfied = !pinRecord;
    let lastEnteredPin = '';
    let currentPassword = pinRecord ? '' : (localStorage.getItem('mixer_password') || '');
    let chunkingEnabled = (localStorage.getItem('mixer_chunking') || 'off') !== 'off';
    let lastPasswordState = !!currentPassword;
    let panicHoldTimer = null;
    let panicHoldInterval = null;
    let panicRemaining = 0;
    let refreshHoldTimer = null;
    let refreshHoldInterval = null;
    let refreshRemaining = 0;
    let refreshInProgress = false;
    let connectionWatchTimer = null;
    const STATUS_ONLINE = 'online';
    const STATUS_OFFLINE = 'offline';
    const STATUS_NATIONAL = 'national';
    const PRIMARY_CHECK_URL = 'https://github.com/';
    const NATIONAL_CHECK_URL = 'https://www.aparat.com/';
    let lastKnownStatus = navigator.onLine !== false ? STATUS_ONLINE : STATUS_OFFLINE;
    let statusCheckInFlight = null;
    let lastStatusCheck = 0;
    const STATUS_CHECK_INTERVAL = 8000;
    let unlockInProgress = false;
    let failedPinAttempts = 0;
    let currentChunks = [];
    let lastChunkView = 'single';

    function getTranslations(lang) {
        return lang === 'fa' ? window.langFa : window.langEn;
    }

    function t(key, vars) {
        const primary = getTranslations(currentLang) || {};
        const fallback = window.langEn || {};
        let text = primary[key] || fallback[key] || '';
        if (vars) {
            Object.keys(vars).forEach((k) => {
                text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
            });
        }
        return text;
    }

    function formatTemplate(text, vars) {
        let out = text || '';
        if (vars) {
            Object.keys(vars).forEach((k) => {
                out = out.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
            });
        }
        return out;
    }

    function getLocalizedValue(value) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[currentLang] || value.fa || value.en || '';
    }

    function compareVersions(a, b) {
        const left = String(a || '').split('.').map((part) => parseInt(part, 10));
        const right = String(b || '').split('.').map((part) => parseInt(part, 10));
        const len = Math.max(left.length, right.length);
        for (let i = 0; i < len; i++) {
            const l = Number.isFinite(left[i]) ? left[i] : 0;
            const r = Number.isFinite(right[i]) ? right[i] : 0;
            if (l > r) return 1;
            if (l < r) return -1;
        }
        return 0;
    }

    function toEnglishDigits(input) {
        return input
            .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06F0))
            .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));
    }

    function toPersianDigits(input) {
        return input.replace(/\d/g, (d) => String.fromCharCode(0x06F0 + (d.charCodeAt(0) - 48)));
    }

    function weakHashPin(pin, saltBytes) {
        let hash = 2166136261 >>> 0;
        for (let i = 0; i < pin.length; i++) {
            hash ^= pin.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        for (let i = 0; i < saltBytes.length; i++) {
            hash ^= saltBytes[i];
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function updateVersionDisplay() {
        const el = document.getElementById('version-value');
        if (!el) return;
        const value = installedVersion || latestVersionInfo?.version || '';
        if (!value) {
            el.textContent = '--';
            return;
        }
        el.textContent = currentLang === 'fa' ? toPersianDigits(value) : value;
    }

    function readCachedJson(key) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const data = JSON.parse(raw);
            return data && typeof data === 'object' ? data : null;
        } catch (e) {
            return null;
        }
    }

    function cacheVersionInfo(info) {
        try {
            if (info) {
                localStorage.setItem(VERSION_CACHE_KEY, JSON.stringify(info));
            } else {
                localStorage.removeItem(VERSION_CACHE_KEY);
            }
        } catch (e) {}
    }

    function cacheAlertInfo(info) {
        try {
            if (info) {
                localStorage.setItem(ALERT_CACHE_KEY, JSON.stringify(info));
            } else {
                localStorage.removeItem(ALERT_CACHE_KEY);
            }
        } catch (e) {}
    }

    function loadCachedVersionInfo() {
        const info = readCachedJson(VERSION_CACHE_KEY);
        if (!info || !info.version) return;
        latestVersionInfo = info;
        const storedVersion = localStorage.getItem('mixer_installed_version') || '';
        const storedVid = localStorage.getItem('mixer_installed_vid') || localStorage.getItem('mixer_installed_uuid');
        installedVersion = storedVersion;
        installedVid = storedVid || '';
        if (!storedVersion) return;
        const versionChanged = compareVersions(info.version, installedVersion) > 0;
        const vidChanged = !!(info.vid && installedVid && info.vid !== installedVid);
        updateAvailable = versionChanged || vidChanged;
    }

    function loadCachedAlertInfo() {
        const info = readCachedJson(ALERT_CACHE_KEY);
        if (!info) return;
        alertInfo = info;
    }

    function bytesToBase64Url(bytes) {
        let binary = '';
        bytes.forEach((b) => {
            binary += String.fromCharCode(b);
        });
        let b64 = btoa(binary);
        b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
        return b64;
    }

    function base64UrlToBytes(str) {
        let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
    }

    function utf8ToBase64Url(str) {
        return bytesToBase64Url(enc.encode(str));
    }

    function base64UrlToUtf8(str) {
        return dec.decode(base64UrlToBytes(str));
    }

    const identityPerm = Array.from({ length: baseAlphabet.length }, (_, i) => i);

    function makePermutation(seed) {
        const arr = Array.from({ length: baseAlphabet.length }, (_, i) => i);
        let state = seed >>> 0;
        for (let i = arr.length - 1; i > 0; i--) {
            state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
            const j = state % (i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function permutationFromPassword(pwd) {
        if (!pwd) return identityPerm;
        let hash = 2166136261 >>> 0; // FNV-1a 32bit
        for (let i = 0; i < pwd.length; i++) {
            hash ^= pwd.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        const seed = hash >>> 0 || 1;
        return makePermutation(seed);
    }

    function inversePermutation(perm) {
        const inv = new Array(perm.length);
        for (let i = 0; i < perm.length; i++) {
            inv[perm[i]] = i;
        }
        return inv;
    }

    function toPersianAlphabet(str, perm = identityPerm) {
        let out = '';
        for (const ch of str) {
            const idx = baseAlphabet.indexOf(ch);
            if (idx === -1) throw new Error('INVALID_ALPHABET');
            out += faAlphabet[perm[idx]];
        }
        return out;
    }

    function fromPersianAlphabet(str, invPerm = identityPerm) {
        const compact = str.replace(/\s+/g, '');
        let out = '';
        for (const ch of compact) {
            const idx = faToIndexMap[ch];
            if (idx === undefined) throw new Error('INVALID_ALPHABET');
            const baseIdx = invPerm[idx];
            out += baseAlphabet[baseIdx];
        }
        return out;
    }

    function randomBytes(len) {
        const arr = new Uint8Array(len);
        if (crypto?.getRandomValues) {
            crypto.getRandomValues(arr);
        } else {
            for (let i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
    }

    function randomBaseChars(len) {
        let result = '';
        for (let i = 0; i < len; i++) {
            const idx = Math.floor(Math.random() * baseAlphabet.length);
            result += baseAlphabet[idx];
        }
        return result;
    }

    async function deriveKey(password, salt) {
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            enc.encode(password),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt,
                iterations: 120000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async function encryptWithPassword(text, password) {
        const salt = randomBytes(12);
        const iv = randomBytes(12);
        const key = await deriveKey(password, salt);
        const cipherBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            enc.encode(text)
        );
        const cipher = new Uint8Array(cipherBuffer);
        const payload = new Uint8Array(1 + salt.length + iv.length + cipher.length);
        let offset = 0;
        payload[offset++] = 1;
        payload.set(salt, offset);
        offset += salt.length;
        payload.set(iv, offset);
        offset += iv.length;
        payload.set(cipher, offset);
        const b64 = bytesToBase64Url(payload);
        const perm = permutationFromPassword(password);
        return toPersianAlphabet(b64, perm);
    }

    async function decryptWithPassword(text, password) {
        const perm = permutationFromPassword(password);
        const inv = inversePermutation(perm);
        const b64 = fromPersianAlphabet(text, inv);
        const bytes = base64UrlToBytes(b64);
        if (bytes[0] !== 1) throw new Error('BAD_VERSION');
        let offset = 1;
        const salt = bytes.slice(offset, offset + 12);
        offset += 12;
        const iv = bytes.slice(offset, offset + 12);
        offset += 12;
        const cipher = bytes.slice(offset);
        const key = await deriveKey(password, salt);
        const plainBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            cipher
        );
        return dec.decode(plainBuffer);
    }

    function encodeWithoutPassword(text) {
        const body = utf8ToBase64Url(text);
        const prefixLen = 3 + Math.floor(Math.random() * 3);
        const suffixLen = 3 + Math.floor(Math.random() * 3);
        const prefix = randomBaseChars(prefixLen);
        const suffix = randomBaseChars(suffixLen);

        const totalLen = 3 + prefixLen + body.length + suffixLen;
        const bytes = new Uint8Array(totalLen);

        let offset = 0;
        bytes[offset++] = 0;
        bytes[offset++] = prefixLen;
        bytes[offset++] = suffixLen;
        for (const ch of prefix) bytes[offset++] = ch.charCodeAt(0);
        for (const ch of body) bytes[offset++] = ch.charCodeAt(0);
        for (const ch of suffix) bytes[offset++] = ch.charCodeAt(0);

        const b64 = bytesToBase64Url(bytes);
        return toPersianAlphabet(b64, identityPerm);
    }

    function decodeWithoutPassword(text) {
        const b64 = fromPersianAlphabet(text, identityPerm);
        const bytes = base64UrlToBytes(b64);
        if (bytes[0] !== 0) throw new Error('BAD_VERSION');
        const prefixLen = bytes[1];
        const suffixLen = bytes[2];
        const start = 3 + prefixLen;
        const end = bytes.length - suffixLen;
        if (start < 3 || end < start) throw new Error('BAD_LAYOUT');
        let body = '';
        for (let i = start; i < end; i++) body += String.fromCharCode(bytes[i]);
        return base64UrlToUtf8(body);
    }

    async function doEncode() {
        const inputEl = document.getElementById('input-send');
        const outputEl = document.getElementById('output-send');
        if (!inputEl || !outputEl) return;

        const text = inputEl.value || '';
        if (!text) {
            outputEl.value = '';
            updateCharCounter(0);
            return;
        }

        try {
            let encoded;
            const pwd = currentPassword.trim();
            if (pwd) {
                encoded = await encryptWithPassword(text, pwd);
            } else {
                encoded = encodeWithoutPassword(text);
            }
            outputEl.value = encoded;
            renderChunks(encoded);
            updateCharCounter(encoded.length);
        } catch (err) {
            outputEl.value = '';
            updateCharCounter(0);
            showToast(t('toast_encode_failed'));
        }
    }

    async function doDecode() {
        const inputEl = document.getElementById('input-receive');
        const outputEl = document.getElementById('output-receive');
        if (!inputEl || !outputEl) return;

        const text = (inputEl.value || '').trim();
        if (!text) {
            outputEl.value = '';
            return;
        }

        try {
            let decoded;
            const pwd = currentPassword.trim();
            if (pwd) {
                decoded = await decryptWithPassword(text, pwd);
            } else {
                decoded = decodeWithoutPassword(text);
            }
            outputEl.value = decoded;
        } catch (err) {
            outputEl.value = '';
            showToast(t('toast_decode_failed'));
        }
    }

    function renderChunks(encoded) {
        const outputWrap = document.getElementById('output-area-send');
        const copyWrap = document.getElementById('copy-send-wrapper');
        const chunkWrapper = document.getElementById('chunk-wrapper');
        const chunkList = document.getElementById('chunk-list');
        currentChunks = [];
        if (!chunkWrapper || !chunkList) return;

        if (!chunkingEnabled || encoded.length <= 201) {
            if (outputWrap) outputWrap.style.display = '';
            if (copyWrap) copyWrap.style.display = '';
            chunkWrapper.style.display = 'none';
            return;
        }

        currentChunks = [];
        for (let i = 0; i < encoded.length; i += 201) {
            currentChunks.push(encoded.slice(i, i + 201));
        }

        chunkList.innerHTML = '';
        currentChunks.forEach((chunk, idx) => {
            const item = document.createElement('div');
            item.className = 'chunk-item';
            const text = document.createElement('div');
            text.className = 'chunk-text';
            text.textContent = chunk;
            const btn = document.createElement('button');
            btn.className = 'chunk-copy';
            btn.textContent = t('chunk_copy', { num: idx + 1 });
            btn.onclick = () => copyChunk(idx);
            item.appendChild(text);
            item.appendChild(btn);
            chunkList.appendChild(item);
        });

        if (outputWrap) outputWrap.style.display = 'none';
        if (copyWrap) copyWrap.style.display = 'none';
        chunkWrapper.style.display = 'block';
    }

    function updateCharCounter(len) {
        const el = document.getElementById('char-counter');
        if (!el) return;
        el.textContent = `${len}/201`;
        el.classList.remove('grey', 'orange', 'red');
        if (len > 201) {
            el.classList.add('red');
        } else if (len > 140) {
            el.classList.add('orange');
        } else {
            el.classList.add('grey');
        }
    }

    async function updatePassword(value) {
        const prevHadPassword = !!currentPassword;
        const normalized = toEnglishDigits(value || '');
        currentPassword = normalized;

        if (pinRecord && lockSatisfied && lastEnteredPin) {
            localStorage.removeItem('mixer_password');
            if (currentPassword) {
                try {
                    const encPwd = await encryptSecretWithPin(lastEnteredPin, currentPassword);
                    localStorage.setItem('mixer_password_enc', encPwd);
                } catch (e) {
                    console.error(e);
                }
            } else {
                localStorage.removeItem('mixer_password_enc');
            }
        } else if (!pinRecord) {
            if (currentPassword) localStorage.setItem('mixer_password', currentPassword);
            else localStorage.removeItem('mixer_password');
            localStorage.removeItem('mixer_password_enc');
        } else {
            localStorage.removeItem('mixer_password');
            localStorage.removeItem('mixer_password_enc');
        }

        const nowHasPassword = !!currentPassword;
        if (nowHasPassword && !prevHadPassword) {
            showToast(t('toast_password_set'));
        } else if (!nowHasPassword && prevHadPassword) {
            showToast(t('toast_password_disabled'));
        }
        lastPasswordState = nowHasPassword;

        updatePasswordWarning();
        doEncode();
    }

    function updatePasswordWarning() {
        const warn = document.getElementById('password-warning');
        if (!warn) return;
        warn.style.display = currentPassword.trim() ? 'none' : 'block';
    }

    function setUpdateBanner(message) {
        const banners = document.querySelectorAll('[data-update-banner]');
        banners.forEach((banner) => {
            if (!message) {
                banner.textContent = '';
                banner.style.display = 'none';
            } else {
                banner.textContent = message;
                banner.style.display = 'block';
            }
        });
    }

    function buildUpdateMessage(info) {
        const rawVersion = info.version || '';
        const displayVersion = currentLang === 'fa' ? toPersianDigits(rawVersion) : rawVersion;
        const vars = { version: displayVersion };
        const hasLegacy = typeof info.message !== 'undefined';
        const rawTitle = hasLegacy ? (info.title || info.description) : info.title;
        const rawDesc = hasLegacy ? info.message : info.description;
        const titleText = formatTemplate(getLocalizedValue(rawTitle), vars).trim();
        const descText = formatTemplate(getLocalizedValue(rawDesc), vars).trim();
        return [titleText, descText].filter(Boolean).join('\n').trim();
    }

    function renderUpdateBanner() {
        if (!latestVersionInfo || !updateAvailable) {
            setUpdateBanner('');
            return;
        }
        setUpdateBanner(buildUpdateMessage(latestVersionInfo));
    }

    function updateAlertDismissLabels() {
        const label = t('alert_dismiss');
        document.querySelectorAll('[data-alert-dismiss]').forEach((btn) => {
            btn.setAttribute('aria-label', label);
            btn.setAttribute('title', label);
        });
    }

    function setAlertBanner(message) {
        const banners = document.querySelectorAll('[data-alert-banner]');
        banners.forEach((banner) => {
            const msgEl = banner.querySelector('[data-alert-message]');
            if (!message) {
                if (msgEl) msgEl.textContent = '';
                banner.style.display = 'none';
            } else {
                if (msgEl) msgEl.textContent = message;
                banner.style.display = 'flex';
            }
        });
    }

    function buildAlertMessage(info) {
        const title = getLocalizedValue(info.title || info.message);
        const description = getLocalizedValue(info.description);
        const vars = { desc: description || '' };
        const titleText = formatTemplate(title, vars).trim();
        const descText = formatTemplate(description, vars).trim();
        return [titleText, descText].filter(Boolean).join('\n').trim();
    }

    function shouldShowAlert(info) {
        if (!info || !info.aid) return false;
        if (dismissedAlertAid && info.aid === dismissedAlertAid) return false;
        const expires = Number(info.expired);
        if (!Number.isFinite(expires)) return false;
        const nowSec = Math.floor(Date.now() / 1000);
        if (expires <= nowSec) return false;
        const message = buildAlertMessage(info);
        return !!message;
    }

    function renderAlertBanner() {
        updateAlertDismissLabels();
        if (!shouldShowAlert(alertInfo)) {
            setAlertBanner('');
            return;
        }
        setAlertBanner(buildAlertMessage(alertInfo));
    }

    function dismissAlert() {
        if (alertInfo?.aid) {
            dismissedAlertAid = alertInfo.aid;
            localStorage.setItem(ALERT_DISMISS_KEY, dismissedAlertAid);
        }
        setAlertBanner('');
    }

    async function checkAlert(status) {
        const effectiveStatus = status || await checkOnlineStatus();
        if (effectiveStatus !== STATUS_ONLINE) return;
        const now = Date.now();
        if (alertCheckInFlight) return alertCheckInFlight;
        if (now - lastAlertCheck < ALERT_CHECK_INTERVAL) return;
        alertCheckInFlight = (async () => {
            const res = await fetch(`./alert.json?ts=${now}`, { cache: 'no-store' });
            if (!res.ok) {
                if (res.status === 404) {
                    alertInfo = null;
                    cacheAlertInfo(null);
                    renderAlertBanner();
                }
                return;
            }
            const info = await res.json();
            if (info && info.aid) {
                alertInfo = info;
                cacheAlertInfo(info);
            } else {
                alertInfo = null;
                cacheAlertInfo(null);
            }
            renderAlertBanner();
        })()
            .catch((e) => console.error(e))
            .finally(() => {
                lastAlertCheck = Date.now();
                alertCheckInFlight = null;
            });
        return alertCheckInFlight;
    }

    async function checkForUpdate(status) {
        try {
            const effectiveStatus = status || await checkOnlineStatus();
            if (effectiveStatus !== STATUS_ONLINE) return;
            const now = Date.now();
            if (updateCheckInFlight) return updateCheckInFlight;
            if (now - lastUpdateCheck < UPDATE_CHECK_INTERVAL) return;
            updateCheckInFlight = (async () => {
                const res = await fetch(`./version.json?ts=${now}`, { cache: 'no-store' });
                if (!res.ok) {
                    if (res.status === 404) {
                        latestVersionInfo = null;
                        cacheVersionInfo(null);
                        updateAvailable = false;
                        renderUpdateBanner();
                    }
                    return;
                }
                const info = await res.json();
                if (!info || !info.version) return;
                latestVersionInfo = info;
                cacheVersionInfo(info);
                const storedVersion = localStorage.getItem('mixer_installed_version');
                const storedVid = localStorage.getItem('mixer_installed_vid') || localStorage.getItem('mixer_installed_uuid');
                if (!storedVersion) {
                    installedVersion = info.version;
                    installedVid = info.vid || '';
                    localStorage.setItem('mixer_installed_version', installedVersion);
                    if (installedVid) localStorage.setItem('mixer_installed_vid', installedVid);
                    updateAvailable = false;
                    updateVersionDisplay();
                    setUpdateBanner('');
                    return;
                }
                installedVersion = storedVersion;
                installedVid = storedVid || '';
                const versionChanged = compareVersions(info.version, installedVersion) > 0;
                const vidChanged = !!(info.vid && installedVid && info.vid !== installedVid);
                updateAvailable = versionChanged || vidChanged;
                if (!updateAvailable && info.vid && info.vid !== installedVid) {
                    installedVid = info.vid;
                    localStorage.setItem('mixer_installed_vid', installedVid);
                }
                renderUpdateBanner();
                updateVersionDisplay();
            })()
                .catch((e) => console.error(e))
                .finally(() => {
                    lastUpdateCheck = Date.now();
                    updateCheckInFlight = null;
                });
            return updateCheckInFlight;
        } catch (e) {
            console.error(e);
        }
    }

    function probeExternal(url, ts) {
        const sep = url.includes('?') ? '&' : '?';
        return fetch(`${url}${sep}ts=${ts}`, { mode: 'no-cors', cache: 'no-store' })
            .then(() => true)
            .catch(() => false);
    }

    async function checkOnlineStatus() {
        if (navigator.onLine === false) {
            lastKnownStatus = STATUS_OFFLINE;
            return lastKnownStatus;
        }
        const now = Date.now();
        if (statusCheckInFlight) return statusCheckInFlight;
        if (now - lastStatusCheck < STATUS_CHECK_INTERVAL) return lastKnownStatus;
        statusCheckInFlight = (async () => {
            const [primaryOk, nationalOk] = await Promise.all([
                probeExternal(PRIMARY_CHECK_URL, now),
                probeExternal(NATIONAL_CHECK_URL, now)
            ]);
            if (primaryOk) return STATUS_ONLINE;
            if (nationalOk) return STATUS_NATIONAL;
            return STATUS_OFFLINE;
        })()
            .catch(() => STATUS_OFFLINE)
            .finally(() => {
                lastStatusCheck = Date.now();
                statusCheckInFlight = null;
            });
        lastKnownStatus = await statusCheckInFlight;
        return lastKnownStatus;
    }

    async function updateConnectionStatus() {
        const badge = document.getElementById('connection-status');
        if (!badge) return;
        const status = await checkOnlineStatus();
        const onlineText = t('status_online');
        const offlineText = t('status_offline');
        const nationalText = t('status_national');
        const isOnline = status === STATUS_ONLINE;
        const isNational = status === STATUS_NATIONAL;
        badge.textContent = isOnline ? onlineText : (isNational ? nationalText : offlineText);
        badge.classList.toggle('online', isOnline);
        badge.classList.toggle('offline', status === STATUS_OFFLINE);
        badge.classList.toggle('national', isNational);
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.disabled = !isOnline;
            refreshBtn.setAttribute('aria-disabled', String(!isOnline));
        }
        if (isOnline) checkForUpdate(status);
        checkAlert(status);
    }

    function renderFaq(translations) {
        const list = document.getElementById('faq-list');
        if (!list || !translations) return;
        list.innerHTML = '';

        const items = [];
        Object.keys(translations).forEach((key) => {
            const match = /^faq_q(\d+)$/.exec(key);
            if (!match) return;
            const idx = Number(match[1]);
            const question = translations[key];
            const answer = translations[`faq_a${idx}`];
            if (!question || !answer) return;
            items.push({ idx, question, answer });
        });

        items.sort((a, b) => a.idx - b.idx);
        items.forEach(({ question, answer }) => {
            const item = document.createElement('details');
            item.className = 'faq-item';
            const summary = document.createElement('summary');
            summary.textContent = question;
            const body = document.createElement('div');
            body.textContent = answer;
            item.appendChild(summary);
            item.appendChild(body);
            list.appendChild(item);
        });
    }

    function startConnectionWatcher() {
        if (connectionWatchTimer) return;
        updateConnectionStatus();
        connectionWatchTimer = setInterval(updateConnectionStatus, 2000);
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        window.addEventListener('focus', updateConnectionStatus);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) updateConnectionStatus();
        });
        const netInfo = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (netInfo?.addEventListener) {
            netInfo.addEventListener('change', updateConnectionStatus);
        }
    }

    function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register('./sw.js')
            .catch((err) => console.error('Service worker registration failed', err));
    }

    function applyLanguage(lang) {
        const translations = lang === 'fa' ? window.langFa : window.langEn;
        if (!translations) return;
        currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) el.textContent = translations[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[key]) el.placeholder = translations[key];
        });

        const chunkingToggle = document.getElementById('chunking-toggle');
        if (chunkingToggle) updateChunkToggleText(chunkingToggle, chunkingEnabled);
        renderFaq(translations);
        updateVersionDisplay();
        updateConnectionStatus();
        renderUpdateBanner();
        renderAlertBanner();
    }

    function changeLanguage(lang) {
        localStorage.setItem('mixer_lang', lang);
        applyLanguage(lang);
    }

    function applyTheme(theme) {
        const body = document.body;
        if (theme === 'light') {
            body.classList.add('light-mode');
        } else if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            body.classList.toggle('light-mode', !prefersDark);
        } else {
            body.classList.remove('light-mode');
        }
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', body.classList.contains('light-mode') ? '#f2f2f7' : '#0a0a0a');
        }
    }

    function changeTheme(theme) {
        currentTheme = theme;
        localStorage.setItem('mixer_theme', theme);
        applyTheme(theme);
    }

    async function smartPaste(targetId, callback) {
        const el = document.getElementById(targetId);
        if (!el) return;
        el.focus();
        if (navigator.clipboard?.readText) {
            try {
                const text = await navigator.clipboard.readText();
                if (text) {
                    el.value = text;
                    if (typeof callback === 'function') callback();
                    showToast(t('toast_pasted'));
                    return;
                }
                showToast(t('toast_clipboard_empty'));
            } catch {
                showToast(t('toast_paste_manual'));
            }
        } else {
            showToast(t('toast_paste_manual'));
        }
    }

    function copyText(elementId) {
        const el = document.getElementById(elementId);
        if (!el || !el.value) return;
        const msg = t('toast_copied');
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(el.value).then(() => showToast(msg)).catch(() => fallbackCopy(el, msg));
        } else {
            fallbackCopy(el, msg);
        }
    }

    function fallbackCopy(el, msg) {
        el.select();
        el.setSelectionRange(0, 99999);
        try {
            document.execCommand('copy');
            showToast(msg);
        } catch (err) {
            console.error(err);
        }
        window.getSelection().removeAllRanges();
        el.blur();
    }

    function showToast(msg) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function switchTab(event, tabId) {
        enforceLock();
        document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
        const target = document.getElementById(`page-${tabId}`);
        if (target) target.classList.add('active');

        document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
        if (event?.currentTarget) event.currentTarget.classList.add('active');
    }

    function init() {
        const langSelector = document.getElementById('lang-selector');
        const themeSelector = document.getElementById('theme-selector');
        const passwordInput = document.getElementById('password-value');
        const chunkingToggle = document.getElementById('chunking-toggle');
        document.querySelectorAll('[data-alert-dismiss]').forEach((btn) => {
            btn.onclick = dismissAlert;
        });

        if (langSelector) langSelector.value = currentLang;
        if (themeSelector) themeSelector.value = currentTheme;
        if (passwordInput) passwordInput.value = currentPassword;
        if (chunkingToggle) {
            updateChunkToggleText(chunkingToggle, chunkingEnabled);
        }

        loadCachedVersionInfo();
        loadCachedAlertInfo();
        applyLanguage(currentLang);
        applyTheme(currentTheme);
        startConnectionWatcher();
        registerServiceWorker();
        updatePasswordWarning();
        checkForUpdate();
        checkAlert();
        const initialOut = document.getElementById('output-send')?.value || '';
        updateCharCounter(initialOut.length);
        renderChunks(initialOut);
        try { enforceLock(); } catch (e) { console.error(e); lockSatisfied = true; hideLockOverlay(); }

        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                if (currentTheme === 'system') applyTheme('system');
            });
        }
    }

    async function hashPin(pin) {
        const data = enc.encode(pin);
        const digest = await crypto.subtle.digest('SHA-256', data);
        const bytes = new Uint8Array(digest);
        return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    function loadStoredPin() {
        const length = Number(localStorage.getItem('mixer_pin_len')) || 0;
        const v0 = localStorage.getItem('mixer_pin_v0');
        if (!hasWebCrypto && v0 && v0.startsWith('v0:')) {
            try {
                const bytes = base64UrlToBytes(v0.slice(3));
                if (bytes.length >= 12) {
                    const salt = bytes.slice(0, 8);
                    const hash = ((bytes[8] << 24) | (bytes[9] << 16) | (bytes[10] << 8) | bytes[11]) >>> 0;
                    return { version: 0, salt, hash, length };
                }
            } catch (e) { /* ignore parse errors */ }
        }
        const v2 = localStorage.getItem('mixer_pin_v2');
        if (v2 && v2.startsWith('v2:')) {
            try {
                const bytes = base64UrlToBytes(v2.slice(3));
                const salt = bytes.slice(0, 16);
                const hash = bytes.slice(16);
                return { version: 2, salt, hash, length };
            } catch (e) { /* ignore parse errors */ }
        }
        if (v0 && v0.startsWith('v0:')) {
            try {
                const bytes = base64UrlToBytes(v0.slice(3));
                if (bytes.length >= 12) {
                    const salt = bytes.slice(0, 8);
                    const hash = ((bytes[8] << 24) | (bytes[9] << 16) | (bytes[10] << 8) | bytes[11]) >>> 0;
                    return { version: 0, salt, hash, length };
                }
            } catch (e) { /* ignore parse errors */ }
        }
        const legacy = localStorage.getItem('mixer_pin_hash');
        if (legacy) return { version: 1, legacyHash: legacy, length };
        return null;
    }

    async function derivePinHash(pin, salt) {
        const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveBits']);
        const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, keyMaterial, 256);
        return new Uint8Array(bits);
    }

    async function derivePinKey(pin, salt) {
        const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']);
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async function encryptSecretWithPin(pin, secret) {
        const salt = randomBytes(16);
        const iv = randomBytes(12);
        const key = await derivePinKey(pin, salt);
        const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(secret));
        const cipher = new Uint8Array(cipherBuf);
        const payload = new Uint8Array(salt.length + iv.length + cipher.length);
        payload.set(salt);
        payload.set(iv, salt.length);
        payload.set(cipher, salt.length + iv.length);
        return bytesToBase64Url(payload);
    }

    async function decryptSecretWithPin(pin, payloadB64) {
        const bytes = base64UrlToBytes(payloadB64);
        const salt = bytes.slice(0, 16);
        const iv = bytes.slice(16, 28);
        const cipher = bytes.slice(28);
        const key = await derivePinKey(pin, salt);
        const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
        return dec.decode(plainBuf);
    }

    function constTimeEqual(a, b) {
        if (a.length !== b.length) return false;
        let diff = 0;
        for (let i = 0; i < a.length; i++) diff |= (a[i] ^ b[i]);
        return diff === 0;
    }

    function storeWeakPin(inputVal) {
        const salt = randomBytes(8);
        const hash = weakHashPin(inputVal, salt);
        const payload = new Uint8Array(salt.length + 4);
        payload.set(salt);
        payload[salt.length] = (hash >>> 24) & 0xff;
        payload[salt.length + 1] = (hash >>> 16) & 0xff;
        payload[salt.length + 2] = (hash >>> 8) & 0xff;
        payload[salt.length + 3] = hash & 0xff;
        const encoded = 'v0:' + bytesToBase64Url(payload);
        localStorage.setItem('mixer_pin_v0', encoded);
        localStorage.removeItem('mixer_pin_v2');
        localStorage.removeItem('mixer_pin_hash');
        localStorage.removeItem('mixer_password_enc');
        localStorage.setItem('mixer_pin_len', String(inputVal.length));
        pinRecord = { version: 0, salt, hash, length: inputVal.length };
        lockSatisfied = true;
        hideLockOverlay();
        lastEnteredPin = inputVal;
        if (currentPassword) localStorage.setItem('mixer_password', currentPassword);
        showToast(t('toast_lock_enabled'));
    }

    async function updatePinFromSettings(val) {
        const normalized = toEnglishDigits(val || '');
        const inputVal = normalized.replace(/\D/g, '');
        const inputEl = document.getElementById('pin-value');
        if (inputEl) {
            const displayVal = currentLang === 'fa' ? toPersianDigits(inputVal) : inputVal;
            if (inputEl.value !== displayVal) inputEl.value = displayVal;
        }

        if (!inputVal) {
            pinRecord = null;
            lockSatisfied = true;
            lastEnteredPin = '';
            localStorage.removeItem('mixer_pin_v0');
            localStorage.removeItem('mixer_pin_v2');
            localStorage.removeItem('mixer_pin_hash');
            localStorage.removeItem('mixer_password_enc');
            localStorage.removeItem('mixer_pin_len');
            if (currentPassword) localStorage.setItem('mixer_password', currentPassword);
            else localStorage.removeItem('mixer_password');
            hideLockOverlay();
            showToast(t('toast_pin_disabled'));
            return;
        }

        if (inputVal.length < 4) return;

        if (!hasWebCrypto) {
            storeWeakPin(inputVal);
            return;
        }

        try {
            const salt = randomBytes(16);
            const hash = await derivePinHash(inputVal, salt);
            const payload = new Uint8Array(salt.length + hash.length);
            payload.set(salt);
            payload.set(hash, salt.length);
            const encoded = 'v2:' + bytesToBase64Url(payload);
            localStorage.setItem('mixer_pin_v2', encoded);
            localStorage.removeItem('mixer_pin_v0');
            localStorage.removeItem('mixer_pin_hash');
            localStorage.removeItem('mixer_password_enc');
            localStorage.removeItem('mixer_password');
            localStorage.setItem('mixer_pin_len', String(inputVal.length));
            pinRecord = { version: 2, salt, hash, length: inputVal.length };
            lockSatisfied = true;
            hideLockOverlay();
            lastEnteredPin = inputVal;
            if (currentPassword) {
                try {
                    const encPwd = await encryptSecretWithPin(inputVal, currentPassword);
                    localStorage.setItem('mixer_password_enc', encPwd);
                } catch (e) { /* ignore */ }
            }
            showToast(t('toast_lock_enabled'));
        } catch (e) {
            console.error(e);
            storeWeakPin(inputVal);
        }
    }

    function showLockOverlay() {
        const overlay = document.getElementById('lock-overlay');
        if (overlay) {
            overlay.classList.remove('fade-out');
            overlay.classList.remove('error-flash');
            overlay.style.display = 'flex';
        }
        renderKeypad();
    }

    function hideLockOverlay() {
        const overlay = document.getElementById('lock-overlay');
        if (!overlay) return;
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.style.display = 'none';
            overlay.classList.remove('fade-out');
        }, 250);
    }

    async function unlockApp() {
        const input = document.getElementById('unlock-pin');
        if (!input) return;
        if (unlockInProgress) return;
        unlockInProgress = true;
        const pin = toEnglishDigits((input.value || '').trim());
        try {
            if (!pinRecord) {
                lockSatisfied = true;
                hideLockOverlay();
                input.value = '';
                return;
            }
            let ok = false;
            if (!hasWebCrypto && pinRecord.version !== 0) {
                showToast(t('toast_lock_unavailable'));
                pinRecord = null;
                lockSatisfied = true;
                hideLockOverlay();
                input.value = '';
                return;
            }
            if (pinRecord.version === 0) {
                const calc = weakHashPin(pin, pinRecord.salt);
                ok = calc === pinRecord.hash;
            } else if (pinRecord.version === 2) {
                const calc = await derivePinHash(pin, pinRecord.salt);
                ok = constTimeEqual(calc, pinRecord.hash);
            } else if (pinRecord.version === 1) {
                const legacy = await hashPin(pin);
                ok = legacy === pinRecord.legacyHash;
            }

            if (ok) {
                lockSatisfied = true;
                failedPinAttempts = 0;
                hideLockOverlay();
                input.value = '';
                lastEnteredPin = pin;
                const settingsInput = document.getElementById('pin-value');
                if (settingsInput) settingsInput.value = pin;
                try {
                    const storedEnc = localStorage.getItem('mixer_password_enc');
                    const pwdInput = document.getElementById('password-value');
                    if (storedEnc) {
                        const restored = await decryptSecretWithPin(pin, storedEnc);
                        currentPassword = restored;
                        if (pwdInput) pwdInput.value = restored;
                    } else {
                        const plain = localStorage.getItem('mixer_password') || '';
                        currentPassword = plain;
                        if (pwdInput) pwdInput.value = plain;
                    }
                } catch (e) { console.error(e); }
                localStorage.setItem('mixer_pin_len', String(pin.length));
                if (pinRecord) pinRecord.length = pin.length;
                updatePasswordWarning();
                doEncode();
                showToast(t('toast_welcome'));
            } else {
                failedPinAttempts += 1;
                if (failedPinAttempts >= 3) {
                    showToast(t('toast_panic_fail'));
                    panicClear();
                    return;
                }
                showToast(t('toast_pin_wrong', { count: failedPinAttempts, max: 3 }));
                flashLockError();
                deletePinDigit();
            }
        } finally {
            unlockInProgress = false;
        }
    }

    function enforceLock() {
        if (!pinRecord) {
            hideLockOverlay();
            lockSatisfied = true;
            return;
        }
        if (!hasWebCrypto && pinRecord && pinRecord.version !== 0) {
            showToast(t('toast_lock_unavailable'));
            pinRecord = null;
            lockSatisfied = true;
            hideLockOverlay();
            return;
        }
        if (!lockSatisfied) showLockOverlay();
        else hideLockOverlay();
    }

    function pressPinDigit(d) {
        const input = document.getElementById('unlock-pin');
        if (!input) return;
        const targetLen = pinRecord?.length || 4;
        if (input.value.length >= targetLen) return;
        input.value += d;
    }

    function deletePinDigit() {
        const input = document.getElementById('unlock-pin');
        if (!input) return;
        input.value = input.value.slice(0, -1);
    }

    function panicClear(event) {
        event?.preventDefault?.();
        const fields = ['input-send', 'output-send', 'input-receive', 'output-receive', 'unlock-pin', 'pin-value', 'password-value'];
        fields.forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        pinRecord = null;
        lockSatisfied = true;
        lastEnteredPin = '';
        failedPinAttempts = 0;
        try {
            localStorage.clear();
        } catch (e) {
            localStorage.removeItem('mixer_pin_v2');
            localStorage.removeItem('mixer_pin_hash');
            localStorage.removeItem('mixer_password_enc');
            localStorage.removeItem('mixer_password');
            localStorage.removeItem('mixer_lang');
            localStorage.removeItem('mixer_theme');
        }
        currentPassword = '';
        updatePasswordWarning();
        updateCharCounter(0);
        doEncode();
        hideLockOverlay();
        resetPanicOverlay();
        showToast(t('toast_cleared'));
    }

    function flashLockError() {
        const overlay = document.getElementById('lock-overlay');
        if (!overlay) return;
        overlay.classList.remove('error-flash');
        void overlay.offsetWidth; // force reflow
        overlay.classList.add('error-flash');
    }

    function startPanicHold(event) {
        event?.preventDefault?.();
        endPanicHold();
        panicRemaining = 3;
        showHoldToast(panicRemaining);
        panicHoldInterval = setInterval(() => {
            panicRemaining -= 1;
            if (panicRemaining <= 0) {
                endPanicHold(true);
                panicClear();
            } else {
                showHoldToast(panicRemaining);
            }
        }, 1000);
        panicHoldTimer = setTimeout(() => {}, 0); // marker
    }

    function endPanicHold(triggered) {
        if (panicHoldInterval) {
            clearInterval(panicHoldInterval);
            panicHoldInterval = null;
        }
        if (panicHoldTimer) {
            clearTimeout(panicHoldTimer);
            panicHoldTimer = null;
        }
        if (!triggered && panicRemaining === 3) {
            showToast(t('toast_panic_hold_hint'));
        } else if (!triggered) {
            hideToast();
        }
        if (!triggered) {
            resetPanicOverlay();
        }
    }

    function showHoldToast(seconds) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = t('toast_panic_hold', { sec: seconds });
        toast.classList.add('show');
        pulsePanicOverlay();
    }

    function hideToast() {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.classList.remove('show');
    }

    function pulsePanicOverlay() {
        const overlay = document.getElementById('panic-overlay');
        if (!overlay) return;
        overlay.classList.add('active');
        overlay.classList.remove('beat');
        void overlay.offsetWidth;
        overlay.classList.add('beat');
    }

    function resetPanicOverlay() {
        const overlay = document.getElementById('panic-overlay');
        if (!overlay) return;
        overlay.classList.remove('active');
        overlay.classList.remove('beat');
    }

    function pulseRefreshOverlay() {
        const overlay = document.getElementById('refresh-overlay');
        if (!overlay) return;
        overlay.classList.add('active');
        overlay.classList.remove('beat');
        void overlay.offsetWidth;
        overlay.classList.add('beat');
    }

    function resetRefreshOverlay() {
        const overlay = document.getElementById('refresh-overlay');
        if (!overlay) return;
        overlay.classList.remove('active');
        overlay.classList.remove('beat');
    }

    function showRefreshHoldToast(seconds) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        const template = t('refresh_hold');
        toast.textContent = template.replace('{sec}', seconds);
        toast.classList.add('show');
        pulseRefreshOverlay();
    }

    function startRefreshHold(event) {
        event?.preventDefault?.();
        endRefreshHold();
        if (refreshInProgress) return;
        refreshRemaining = 3;
        showRefreshHoldToast(refreshRemaining);
        refreshHoldInterval = setInterval(() => {
            refreshRemaining -= 1;
            if (refreshRemaining <= 0) {
                endRefreshHold(true);
                refreshApp();
            } else {
                showRefreshHoldToast(refreshRemaining);
            }
        }, 1000);
        refreshHoldTimer = setTimeout(() => {}, 0); // marker
    }

    function endRefreshHold(triggered) {
        if (refreshHoldInterval) {
            clearInterval(refreshHoldInterval);
            refreshHoldInterval = null;
        }
        if (refreshHoldTimer) {
            clearTimeout(refreshHoldTimer);
            refreshHoldTimer = null;
        }
        if (!triggered && refreshRemaining === 3) {
            showToast(t('refresh_hold_hint'));
        } else if (!triggered) {
            hideToast();
        }
        if (!triggered) {
            resetRefreshOverlay();
        }
    }

    async function clearAppStorage() {
        try { localStorage.clear(); } catch (e) {}
        try { sessionStorage.clear(); } catch (e) {}
        if (navigator.serviceWorker?.getRegistrations) {
            try {
                const regs = await navigator.serviceWorker.getRegistrations();
                await Promise.all(regs.map((reg) => reg.unregister()));
            } catch (e) {}
        }
        if (window.caches?.keys) {
            try {
                const keys = await caches.keys();
                await Promise.all(keys.map((key) => caches.delete(key)));
            } catch (e) {}
        }
        if (window.indexedDB?.databases) {
            try {
                const dbs = await indexedDB.databases();
                await Promise.all(dbs.map((db) => {
                    if (!db?.name) return Promise.resolve();
                    return new Promise((resolve) => {
                        const req = indexedDB.deleteDatabase(db.name);
                        req.onsuccess = () => resolve();
                        req.onerror = () => resolve();
                        req.onblocked = () => resolve();
                    });
                }));
            } catch (e) {}
        }
    }

    function forceReload() {
        const url = new URL(window.location.href);
        url.searchParams.set('refresh', Date.now().toString());
        window.location.replace(url.toString());
    }

    async function refreshApp() {
        if (refreshInProgress) return;
        const status = await checkOnlineStatus();
        if (status !== STATUS_ONLINE) {
            showToast(t('refresh_no_net'));
            resetRefreshOverlay();
            return;
        }
        refreshInProgress = true;
        pulseRefreshOverlay();
        setTimeout(resetRefreshOverlay, 800);
        const msg = t('refreshing');
        showToast(msg);
        try {
            await clearAppStorage();
        } catch (e) {
            console.error(e);
        }
        forceReload();
    }

    function changeChunking(mode) {
        chunkingEnabled = mode !== 'off';
        localStorage.setItem('mixer_chunking', chunkingEnabled ? 'on' : 'off');
        const currentOut = document.getElementById('output-send')?.value || '';
        renderChunks(currentOut);
    }

    function toggleChunking() {
        chunkingEnabled = !chunkingEnabled;
        localStorage.setItem('mixer_chunking', chunkingEnabled ? 'on' : 'off');
        const btn = document.getElementById('chunking-toggle');
        if (btn) updateChunkToggleText(btn, chunkingEnabled);
        const currentOut = document.getElementById('output-send')?.value || '';
        renderChunks(currentOut);
    }

    function updateChunkToggleText(btn, enabled) {
        const textOn = t('chunk_on');
        const textOff = t('chunk_off');
        btn.textContent = enabled ? textOn : textOff;
        btn.classList.toggle('active', enabled);
    }

    async function copyChunk(idx) {
        const chunk = currentChunks[idx];
        if (!chunk) return;
        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(chunk);
                showToast(t('toast_copied'));
                return;
            } catch (e) {}
        }
        fallbackCopyTextValue(chunk);
    }

    async function copyAllChunks() {
        if (!currentChunks.length) return;
        const text = currentChunks.join('\n');
        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                showToast(t('toast_copied'));
                return;
            } catch (e) {}
        }
        fallbackCopyTextValue(text);
    }

    function fallbackCopyTextValue(text) {
        const tmp = document.createElement('textarea');
        tmp.value = text;
        document.body.appendChild(tmp);
        tmp.select();
        tmp.setSelectionRange(0, 99999);
        try { document.execCommand('copy'); showToast(t('toast_copied')); } catch (err) {}
        document.body.removeChild(tmp);
    }

    function renderKeypad() {
        const container = document.getElementById('pin-keypad');
        if (!container) return;
        const digits = Array.from({ length: 10 }, (_, i) => String(i));
        for (let i = digits.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [digits[i], digits[j]] = [digits[j], digits[i]];
        }
        const slots = [
            digits[0], digits[1], digits[2],
            digits[3], digits[4], digits[5],
            digits[6], digits[7], digits[8],
            'del',   digits[9], 'unlock'
        ];

        container.innerHTML = '';
        slots.forEach((item) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            if (item === 'del') {
                btn.textContent = '←';
                btn.onclick = deletePinDigit;
            } else if (item === 'unlock') {
                btn.classList.add('unlock-btn');
                btn.setAttribute('aria-label', t('lock_unlock_btn'));
                btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-6h-1V9a5 5 0 0 0-10 0h2a3 3 0 0 1 6 0v2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"/></svg>';
                btn.onclick = unlockApp;
            } else {
                btn.textContent = item;
                btn.onclick = () => pressPinDigit(item);
            }
            container.appendChild(btn);
        });
    }

    window.doEncode = doEncode;
    window.doDecode = doDecode;
    window.smartPaste = smartPaste;
    window.copyText = copyText;
    window.switchTab = switchTab;
    window.changeLanguage = changeLanguage;
    window.changeTheme = changeTheme;
    window.updatePassword = updatePassword;
    window.unlockApp = unlockApp;
    window.pressPinDigit = pressPinDigit;
    window.deletePinDigit = deletePinDigit;
    window.updatePinFromSettings = updatePinFromSettings;
    window.panicClear = panicClear;
    window.startPanicHold = startPanicHold;
    window.endPanicHold = endPanicHold;
    window.startRefreshHold = startRefreshHold;
    window.endRefreshHold = endRefreshHold;
    window.refreshApp = refreshApp;
    window.copyChunk = copyChunk;
    window.copyAllChunks = copyAllChunks;
    window.changeChunking = changeChunking;
    window.toggleChunking = toggleChunking;

    window.addEventListener('DOMContentLoaded', init);
})();
