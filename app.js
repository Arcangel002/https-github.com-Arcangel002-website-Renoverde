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

  static async getPosts() {
    return this.fetch('/blog/posts');
  }

  static async getFAQs() {
    return this.fetch('/faq');
  }

  static async submitContact(data) {
    return this.fetch('/contatos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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
  }

  async handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;

    try {
      const data = {
        nome: form.nome.value,
        email: form.email.value,
        telefone: form.telefone.value,
        assunto: form.assunto.value,
        mensagem: form.mensagem.value,
      };

      await this.api.submitContact(data);
      
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      form.reset();
      this.router.navigate('home');
    } catch (error) {
      alert('Erro ao enviarmensagem. Tente novamente.');
      console.error(error);
    }
  }

  async handleNewsletterSubmit(e) {
    e.preventDefault();
    const form = e.target;

    try {
      const data = { email: form.email.value };
      await this.api.fetch('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      alert('Inscrição realizada com sucesso!');
      form.reset();
    } catch (error) {
      alert('Erro ao se inscrever. Tente novamente.');
    }
  }

  async loadInitialData() {
    try {
      // Load Services
      const services = await this.api.getServices();
      const servicesContainer = document.getElementById('servicesList');
      if (servicesContainer && services.data) {
        servicesContainer.innerHTML = Components.renderServices(services.data);
      }

      // Load Blog Posts
      const posts = await this.api.getPosts();
      const blogsContainer = document.getElementById('blogList');
      if (blogsContainer && posts.data) {
        blogsContainer.innerHTML = Components.renderBlogPosts(posts.data);
      }

      // Load FAQs
      const faqs = await this.api.getFAQs();
      const faqsContainer = document.getElementById('faqList');
      if (faqsContainer && faqs.data) {
        faqsContainer.innerHTML = Components.renderFAQs(faqs.data);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  // Show home page by default
  window.app.router.navigate('home');
});
