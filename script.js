const form = document.querySelector('#customizer-form');
const nameInput = document.querySelector('#business-name');
const reviewInput = document.querySelector('#review-link');
const previewBusiness = document.querySelector('#preview-business');
const captionBusiness = document.querySelector('#caption-business');
const previewPlaque = document.querySelector('#preview-plaque');
const priceEl = document.querySelector('#price');
const message = document.querySelector('#form-message');
let selectedColor = '#344638';
let selectedColorLabel = 'Verde oliva';
let selectedModel = 'vertical';
let selectedSize = '15x21';
let selectedPrice = 89.90;
let logoDataUrl = '';

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function updatePreview() {
  const name = nameInput.value.trim() || 'Nome do estabelecimento';
  previewBusiness.textContent = name.toLocaleUpperCase('pt-BR');
  captionBusiness.textContent = name;
  document.querySelector('#color-name').textContent = selectedColorLabel;
  document.querySelector('#caption-details').textContent = 'Impressão ' + selectedColorLabel.toLowerCase() + ' · acabamento personalizado';
  document.querySelector('#caption-model').textContent = selectedModel === 'vertical' ? 'Vertical' : 'Horizontal';
  document.querySelector('#caption-size').textContent = selectedSize === '15x21' ? '15 × 21 cm' : '21 × 30 cm';
  previewPlaque.style.color = selectedColor;
  previewPlaque.querySelector('.preview-stars').style.color = '#b38a50';
  previewPlaque.classList.toggle('horizontal', selectedModel === 'horizontal');
  priceEl.textContent = formatPrice(selectedPrice);
  document.querySelector('.plaque-hero').style.color = selectedColor;
  document.querySelector('.plaque-hero .preview-business').textContent = name.toLocaleUpperCase('pt-BR');
  document.querySelector('.plaque-hero .preview-subtitle').textContent = 'PERSONALIZADA';
  document.querySelector('#preview-symbol').style.display = logoDataUrl ? 'none' : 'block';
}
nameInput.addEventListener('input', updatePreview);
document.querySelectorAll('.swatch').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.swatch').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  selectedColor = button.dataset.color;
  selectedColorLabel = button.dataset.label;
  updatePreview();
}));
document.querySelectorAll('[data-model]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-model]').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  selectedModel = button.dataset.model;
  updatePreview();
}));
document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-size]').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  selectedSize = button.dataset.size;
  selectedPrice = Number(button.dataset.price);
  updatePreview();
}));
document.querySelector('#logo-upload').addEventListener('change', event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    message.textContent = 'O arquivo deve ter no máximo 5 MB.';
    event.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    logoDataUrl = String(reader.result);
    const image = document.querySelector('#preview-logo-image');
    image.src = logoDataUrl;
    image.hidden = false;
    document.querySelector('#logo-mark').textContent = '✓';
    document.querySelector('#logo-filename').textContent = file.name;
    updatePreview();
    message.textContent = '';
  };
  reader.readAsDataURL(file);
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const reviewLink = reviewInput.value.trim();
  if (reviewLink && !/^https?:\/\//i.test(reviewLink)) {
    message.textContent = 'Inclua o endereço completo do link, começando com https://';
    reviewInput.focus();
    return;
  }
  const business = nameInput.value.trim() || 'Não informado';
  const summary = [
    'Olá! Quero continuar a personalização de uma placa elo.',
    '',
    'Estabelecimento: ' + business,
    'Cor: ' + selectedColorLabel,
    'Modelo: ' + (selectedModel === 'vertical' ? 'Vertical' : 'Horizontal'),
    'Tamanho: ' + (selectedSize === '15x21' ? '15 × 21 cm' : '21 × 30 cm'),
    'Valor estimado: ' + formatPrice(selectedPrice),
    'Link de avaliação: ' + (reviewLink || 'Ainda não informado'),
    '',
    'Gostaria de confirmar os detalhes, frete e prazo.'
  ].join('\n');
  message.textContent = 'Sua personalização está pronta! A próxima etapa é confirmar o pedido com a loja. Este projeto ainda não tem checkout ou pagamento conectado.';
  const whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(summary);
  const open = document.createElement('a');
  open.href = whatsappUrl;
  open.target = '_blank';
  open.rel = 'noopener noreferrer';
  open.className = 'button button-dark button-full';
  open.style.marginTop = '12px';
  open.textContent = 'Enviar resumo pelo WhatsApp ↗';
  const old = document.querySelector('#whatsapp-next-step');
  if (old) old.remove();
  open.id = 'whatsapp-next-step';
  form.querySelector('.form-bottom').appendChild(open);
});
const menuToggle = document.querySelector('.menu-toggle');
menuToggle.addEventListener('click', () => {
  const nav = document.querySelector('.main-nav');
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  document.querySelector('.main-nav').classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));
updatePreview();