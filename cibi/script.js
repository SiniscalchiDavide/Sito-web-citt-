// Configurazione personalizzata di Tailwind per colori specifici
tailwind.config = {
    theme: {
        extend: {
            colors: {
                // Colore principale del testo (Marrone Toscano/Rosso Scuro)
                'maroon-tuscany': '#960018',
                // Colore di sfondo per l'elemento attivo nella lista (Beige Dorato)
                'gold-active': '#fef3c7',
                // Colore per i testi secondari e gli accenti
                'gold-text': '#78350f',
                // Colore per i badge neutri
                'stone-gray': '#57534e',
                // Colore per i badge success
                'leaf-green': '#16a34a',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Funzione per gestire il cambio di tab
    function activateTab(targetId) {
        const listItems = document.querySelectorAll('.list-item-link');
        const tabPanes = document.querySelectorAll('.tab-pane');
        // 1. Rimuovi lo stato attivo da tutti gli elementi della lista e nascondi tutte le tab
        listItems.forEach(item => {
            item.classList.remove('active', 'bg-gold-active', 'font-semibold', 'text-maroon-tuscany');
            item.classList.add('text-gray-700');
        });
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
        });
        // 2. Aggiungi lo stato attivo all'elemento cliccato
        const activeLink = document.querySelector(`.list-item-link[data-target="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active', 'bg-gold-active', 'font-semibold', 'text-maroon-tuscany');
            activeLink.classList.remove('text-gray-700');
        }
        // 3. Mostra la tab corrispondente
        const activePane = document.getElementById(targetId);
        if (activePane) {
            activePane.classList.add('active');
        }
    }
    // Aggiungi listener a tutti gli elementi della lista
    document.querySelectorAll('.list-item-link').forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = event.currentTarget.getAttribute('data-target');
            activateTab(targetId);
        });
    });
    // Attiva la tab di default all'avvio (Bistecca)
    activateTab('list-bistecca');
});
