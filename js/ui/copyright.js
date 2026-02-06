export function toggleCopyright(btn) {
  const text = btn.querySelector('.copyright-text');
  if (!text) return;

  text.style.animation = 'none';
  setTimeout(() => { text.style.animation = ''; }, 10);
}
