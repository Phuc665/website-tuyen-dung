// ===================================================
// JOBVIET - MAIN APPLICATION SCRIPT
// ===================================================

// ===== STATE =====
let currentFilter = 'all';
let currentRole = 'candidate';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderJobs();
  renderCompanies();
  renderTestimonials();
  renderBlog();
  initScrollEffects();
  initNavbar();
  animateNumbers();
  addFadeInClasses();
});

// ===== RENDER CATEGORIES =====
function renderCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map((cat, i) => `
    <div class="category-card fade-in" style="animation-delay:${i * 0.05}s" onclick="quickSearch('${cat.name}')">
      <div class="cat-icon">${cat.icon}</div>
      <div class="cat-name">${cat.name}</div>
      <div class="cat-count">${cat.count.toLocaleString('vi-VN')} việc làm</div>
    </div>
  `).join('');
}

// ===== RENDER JOBS =====
function renderJobs(filter = 'all') {
  const grid = document.getElementById('jobs-grid');
  if (!grid) return;
  const filtered = filter === 'all' ? JOBS : JOBS.filter(j => j.type === filter);
  grid.innerHTML = filtered.map((job, i) => `
    <div class="job-card fade-in" style="animation-delay:${i * 0.07}s" onclick="showJobDetail(${job.id})">
      <div class="job-card-top">
        <div class="job-logo">${job.logo}</div>
        <div class="job-info">
          <div class="job-title">${job.title}</div>
          <div class="job-company">${job.company}</div>
        </div>
        <span class="job-badge badge-${job.type}">${getTypeLabel(job.type)}</span>
      </div>
      <div class="job-tags">
        ${job.tags.map(t => `<span class="job-tag">${t}</span>`).join('')}
      </div>
      <div class="job-footer">
        <div class="job-salary">${job.salary}</div>
        <div class="job-meta">
          <span class="job-location">📍 ${job.location}</span>
          <span class="job-time">🕐 ${job.time}</span>
        </div>
      </div>
    </div>
  `).join('');
  // Re-observe fade-in elements
  observeFadeIns();
}

// ===== RENDER COMPANIES =====
function renderCompanies() {
  const grid = document.getElementById('companies-grid');
  if (!grid) return;
  grid.innerHTML = COMPANIES.map((c, i) => `
    <div class="company-card fade-in" style="animation-delay:${i * 0.07}s">
      <div class="company-logo">${c.logo}</div>
      <div class="company-name">${c.name}</div>
      <div class="company-industry">${c.industry}</div>
      <span class="company-jobs">${c.jobs} việc làm</span>
    </div>
  `).join('');
  observeFadeIns();
}

// ===== RENDER TESTIMONIALS =====
function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;
  grid.innerHTML = TESTIMONIALS.map((t, i) => `
    <div class="testimonial-card fade-in" style="animation-delay:${i * 0.1}s">
      <div class="testimonial-stars">${'⭐'.repeat(t.stars)}</div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <div class="author-avatar">${t.avatar}</div>
        <div>
          <div class="author-name">${t.name}</div>
          <div class="author-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');
  observeFadeIns();
}

// ===== RENDER BLOG =====
function renderBlog() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;
  grid.innerHTML = BLOG_POSTS.map((post, i) => `
    <div class="blog-card fade-in" style="animation-delay:${i * 0.1}s">
      <div class="blog-img">
        <div class="blog-img-overlay"></div>
        ${post.emoji}
      </div>
      <div class="blog-content">
        <span class="blog-category">${post.category}</span>
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-excerpt">${post.excerpt}</p>
        <div class="blog-footer">
          <span class="blog-author">✍️ ${post.author}</span>
          <span class="blog-read">📖 ${post.readTime}</span>
        </div>
      </div>
    </div>
  `).join('');
  observeFadeIns();
}

// ===== HELPER =====
function getTypeLabel(type) {
  const map = { fulltime: 'Toàn thời gian', parttime: 'Bán thời gian', remote: 'Remote', intern: 'Thực tập' };
  return map[type] || type;
}

// ===== FILTER JOBS =====
function filterJobs(type) {
  currentFilter = type;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`filter-${type}`);
  if (activeBtn) activeBtn.classList.add('active');
  renderJobs(type);
}

// ===== SEARCH =====
function searchJobs() {
  const keyword = document.getElementById('search-keyword').value.trim();
  const location = document.getElementById('search-location').value;
  if (keyword || location) {
    showToast(`🔍 Đang tìm kiếm: "${keyword || 'Tất cả'}"${location ? ` tại ${getLocationName(location)}` : ''}`, '🔍');
    document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
  } else {
    showToast('⚠️ Vui lòng nhập từ khóa tìm kiếm!', '⚠️');
  }
}

function quickSearch(keyword) {
  document.getElementById('search-keyword').value = keyword;
  searchJobs();
}

function getLocationName(val) {
  const map = { hcm: 'TP.HCM', hn: 'Hà Nội', dn: 'Đà Nẵng', ct: 'Cần Thơ', hp: 'Hải Phòng', other: 'Tỉnh khác' };
  return map[val] || val;
}

// ===== JOB DETAIL MODAL =====
function showJobDetail(id) {
  const job = JOBS.find(j => j.id === id);
  if (!job) return;
  const content = document.getElementById('job-detail-content');
  content.innerHTML = `
    <div class="job-detail-header">
      <div class="job-detail-logo">${job.logo}</div>
      <h2 class="job-detail-title">${job.title}</h2>
      <div class="job-detail-company">${job.company}</div>
      <div class="job-detail-badges">
        <span class="job-badge badge-${job.type}">${getTypeLabel(job.type)}</span>
        ${job.tags.map(t => `<span class="job-tag">${t}</span>`).join('')}
      </div>
    </div>
    <div class="job-detail-info-grid">
      <div class="job-info-item">
        <div class="job-info-label">💰 Mức lương</div>
        <div class="job-info-value">${job.salary}</div>
      </div>
      <div class="job-info-item">
        <div class="job-info-label">📍 Địa điểm</div>
        <div class="job-info-value">${job.location}</div>
      </div>
      <div class="job-info-item">
        <div class="job-info-label">⏰ Hạn nộp hồ sơ</div>
        <div class="job-info-value">${job.deadline}</div>
      </div>
      <div class="job-info-item">
        <div class="job-info-label">🕐 Đăng</div>
        <div class="job-info-value">${job.time}</div>
      </div>
    </div>
    <div class="job-detail-section">
      <h3 class="job-detail-section-title">Mô tả công việc</h3>
      <p style="font-size:14px;color:var(--text-light);line-height:1.8">${job.description}</p>
    </div>
    <div class="job-detail-section">
      <h3 class="job-detail-section-title">Yêu cầu ứng viên</h3>
      <ul>${job.requirements.map(r => `<li>${r}</li>`).join('')}</ul>
    </div>
    <div class="job-detail-section">
      <h3 class="job-detail-section-title">Quyền lợi</h3>
      <ul>${job.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
    </div>
    <button class="btn-apply" onclick="applyJob(${job.id})">🚀 Ứng Tuyển Ngay</button>
  `;
  showModal('jobModal');
}

function applyJob(id) {
  const job = JOBS.find(j => j.id === id);
  closeModal('jobModal');
  showToast(`✅ Đã gửi hồ sơ cho vị trí "${job.title}" thành công!`, '✅');
}

function viewAllJobs() {
  filterJobs('all');
  document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
  showToast('Đang hiển thị tất cả việc làm', '📋');
}

// ===== MODALS =====
function showModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}
function closeModalOutside(event, id) {
  if (event.target.id === id) closeModal(id);
}
function switchModal(from, to) {
  closeModal(from);
  setTimeout(() => showModal(to), 200);
}

// ===== AUTH FORMS =====
function handleLogin(event) {
  event.preventDefault();
  const btn = document.getElementById('login-submit');
  btn.textContent = 'Đang đăng nhập...';
  btn.disabled = true;
  setTimeout(() => {
    closeModal('loginModal');
    showToast('🎉 Đăng nhập thành công! Chào mừng bạn!', '🎉');
    btn.textContent = 'Đăng Nhập';
    btn.disabled = false;
  }, 1200);
}

function handleRegister(event) {
  event.preventDefault();
  const btn = document.getElementById('register-submit');
  btn.textContent = 'Đang tạo tài khoản...';
  btn.disabled = true;
  setTimeout(() => {
    closeModal('registerModal');
    showToast('🚀 Tạo tài khoản thành công! Chào mừng bạn đến với JobViet!', '🚀');
    btn.textContent = 'Tạo Tài Khoản';
    btn.disabled = false;
  }, 1500);
}

// ===== ROLE SWITCH =====
function switchRole(role) {
  currentRole = role;
  document.getElementById('role-candidate').classList.toggle('active', role === 'candidate');
  document.getElementById('role-employer').classList.toggle('active', role === 'employer');
  const companyField = document.getElementById('company-field');
  if (companyField) companyField.style.display = role === 'employer' ? 'block' : 'none';
}

// ===== PASSWORD TOGGLE =====
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ===== NAVBAR =====
function initNavbar() {
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
    const scrollTop = document.getElementById('scroll-top');
    if (scrollTop) scrollTop.classList.toggle('visible', window.scrollY > 400);
  });
}

function toggleMenu() {
  const links = document.getElementById('nav-links');
  if (links) links.classList.toggle('open');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== SMOOTH SCROLL NAV =====
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      document.getElementById('nav-links')?.classList.remove('open');
    }
  });
});

// ===== TOAST =====
let toastTimeout;
function showToast(message, icon = '✅') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');
  if (!toast) return;
  toastMsg.textContent = message;
  toastIcon.textContent = icon;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== ANIMATE NUMBERS =====
function animateNumbers() {
  const elements = document.querySelectorAll('.stat-number[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = Date.now();
        const step = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.floor(eased * target);
          el.textContent = value >= 1000 ? (value / 1000).toFixed(1) + 'K+' : value;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target >= 1000 ? (target / 1000).toFixed(0) + 'K+' : target;
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  elements.forEach(el => observer.observe(el));
}

// ===== SCROLL FADE-IN =====
function addFadeInClasses() {
  const sections = document.querySelectorAll('.section-header, .step-card, .testimonial-card, .blog-card, .category-card, .company-card');
  sections.forEach(el => el.classList.add('fade-in'));
  observeFadeIns();
}

function observeFadeIns() {
  const elements = document.querySelectorAll('.fade-in:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  elements.forEach(el => observer.observe(el));
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }, { passive: true });
}

// ===== ENTER KEY SEARCH =====
document.getElementById('search-keyword')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchJobs();
});
