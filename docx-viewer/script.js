// DOCX Viewer (mammoth.js)
const fileInput = document.getElementById('file-input');
const openBtn = document.getElementById('open-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const docxPreview = document.getElementById('docx-preview');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = error.querySelector('.error-message');

// Dosya açma butonu
openBtn.addEventListener('click', () => {
  fileInput.click();
});

// Dosya seçildiğinde
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  loadDocx(file);
});

// Sürükle-bırak desteği
document.body.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

document.body.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const file = e.dataTransfer.files[0];
  if (file && file.name.endsWith('.docx')) {
    loadDocx(file);
  }
});

// Tam ekran
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// DOCX yükle (mammoth.js ile)
async function loadDocx(file) {
  docxPreview.innerHTML = '';
  error.classList.add('hidden');
  loading.classList.remove('hidden');

  try {
    const arrayBuffer = await file.arrayBuffer();

    // mammoth.js ile DOCX'i HTML'e dönüştür
    const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });

    docxPreview.innerHTML = result.value;
    loading.classList.add('hidden');
  } catch (err) {
    console.error('DOCX yükleme hatası:', err);
    loading.classList.add('hidden');
    error.classList.remove('hidden');
    errorMessage.textContent = `Dosya yüklenemedi: ${err.message}`;
  }
}

// URL parametresi ile dosya yükle
function loadFromUrlParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const fileUrl = urlParams.get('file') || urlParams.get('url');

  if (fileUrl) {
    loadDocxFromUrl(fileUrl);
  }
}

// URL'den DOCX yükle
async function loadDocxFromUrl(fileUrl) {
  docxPreview.innerHTML = '';
  error.classList.add('hidden');
  loading.classList.remove('hidden');

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    // mammoth.js ile DOCX'i HTML'e dönüştür
    const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });

    docxPreview.innerHTML = result.value;
    loading.classList.add('hidden');
  } catch (err) {
    console.error('DOCX yükleme hatası:', err);
    loading.classList.add('hidden');
    error.classList.remove('hidden');
    errorMessage.textContent = `Dosya yüklenemedi: ${err.message}`;
  }
}

// Başlangıçta URL parametresini kontrol et
loadFromUrlParam();

console.log('DOCX Görüntüleyici hazır');
