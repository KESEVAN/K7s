(function () {
    const HASH = '9be790b94099659a22683b450f78ef50a9e6568df3437e0cad0f3f5825018053';
    const KEY  = 'tol_auth';

    if (sessionStorage.getItem(KEY) === HASH) return;

    document.body.style.overflow = 'hidden';

    const overlay = document.createElement('div');
    overlay.id = 'auth-gate';
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:9999',
        'background:#090909',
        'display:flex', 'align-items:center', 'justify-content:center',
        'flex-direction:column', 'gap:0',
    ].join(';');

    overlay.innerHTML = `
        <div style="width:100%;max-width:340px;padding:0 1.5rem;text-align:left;">
            <p style="font-family:'Space Mono',monospace;font-size:0.55rem;letter-spacing:0.3em;color:rgba(255,255,255,0.25);text-transform:uppercase;margin-bottom:2rem;">Private</p>
            <p style="font-family:'Space Mono',monospace;font-size:1.5rem;font-weight:700;color:#fff;letter-spacing:-0.02em;line-height:1;margin-bottom:0.5rem;">THINKING<br>OUT LOUD</p>
            <p style="font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:0.82rem;font-weight:300;color:rgba(255,255,255,0.35);margin-bottom:2.5rem;line-height:1.65;">Enter the passphrase to continue.</p>
            <input
                id="auth-input"
                type="password"
                autocomplete="off"
                placeholder="passphrase"
                style="
                    width:100%;
                    background:transparent;
                    border:none;
                    border-bottom:1px solid rgba(255,255,255,0.12);
                    color:#fff;
                    font-family:'Space Mono',monospace;
                    font-size:0.85rem;
                    letter-spacing:0.08em;
                    padding:0.6rem 0;
                    outline:none;
                    margin-bottom:1.5rem;
                    display:block;
                "
            />
            <button
                id="auth-submit"
                style="
                    font-family:'Space Mono',monospace;
                    font-size:0.65rem;
                    letter-spacing:0.18em;
                    text-transform:uppercase;
                    padding:10px 22px;
                    border:1px solid rgba(255,255,255,0.18);
                    background:rgba(255,255,255,0.05);
                    color:#fff;
                    cursor:pointer;
                    transition:background 0.15s;
                    margin-bottom:1rem;
                "
                onmouseover="this.style.background='rgba(255,255,255,0.1)'"
                onmouseout="this.style.background='rgba(255,255,255,0.05)'"
            >ENTER</button>
            <p id="auth-error" style="font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:0.75rem;color:rgba(239,68,68,0.6);min-height:1.2em;"></p>
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
