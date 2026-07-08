const form = document.getElementById('upload-form');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileNameEl = document.getElementById('file-name');
const sendBtn = document.getElementById('send-btn');
const statusEl = document.getElementById('status');

const isAllowedImage = (file) => file.type.startsWith('image/');

const setStatus = (message, type = '') => {
  statusEl.textContent = message;
  statusEl.className = `upload-status${type ? ` is-${type}` : ''}`;
};

const clearForm = () => {
  fileInput.value = '';
  fileNameEl.hidden = true;
  fileNameEl.textContent = '';
  sendBtn.disabled = true;
};

const setFile = (file) => {
  if (!file) {
    clearForm();
    return;
  }

  if (!isAllowedImage(file)) {
    clearForm();
    setStatus('Only images and GIFs are allowed.', 'error');
    return;
  }

  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;

  fileNameEl.textContent = file.name;
  fileNameEl.hidden = false;
  sendBtn.disabled = false;
  setStatus('');
};

dropZone.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  setFile(fileInput.files[0] ?? null);
});

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('is-dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('is-dragover');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('is-dragover');

  const file = event.dataTransfer.files[0];
  if (file) {
    setFile(file);
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    setStatus('Select an image or GIF first.', 'error');
    return;
  }

  if (!isAllowedImage(file)) {
    setStatus('Only images and GIFs are allowed.', 'error');
    return;
  }

  sendBtn.disabled = true;
  setStatus('Uploading...');

  try {
    const response = await fetch('/upload', {
      method: 'PATCH',
      headers: {
        'Content-Type': file.type,
        'X-Filename': file.name,
      },
      body: file,
    });

    const message = await response.text();
    setStatus(message, response.ok ? 'success' : 'error');

    if (response.ok) {
      clearForm();
    }
  } catch (error) {
    setStatus(`Upload failed: ${error.message}`, 'error');
  } finally {
    if (fileInput.files.length > 0) {
      sendBtn.disabled = false;
    }
  }
});
