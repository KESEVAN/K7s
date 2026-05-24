(function () {
    const cfg      = window.AUTH_CONFIG || {};
    const HASH     = cfg.hash     || '9be790b94099659a22683b450f78ef50a9e6568df3437e0cad0f3f5825018053';
    const KEY      = cfg.key      || 'tol_auth';
    const LOGO     = cfg.logo     || null;
    const TITLE    = cfg.title    || 'PRIVATE';
    const SUBTITLE = cfg.subtitle || '';

    if (sessionStorage.getItem(KEY) === HASH) return;

    document.body.style.overflow = 'hidden';

    const logoHTML = LOGO
        ? `<img src="${LOGO}" alt="logo" style="width:200px;height:200px;object-fit:contain;display:block;margin:0 auto 2.5rem;" />`
        : '';

    const subtitleHTML = SUBTITLE
        ? `<p style="font-family:'Space Mono',monospace;font-size:1.5rem;font-weight:700;color:#fff;letter-spacing:-0.02em;line-height:1;margin-bottom:0.5rem;">${SUBTITLE}</p>`
        : '';

    const overlay = document.createElement('div');
    overlay.id = 'auth-gate';
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:9999',
        'background:#090909',
        'display:flex', 'flex-direction:column',
        'align-items:center', 'justify-content:center',
    ].join(';');

    overlay.innerHTML = `
        <div style="width:100%;max-width:340px;padding:0 1.5rem;text-align:center;">
            ${logoHTML}
            <p style="font-family:'Space Mono',monospace;font-size:0.55rem;letter-spacing:0.3em;color:rgba(255,255,255,0.50);text-transform:uppercase;margin-bottom:${SUBTITLE ? '0.5rem' : '2rem'};">${TITLE}</p>
            ${subtitleHTML}
            <p style="font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:0.85rem;font-weight:300;color:rgba(255,255,255,0.65);margin-bottom:2.5rem;margin-top:0.6rem;line-height:1.65;">Enter the passphrase to continue.</p>
            <input
                id="auth-input"
                type="password"
                autocomplete="off"
                placeholder="passphrase"
                style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.22);color:#fff;font-family:'Space Mono',monospace;font-size:0.85rem;letter-spacing:0.08em;padding:0.6rem 0;outline:none;margin-bottom:1.5rem;display:block;text-align:center;"
            />
            <button
                id="auth-submit"
                style="font-family:'Space Mono',monospace;font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;padding:10px 22px;border:1px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.05);color:#fff;cursor:pointer;margin-bottom:1rem;"
                onmouseover="this.style.background='rgba(255,255,255,0.1)'"
                onmouseout="this.style.background='rgba(255,255,255,0.05)'"
            >ENTER</button>
            <p id="auth-error" style="font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:0.78rem;color:rgba(239,68,68,0.80);min-height:1.2em;"></p>
        </div>
    `;

    document.body.appendChild(overlay);

    const input  = document.getElementById('auth-input');
    const button = document.getElementById('auth-submit');
    const error  = document.getElementById('auth-error');

    input.focus();

    async function attempt() {
        error.textContent = '';
        const val = input.value;
        if (!val) return;
        const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(val));
        const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        if (hash === HASH) {
            sessionStorage.setItem(KEY, HASH);
            document.body.style.overflow = '';
            overlay.remove();
        } else {
            error.textContent = 'incorrect passphrase.';
            input.value = '';
            input.focus();
        }
    }

    button.addEventListener('click', attempt);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
})();
