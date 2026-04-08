// ====================
// MULTILINGUAL SYSTEM
// ====================

class MultilingualSystem {
  constructor() {
    this.currentLang = 'pt'; // Default language
    this.translations = {};
    this.init();
  }

  async init() {
    // Load default language
    await this.loadLanguage(this.currentLang);

    // Create language switcher
    this.createLanguageSwitcher();

    // Apply initial translations
    this.applyTranslations();

    // Load saved language preference
    const savedLang = localStorage.getItem('renoverde-lang');
    if (savedLang && savedLang !== this.currentLang) {
      this.switchLanguage(savedLang);
    }
  }

  async loadLanguage(lang) {
    try {
      const response = await fetch(`languages/${lang}.json`);
      this.translations = await response.json();
    } catch (error) {
      console.error(`Failed to load language file for ${lang}:`, error);
    }
  }

  createLanguageSwitcher() {
    // Create language switcher element
    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.innerHTML = `
      <select id="lang-select" class="lang-select">
        <option value="pt">🇵🇹 Português</option>
        <option value="en">🇺🇸 English</option>
        <option value="fr">🇫🇷 Français</option>
      </select>
    `;

    // Add to topbar
    const topbar = document.querySelector('.topbar .inner');
    if (topbar) {
      topbar.appendChild(switcher);
    }

    // Add event listener
    const select = switcher.querySelector('#lang-select');
    select.value = this.currentLang;
    select.addEventListener('change', (e) => {
      this.switchLanguage(e.target.value);
    });
  }

  async switchLanguage(lang) {
    if (lang === this.currentLang) return;

    await this.loadLanguage(lang);
    this.currentLang = lang;

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Save preference
    localStorage.setItem('renoverde-lang', lang);

    // Update select value
    const select = document.getElementById('lang-select');
    if (select) select.value = lang;

    // Apply translations
    this.applyTranslations();

    // Update page title
    this.updatePageTitle();
  }

  applyTranslations() {
    // Navigation
    this.translateElement('nav-home', this.translations.nav.home);
    this.translateElement('nav-about', this.translations.nav.about);
    this.translateElement('nav-services', this.translations.nav.services);
    this.translateElement('nav-mission', this.translations.nav.mission);
    this.translateElement('nav-blog', this.translations.nav.blog);
    this.translateElement('nav-faq', this.translations.nav.faq);
    this.translateElement('nav-schedule', this.translations.nav.schedule);

    // Topbar
    this.translateElement('topbar-welcome', this.translations.topbar.welcome);
    this.translateElement('topbar-findus', this.translations.topbar.findUs);
    this.translateElement('topbar-feedback', this.translations.topbar.feedback);

    // Hero section
    this.translateElement('hero-tag', this.translations.hero.tag);
    this.translateElement('hero-title', this.translations.hero.title);
    this.translateElement('hero-subtitle', this.translations.hero.subtitle);
    this.translateElement('hero-cta', this.translations.hero.cta);
    this.translateElement('hero-services-btn', this.translations.hero.secondary);

    // Hero stats
    this.translateElement('stat-plastic', this.translations.hero.stats.plastic);
    this.translateElement('stat-products', this.translations.hero.stats.products);
    this.translateElement('stat-communities', this.translations.hero.stats.communities);

    // About section
    this.translateElement('about-label', this.translations.about.label);
    this.translateElement('about-title', this.translations.about.title);
    this.translateElement('about-subtitle', this.translations.about.subtitle);

    // About stats
    this.translateElement('about-stat-recycled', this.translations.about.stats.recycled);
    this.translateElement('about-stat-products', this.translations.about.stats.products);
    this.translateElement('about-stat-jobs', this.translations.about.stats.jobs);

    // Services section
    this.translateElement('services-label', this.translations.services.label);
    this.translateElement('services-title', this.translations.services.title);
    this.translateElement('services-subtitle', this.translations.services.subtitle);

    // Service items
    this.translateElement('service-collection-title', this.translations.services.items.collection.title);
    this.translateElement('service-collection-desc', this.translations.services.items.collection.desc);
    this.translateElement('service-recycling-title', this.translations.services.items.recycling.title);
    this.translateElement('service-recycling-desc', this.translations.services.items.recycling.desc);
    this.translateElement('service-products-title', this.translations.services.items.products.title);
    this.translateElement('service-products-desc', this.translations.services.items.products.desc);
    this.translateElement('services-cta', this.translations.services.cta);

    // Mission section
    this.translateElement('mission-label', this.translations.mission.label);
    this.translateElement('mission-title', this.translations.mission.title);
    this.translateElement('mission-subtitle', this.translations.mission.subtitle);
    this.translateElement('mission-vision-title', this.translations.mission.vision.title);
    this.translateElement('mission-vision-content', this.translations.mission.vision.content);
    this.translateElement('mission-values-title', this.translations.mission.values.title);
    this.translateElement('mission-values-content', this.translations.mission.values.content);

    // Schedule section
    this.translateElement('schedule-form-label', this.translations.schedule.label);
    this.translateElement('schedule-form-title', this.translations.schedule.title);
    this.translateElement('schedule-form-subtitle', this.translations.schedule.subtitle);

    // Form labels and placeholders
    this.translateElement('form-name-label', this.translations.schedule.form.name);
    this.translateElement('form-name', this.translations.schedule.form.name);
    this.translateElement('form-email-label', this.translations.schedule.form.email);
    this.translateElement('form-email', this.translations.schedule.form.email);
    this.translateElement('form-phone-label', this.translations.schedule.form.phone);
    this.translateElement('form-phone', this.translations.schedule.form.phone);
    this.translateElement('form-date-label', this.translations.schedule.form.date);
    this.translateElement('form-date', this.translations.schedule.form.date);
    this.translateElement('form-time-label', this.translations.schedule.form.time);
    this.translateElement('form-waste-label', this.translations.schedule.form.wasteType);
    this.translateElement('form-message-label', this.translations.schedule.form.message);
    this.translateElement('form-message', this.translations.schedule.form.message);
    this.translateElement('form-submit', this.translations.schedule.form.submit);

    // Update waste type options
    this.updateWasteTypeOptions();

    // FAQ section
    this.translateElement('faq-label', this.translations.faq.label);
    this.translateElement('faq-title', this.translations.faq.title);
    this.translateElement('faq-subtitle', this.translations.faq.subtitle);

    // FAQ items
    this.translateElement('faq-question-1', this.translations.faq.questions.q1);
    this.translateElement('faq-answer-1', this.translations.faq.questions.a1);
    this.translateElement('faq-question-2', this.translations.faq.questions.q2);
    this.translateElement('faq-answer-2', this.translations.faq.questions.a2);
    this.translateElement('faq-question-3', this.translations.faq.questions.q3);
    this.translateElement('faq-answer-3', this.translations.faq.questions.a3);

    // Testimonials
    this.translateElement('testimonials-label', this.translations.testimonials.label);
    this.translateElement('testimonials-title', this.translations.testimonials.title);
    this.translateElement('testimonials-subtitle', this.translations.testimonials.subtitle);

    // Blog
    this.translateElement('blog-label', this.translations.blog.label);
    this.translateElement('blog-title', this.translations.blog.title);
    this.translateElement('blog-subtitle', this.translations.blog.subtitle);
    this.translateAllByClass('read-more', this.translations.blog.readMore);

    // Contact bar
    this.translateElement('contact-bar-title', this.translations.contact.newsletter.title);
    this.translateElement('contact-bar-subtitle', this.translations.contact.newsletter.subtitle);
    this.translateElement('newsletter-email', this.translations.contact.newsletter.placeholder);
    this.translateElement('newsletter-submit', this.translations.contact.newsletter.submit);
    this.translateElement('faq-view-all', this.translations.faq.viewAll);
    this.translateElement('blog-view-all', this.translations.blog.viewAll);

    // Footer
    this.translateElement('footer-description', this.translations.footer.aboutText);
    this.translateElement('footer-address', this.translations.footer.contact.address);
    this.translateElement('footer-email', this.translations.footer.contact.email);
    this.translateElement('footer-nav-title', this.translations.footer.navigationTitle);
    this.translateElement('footer-nav-home', this.translations.nav.home);
    this.translateElement('footer-nav-about', this.translations.footer.links.about);
    this.translateElement('footer-nav-services', this.translations.footer.links.services);
    this.translateElement('footer-nav-blog', this.translations.footer.links.blog);
    this.translateElement('footer-nav-contact', this.translations.footer.links.contact);
    this.translateElement('footer-services-title', this.translations.footer.servicesTitle);
    this.translateElement('footer-news-title', this.translations.footer.newsTitle);
    this.translateElement('footer-copyright', this.translations.footer.copyright);
  }

  translateElement(id, text) {
    const element = document.getElementById(id);
    if (element) {
      if (element.tagName === 'INPUT' && element.type === 'submit') {
        element.value = text;
      } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = text;
      } else if (id === 'footer-address') {
        element.textContent = `📍 ${text}`;
      } else if (id === 'footer-email' || id === 'contact-email') {
        element.textContent = `✉️ ${text}`;
      } else {
        element.textContent = text;
      }
    }
  }

  updateWasteTypeOptions() {
    const wasteTypeSelect = document.getElementById('waste-type');
    if (wasteTypeSelect) {
      const options = wasteTypeSelect.querySelectorAll('option');
      options.forEach(option => {
        const value = option.value;
        if (value && this.translations.schedule.form.wasteTypes[value]) {
          option.textContent = this.translations.schedule.form.wasteTypes[value];
        }
      });
    }
  }

  translateAllByClass(className, text) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => {
      el.textContent = text;
    });
  }

  updatePageTitle() {
    const titleElement = document.querySelector('title');
    if (titleElement) {
      if (this.currentLang === 'pt') {
        titleElement.textContent = 'Renoverde – Guiné-Bissau';
      } else if (this.currentLang === 'en') {
        titleElement.textContent = 'Renoverde – Guinea-Bissau';
      } else if (this.currentLang === 'fr') {
        titleElement.textContent = 'Renoverde – Guinée-Bissau';
      }
    }
  }
}

// Initialize multilingual system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.multilingualSystem = new MultilingualSystem();
});