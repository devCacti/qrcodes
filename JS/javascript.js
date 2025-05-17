// Change the height of the div with id spacer to the height of the footer element
const spacer = document.getElementById('spacer');
const footer = document.querySelector('footer');
const footerHeight = footer.offsetHeight;
spacer.style.height = `${footerHeight + 100}px`;