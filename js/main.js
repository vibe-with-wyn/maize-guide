/* ============================================
   MaizeGuide - Main JavaScript
   ============================================ */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
    // Lock body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu when clicking a link
  navMenu.querySelectorAll('.navbar-link, .navbar-mobile-auth a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ---- Scroll reveal animations ----
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 100;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 0;
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset - 20,
        behavior: 'smooth'
      });
    }
  });
});

// ---- Active nav link based on scroll position ----
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-link');
  
  if (!sections.length || !navLinks.length) return;

  let current = '';
  const offset = navbar ? navbar.offsetHeight + 100 : 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - offset;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ---- Counter animation (for hero stats) ----
function animateCounters() {
  const counters = document.querySelectorAll('.hero-stat-value');
  
  counters.forEach(counter => {
    const text = counter.textContent;
    const hasK = text.includes('K');
    const hasPercent = text.includes('%');
    const target = parseFloat(text.replace(/[^0-9.]/g, ''));
    
    if (isNaN(target)) return;
    
    let current = 0;
    const increment = target / 60;
    const duration = 1500;
    const stepTime = duration / 60;

    const animate = () => {
      current += increment;
      if (current >= target) {
        current = target;
        counter.textContent = text; // Restore original text
        return;
      }

      let display = Math.floor(current);
      if (hasK) display = display + 'K+';
      else if (hasPercent) display = display + '%';
      else display = display.toString();
      
      counter.textContent = display;
      setTimeout(animate, stepTime);
    };

    // Only animate if element is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

// Run counter animation on load
window.addEventListener('load', animateCounters);

// ---- Tooltip positioning fix for edge cases ----
document.querySelectorAll('[data-tooltip]').forEach(el => {
  el.addEventListener('mouseenter', function() {
    const rect = this.getBoundingClientRect();
    if (rect.top < 60) {
      this.style.setProperty('--tooltip-position', 'below');
    }
  });
});

// ---- Year in footer (dynamic) ----
document.querySelectorAll('.footer-bottom p').forEach(p => {
  const year = new Date().getFullYear();
  p.textContent = p.textContent.replace(/\d{4}/, year);
});

console.log('%c🌽 MaizeGuide', 'color: #16a34a; font-size: 18px; font-weight: bold;');
console.log('%cSmart Corn Crop Planning System', 'color: #64748b; font-size: 12px;');
