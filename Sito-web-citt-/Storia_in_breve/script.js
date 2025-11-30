// Variabile per tenere traccia dell'elemento aperto (per l'effetto Accordion)
let openItemId = null;
let openContentId = null;
/**
 * Gestisce l'apertura e la chiusura di un pannello collapse.
 * @param {string} contentId - L'ID del div del contenuto da aprire/chiudere (es. 'collapseOrigini').
 * @param {string} itemId - L'ID dell'elemento wrapper del pannello (es. 'itemOrigini').
 */
function toggleCollapse(contentId, itemId) {
    const content = document.getElementById(contentId);
    const item = document.getElementById(itemId);
    // Seleziona il tag SVG della freccia, che è il primo elemento con classe 'chevron' all'interno di 'item'
    const chevron = item.querySelector('.chevron');
    // 1. Chiudi il pannello precedentemente aperto (se esiste ed è diverso da quello attuale)
    if (openContentId && openContentId !== contentId) {
        const prevContent = document.getElementById(openContentId);
        const prevItem = document.getElementById(openItemId);
        const prevChevron = prevItem.querySelector('.chevron');
        // Rimuovi le classi di stato attivo
        prevContent.classList.remove('active');
        prevItem.querySelector('.accordion-header').classList.remove('active');
        prevChevron.classList.remove('rotated');
        
        // Pulisci l'elemento aperto
        openContentId = null;
        openItemId = null;
    }
    // 2. Apri o chiudi il pannello corrente
    const header = item.querySelector('.accordion-header');
    
    if (content.classList.contains('active')) {
        // Se è attivo, chiudi
        content.classList.remove('active');
        header.classList.remove('active');
        chevron.classList.remove('rotated');
        openContentId = null;
        openItemId = null;
    } else {
        // Se è chiuso, apri
        content.classList.add('active');
        header.classList.add('active');
        chevron.classList.add('rotated');
        // Imposta l'elemento corrente come aperto
        openContentId = contentId;
        openItemId = itemId;
    }
}