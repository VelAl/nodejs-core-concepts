const img = document.getElementById('uploaded-image');
const placeholder = document.getElementById('image-placeholder');

img.addEventListener('load', () => {
  img.hidden = false;
  placeholder.hidden = true;
});

img.addEventListener('error', () => {
  img.hidden = true;
  placeholder.hidden = false;
});
