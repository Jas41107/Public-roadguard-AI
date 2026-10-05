document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.metric-card');

  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 120}ms`;
    card.classList.add('metric-animate');
  });
});
