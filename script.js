/**
 * Portfolio Interactive Scripts
 * - Floating Ember Particles Engine
 * - Smooth Navigation & Scroll Spy
 * - Stats Counter Animation
 * - Skill Bar Fill Animation
 * - Video Showreel Modal
 * - Mobile Navigation Drawer
 * - Form Submission Simulation
 */

(function () {
  'use strict';

  // ─── 0. Page Preloader (0% to 100%) ───────────────────────
  const preloader = document.getElementById('pagePreloader');
  const preloaderPercent = document.getElementById('preloaderPercent');
  const preloaderProgressBar = document.getElementById('preloaderProgressBar');

  if (preloader && preloaderPercent && preloaderProgressBar) {
    document.body.style.overflow = 'hidden';
    const duration = 1600; // ms
    const startTime = performance.now();

    function updatePreloader(currentTime) {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - rawProgress, 3);
      const progress = Math.floor(easeProgress * 100);

      preloaderPercent.textContent = `${progress}%`;
      preloaderProgressBar.style.width = `${progress}%`;

      if (rawProgress < 1) {
        requestAnimationFrame(updatePreloader);
      } else {
        preloaderPercent.textContent = '100%';
        preloaderProgressBar.style.width = '100%';

        setTimeout(() => {
          preloader.classList.add('fade-out');
          document.body.style.overflow = '';
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 850);
        }, 250);
      }
    }

    requestAnimationFrame(updatePreloader);
  }

  // ─── 1. Floating Ember Sparks Canvas Engine ────────────────
  const canvas = document.getElementById('ember-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 65;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class EmberParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.size = Math.random() * 2.5 + 1;
        this.speedY = Math.random() * 0.9 + 0.35;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.fadeRate = Math.random() * 0.003 + 0.001;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.02 + 0.01;

        // Ember colors: fiery red, vibrant orange, molten gold
        const colorPalette = [
          'rgba(255, 60, 0, ',
          'rgba(255, 110, 0, ',
          'rgba(255, 160, 20, ',
          'rgba(255, 200, 50, '
        ];
        this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      }

      update() {
        this.y -= this.speedY;
        this.swayAngle += this.swaySpeed;
        this.x += Math.sin(this.swayAngle) * 0.5 + this.speedX;
        this.opacity -= this.fadeRate;

        if (this.y < -10 || this.opacity <= 0 || this.x < -10 || this.x > width + 10) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.shadowBlur = this.size * 5;
        ctx.shadowColor = '#ff4d00';
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new EmberParticle());
    }

    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    function animateEmbers() {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
        }
      }
      requestAnimationFrame(animateEmbers);
    }

    animateEmbers();
  }

  // ─── 2. Navbar Scroll Behavior & Smooth Links ─────────────
  const nav = document.getElementById('nav');
  const scrollThreshold = 50;

  function updateNavScroll() {
    if (window.scrollY > scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();

  // Smooth scroll for anchor tags
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navOffset = nav ? nav.offsetHeight : 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset + 10;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Close mobile nav if open
      closeMobileNav();
    });
  });

  // ─── 3. Scroll Reveal Animations (Intersection Observer) ──
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ─── 4. Animated Number Counters ──────────────────────────
  const statCounts = document.querySelectorAll('.stat-count');
  let animatedStats = false;

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          statCounts.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            const duration = 1800; // ms
            const frameDuration = 1000 / 60;
            const totalFrames = Math.round(duration / frameDuration);
            let frame = 0;

            const counterTimer = setInterval(() => {
              frame++;
              const progress = frame / totalFrames;
              // Ease out quart
              const easeOut = 1 - Math.pow(1 - progress, 4);
              const current = Math.round(easeOut * target);

              counter.textContent = current;

              if (frame === totalFrames) {
                clearInterval(counterTimer);
                counter.textContent = target;
              }
            }, frameDuration);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStatsRow = document.querySelector('.hero-stats-row');
  if (heroStatsRow) {
    countObserver.observe(heroStatsRow);
  }

  // ─── 5. Skill Bars Animation ──────────────────────────────
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-width');
          entry.target.style.width = width + '%';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  skillFills.forEach((fill) => skillObserver.observe(fill));

  // ─── 6. Active Nav Link on Scroll ─────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  function highlightActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  // ─── 7. Showreel Video Modal ──────────────────────────────
  const openShowreelBtn = document.getElementById('openShowreelBtn');
  const closeVideoModal = document.getElementById('closeVideoModal');
  const videoModal = document.getElementById('videoModal');
  const showreelPlayer = document.getElementById('showreelPlayer');

  function openModal() {
    if (!videoModal) return;
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (showreelPlayer) {
      showreelPlayer.currentTime = 0;
      showreelPlayer.play().catch(() => {});
    }
  }

  function closeModal() {
    if (!videoModal) return;
    videoModal.classList.remove('open');
    document.body.style.overflow = '';
    if (showreelPlayer) {
      showreelPlayer.pause();
    }
  }

  if (openShowreelBtn) {
    openShowreelBtn.addEventListener('click', openModal);
  }

  if (closeVideoModal) {
    closeVideoModal.addEventListener('click', closeModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('open')) {
      closeModal();
    }
  });

  // ─── 8. Mobile Navigation Drawer ──────────────────────────
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  function toggleMobileNav() {
    mobileMenuBtn.classList.toggle('active');
    mobileNav.classList.toggle('open');
  }

  function closeMobileNav() {
    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.classList.remove('active');
      mobileNav.classList.remove('open');
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileNav);
  }

  // ─── 9. Form Submission Handler ───────────────────────────
  window.handleFormSubmit = function (event) {
    event.preventDefault();
    const form = document.getElementById('contactForm');
    const statusMsg = document.getElementById('formStatusMsg');
    const submitBtn = form.querySelector('.btn-submit');

    if (!form || !statusMsg) return;

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>SENDING...</span>';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.opacity = '1';
      submitBtn.disabled = false;

      statusMsg.className = 'form-status-msg success';
      statusMsg.textContent = '⚡ Thank you! Your message has been sent successfully. I will get back to you shortly.';
      form.reset();

      setTimeout(() => {
        statusMsg.textContent = '';
      }, 6000);
    }, 1200);
  };

  // ─── 10. Subtle Interactive Tilt on Showcase Cards ────────
  const cards = document.querySelectorAll('.service-card, .project-showcase-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ─── 11. Floating Scroll-To-Top Arrow Button ──────────────
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

})();
