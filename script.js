
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const searchInput = document.querySelector('#post-search');
const cards = Array.from(document.querySelectorAll('.post-card'));
if (searchInput && cards.length) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    cards.forEach(card => {
      const haystack = `${card.dataset.title || ''} ${card.dataset.tag || ''} ${card.textContent.toLowerCase()}`;
      card.hidden = q && !haystack.includes(q);
    });
  });
}
