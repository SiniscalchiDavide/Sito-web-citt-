// --- FUNZIONE DI REGISTRAZIONE (conferma) ---
// Questa funzione raccoglie i dati dal form e li valida prima di salvare l'utente
function conferma() {
    // 1. Recupero dei valori dal form usando gli ID degli elementi HTML
    var nome = document.getElementById("name").value;
    var cognome = document.getElementById("cognome").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var conpassword = document.getElementById("conpassword").value;
    var paese = document.getElementById("country").value;
    var birthdate = document.getElementById("birthdate").value;

    // Gestione radio button (Genere) - Trova il radio button selezionato
    var genereEl = document.querySelector('input[name="gender"]:checked');
    var genere = genereEl ? genereEl.value : ''; // Se selezionato, prendi il valore, altrimenti stringa vuota
    
    // Verifica se l'utente ha accettato i termini e le condizioni
    var terms = document.getElementById("terms") ? document.getElementById("terms").checked : false;

    // 2. Validazione dei dati (Controllo errori)
    var error = false; // Flag per tracciare se ci sono errori
    var errorMessage = ""; // Stringa per accumulare i messaggi di errore

    // Controlla che il nome non sia vuoto
    if (!nome) { errorMessage += "- Il campo Nome è obbligatorio.\n"; error = true; }
    // Controlla che il cognome non sia vuoto
    if (!cognome) { errorMessage += "- Il campo Cognome è obbligatorio.\n"; error = true; }
    // Controlla che l'email non sia vuota
    if (!email) { errorMessage += "- Il campo Email è obbligatorio.\n"; error = true; }
    // Controlla che la password non sia vuota
    if (!password) { errorMessage += "- La Password è obbligatoria.\n"; error = true; }
    
    // Controlla che le due password coincidano
    if (password !== conpassword) {
        errorMessage += "- Le password non coincidono.\n";
        error = true;
    }

    // Controlla che l'utente abbia accettato i termini e le condizioni
    if (!terms) {
        errorMessage += "- Devi accettare i termini e le condizioni.\n";
        var termsError = document.getElementById("termsError");
        if (termsError) termsError.style.display = "block"; // Mostra il messaggio di errore
        error = true;
    } else {
        // Se i termini sono accettati, nascondi il messaggio di errore
        var termsError = document.getElementById("termsError");
        if (termsError) termsError.style.display = "none";
    }

    // Se ci sono errori, mostra un alert e interrompi l'esecuzione
    if (error) {
        alert("Attenzione, correggi i seguenti errori:\n" + errorMessage);
        return; // Esce dalla funzione senza salvare
    }

    // 3. Creazione dell'oggetto Utente con tutti i dati inseriti
    var user = {
        nome: nome,
        cognome: cognome,
        email: email,
        password: password, 
        birthdate: birthdate,
        genere: genere,
        paese: paese,
        createdAt: new Date().toISOString() // Aggiunge la data/ora di registrazione
    };

    // 4. Salvataggio nel LocalStorage
    if (saveUserToStorage(user)) {
        // Se il salvataggio è riuscito, imposta l'utente come loggato
        setCurrentUser(email);
        alert("Registrazione avvenuta con successo! Benvenuto " + nome);
        // Reindirizza alla home page
        window.location.href = '../index/Firenze.html'; 
    } else {
        // Se il salvataggio fallisce (email già registrata), mostra errore
        alert("Errore: utente già registrato con questa email.");
    }
}

// --- FUNZIONI DI SUPPORTO (Database Browser) ---

// Salva un nuovo utente nel LocalStorage (memorizzazione nel browser)
function saveUserToStorage(user) {
    // Recupera la lista degli utenti dal LocalStorage, o crea un array vuoto se non esiste
    var users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Controlla se un utente con la stessa email è già registrato
    var esiste = users.some(function(u) {
        return u.email === user.email;
    });

    // Se l'email è già registrata, ritorna false (registrazione fallita)
    if (esiste) {
        return false;
    }

    // Aggiunge il nuovo utente alla lista
    users.push(user);
    // Salva la lista aggiornata nel LocalStorage come JSON
    localStorage.setItem('users', JSON.stringify(users));
    return true; // Registrazione riuscita
}

// Imposta l'utente corrente come loggato nel LocalStorage
function setCurrentUser(identifier) {
    localStorage.setItem('currentUser', identifier);
}

// Recupera l'email dell'utente attualmente loggato
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// Recupera la lista di tutti gli utenti registrati dal LocalStorage
function getUsersFromStorage() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// --- FUNZIONE DI LOGIN ---
// Autentica un utente verificando email e password
function login() {
    // Recupera i valori inseriti nei campi email e password
    var emailInput = document.getElementById("email").value;
    var passwordInput = document.getElementById("password").value;

    // Ottiene la lista di tutti gli utenti registrati
    var users = getUsersFromStorage();

    // Cerca un utente con email e password corrispondenti
    var user = users.find(function(u) {
        return u.email === emailInput && u.password === passwordInput;
    });

    // Se l'utente esiste, effettua il login
    if (user) {
        setCurrentUser(user.email); // Salva l'utente come loggato
        alert("Account creato!");
        window.location.href = '../index/Firenze.html'; // Reindirizza alla home
    } else {
        // Se email o password sono scorretti, mostra errore
        alert("Email o password non corretti.");
    }
}

// --- GESTIONE PAESI (Caricamento dal JSON) ---
// Carica la lista dei paesi da un file JSON e popola il menu a tendina
async function loadCountriesFromFile(jsonPath = 'countries.json') {
    try {
        // Effettua una richiesta al file JSON
        const res = await fetch(jsonPath);
        // Se il file non viene trovato (404), esce silenziosamente
        if (!res.ok) return; 
        
        // Converte la risposta in oggetto JavaScript
        const countries = await res.json();
        // Cerca il select con ID 'country'
        const select = document.getElementById('country');
        if (!select) return; // Se non esiste, esce
        
        // Azzera il contenuto del select e aggiunge l'opzione di default
        select.innerHTML = '<option value="">Seleziona un paese</option>';
        
        // Filtra i paesi validi (che hanno la proprietà 'it' con il nome italiano)
        const filtered = Array.isArray(countries)
            ? countries.filter(item => item && typeof item === 'object' && Object.prototype.hasOwnProperty.call(item, 'it'))
            : [];
            
        // Ordina i paesi alfabeticamente per nome italiano
        filtered.sort((a, b) => (a.it || '').localeCompare(b.it || '', 'it'));
        
        // Per ogni paese valido, crea un'opzione e la aggiunge al select
        filtered.forEach(item => {
            const name = item.it; // Nome in italiano
            const value = item.alpha2 || item.alpha3 || name; // Codice paese (ISO)
            if (!name) return; // Se il nome non esiste, salta
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = name;
            select.appendChild(opt);
        });
    } catch (err) {
        // Se c'è un errore nel caricamento, stampa un messaggio non bloccante
        console.log("Nota: Impossibile caricare countries.json (normale se non sei nella pagina di registrazione)");
    }
}

// --- NUOVE FUNZIONI: LOGOUT E CONTROLLO HEADER ---

// Funzione per disconnettere l'utente corrente
function logout() {
    // Rimuove l'email dell'utente loggato dal LocalStorage
    localStorage.removeItem('currentUser');
    // Reindirizza alla home page
    window.location.href = '../index/Firenze.html';
}

// Controlla se un utente è loggato e aggiorna il menu di navigazione
function checkLoginStatus() {
    // Cerca l'elemento HTML con ID "user-nav" (menu di navigazione utente)
    const nav = document.getElementById('user-nav');
    
    // Se non trova l'elemento (es. siamo nella pagina di login), non fa nulla
    if (!nav) return;

    // Recupera l'email dell'utente attualmente loggato
    const currentUserEmail = getCurrentUser();

    // Se c'è un utente loggato, personalizza il menu
    if (currentUserEmail) {
        // Recupera la lista di tutti gli utenti
        const users = getUsersFromStorage();
        // Trova l'utente con l'email corrente
        const user = users.find(u => u.email === currentUserEmail);
        
        // Determina il nome da mostrare: nome utente, email, o "Utente"
        const displayName = user ? user.nome : (currentUserEmail || "Utente");

        // MODIFICA L'HTML DEL MENU con saluto e pulsante di logout
        nav.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <span class="welcome-msg" style="font-weight:bold; color:#333;">Ciao, ${displayName}</span>
                <button class="btn secondary" onclick="logout()" style="font-size:0.9rem; padding:4px 10px;">Esci</button>
            </div>
        `;
    }
}

// --- INIZIALIZZAZIONE GLOBALE ---
// Espone le funzioni a livello globale (window) per renderle accessibili dall'HTML

window.conferma = conferma;
window.login = login;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.getUsersFromStorage = getUsersFromStorage;

// Esegue queste operazioni quando il documento HTML ha terminato di caricare
document.addEventListener('DOMContentLoaded', () => {
    loadCountriesFromFile(); // Carica i paesi nel menu a tendina
    checkLoginStatus();      // Controlla se sei loggato e personalizza il menu
});