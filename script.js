'use strict';

/* ==========================================================
   VIOLETA · Catálogo Dinâmico de Moda com Modal
   ========================================================== */

/* ---------- CONFIGURAÇÕES ---------- */
const WHATSAPP_NUMBER = '5549991023413';
const FALLBACK_PRODUCT_IMG = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85';

/* ---------- CATÁLOGO DE PRODUTOS ---------- */
const products = [
  {
    id: '1',
    ativo: true,
    tag: 'Destaque',
    name: 'Vestido Aurora',
    category: 'Feminino',
    tagline: 'Leveza e elegância em cada detalhe.',
    desc: 'Vestido com caimento fluido, tecido de alta qualidade e toque suave. Perfeito para ocasiões especiais ou passeios sofisticados.',
    price: 'R$ 129,90',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&q=85'
  },
  {
    id: '2',
    ativo: true,
    tag: '',
    name: 'Camiseta Essencial',
    category: 'Masculino',
    tagline: 'Conforto e versatilidade.',
    desc: 'Design texturizado e marcante que une imponência contemporânea e leveza para o seu visual cotidiano.',
    price: 'R$ 69,90',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=85'
  },
  {
    id: '3',
    ativo: true,
    tag: 'Novo',
    name: 'Calça Clássica',
    category: 'Feminino',
    tagline: 'Um toque elegante no dia a dia.',
    desc: 'Calça de alfaiataria moderna, ideal para compor looks elegantes tanto para o trabalho quanto para eventos sociais.',
    price: 'R$ 119,90',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=85'
  },
  {
    id: '4',
    ativo: true,
    tag: '',
    name: 'Colar Delicado',
    category: 'Acessórios',
    tagline: 'O detalhe que transforma o look.',
    desc: 'Peça delicada e moderna para valorizar o seu visual com extrema sofisticação em qualquer ocasião.',
    price: 'R$ 49,90',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=85'
  }
];

/* ---------- ELEMENTOS DA PÁGINA ---------- */
const grid = document.getElementById('productsGrid');
const filtersContainer = document.getElementById('categoryFilters');

const modal = document.getElementById('productModal');
const modalImg = document.getElementById('modalImg');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalTagline = document.getElementById('modalTagline');
const modalDesc = document.getElementById('modalDesc');
const modalWhatsapp = document.getElementById('modalWhatsappBtn');
const modalClose = document.getElementById('modalClose');

let activeCategory = 'Todos';
let ultimoFoco = null;

/* ---------- FUNÇÕES AUXILIARES ---------- */
function escapeHTML(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function mensagemWhatsApp(p) {
  return p.whatsappText || `Olá! Gostaria de consultar a disponibilidade e valores da peça “${p.name}” (${p.price}).`;
}

function linkWhatsApp(p) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagemWhatsApp(p))}`;
}

/* ---------- RENDERIZAÇÃO DOS FILTROS ---------- */
function renderFiltros() {
  const ativos = products.filter(p => p.ativo !== false);
  const categorias = ['Todos', ...new Set(ativos.map(p => p.category))];

  if (!categorias.includes(activeCategory)) activeCategory = 'Todos';

  filtersContainer.innerHTML = categorias.map(cat => `
    <button type="button" class="filter ${cat === activeCategory ? 'active' : ''}" data-category="${escapeHTML(cat)}">
      ${escapeHTML(cat)}
    </button>
  `).join('');
}

/* ---------- RENDERIZAÇÃO DOS PRODUTOS ---------- */
function cardHTML(p) {
  const id = escapeHTML(p.id);
  const nome = escapeHTML(p.name);
  const tagHTML = p.tag ? `<span class="tag">${escapeHTML(p.tag)}</span>` : '';

  return `
    <article class="product">
      <button type="button" class="product-img-wrap" data-open-modal="${id}" aria-label="Ver detalhes de ${nome}" style="background:none; border:none; padding:0; width:100%; cursor:pointer;">
        <div class="product-photo">
          <img src="${escapeHTML(p.image)}" alt="${nome}" loading="lazy" data-fallback="${FALLBACK_PRODUCT_IMG}">
          ${tagHTML}
        </div>
      </button>
      <div class="product-info">
        <h3>
          <button type="button" class="product-title-btn" data-open-modal="${id}" style="background:none; border:none; padding:0; font:inherit; color:var(--purple); cursor:pointer; font-weight:700; text-align:left;">
            ${nome}
          </button>
        </h3>
        <p>${escapeHTML(p.desc)}</p>
        <div class="product-bottom">
          <span class="price">${escapeHTML(p.price)}</span>
          <a class="ask-link" href="${linkWhatsApp(p)}" target="_blank" rel="noopener noreferrer">Consultar</a>
        </div>
      </div>
    </article>
  `;
}

function renderProdutos() {
  const filtrados = products.filter(p => {
    if (p.ativo === false) return false;
    return activeCategory === 'Todos' || p.category === activeCategory;
  });

  grid.innerHTML = filtrados.length
    ? filtrados.map(cardHTML).join('')
    : '<p class="empty-msg">Nenhuma peça encontrada nesta categoria.</p>';
}

/* ---------- MODAL ---------- */
function abrirModal(id, opener) {
  const produto = products.find(p => p.id === id && p.ativo !== false);
  if (!produto) return;

  ultimoFoco = opener || null;

  modalImg.src = produto.image;
  modalImg.alt = produto.name;
  modalCategory.textContent = produto.category;
  modalTitle.textContent = produto.name;
  modalTagline.textContent = produto.tagline ? `“${produto.tagline}”` : '';
  modalDesc.textContent = produto.desc;
  modalWhatsapp.href = linkWhatsApp(produto);

  modal.classList.add('active');
  document.body.classList.add('no-scroll');
  if (modalClose) modalClose.focus();
}

function fecharModal() {
  modal.classList.remove('active');
  document.body.classList.remove('no-scroll');
  if (ultimoFoco && ultimoFoco.isConnected) ultimoFoco.focus();
  ultimoFoco = null;
}

/* ---------- EVENTOS ---------- */
filtersContainer.addEventListener('click', e => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  activeCategory = btn.dataset.category;
  renderFiltros();
  renderProdutos();
});

grid.addEventListener('click', e => {
  const gatilho = e.target.closest('[data-open-modal]');
  if (gatilho) abrirModal(gatilho.dataset.openModal, gatilho);
});

if (modalClose) modalClose.addEventListener('click', fecharModal);

modal.addEventListener('click', e => {
  if (e.target === modal) fecharModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    fecharModal();
  }
});

/* ---------- IMAGEM RESERVA ---------- */
document.addEventListener('error', e => {
  if (e.target instanceof HTMLImageElement && e.target.dataset.fallback) {
    const reserva = e.target.dataset.fallback;
    delete e.target.dataset.fallback;
    e.target.src = reserva;
  }
}, true);

/* ---------- INICIALIZAÇÃO ---------- */
renderFiltros();
renderProdutos();

const anoEl = document.getElementById('ano');
if (anoEl) anoEl.textContent = new Date().getFullYear();