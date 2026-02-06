export function initNoteColorPicker() {
  document.querySelectorAll('.note-color-picker').forEach(picker => {
    picker.querySelectorAll('.note-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        picker.querySelectorAll('.note-color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}
