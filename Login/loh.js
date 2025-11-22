// semplice handler per la pagina di login

function handleLoginFormSubmit(ev) {
    ev.preventDefault();
    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value;
    if (!username || !password) {
        alert('Inserisci username e password.');
        return;
    }

    // cerca funzione login esposta dallo script di registrazione
    var result;
    if (window.login) {
        result = window.login(username, password);
    } else {
        // fallback: leggi users da localStorage
        try {
            const raw = localStorage.getItem('users');
            const users = raw ? JSON.parse(raw) : [];
            const user = users.find(u => (u.email === username || u.nome === username) && u.password === password);
            result = user ? { ok: true, user } : { ok: false };
            if (result.ok) localStorage.setItem('currentUser', result.user.email || result.user.nome);
        } catch (e) {
            console.error(e);
            result = { ok: false };
        }
    }

    if (result && result.ok) {
        alert('Accesso effettuato. Benvenuto ' + (result.user.nome || username) + '!');
        // reindirizza alla home (percorso relativo)
        window.location.href = '../index/Firenze.html';
    } else {
        alert('Credenziali non valide.');
    }
}

// collega il form se presente
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (form) form.addEventListener('submit', handleLoginFormSubmit);
});

// esponi per debug
window.handleLoginFormSubmit = handleLoginFormSubmit;
