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
    }else{
        alert("Grazie per esserti registrato, " + nome + "!");
    }
    //quando clicchi indietro nela sezione del ripilogo ricarica la pagina iniziale
    document.body.innerHTML = output + '<button onclick="window.location.reload()">Indietro</button>';
    document.getElementById("submitButton").disabled = false;
}