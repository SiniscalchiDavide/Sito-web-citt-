// ============================================================================
// FUNZIONE DI REGISTRAZIONE - conferma()
// ============================================================================
// Questa funzione viene chiamata quando l'utente clicca il bottone "Registrati"
// Raccoglie tutti i dati dal modulo HTML, li valida e poi li salva nel browser
// Se ci sono errori di validazione, mostra un messaggio all'utente
// Se la registrazione ha successo, reindirizza alla home page e fa il login automatico
// ============================================================================

function conferma() {
    // STEP 1: Leggi tutti i valori inseriti nel form usando gli ID degli elementi HTML
    var nome = document.getElementById("name").value;
    var cognome = document.getElementById("cognome").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var conpassword = document.getElementById("conpassword").value;
    var paese = document.getElementById("country").value;
    var birthdate = document.getElementById("birthdate").value;

    // STEP 2: Gestisci il campo radio button per il genere
    // document.querySelector() cerca un elemento radio con name="gender" che sia checked (selezionato)
    var genereEl = document.querySelector('input[name="gender"]:checked');
    var genere = genereEl ? genereEl.value : '';
    
    // STEP 3: Leggi se l'utente ha spuntato la checkbox "Accetto i termini"
    var terms = document.getElementById("terms") ? document.getElementById("terms").checked : false;

    // ========================================================================
    // STEP 4: VALIDAZIONE DEI DATI - Verifica che tutti i campi siano corretti
    // ========================================================================
    var error = false;
    var errorMessage = "";

    // Controlla che il nome non sia vuoto
    if (!nome) { 
        errorMessage += "- Il campo Nome è obbligatorio.\n"; 
        error = true; 
    }
    
    // Controlla che il cognome non sia vuoto
    if (!cognome) { 
        errorMessage += "- Il campo Cognome è obbligatorio.\n"; 
        error = true; 
    }
    
    // Controlla che l'email non sia vuota
    if (!email) { 
        errorMessage += "- Il campo Email è obbligatorio.\n"; 
        error = true; 
    }
    
    // Controlla che la password non sia vuota
    if (!password) { 
        errorMessage += "- La Password è obbligatoria.\n"; 
        error = true; 
    }
    
    // Controlla che il genere sia selezionato
    if (genere=="") { 
        errorMessage += "- Devi selezionare un Genere.\n"; 
        error = true; 
    }
    
    // Controlla che il paese sia selezionato
    if (!paese) { 
        errorMessage += "- Devi selezionare un Paese.\n"; 
        error = true; 
    }
    
    // Controlla che la data di nascita non sia vuota
    if (!birthdate) { 
        errorMessage += "- La Data di Nascita è obbligatoria.\n"; 
        error = true; 
    }
    
    // Controlla che le due password coincidano
    if (password !== conpassword) {
        errorMessage += "- Le password non coincidono.\n";
        error = true;
    }

    // Controlla che l'utente abbia accettato i termini e le condizioni
    if (!terms) {
        errorMessage += "- Devi accettare i termini e le condizioni.\n";
        error = true;
    } 

    // Se abbiamo trovato almeno un errore, ferma tutto e mostra un alert
    if (error) {
        alert("Attenzione, correggi i seguenti errori:\n" + errorMessage);
        return;
    }

    // ========================================================================
    // STEP 5: CREA UN OGGETTO CON I DATI DELL'UTENTE
    // ========================================================================
    var user = {
        nome: nome,
        cognome: cognome,
        email: email,
        password: password, 
        birthdate: birthdate,
        genere: genere,
        paese: paese,
        createdAt: new Date().toISOString()
    };

    // ========================================================================
    // STEP 6: SALVA L'UTENTE NEL LOCALSTORAGE
    // ========================================================================
    if (saveUserToStorage(user)) {
        setCurrentUser(email);
        alert("Registrazione avvenuta con successo! Benvenuto " + nome);
        window.location.href = '../index/Firenze.html';
    } else {
        alert("Errore: utente già registrato con questa email.");
    }
}

// ============================================================================
// FUNZIONI DI SUPPORTO - Gestione del Database nel Browser (LocalStorage)
// ============================================================================
// Il LocalStorage è come un piccolo database nel browser dell'utente
// Salva i dati sul computer dell'utente (non su un server)
// I dati rimangono anche dopo che il browser viene chiuso
// ============================================================================

// ============================================================================
// FUNZIONE: saveUserToStorage(user)
// ============================================================================
// Scopo: Salva un nuovo utente nel LocalStorage verificando che non sia già registrato
// Parametro: user = oggetto con i dati dell'utente (nome, email, password, ecc.)
// Ritorna: true se il salvataggio è riuscito, false se l'email esiste già
// ============================================================================

function saveUserToStorage(user) {
    
    // ========================================================================
    // STEP 1: LETTURA DEI DATI DAL LOCALSTORAGE
    // ========================================================================
    // localStorage.getItem('users') → Legge la stringa JSON degli utenti salvati
    // JSON.parse() → Converte la stringa JSON in un array di oggetti JavaScript
    // || [] → Se non esiste nulla, crea un array vuoto
    // ========================================================================
    
    var users = JSON.parse(localStorage.getItem('users')) || [];

    
    // ========================================================================
    // STEP 2: CONTROLLO SE L'EMAIL ESISTE GIÀ
    // ========================================================================
    // users.some() → Controlla se ALMENO UN elemento soddisfa la condizione
    // u.email === user.email → Confronta se le email sono uguali
    // Ritorna: true se l'email esiste, false se è nuova
    // ========================================================================
    
    var esiste = users.some(function(u) {
        return u.email === user.email;
    });

    // ========================================================================
    // STEP 3: SE L'EMAIL ESISTE, BLOCCA LA REGISTRAZIONE
    // ========================================================================
    // if (esiste) → Se l'email è stata trovata
    // return false → Esce dalla funzione e segnala errore
    // ========================================================================
    
    if (esiste) {
        return false;
    }

    // ========================================================================
    // STEP 4: AGGIUNGI IL NUOVO UTENTE ALLA LISTA
    // ========================================================================
    // users.push(user) → Aggiunge il nuovo utente alla fine dell'array
    // ========================================================================
    
    users.push(user);

    // ========================================================================
    // STEP 5: SALVA I DATI NEL LOCALSTORAGE
    // ========================================================================
    // JSON.stringify(users) → Converte l'array in stringa JSON
    // localStorage.setItem() → Salva la stringa nel LocalStorage
    // ========================================================================
    
    localStorage.setItem('users', JSON.stringify(users));

    // ========================================================================
    // STEP 6: RITORNA TRUE (SUCCESSO)
    // ========================================================================
    // return true → Segnala che il salvataggio è riuscito
    // ========================================================================
    
    return true;
}

// ============================================================================
// FUNZIONE: setCurrentUser(identifier)
// ============================================================================
// Scopo: Segna un utente come "attualmente loggato" nel browser
// Parametro: identifier = email dell'utente che fa il login
// Effetto: Salva l'email nel LocalStorage per ricordarsi chi è loggato
// ============================================================================

function setCurrentUser(identifier) {
    localStorage.setItem('currentUser', identifier);
}

// ============================================================================
// FUNZIONE: getCurrentUser()
// ============================================================================
// Scopo: Legge quale utente è attualmente loggato
// Ritorna: L'email dell'utente loggato, oppure null se nessuno è loggato
// ============================================================================

function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// ============================================================================
// FUNZIONE: getUsersFromStorage()
// ============================================================================
// Scopo: Legge la lista di TUTTI gli utenti registrati dal LocalStorage
// Ritorna: Un array di oggetti utente, oppure un array vuoto se nessuno è registrato
// ============================================================================

function getUsersFromStorage() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// ============================================================================
// FUNZIONE DI LOGIN - login()
// ============================================================================
// Questa funzione verifica le credenziali di login dell'utente
//controlla se l'utente è loggato
// ============================================================================

function login() {
    // Leggi email e password inserite nei campi del form
    var emailInput = document.getElementById("email").value;
    var passwordInput = document.getElementById("password").value;

    // Ottieni la lista di tutti gli utenti registrati dal LocalStorage
    var users = getUsersFromStorage();

    // Cerca tra gli utenti uno che abbia email E password identiche a quelle inserite
    var user = users.find(function(u) {
        return u.email === emailInput && u.password === passwordInput;
    });

    // Se abbiamo trovato un utente (email e password corrette)
    if (user) {
        setCurrentUser(user.email);
        alert("Account creato!");
        window.location.href = '../index/Firenze.html';
    } else {
        alert("Email o password non corretti.");
    }
}

// ============================================================================
// FUNZIONE DI CARICAMENTO PAESI - loadCountriesFromFile()
// ============================================================================
// Questa funzione carica una lista di paesi da un file JSON esterno
// Popola un menu a tendina (select) con i nomi dei paesi in italiano
// Ordina i paesi alfabeticamente
// Se il file non viene trovato, non fa nulla (nessun errore bloccante)
// ============================================================================

async function loadCountriesFromFile(jsonPath = 'countries.json') {
    try {
        // Prova a scaricare il file JSON con i dati dei paesi
        const res = await fetch(jsonPath);
        // Se il file non esiste (errore 404), esci senza bloccare nulla
        if (!res.ok) return; 
        
        // Converti il file JSON in un oggetto JavaScript
        const countries = await res.json();
        // Cerca l'elemento HTML con ID "country" (il menu a tendina)
        const select = document.getElementById('country');
        // Se non esiste, esci (siamo probabilmente su una pagina diversa)
        if (!select) return;
        
        // Svuota il menu e aggiungi un'opzione di default
        select.innerHTML = '<option value="">Seleziona un paese</option>';
        
        // Filtra i paesi validi (quelli che hanno il nome in italiano)
        const filtered = Array.isArray(countries)
            ? countries.filter(item => item && typeof item === 'object' && Object.prototype.hasOwnProperty.call(item, 'it'))
            : [];
            
        // Ordina i paesi alfabeticamente per nome italiano
        filtered.sort((a, b) => (a.it || '').localeCompare(b.it || '', 'it'));
        
        // Per ogni paese valido, crea un'opzione nel menu e aggiungila
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
        // Se c'è un errore durante il caricamento, stampa un messaggio nei log
        console.log("Nota: Impossibile caricare countries.json (normale se non sei nella pagina di registrazione)");
    }
}

// ============================================================================
// FUNZIONE DI LOGOUT - logout()
// ============================================================================
// Questa funzione disconnette l'utente attualmente loggato
// Cancella i dati di login dal browser e reindirizza alla home page
// ============================================================================

function logout() {
    // Rimuove l'email dell'utente attualmente loggato dal LocalStorage
    localStorage.removeItem('currentUser');
    // Reindirizza alla home page
    window.location.href = '../index/Firenze.html';
}

// ============================================================================
// FUNZIONE DI CONTROLLO LOGIN - checkLoginStatus()
// ============================================================================
// Questa funzione viene eseguita quando la pagina carica
// Verifica se un utente è loggato e personalizza il menu di navigazione
// Se è loggato, mostra: "Ciao, [Nome]" e un pulsante "Esci"
// Se non è loggato, il menu rimane come lo hai programmato nell'HTML
// ============================================================================

function checkLoginStatus() {
    // Cerca l'elemento HTML con ID "user-nav" (menu di navigazione dell'utente)
    const nav = document.getElementById('user-nav');
    
    // Se non trovi l'elemento, esci
    if (!nav) return;

    // Leggi se c'è un utente loggato (la sua email)
    const currentUserEmail = getCurrentUser();

    // Se c'è un utente loggato
    if (currentUserEmail) {
        // Ottieni la lista di tutti gli utenti registrati
        const users = getUsersFromStorage();
        // Trova l'oggetto utente che corrisponde all'email attualmente loggata
        const user = users.find(u => u.email === currentUserEmail);
        
        // Decidi cosa mostrare come nome
        const displayName = user ? user.nome : (currentUserEmail || "Utente");

        // MODIFICA IL CONTENUTO HTML DEL MENU DI NAVIGAZIONE
        nav.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <span class="welcome-msg" style="font-weight:bold; color:#333;">Ciao, ${displayName}</span>
                <button class="btn secondary btnaccedi secondaryaccedi" onclick="logout()" style="font-size:0.9rem; padding:4px 10px;">Esci</button>
            </div>
        `;
    }
}

// ============================================================================
// INIZIALIZZAZIONE GLOBALE - Rendi le funzioni accessibili dall'HTML
// ============================================================================
// Normalmente le funzioni JavaScript sono visibili solo all'interno del file
// Qui le assegniamo a "window" per farle diventare accessibili anche dall'HTML
// Così puoi usare onclick="conferma()" direttamente nei bottoni HTML
// ============================================================================

window.conferma = conferma;
window.login = login;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.getUsersFromStorage = getUsersFromStorage;

// ============================================================================
// ESECUZIONE AL CARICAMENTO DELLA PAGINA - DOMContentLoaded
// ============================================================================
// Questo evento si attiva quando l'HTML ha finito di caricare
// Eseguiamo queste funzioni di setup prima che l'utente interagisca con la pagina
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Carica la lista dei paesi nel menu a tendina (se esiste)
    loadCountriesFromFile();
    // Controlla se c'è un utente loggato e personalizza il menu di navigazione
    checkLoginStatus();
});

//controllo login prima di navigare su pagine protette

// Lista dei link che richiedono il login
// Questi sono i link che vogliamo proteggere
const protectedLinks = [
    '../cibi/cibi.html',
    '../cosa_vedere/cosa_vedere.html',
    '../Storia_in_breve/Storia_in_breve.html',
    '../gite/gite.html',
    '../personaggi/presonaggi.html'
];
// Quando il documento HTML ha finito di caricare
document.addEventListener('DOMContentLoaded', () => {
    // Trova tutti i link (elementi <a>) nella pagina
    const allLinks = document.querySelectorAll('a');
    // Per ogni link nella pagina
    allLinks.forEach(link => {
        // Leggi l'attributo href (la destinazione del link)
        const href = link.getAttribute('href');
        // Controlla se questo link è nella lista dei link protetti
        if (protectedLinks.includes(href)) {
            // Aggiungi un evento: quando clicchi il link, chiama la funzione checkLoginBeforeNavigate()
            link.addEventListener('click', (event) => {
                checkLoginBeforeNavigate(event, href);
            });
        }
    });
});
// ====================================================================
// FUNZIONE: checkLoginBeforeNavigate(event, href)
// ====================================================================
// Questa funzione viene chiamata quando clicchi un link protetto
// event = l'evento del click
// href = il link dove stai cercando di andare
// ====================================================================
function checkLoginBeforeNavigate(event, href) {
    // Leggi se c'è un utente attualmente loggato
    const currentUser = localStorage.getItem('currentUser');
    // Se NON c'è un utente loggato (currentUser è null/undefined)
    if (!currentUser) {
        // Impedisce il comportamento predefinito del link (non va alla pagina)
        event.preventDefault();
        // Mostra un popup con un messaggio
        // \n crea una nuova riga nel messaggio
        alert(
            'Devi fare il login per accedere a questa pagina.\n\n' +
            'Clicca su "Accedi" oppure "Crea account" nel menu in alto.');

    }
    // Se c'è un utente loggato, il link funziona normalmente (non bloccato)
}