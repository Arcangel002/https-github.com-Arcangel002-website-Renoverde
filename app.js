// ====================
// RENOVERDE APP - Main Application
// ====================

// 🌐 API BASE URL - Smart Detection
// Auto-detects ngrok URLs or uses localhost
const getAPIBaseURL = () => {
  // Check if ngrok URL is in sessionStorage (set during setup)
  if (sessionStorage.getItem('ngrok_url')) {
    return sessionStorage.getItem('ngrok_url') + '/api';
  }

  // Check if query parameter has ngrok URL
  const params = new URLSearchParams(window.location.search);
  if (params.has('api')) {
    const apiUrl = params.get('api');
    sessionStorage.setItem('ngrok_url', apiUrl);
    return apiUrl + '/api';
  }

  // Default to localhost
  return 'http://localhost:5001/api';
};

const API_BASE_URL = getAPIBaseURL();

// Supabase REST helper (uses publishable key provided by user)
const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_KEY = window.SUPABASE_KEY || '';

async function supabaseInsert(table, record) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase credentials missing');
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(record)
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Supabase insert failed: ${resp.status} ${text}`);
  }
  return resp.json();
}

// Router Navigation
class Router {
  constructor() {
    this.currentPage = 'home';
    this.routes = {
      'home': '#home',
      'services': '#services',
      'blog': '#blog',
      'about': '#about',
      'faq': '#faq',
      'contact': '#contact',
      'admin': '#admin'
    };
  }

  navigate(page) {
    this.currentPage = page;
    this.load(page);
  }

  load(page) {
    document.querySelectorAll('[data-page]').forEach(el => {
      el.classList.remove('active');
    });

    const pageEl = document.querySelector(`[data-page="${page}"]`);
    if (pageEl) {
      pageEl.classList.add('active');
      window.scrollTo(0, 0);
    }
  }
}

// API Service
class APIService {
  static async fetch(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async getServices() {
    return this.fetch('/servicos');
  }

  static async getProducts() {
    return this.fetch('/produtos');
  }

  static async getLaunches() {
    return this.fetch('/lancamentos');
  }

  static async getPosts() {
    return this.fetch('/blog/posts');
  }

  static async getFAQs() {
    return this.fetch('/faq');
  }

  static async getTeam() {
    return this.fetch('/equipe');
  }

  static async submitContact(data) {
    // POST to serverless endpoint which uses Service Role key
    return fetch('/api/contatos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json());
  }

  static async submitScheduling(data) {
    return fetch('/api/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json());
  }

  static async subscribeNewsletter(data) {
    return fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json());
  }
}

// UI Components
class Components {
  static renderServices(services) {
    return services.map(service => `
      <article class="service-card">
        ${service.imagem ? `<img src="${service.imagem}" alt="${service.titulo}">` : ''}
        <div class="service-content">
          <h3>${service.titulo}</h3>
          <p>${service.descricao || 'Serviço de reciclagem profissional'}</p>
          ${service.preco ? `<span class="price">Desde R$ ${parseFloat(service.preco).toFixed(2)}</span>` : ''}
          <a href="#" class="btn btn-small">Saiba Mais</a>
        </div>
      </article>
    `).join('');
  }

  static renderProducts(products) {
    return products.map(product => `
      <article class="product-card">
        ${product.imagem ? `<img src="${product.imagem}" alt="${product.titulo}">` : ''}
        <div class="product-content">
          <h3>${product.titulo}</h3>
          <p>${product.descricao || 'Produto sustentável produzido com plástico reciclado.'}</p>
          ${product.preco ? `<span class="price">R$ ${parseFloat(product.preco).toFixed(2)}</span>` : ''}
        </div>
      </article>
    `).join('');
  }

  static renderLaunches(launches) {
    return launches.map(launch => `
      <article class="launch-card">
        ${launch.imagem ? `<img src="${launch.imagem}" alt="${launch.titulo}">` : ''}
        <div class="launch-content">
          <h3>${launch.titulo}</h3>
          <p>${launch.descricao || 'Lançamento de produto ou iniciativa sustentável.'}</p>
          ${launch.data_lancamento ? `<span class="launch-date">Lançamento: ${new Date(launch.data_lancamento).toLocaleDateString('pt-BR')}</span>` : ''}
        </div>
      </article>
    `).join('');
  }

  static renderBlogPosts(posts) {
    return posts.map(post => `
      <article class="blog-card">
        ${post.imagem_destaque ? `<img src="${post.imagem_destaque}" alt="${post.titulo}">` : ''}
        <div class="blog-content">
          <h3>${post.titulo}</h3>
          <p class="blog-excerpt">${post.conteudo.substring(0, 150)}...</p>
          <div class="blog-meta">
            <span class="date">${new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
            <span class="views">👁️ ${post.views || 0} visualizações</span>
          </div>
          <a href="#blog" class="btn btn-small">Ler Artigo</a>
        </div>
      </article>
    `).join('');
  }

  static renderFAQs(faqs) {
    return faqs.map((faq, index) => `
      <div class="faq-item">
        <div class="faq-question" onclick="this.parentElement.classList.toggle('open')">
          <span>${faq.pergunta}</span>
          <span class="toggle-icon">►</span>
        </div>
        <div class="faq-answer">
          <p>${faq.resposta}</p>
        </div>
      </div>
    `).join('');
  }

  static renderTeam(team) {
    return team.map(member => `
      <div class="team-card">
        <div class="team-avatar">${member.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div>
        <h4>${member.nome}</h4>
        <p>${member.cargo}</p>
      </div>
    `).join('');
  }
}

// App Initialization
class App {
  constructor() {
    this.router = new Router();
    this.api = APIService;
    this.init();
  }

  async init() {
    this.setupNavigation();
    this.setupForms();
    await this.loadInitialData();
  }

  setupNavigation() {
    document.querySelectorAll('[data-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.nav;
        this.router.navigate(page);
      });
    });
  }

  setupForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
    }

    const productForm = document.getElementById('productForm');
    if (productForm) {
      productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));
    }

    const launchForm = document.getElementById('launchForm');
    if (launchForm) {
      launchForm.addEventListener('submit', (e) => this.handleLaunchSubmit(e));
    }
  }

  async handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    clearFormMessage(form);
    const submitBtn = form.querySelector('[type="submit"]');
    setLoading(submitBtn, true);

    try {
      // Check if this is a scheduling form (has tipo_residuo field)
      const tipoResiduo = form.tipo_residuo ? form.tipo_residuo.value : '';
      const data = form.data ? form.data.value : '';
      const horario = form.horario ? form.horario.value : '';

      if (tipoResiduo && data) {
        // This is a scheduling request - use new endpoint
        const dataToSend = {
          nome: form.nome.value,
          email: form.email.value,
          telefone: form.telefone.value,
          tipo_residuo: tipoResiduo,
          data: data,
          horario: horario,
          mensagem: form.mensagem.value || '',
        };

        await this.api.fetch('/agendamentos', {
          method: 'POST',
          body: JSON.stringify(dataToSend),
        });
        showFormMessage(form, 'Agendamento solicitado com sucesso! Entraremos em contato para confirmar.', true);
      } else {
        // This is a regular contact form
        const dataToSend = {
          nome: form.nome.value,
          email: form.email.value,
          telefone: form.telefone.value,
          assunto: form.assunto ? form.assunto.value : 'Contacto Geral',
          mensagem: form.mensagem.value,
        };

        await this.api.submitContact(dataToSend);
        showFormMessage(form, 'Mensagem enviada com sucesso! Entraremos em contato em breve.', true);
      }

      form.reset();
      // keep user on same section but collapse message after a delay
      setTimeout(() => { clearFormMessage(form); }, 6000);
    } catch (error) {
      showFormMessage(form, 'Erro ao enviar solicitação. Tente novamente.', false);
      console.error(error);
    }
    setLoading(submitBtn, false);
  }

  async handleNewsletterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    clearFormMessage(form);
    const submitBtn = form.querySelector('[type="submit"]');
    setLoading(submitBtn, true);
    try {
      const emailEl = form.querySelector('input[name="email"]') || form.querySelector('#newsletter-email');
      const email = emailEl ? emailEl.value.trim() : '';
      if (!email) { showFormMessage(form, 'Por favor insira um email válido.', false); setLoading(submitBtn, false); return; }
      const data = { email };
      await this.api.subscribeNewsletter(data);
      showFormMessage(form, 'Inscrição realizada com sucesso!', true);
      form.reset();
      setTimeout(() => { clearFormMessage(form); }, 5000);
    } catch (error) {
      showFormMessage(form, 'Erro ao se inscrever. Tente novamente.', false);
      console.error(error);
    }
    setLoading(submitBtn, false);
  }

// Helper UI functions for forms
function showFormMessage(form, message, success = true) {
  let node = form.querySelector('.form-status');
  if (!node) {
    node = document.createElement('div');
    node.className = 'form-status';
    form.appendChild(node);
  }
  node.textContent = message;
  node.classList.toggle('success', success);
  node.classList.toggle('error', !success);
}

function clearFormMessage(form) {
  const node = form.querySelector('.form-status');
  if (node) node.remove();
}

function setLoading(button, isLoading) {
  if (!button) return;
  if (isLoading) {
    button.dataset.orig = button.innerHTML;
    button.disabled = true;
    button.innerHTML = 'Aguarde...';
  } else {
    button.disabled = false;
    if (button.dataset.orig) button.innerHTML = button.dataset.orig;
  }
}

  async handleProductSubmit(e) {
  e.preventDefault();
  const form = e.target;

  try {
    const payload = {
      titulo: form.titulo.value,
      descricao: form.descricao.value,
      imagem: form.imagem.value,
      preco: form.preco.value,
    };

    await this.api.fetch('/produtos', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    alert('Produto criado com sucesso!');
    form.reset();
    await this.loadProducts();
  } catch (error) {
    alert('Erro ao criar produto. Tente novamente.');
    console.error(error);
  }
}

  async handleLaunchSubmit(e) {
  e.preventDefault();
  const form = e.target;

  try {
    const payload = {
      titulo: form.titulo.value,
      descricao: form.descricao.value,
      imagem: form.imagem.value,
      data_lancamento: form.data_lancamento.value,
    };

    await this.api.fetch('/lancamentos', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    alert('Lançamento criado com sucesso!');
    form.reset();
    await this.loadLaunches();
  } catch (error) {
    alert('Erro ao criar lançamento. Tente novamente.');
    console.error(error);
  }
}

  async loadServices() {
  const services = await this.api.getServices();
  const servicesContainer = document.getElementById('servicesList');
  if (servicesContainer && services.data) {
    servicesContainer.innerHTML = Components.renderServices(services.data);
  }
}

  async loadProducts() {
  const products = await this.api.getProducts();
  const productsContainer = document.getElementById('productList');
  if (productsContainer && products.data) {
    productsContainer.innerHTML = Components.renderProducts(products.data);
  }
}

  async loadLaunches() {
  const launches = await this.api.getLaunches();
  const launchesContainer = document.getElementById('launchList');
  if (launchesContainer && launches.data) {
    launchesContainer.innerHTML = Components.renderLaunches(launches.data);
  }
}

  async loadInitialData() {
  // Load Services
  try {
    const services = await this.api.getServices();
    const servicesContainer = document.getElementById('servicesList');
    if (servicesContainer && services.data) {
      servicesContainer.innerHTML = Components.renderServices(services.data);
    }
  } catch (error) {
    console.warn('Could not load services:', error.message);
  }

  // Load Blog Posts
  try {
    const posts = await this.api.getPosts();
    const blogsContainer = document.getElementById('blogList');
    if (blogsContainer && posts.data) {
      blogsContainer.innerHTML = Components.renderBlogPosts(posts.data);
    }
  } catch (error) {
    console.warn('Could not load blog posts:', error.message);
  }

  // Load FAQs
  try {
    const faqs = await this.api.getFAQs();
    const faqsContainer = document.getElementById('faqList');
    if (faqsContainer && faqs.data) {
      faqsContainer.innerHTML = Components.renderFAQs(faqs.data);
    }
  } catch (error) {
    console.warn('Could not load FAQs:', error.message);
  }

  // Load Team
  try {
    const team = await this.api.getTeam();
    const teamContainer = document.getElementById('teamList');
    if (teamContainer && team.data) {
      teamContainer.innerHTML = Components.renderTeam(team.data);
    }
  } catch (error) {
    console.warn('Could not load team:', error.message);
  }

  // Load Products
  try {
    await this.loadProducts();
  } catch (error) {
    console.warn('Could not load products:', error.message);
  }

  // Load Launches
  try {
    await this.loadLaunches();
  } catch (error) {
    console.warn('Could not load launches:', error.message);
  }
}
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
