function conferma() {
    var nome = document.getElementById("name").value;
    var cognome = document.getElementById("cognome").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var conpassword = document.getElementById("conpassword").value;
    var eta = document.getElementById("age").value;
    var genere = document.querySelector('input[name="gender"]:checked');
    var interessi = document.querySelectorAll('input[name="interests"]:checked');
    var paese = document.getElementById("country").value;
    var terms = document.getElementById("terms").checked;
    var birthdate = document.getElementById("birthdate").value;
    //controllo input
    var error = false;
    var errorMessage = "";

    if (!nome) {
        errorMessage += "Il campo Nome è obbligatorio.\n";
        error = true;
    } 
    if (!cognome) {
        errorMessage += "Il campo Cognome è obbligatorio.\n";
        error = true;
    } 
    if (!email) {
        errorMessage += "Il campo Email è obbligatorio.\n";
        error = true;
    } 
    if (!eta) {
        errorMessage += "Il campo Età è obbligatorio.\n";
        error = true;
    } 
    if (!birthdate) {
        errorMessage += "Il campo Data di Nascita è obbligatorio.\n";
        error = true;
    } 
    if (!genere) {
        errorMessage += "Seleziona il tuo genere.\n";
        error = true;
    } 
    if (!interessi) {
        errorMessage += "Seleziona il/i tuo/i interesse/i.\n";
        error = true;
    } 
    if (!paese || paese === "") {
        errorMessage += "Seleziona il tuo paese di provenienza.\n";
        error = true;
    } 
    if (password !== conpassword) {
        errorMessage += "Le password non corrispondono.\n";
        error = true;
    } 
    if (!terms) {
        errorMessage += "Devi accettare i termini e le condizioni.\n";
        error = true;
    } 

    if (error) {
        alert(errorMessage);
        return;
    } else {
        alert("Grazie per esserti registrato, " + nome + "!");    
        window.location.href = '../index/Firenze.html';
    }

    document.getElementById("submitButton").disabled = false;
}

async function loadCountriesFromFile(jsonPath = 'countries.json') {
    try {
        const res = await fetch(jsonPath);
        if (!res.ok) throw new Error('Impossibile caricare ' + jsonPath);
        const countries = await res.json(); // aspettati array di oggetti
        const select = document.getElementById('country');
        if (!select) return;
        // svuota e aggiungi option iniziale
        select.innerHTML = '<option value="">Seleziona un paese</option>';
        // filtra solo oggetti che hanno esattamente la chiave 'it' (minuscola)
        const filtered = Array.isArray(countries)
            ? countries.filter(item => item && typeof item === 'object' && Object.prototype.hasOwnProperty.call(item, 'it'))
            : [];
        // ordina alfabeticamente per nome italiano
        filtered.sort((a, b) => (a.it || '').localeCompare(b.it || '', 'it'));
        filtered.forEach(item => {
            const name = item.it;
            // valore utile per il form: preferisci alpha2/alpha3 se presenti, altrimenti il nome
            const value = item.alpha2 || item.alpha3 || name;
            if (!name) return;
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = name;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error(err);
        const select = document.getElementById('country');
        if (select) select.innerHTML = '<option value="">Errore caricamento paesi</option>';
    }
}

// chiama il loader al caricamento pagina
document.addEventListener('DOMContentLoaded', () => loadCountriesFromFile());