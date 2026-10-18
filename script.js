/* script.js - Esquadrias de Alumínio Fogaça */
(function () {
  'use strict';

  /* Garante que o DOM esteja pronto antes de executar */
  document.addEventListener('DOMContentLoaded', function () {

  const CART_KEY = 'fogaca_cart';

  /* ---------- Catálogo de produtos ---------- */
  const produtos = [
    {
      id: 1,
      nome: 'Portão Basculante',
      categoria: 'Portões',
      preco: 'R$ 2.490,00',
      precoNumerico: 2490,
      imagem: 'https://images.unsplash.com/photo-1558494744-d53d1e72cb7c?auto=format&fit=crop&w=600&q=80',
      descricao: 'Portão basculante em aço com abertura vertical, ideal para garagens de pequeno e médio porte.',
    },
    {
      id: 2,
      nome: 'Grade de Proteção',
      categoria: 'Grades',
      preco: 'R$ 320,00 (m²)',
      precoNumerico: 320,
      imagem: 'https://images.unsplash.com/photo-1581447737293-f92217c30c8d?auto=format&fit=crop&w=600&q=80',
      descricao: 'Grade de proteção para janelas e sacadas, fabricada sob medida com acabamento em pintura eletrostática.',
    },
    {
      id: 3,
      nome: 'Corrimão em Aço Inox',
      categoria: 'Estruturas',
      preco: 'R$ 180,00 (m)',
      precoNumerico: 180,
      imagem: 'https://images.unsplash.com/photo-1584556662471-2b8fd6d98365?auto=format&fit=crop&w=600&q=80',
      descricao: 'Corrimão em aço inox escovado para escadas e rampas, resistente à corrosão e de fácil manutenção.',
    },
    {
      id: 4,
      nome: 'Estrutura Metálica',
      categoria: 'Estruturas',
      preco: 'Sob Consulta',
      precoNumerico: null,
      imagem: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      descricao: 'Estrutura metálica sob medida para coberturas, galpões e mezzaninos, com cálculo estrutural incluído.',
    },
    {
      id: 5,
      nome: 'Porta de Enrolar',
      categoria: 'Portões',
      preco: 'R$ 450,00 (m²)',
      precoNumerico: 450,
      imagem: 'https://images.unsplash.com/photo-1557073777-6be5e2e1a0c5?auto=format&fit=crop&w=600&q=80',
      descricao: 'Porta de enrolar automática para comércios e industriais, com motorização opcional e guias reforçadas.',
    },
    {
      id: 6,
      nome: 'Escada Caracol',
      categoria: 'Escadas',
      preco: 'Sob Consulta',
      precoNumerico: null,
      imagem: 'https://images.unsplash.com/photo-1519856991343-1b7e991e9e69?auto=format&fit=crop&w=600&q=80',
      descricao: 'Escada caracol em aço ou alumínio, design compacto e elegante para otimizar espaços internos e externos.',
    },
    {
      id: 7,
      nome: 'Guarda-Corpo',
      categoria: 'Estruturas',
      preco: 'R$ 290,00 (m)',
      precoNumerico: 290,
      imagem: 'https://images.unsplash.com/photo-1541116617766-e2e2c7878e64?auto=format&fit=crop&w=600&q=80',
      descricao: 'Guarda-corpo para escadas e varandas em alumínio com vidro laminado, seguro e com acabamento impecável.',
    },
    {
      id: 8,
      nome: 'Estrutura de Mezanino',
      categoria: 'Estruturas',
      preco: 'Sob Consulta',
      precoNumerico: null,
      imagem: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=600&q=80',
      descricao: 'Mezanino metálico para ampliar áreas úteis em galpões e lojas, com projeto estrutural e instalação.',
    },
  ];


  /* ---------- Carrinho ---------- */
  const cartCountEl = document.getElementById('cart-count');
  const cartButton = document.getElementById('cart-button');

  function loadCart() {
    try {
      const data = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      /* localStorage indisponível: o carrinho funciona apenas em memória */
    }
  }

  let cart = loadCart();

  function getTotalItems() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function renderCartCount(animate) {
    const total = getTotalItems();
    cartCountEl.textContent = total;
    cartButton.setAttribute('aria-label', 'Abrir carrinho. Itens no carrinho: ' + total);

    if (animate) {
      cartCountEl.classList.remove('cart-bump');
      void cartCountEl.offsetWidth; // reinicia a animação
      cartCountEl.classList.add('cart-bump');
    }
  }

  function addToCart(id, name, preco, quantidade = 1, observacoes = '') {
    const obs = observacoes || '';
    const existing = cart.find((item) => item.id === id && item.observacoes === obs);
    if (existing) {
      existing.quantity += quantidade;
    } else {
      cart.push({ id, name, preco, quantity: quantidade, observacoes: obs });
    }
    saveCart(cart);
    renderCartCount(true);
  }

  // Ponto de extensão: abrir o carrinho (modal/página) futuramente
  cartButton.addEventListener('click', () => {
    console.log('Carrinho:', cart);
  });

  /* ---------- Render do catálogo dinâmico ---------- */
  const catalogoGrid = document.getElementById('catalogo-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function criarCardProduto(produto) {
    const artigo = document.createElement('article');
    artigo.className = 'rounded border border-grafite-100 bg-white p-6 shadow-sm transition hover:shadow-md flex flex-col';
    artigo.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" class="mb-4 h-36 w-full object-cover rounded bg-grafite-100" />
      <h3 class="font-display text-xl font-semibold uppercase">${produto.nome}</h3>
      <p class="mt-2 text-sm text-grafite-500 flex-1">${produto.descricao}</p>
      <span class="mt-auto mb-4 font-display text-sm font-semibold text-grafite-800">${produto.preco}</span>
      <div class="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          class="add-to-cart flex-1 rounded bg-grafite-800 py-2 font-display text-sm uppercase tracking-wider text-white transition hover:bg-industrial-500"
          data-product-id="${produto.id}"
          data-product="${produto.nome}"
          data-product-preco="${produto.precoNumerico}"
        >
          Adicionar ao carrinho
        </button>
        <button
          type="button"
          class="ver-detalhes flex-1 rounded border border-grafite-200 py-2 font-display text-sm uppercase tracking-wider text-grafite-700 transition hover:bg-grafite-50 hover:text-industrial-600 hover:border-industrial-500"
          data-product-id="${produto.id}"
        >
          Ver Detalhes
        </button>
      </div>
    `;
    return artigo;
  }

  function renderProdutos(categoria = 'todos') {
    catalogoGrid.innerHTML = '';
    const filtrados = categoria === 'todos' ? produtos : produtos.filter((p) => p.categoria === categoria);
    filtrados.forEach((produto) => {
      catalogoGrid.appendChild(criarCardProduto(produto));
    });
    catalogoGrid.querySelectorAll('.add-to-cart').forEach((btn) => {
      btn.addEventListener('click', () => {
        addToCart(
          Number(btn.dataset.productId),
          btn.dataset.product,
          Number(btn.dataset.productPreco)
        );
      });
    });
    catalogoGrid.querySelectorAll('.ver-detalhes').forEach((btn) => {
      btn.addEventListener('click', () => {
        const produto = produtos.find((p) => p.id === Number(btn.dataset.productId));
        if (produto) abrirModal(produto);
      });
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.setAttribute('aria-pressed', 'false');
        b.classList.remove('bg-industrial-500', 'text-white', 'active');
        b.classList.add('bg-grafite-100', 'text-grafite-700');
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.remove('bg-grafite-100', 'text-grafite-700');
      btn.classList.add('bg-industrial-500', 'text-white', 'active');
      renderProdutos(btn.dataset.categoria);
    });
  });

  renderProdutos('todos');

  /* ---------- Modal Detalhes do Produto ---------- */
  const modalEl = document.getElementById('modal-detalhes');
  const modalContainer = document.getElementById('modal-container');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalFechar = document.getElementById('modal-fechar');
  const modalCancelar = document.getElementById('modal-cancelar');
  const modalAdicionar = document.getElementById('modal-adicionar');
  const modalImagem = document.getElementById('modal-imagem');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalCategoria = document.getElementById('modal-categoria');
  const modalPreco = document.getElementById('modal-preco');
  const modalDescricao = document.getElementById('modal-descricao');
  const modalQuantidade = document.getElementById('modal-quantidade');
  const modalMedidas = document.getElementById('modal-medidas');

  let produtoAtual = null;

  function abrirModal(produto) {
    produtoAtual = produto;
    modalImagem.src = produto.imagem;
    modalImagem.alt = produto.nome;
    modalTitulo.textContent = produto.nome;
    modalCategoria.textContent = produto.categoria;
    modalPreco.textContent = produto.preco;
    modalDescricao.textContent = produto.descricao;
    modalQuantidade.value = 1;
    modalMedidas.value = '';

    modalEl.classList.remove('hidden');
    // Pequeno atraso para permitir a transição CSS
    requestAnimationFrame(() => {
      modalBackdrop.classList.remove('opacity-0');
      modalContainer.classList.remove('opacity-0', 'translate-y-4');
      modalContainer.querySelector('div.bg-white').classList.remove('scale-95');
      modalContainer.querySelector('div.bg-white').classList.add('scale-100');
    });
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', fecharModalESC);
  }

  function fecharModal() {
    modalBackdrop.classList.add('opacity-0');
    modalContainer.classList.add('opacity-0', 'translate-y-4');
    modalContainer.querySelector('div.bg-white').classList.remove('scale-100');
    modalContainer.querySelector('div.bg-white').classList.add('scale-95');
    setTimeout(() => {
      modalEl.classList.add('hidden');
      document.body.style.overflow = '';
      produtoAtual = null;
    }, 200);
    document.removeEventListener('keydown', fecharModalESC);
  }

  function fecharModalESC(e) {
    if (e.key === 'Escape') fecharModal();
  }

  modalFechar.addEventListener('click', fecharModal);
  modalCancelar.addEventListener('click', fecharModal);
  modalBackdrop.addEventListener('click', fecharModal);

  modalAdicionar.addEventListener('click', () => {
    if (!produtoAtual) return;
    const quantidade = parseInt(modalQuantidade.value, 10) || 1;
    const medidas = modalMedidas.value.trim();
    addToCart(produtoAtual.id, produtoAtual.nome, produtoAtual.precoNumerico, quantidade, medidas);
    fecharModal();
  });

  renderCartCount(false);

  /* ---------- Gaveta do Carrinho ---------- */
  const carrinhoDrawer = document.getElementById('carrinho-drawer');
  const carrinhoPainel = document.getElementById('carrinho-painel');
  const carrinhoBackdrop = document.getElementById('carrinho-backdrop');
  const carrinhoFechar = document.getElementById('carrinho-fechar');
  const carrinhoConteudo = document.getElementById('carrinho-conteudo');
  const carrinhoVazio = document.getElementById('carrinho-vazio');
  const carrinhoItens = document.getElementById('carrinho-itens');
  const carrinhoRodape = document.getElementById('carrinho-rodape');
  const carrinhoTotal = document.getElementById('carrinho-total');
  const carrinhoLimpar = document.getElementById('carrinho-limpar');

  function formatarPreco(valor) {
    if (valor === null || valor === undefined) return 'Sob consulta';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }

  function calcularTotal() {
    return cart.reduce((total, item) => {
      if (item.preco === null) return total;
      return total + item.preco * item.quantity;
    }, 0);
  }

  function abrirCarrinho() {
    renderCarrinho();
    carrinhoDrawer.classList.remove('hidden');
    requestAnimationFrame(() => {
      carrinhoBackdrop.classList.remove('opacity-0');
      carrinhoPainel.classList.remove('translate-x-full');
    });
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', fecharCarrinhoESC);
  }

  function fecharCarrinho() {
    carrinhoBackdrop.classList.add('opacity-0');
    carrinhoPainel.classList.add('translate-x-full');
    setTimeout(() => {
      carrinhoDrawer.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
    document.removeEventListener('keydown', fecharCarrinhoESC);
  }

  function fecharCarrinhoESC(e) {
    if (e.key === 'Escape') fecharCarrinho();
  }

  function renderCarrinho() {
    carrinhoItens.innerHTML = '';

    if (cart.length === 0) {
      carrinhoVazio.classList.remove('hidden');
      carrinhoRodape.classList.add('hidden');
      return;
    }

    carrinhoVazio.classList.add('hidden');
    carrinhoRodape.classList.remove('hidden');

    cart.forEach((item) => {
      const subtotal = item.preco !== null ? item.preco * item.quantity : 0;
      const itemEl = document.createElement('div');
      itemEl.className = 'flex flex-col gap-2 sm:flex-row sm:items-center gap-4 border-b border-grafite-100 pb-4';
      itemEl.innerHTML = `
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-display text-sm font-semibold text-grafite-900 truncate">${item.name}</span>
            ${item.observacoes ? `<span class="text-xs text-grafite-500 bg-grafite-50 px-2 py-1 rounded">Medidas: ${item.observacoes}</span>` : ''}
          </div>
          <div class="text-xs text-grafite-500">
            ${item.preco !== null ? formatarPreco(item.preco) + ' un.' : 'Preço sob consulta'}
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="carrinho-qtde-btn rounded bg-grafite-100 px-2 py-1 text-grafite-700 font-bold text-xs hover:bg-grafite-200 transition"
            data-action="diminuir"
            data-item-id="${item.id}"
            data-item-obs="${item.observacoes}"
            aria-label="Diminuir quantidade de ${item.name}"
          >
            −
          </button>
          <span class="w-8 text-center font-mono text-sm font-semibold text-grafite-900">${item.quantity}</span>
          <button
            type="button"
            class="carrinho-qtde-btn rounded bg-grafite-100 px-2 py-1 text-grafite-700 font-bold text-xs hover:bg-grafite-200 transition"
            data-action="aumentar"
            data-item-id="${item.id}"
            data-item-obs="${item.observacoes}"
            aria-label="Aumentar quantidade de ${item.name}"
          >
            +
          </button>
          <button
            type="button"
            class="carrinho-remover rounded text-grafite-400 hover:text-industrial-600 transition"
            data-item-id="${item.id}"
            data-item-obs="${item.observacoes}"
            aria-label="Remover ${item.name}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1 0 1-1 1H6c-1 0-1 0-1-1V6"/><path d="M8 6V4c0-1 1-1 1-1h2c1 0 1 1 1 1v2"/><path d="M14 6V4c0-1 1-1 1-1h2c1 0 1 1 1 1v2"/><path d="M18 10h-4c0-1 1-1 1-1h3c1 0 1 1 1 1z"/></svg>
          </button>
        </div>
        ${item.preco !== null ? `<div class="mt-2 sm:mt-0 sm:ml-auto text-right"><span class="font-display text-sm font-bold text-grafite-900">${formatarPreco(subtotal)}</span></div>` : ''}
      `;
      carrinhoItens.appendChild(itemEl);
    });

    carrinhoTotal.textContent = formatarPreco(calcularTotal());

    carrinhoItens.querySelectorAll('.carrinho-qtde-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.itemId);
        const obs = btn.dataset.itemObs;
        const action = btn.dataset.action;
        alterarQuantidade(id, obs, action === 'aumentar' ? 1 : -1);
      });
    });

    carrinhoItens.querySelectorAll('.carrinho-remover').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.itemId);
        const obs = btn.dataset.itemObs;
        removerItem(id, obs);
      });
    });
  }

  function alterarQuantidade(id, observacoes, delta) {
    const item = cart.find((i) => i.id === id && i.observacoes === observacoes);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      removerItem(id, observacoes);
    } else {
      saveCart(cart);
      renderCartCount(true);
      renderCarrinho();
    }
  }

  function removerItem(id, observacoes) {
    cart = cart.filter((i) => !(i.id === id && i.observacoes === observacoes));
    saveCart(cart);
    renderCartCount(true);
    renderCarrinho();
  }

  function limparCarrinho() {
    cart = [];
    saveCart(cart);
    renderCartCount(true);
    renderCarrinho();
  }

  cartButton.addEventListener('click', abrirCarrinho);
  carrinhoFechar.addEventListener('click', fecharCarrinho);
  carrinhoBackdrop.addEventListener('click', fecharCarrinho);
  carrinhoLimpar.addEventListener('click', limparCarrinho);

  /* ---------- WhatsApp ---------- */
  // ⚠️ Substitua pelo número da loja (com DDI, sem espaços ou símbolos)
  const WHATSAPP_NUMBER = '5511999999999';

  function gerarMensagemWhatsApp() {
    if (cart.length === 0) return null;

    const linhas = [];
    linhas.push('*Novo Orçamento - Esquadrias de Alumínio Fogaça*');
    linhas.push('');
    linhas.push('*Itens:*');

    cart.forEach((item, index) => {
      const precoItem = item.preco !== null ? item.preco * item.quantity : 0;
      const precoFormatado = item.preco !== null ? formatarPreco(item.preco) : 'sob consulta';
      const subtotalFormatado = item.preco !== null ? formatarPreco(precoItem) : 'sob consulta';
      const obs = item.observacoes ? ` (Medidas: ${item.observacoes})` : '';
      linhas.push(`${index + 1}. ${item.name} x${item.quantity}${obs}`);
      linhas.push(`   Preço unitário: ${precoFormatado}`);
      linhas.push(`   Subtotal: ${subtotalFormatado}`);
    });

    linhas.push('');
    linhas.push(`*Total: ${formatarPreco(calcularTotal())}*`);
    linhas.push('');
    linhas.push('Gostaria de solicitar orçamento para os itens acima.');

    return linhas.join('%0A');
  }

  function abrirWhatsApp() {
    if (cart.length === 0) return;

    const mensagem = gerarMensagemWhatsApp();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    fecharCarrinho();
  }

  document.getElementById('carrinho-finalizar').addEventListener('click', abrirWhatsApp);

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  function setMenu(open) {
    mobileMenu.classList.toggle('hidden', !open);
    iconOpen.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  menuToggle.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  // Fecha o menu ao clicar em um link, ao pressionar Esc ou ao ampliar a tela
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });

  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });

  /* ---------- Link ativo conforme a seção visível ---------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Ícones (Lucide) ---------- */
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ---------- Depoimentos ---------- */
  const depoimentos = [
    {
      nome: 'Maria Oliveira',
      cidade: 'São Paulo - SP',
      avaliacao: 5,
      texto: 'Excelente trabalho! O portão de alumínio ficou impecável, com acabamento perfeito e entregue no prazo combinado. Recomendo a todos.',
    },
    {
      nome: 'Carlos Mendes',
      cidade: 'Campinas - SP',
      avaliacao: 5,
      texto: 'Contratei a serralheira para as grades de proteção do meu apartamento. Profissionais atenciosos, qualidade superior e pontualidade impecável.',
    },
    {
      nome: 'Fernanda Lima',
      cidade: 'São Bernardo do Campo - SP',
      avaliacao: 5,
      texto: 'O corrimão de aço inox da escada ficou lindo e moderno. Atendimento do início ao fim foi nota 10. Muito satisfeita com o resultado.',
    },
  ];

  function renderDepoimentos() {
    const grid = document.getElementById('depoimentos-grid');
    if (!grid) return;

    grid.innerHTML = '';

    depoimentos.forEach((depoimento) => {
      const estrelas = Array.from({ length: depoimento.avaliacao }, () => '★').join('');
      const item = document.createElement('div');
      item.className = 'bg-white p-6 rounded-xl shadow-sm border border-grafite-100 flex flex-col';
      item.innerHTML = `
        <div class="flex-1">
          <div class="flex items-center gap-1 mb-3">
            <span class="text-yellow-500 text-xs font-bold">${estrelas}</span>
          </div>
          <p class="text-grafite-600 text-sm leading-relaxed mb-4">"${depoimento.texto}"</p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-grafite-100 flex items-center justify-center flex-shrink-0">
              <span class="text-xs font-bold text-grafite-800">${depoimento.nome.charAt(0)}</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-grafite-900">${depoimento.nome}</p>
              <p class="text-xs text-grafite-500">${depoimento.cidade}</p>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(item);
    });
  }

  renderDepoimentos();

  /* ---------- Formulário de Contato Rápido ---------- */
  function enviarContatoRapido(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const textoOriginal = btn.textContent;

    btn.textContent = 'Enviando...';
    btn.disabled = true;

    // Simula envio (substituir por fetch real quando houver backend)
    setTimeout(() => {
      form.reset();
      btn.textContent = textoOriginal;
      btn.disabled = false;
      const msg = document.getElementById('msg-sucesso-contato');
      msg.classList.remove('hidden');
      setTimeout(() => msg.classList.add('hidden'), 5000);
    }, 1200);

    return false;
  }

  /* ---------- Rodapé ---------- */
  document.getElementById('current-year').textContent = new Date().getFullYear();
  });
})();
