/* ═══════════════════════════════════════════════
   DENZEL OSWARD CHILEWA — Portfolio App JS
   ═══════════════════════════════════════════════ */

'use strict';

// ─── LOADER ───
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 900);
});

// ─── SCROLL PROGRESS ───
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  const bar = document.getElementById('scroll-progress');
  if (bar) bar.style.width = progress + '%';
}

// ─── NAVBAR ───
function handleNavbar() {
  const navbar = document.getElementById('navbar');
  const links = navbar.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const scrolled = window.scrollY > 50;
  navbar.classList.toggle('scrolled', scrolled);

  // Active link tracking
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  links.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${current}`);
  });
}

// ─── TYPED EFFECT ───
const roles = [
  'Data Scientist',
  'Machine Learning Enthusiast',
  'Statistical Analyst',
  'Backend Developer',
  'AI Explorer'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-role');

function type() {
  if (!typedEl) return;
  const current = roles[roleIndex];

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(type, isDeleting ? 60 : 100);
}

// ─── REVEAL ANIMATIONS ───
function initReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), Number(delay));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

// ─── SKILL BARS ───
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = el.dataset.width + '%';
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
}

// ─── GITHUB PROJECTS ───
const LANG_COLORS = {
  JavaScript: '#f7df1e',
  Python:     '#3776ab',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  TypeScript: '#3178c6',
  'Jupyter Notebook': '#f37626',
  R: '#276dc3'
};

const LANG_ICONS = {
  JavaScript: 'fa-brands fa-js',
  Python:     'fa-brands fa-python',
  HTML:       'fa-brands fa-html5',
  CSS:        'fa-brands fa-css3-alt',
  TypeScript: 'fa-brands fa-js',
  R:          'fa-solid fa-chart-bar',
  default:    'fa-solid fa-code'
};

const REPO_ICON = {
  'medicore-hms':            'fa-solid fa-hospital',
  'hisense-flagship-website': 'fa-solid fa-tv',
  'Denzel-portfolio':        'fa-solid fa-user-tie',
  default:                   'fa-solid fa-folder-open'
};

function getRepoIcon(name) {
  return REPO_ICON[name] || REPO_ICON['default'];
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function normalizeRepo(repo) {
  return {
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url || repo.url || repo.homepage || '#',
    language: repo.language,
    stargazers_count: repo.stargazers_count ?? repo.stars ?? 0,
    forks_count: repo.forks_count ?? repo.forks ?? 0,
    updated_at: repo.updated_at || repo.updatedAt || new Date().toISOString(),
    fork: repo.fork
  };
}

function renderProjects(repos) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  repos = (repos || []).map(normalizeRepo);

  if (!repos || repos.length === 0) {
    grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No public repositories found.</p></div>';
    return;
  }

  grid.innerHTML = repos.map((repo, i) => {
    const lang = repo.language || 'Code';
    const langColor = LANG_COLORS[lang] || '#64748b';
    const langIcon = LANG_ICONS[lang] || LANG_ICONS['default'];
    const repoIcon = getRepoIcon(repo.name);
    const rawDesc = (repo.description || '').trim();
    const desc = rawDesc.length > 12 && !/^(m|project|hospital system)$/i.test(rawDesc)
      ? rawDesc
      : inferDescription(repo.name);
    const delay = i * 80;

    return `
      <div class="col-md-6 col-lg-4 reveal-up" data-delay="${delay}">
        <div class="project-card">
          <div class="project-img-wrap">
            <div class="project-img-overlay"></div>
            <i class="${repoIcon} project-icon-large"></i>
          </div>
          <div class="project-body">
            <div class="project-lang">
              <span class="lang-dot" style="background:${langColor}"></span>
              ${lang}
            </div>
            <h3 class="project-title">${formatRepoName(repo.name)}</h3>
            <p class="project-desc">${desc}</p>
            <div class="project-meta">
              <span><i class="fa-solid fa-star"></i>${repo.stargazers_count}</span>
              <span><i class="fa-solid fa-code-fork"></i>${repo.forks_count}</span>
              <span><i class="fa-solid fa-clock"></i>${formatDate(repo.updated_at)}</span>
            </div>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
              <i class="fa-brands fa-github"></i> View Repository <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-run reveal for new elements
  initReveal();
}

function formatRepoName(name) {
  return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function inferDescription(name) {
  const map = {
    'Denzel-portfolio':        'A modern, responsive personal portfolio website showcasing data science and development work.',
    'hisense-flagship-website': 'A flagship product website for Hisense electronics built with HTML, CSS, and JavaScript.',
    'medicore-hms':             'MediCore Hospital Management System — a full-featured platform for managing hospital operations and patient records.'
  };
  return map[name] || 'A project built with passion and clean code architecture.';
}

function selectRepos(repos) {
  const list = Array.isArray(repos) ? repos : [];
  const filtered = list.filter(repo => !repo.fork && !/portfolio/i.test(repo.name || ''));
  return (filtered.length ? filtered : list).slice(0, 6);
}

async function fetchGitHubProjects() {
  const grid = document.getElementById('projects-grid');
  try {
    const api = window.PORTFOLIO_API;
    if (api) {
      const apiRes = await fetch(`${api}/api/projects`, { signal: AbortSignal.timeout(4000) });
      if (apiRes.ok) {
        const payload = await apiRes.json();
        const repos = payload.data || payload.projects || payload;
        if (Array.isArray(repos) && repos.length) {
          renderProjects(selectRepos(repos));
          return;
        }
      }
    }
    const res = await fetch('https://api.github.com/users/D4denzoo/repos?sort=updated&per_page=30');
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const repos = await res.json();
    renderProjects(selectRepos(repos));
  } catch (err) {
    console.warn('GitHub API fetch failed, using local data:', err.message);
    // Fallback to known repos
    renderProjects([
      {
        name: 'Denzel-portfolio',
        description: null,
        html_url: 'https://github.com/D4denzoo/Denzel-portfolio',
        language: 'JavaScript',
        stargazers_count: 0,
        forks_count: 0,
        updated_at: '2026-05-26T10:45:47Z'
      },
      {
        name: 'medicore-hms',
        description: 'hospital system',
        html_url: 'https://github.com/D4denzoo/medicore-hms',
        language: 'HTML',
        stargazers_count: 0,
        forks_count: 0,
        updated_at: '2026-05-26T10:37:14Z'
      },
      {
        name: 'hisense-flagship-website',
        description: 'project',
        html_url: 'https://github.com/D4denzoo/hisense-flagship-website',
        language: 'HTML',
        stargazers_count: 0,
        forks_count: 0,
        updated_at: '2026-05-26T11:27:37Z'
      }
    ]);
  }
}

// ─── CONTACT FORM ───
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');

    if (!name || !email || !subject || !message) {
      showFeedback(feedback, 'error', 'Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback(feedback, 'error', 'Please enter a valid email address.');
      return;
    }

    const api = String(window.PORTFOLIO_API || '').trim().replace(/\/$/, '');
    if (!api) {
      showFeedback(feedback, 'error', 'The contact service is not configured. Please try again later.');
      return;
    }

    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';

    try {
      const res = await fetch(`${api}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      let data = {};
      try {
        data = await res.json();
      } catch (parseError) {
        data = {};
      }

      if (!res.ok || data.success === false) {
        showFeedback(feedback, 'error', 'Unable to send your message right now. Please try again later.');
        return;
      }

      showFeedback(feedback, 'success', 'Your message has been sent successfully.');
      form.reset();
    } catch (err) {
      showFeedback(feedback, 'error', 'Unable to send your message right now. Please try again later.');
    } finally {
      submitBtn.disabled = false;
      btnText.style.display = 'inline-flex';
      btnLoading.style.display = 'none';
    }
  });
}

function showFeedback(el, type, msg) {
  el.textContent = msg;
  el.className = `form-feedback ${type}`;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (type === 'success') setTimeout(() => { el.style.display = 'none'; }, 6000);
}

// ─── SCROLL TO TOP ───
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
}

// ─── SMOOTH NAV CLOSE ON MOBILE ───
function initMobileNav() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('navbarNav');
      if (collapse && collapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}

// ─── SCROLL EVENTS ───
window.addEventListener('scroll', () => {
  updateScrollProgress();
  handleNavbar();
}, { passive: true });

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  handleNavbar();
  updateScrollProgress();
  initReveal();
  initSkillBars();
  initContactForm();
  initScrollTop();
  initMobileNav();
  fetchGitHubProjects();
  setTimeout(type, 800);
});
