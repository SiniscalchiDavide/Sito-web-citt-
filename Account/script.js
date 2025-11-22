// --- FUNZIONE DI REGISTRAZIONE (conferma) ---
function conferma() {
    // 1. Recupero dei valori dal form
    var nome = document.getElementById("name").value;
    var cognome = document.getElementById("cognome").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var conpassword = document.getElementById("conpassword").value;
    var eta = document.getElementById("age").value;
    var paese = document.getElementById("country").value;
    var birthdate = document.getElementById("birthdate").value;

    // Gestione radio button (Genere)
    var genereEl = document.querySelector('input[name="gender"]:checked');
    var genere = genereEl ? genereEl.value : '';
    

    var terms = document.getElementById("terms") ? document.getElementById("terms").checked : false;

    // 2. Validazione dei dati (Controllo errori)
    var error = false;
    var errorMessage = "";

    if (!nome) { errorMessage += "- Il campo Nome è obbligatorio.\n"; error = true; }
    if (!cognome) { errorMessage += "- Il campo Cognome è obbligatorio.\n"; error = true; }
    if (!email) { errorMessage += "- Il campo Email è obbligatorio.\n"; error = true; }
    if (!password) { errorMessage += "- La Password è obbligatoria.\n"; error = true; }
    
    // Controllo che le password coincidano
    if (password !== conpassword) {
        errorMessage += "- Le password non coincidono.\n";
        error = true;
    }

    // Controllo termini e condizioni
    if (!terms) {
        errorMessage += "- Devi accettare i termini e le condizioni.\n";
        var termsError = document.getElementById("termsError");
        if (termsError) termsError.style.display = "block";
        error = true;
    } else {
        var termsError = document.getElementById("termsError");
        if (termsError) termsError.style.display = "none";
    }

    // Se ci sono errori, blocca tutto e mostra l'alert
    if (error) {
        alert("Attenzione, correggi i seguenti errori:\n" + errorMessage);
        return; // Esce dalla funzione senza salvare
    }

    // 3. Creazione dell'oggetto Utente
    var user = {
        nome: nome,
        cognome: cognome,
        email: email,
        password: password, 
        eta: eta,
        birthdate: birthdate,
        genere: genere,
        paese: paese,
        createdAt: new Date().toISOString()
    };

    // 4. Salvataggio nel LocalStorage
    if (saveUserToStorage(user)) {
        setCurrentUser(email);
        alert("Registrazione avvenuta con successo! Benvenuto " + nome);
        // Reindirizza alla home page (modifica il percorso se necessario)
        window.location.href = '../index/Firenze.html'; 
    } else {
        alert("Errore: utente già registrato con questa email.");
    }
}

// --- FUNZIONI DI SUPPORTO (Database Browser) ---

function saveUserToStorage(user) {
    var users = JSON.parse(localStorage.getItem('users')) || [];
    
    var esiste = users.some(function(u) {
        return u.email === user.email;
    });

    if (esiste) {
        return false;
    }

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

function setCurrentUser(identifier) {
    localStorage.setItem('currentUser', identifier);
}

function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

function getUsersFromStorage() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// --- FUNZIONE DI LOGIN ---
function login() {
    var emailInput = document.getElementById("email").value;
    var passwordInput = document.getElementById("password").value;

    var users = getUsersFromStorage();

    var user = users.find(function(u) {
        return u.email === emailInput && u.password === passwordInput;
    });

    if (user) {
        setCurrentUser(user.email);
        alert("Login effettuato!");
        window.location.href = '../index/Firenze.html';
    } else {
        alert("Email o password non corretti.");
    }
}

// --- GESTIONE PAESI (Caricamento dal JSON) ---
async function loadCountriesFromFile(jsonPath = 'countries.json') {
    try {
        // Cerchiamo di caricare il file. Se fallisce, gestiamo l'errore silenziosamente
        const res = await fetch(jsonPath);
        if (!res.ok) return; // Se non trova il file, esce senza errori bloccanti
        
        const countries = await res.json();
        const select = document.getElementById('country');
        if (!select) return;
        
        select.innerHTML = '<option value="">Seleziona un paese</option>';
        
        const filtered = Array.isArray(countries)
            ? countries.filter(item => item && typeof item === 'object' && Object.prototype.hasOwnProperty.call(item, 'it'))
            : [];
            
        filtered.sort((a, b) => (a.it || '').localeCompare(b.it || '', 'it'));
        
        filtered.forEach(item => {
            const name = item.it;
            const value = item.alpha2 || item.alpha3 || name;
            if (!name) return;
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = name;
            select.appendChild(opt);
        });
    } catch (err) {
        console.log("Nota: Impossibile caricare countries.json (normale se non sei nella pagina di registrazione)");
    }
}

// --- NUOVE FUNZIONI: LOGOUT E CONTROLLO HEADER ---

function logout() {
    // Rimuove l'utente loggato
    localStorage.removeItem('currentUser');
    // Ricarica la pagina per ripristinare i pulsanti originali
    window.location.reload(); 
}

function checkLoginStatus() {
    // Cerca l'elemento nav con ID "user-nav" (presente in Firenze.html)
    const nav = document.getElementById('user-nav');
    
    // Se non trova l'elemento (es. siamo nella pagina di login), non fa nulla
    if (!nav) return;

    // Controlla se c'è un utente salvato
    const currentUserEmail = getCurrentUser();

    if (currentUserEmail) {
        // Recupera i dettagli dell'utente per mostrare il nome vero
        const users = getUsersFromStorage();
        const user = users.find(u => u.email === currentUserEmail);
        
        // Se trova l'utente usa il nome, altrimenti usa l'email, altrimenti "Utente"
        const displayName = user ? user.nome : (currentUserEmail || "Utente");

        // MODIFICA L'HTML DEL MENU
        nav.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <span class="welcome-msg" style="font-weight:bold; color:#333;">Ciao, ${displayName}</span>
                <button class="btn secondary" onclick="logout()" style="font-size:0.9rem; padding:4px 10px;">Esci</button>
            </div>
        `;
    }
}

// --- INIZIALIZZAZIONE GLOBALE ---

// Espone le funzioni affinché i pulsanti HTML possano usarle (onclick="...")
window.conferma = conferma;
window.login = login;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.getUsersFromStorage = getUsersFromStorage;

// Esegue queste operazioni appena la pagina ha finito di caricare
document.addEventListener('DOMContentLoaded', () => {
    loadCountriesFromFile(); // Carica i paesi (se c'è il menu a tendina)
    checkLoginStatus();      // Controlla se sei loggato e cambia i pulsanti
});