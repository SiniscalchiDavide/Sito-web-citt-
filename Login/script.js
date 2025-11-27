// ============================================================================
// GESTIONE DEL FORM DI LOGIN - handleLoginFormSubmit(ev)
// ============================================================================
// Questa funzione viene chiamata quando l'utente invia il form di login
// (cioè quando clicca il bottone "Accedi" o preme Enter)
// 
// Cosa fa:
// 1. Legge username e password inseriti nel form
// 2. Verifica che non siano vuoti
// 3. Cerca l'utente tra quelli registrati (per email o nome)
// 4. Se lo trova e la password è corretta, fa il login e va alla home page
// 5. Se non lo trova o la password è sbagliata, mostra un errore
// ============================================================================

function handleLoginFormSubmit(ev) {
    // Impedisce il comportamento predefinito del form (ricarica della pagina)
    // Così il form non si reinizializza e possiamo gestire noi il login
    ev.preventDefault();
    
    // STEP 1: Leggi username e password dal form
    // .trim() rimuove gli spazi bianchi all'inizio e alla fine
    // (es: " mario " diventa "mario", così gli errori di digitazione non bloccano il login)
    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value;
    
    // STEP 2: Verifica che entrambi i campi siano compilati
    // Se uno dei due è vuoto (!username significa username === "")
    // Mostra un errore e esce dalla funzione
    if (!username || !password) {
        alert('Inserisci username e password.');
        return;
    }

    // ========================================================================
    // STEP 3: CERCA L'UTENTE NEL DATABASE (LocalStorage)
    // ========================================================================
    // Prova prima a usare la funzione login() definita nello script di registrazione
    // Se quella non è disponibile, usa un sistema di fallback (backup)
    // ========================================================================
    
    var result;
    
    // Controlla se la funzione login() è disponibile (definita nello script Account/script.js)
    if (window.login) {
        // Se è disponibile, usala per verificare le credenziali
        result = window.login(username, password);
    } else {
        // Se la funzione login() NON è disponibile (siamo su una pagina che non carica Account/script.js)
        // Usa un sistema di fallback: leggi direttamente dal LocalStorage
        try {
            // Leggi la stringa JSON degli utenti dal LocalStorage
            const raw = localStorage.getItem('users');
            // Converti la stringa JSON in un array di oggetti (o array vuoto se non esiste)
            const users = raw ? JSON.parse(raw) : [];
            
            // Cerca un utente che corrisponda a ENTRAMBI questi criteri:
            // - L'email O il nome coincidono con lo username inserito
            // - La password coincide esattamente
            const user = users.find(u => 
                (u.email === username || u.nome === username) && u.password === password
            );
            
            // Se abbiamo trovato un utente (user !== undefined), il login è valido
            result = user ? { ok: true, user } : { ok: false };
            
            // Se il login è valido, salva l'utente come "attualmente loggato"
            if (result.ok) {
                localStorage.setItem('currentUser', result.user.email || result.user.nome);
            }
        } catch (e) {
            // Se c'è un errore durante la lettura del JSON o il parsing, stampa l'errore nella console
            // e imposta result come fallimento
            console.error(e);
            result = { ok: false };
        }
    }

    // ========================================================================
    // STEP 4: GESTISCI IL RISULTATO DEL LOGIN
    // ========================================================================
    // Se result.ok è true, il login ha avuto successo
    // Se result.ok è false, il login è fallito
    // ========================================================================
    
    if (result && result.ok) {
        // LOGIN RIUSCITO
        // Mostra un messaggio di benvenuto con il nome dell'utente
        alert('Accesso effettuato. Benvenuto ' + (result.user.nome || username) + '!');
        // Reindirizza l'utente alla home page
        window.location.href = '../index/Firenze.html';
    } else {
        // LOGIN FALLITO
        // Mostra un messaggio di errore generico (per motivi di sicurezza non diciamo se è l'email o la password sbagliata)
        alert('Dati non valide.');
        // Ricarica la pagina per azzerare il form
        location.reload();
    }
}

// ============================================================================
// COLLEGAMENTO DEL FORM AL GESTORE DEGLI EVENTI
// ============================================================================
// Questa parte si esegue quando l'HTML ha finito di caricare
// Cerca il form di login e configura il bottone di invio
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Cerca l'elemento HTML con ID "loginForm" (il form di login)
    const form = document.getElementById('loginForm');
    
    // Se il form esiste sulla pagina, collegagli il nostro gestore
    // Così quando l'utente clicca "Accedi", verrà chiamata handleLoginFormSubmit()
    if (form) {
        form.addEventListener('submit', handleLoginFormSubmit);
    }
});

// ============================================================================
// ESPOSIZIONE DELLA FUNZIONE PER DEBUG
// ============================================================================
// Rendi la funzione handleLoginFormSubmit visibile globalmente
// Questo permette di testarla dalla console del browser (a scopo di debug)
// In produzione questo commento potrebbe essere rimosso per pulire il codice
// ============================================================================

window.handleLoginFormSubmit = handleLoginFormSubmit;
