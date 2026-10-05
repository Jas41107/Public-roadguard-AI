document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const yearNode = document.getElementById('current-year');

  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('open');
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach((element) => {
    element.classList.add('is-visible');
  });
});
