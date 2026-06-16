/* ============================================
   MAYUR VAIDYA — PORTFOLIO INTERACTIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ========== TYPING EFFECT ==========
  const typedTextEl = document.getElementById('typedText');
  const roles = [
    'Engineer',
    'Researcher',
    'Technical Leader',
    'Event Organizer',
    'IEEE Member',
    'Community Builder',
    'Innovator',
    'Problem Solver'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before next word
    }

    setTimeout(typeRole, typingSpeed);
  }

  typeRole();

  // ========== STICKY NAVIGATION ==========
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ========== SCROLL SPY ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ========== MOBILE MENU ==========
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function toggleMenu() {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
  }

  navToggle.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', toggleMenu);

  // Close on link click
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ========== SCROLL REVEAL ==========
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========== COUNTER ANIMATION ==========
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (counters.length > 0) {
    counterObserver.observe(counters[0].closest('.metrics-bar'));
  }

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ========== TIMELINE EXPAND ==========
  document.querySelectorAll('.timeline-expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.timeline-item');
      item.classList.toggle('expanded');
    });
  });

  // Also allow clicking the card itself
  document.querySelectorAll('.timeline-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.timeline-expand')) return;
      const item = card.closest('.timeline-item');
      item.classList.toggle('expanded');
    });
  });

  // ========== PROJECT FILTER ==========
  const projectFilters = document.getElementById('projectFilters');
  const projectCards = document.querySelectorAll('#projectsGrid .project-card');

  if (projectFilters) {
    projectFilters.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-tab')) {
        // Update active tab
        projectFilters.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');

        const filter = e.target.getAttribute('data-filter');

        projectCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      }
    });
  }

  // ========== GALLERY FILTER ==========
  const galleryFilters = document.getElementById('galleryFilters');
  const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item');

  if (galleryFilters) {
    galleryFilters.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-tab')) {
        galleryFilters.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');

        const filter = e.target.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
            item.style.opacity = '0';
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease';
              item.style.opacity = '1';
            });
          } else {
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      }
    });
  }

  // ========== MEDIA LIGHTBOX ==========
  const lightbox = document.getElementById('mediaLightbox');
  const lightboxMediaContainer = document.getElementById('lightboxMediaContainer');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  
  let currentMediaList = [];
  let currentMediaIndex = 0;

  function openLightbox(mediaElements, startIndex) {
    currentMediaList = Array.from(mediaElements).map(el => {
      if (el.tagName === 'IMG') {
        return {
          type: 'image',
          src: el.getAttribute('src'),
          alt: el.getAttribute('alt') || 'Image'
        };
      } else if (el.tagName === 'VIDEO') {
        return {
          type: 'video',
          src: el.getAttribute('src'),
          alt: el.getAttribute('alt') || 'Video'
        };
      } else if (el.querySelector('video')) {
        const video = el.querySelector('video');
        return {
          type: 'video',
          src: video.getAttribute('src'),
          alt: video.getAttribute('alt') || 'Video'
        };
      }
      return null;
    }).filter(Boolean);

    currentMediaIndex = startIndex;
    updateLightbox();
    if (lightbox) {
      lightbox.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    if (currentMediaList.length === 0 || !lightboxMediaContainer) return;
    const media = currentMediaList[currentMediaIndex];
    lightboxMediaContainer.innerHTML = '';

    if (media.type === 'image') {
      const img = document.createElement('img');
      img.src = media.src;
      img.alt = media.alt;
      lightboxMediaContainer.appendChild(img);
    } else if (media.type === 'video') {
      const video = document.createElement('video');
      video.src = media.src;
      video.controls = true;
      video.autoplay = true;
      video.style.outline = 'none';
      lightboxMediaContainer.appendChild(video);
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = media.alt;
    }
  }

  function closeLightbox() {
    if (lightboxMediaContainer) lightboxMediaContainer.innerHTML = '';
    if (lightbox) lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextMedia() {
    currentMediaIndex = (currentMediaIndex + 1) % currentMediaList.length;
    updateLightbox();
  }

  function prevMedia() {
    currentMediaIndex = (currentMediaIndex - 1 + currentMediaList.length) % currentMediaList.length;
    updateLightbox();
  }

  if (lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextMedia);
    lightboxPrev.addEventListener('click', prevMedia);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextMedia();
      if (e.key === 'ArrowLeft') prevMedia();
    });

    // Touch swipe support for lightbox
    let touchStartX = 0;
    let touchEndX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextMedia();
        else prevMedia();
      }
    }, { passive: true });
  }

  // Bind lightbox click handlers to all image and video elements
  document.querySelectorAll('.leadership-slider-track, .publication-media-scroll').forEach(container => {
    const trackChildren = Array.from(container.children).filter(el => {
      return el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.classList.contains('slider-video-card');
    });
    
    const isLeadershipSlider = container.classList.contains('leadership-slider-track');
    const totalCount = trackChildren.length;
    // For leadership sliders, we only cycle through the first loop in lightbox to avoid duplicates
    const originalCount = isLeadershipSlider ? totalCount / 2 : totalCount;
    const clickableMedia = trackChildren.slice(0, originalCount);
    
    trackChildren.forEach((child, index) => {
      const originalIndex = index % originalCount;
      child.style.cursor = 'pointer';
      child.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(clickableMedia, originalIndex);
      });
    });
  });

  // ========== CONTACT FORM ==========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Message Sent!
      `;
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      btn.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.3)';
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.boxShadow = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ========== PARALLAX EFFECT (Hero) ==========
  const heroContent = document.querySelector('.hero-content');
  const heroImage = document.querySelector('.hero-image');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      const parallaxAmount = scrollY * 0.15;
      if (heroContent) {
        heroContent.style.transform = `translateY(${parallaxAmount}px)`;
        heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
      }
      if (heroImage) {
        heroImage.style.transform = `translateY(${parallaxAmount * 0.5}px)`;
      }
    }
  }, { passive: true });

  // ========== CURSOR GLOW EFFECT ON CARDS ==========
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--glow-x', `${x}px`);
      card.style.setProperty('--glow-y', `${y}px`);
      card.style.background = `
        radial-gradient(
          300px circle at ${x}px ${y}px,
          rgba(99, 102, 241, 0.06),
          transparent 60%
        ),
        rgba(255, 255, 255, 0.03)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // ========== DYNAMIC MEDIA LOADER & HARDWARE SLIDERS ==========
  function checkFileExists(url) {
    // Try fetch with HEAD method first
    return fetch(url, { method: 'HEAD' })
      .then(res => res.ok)
      .catch(() => {
        // Fallback to manual loading checks if fetch fails (e.g. CORS/file://)
        return new Promise((resolve) => {
          const isVideo = url.toLowerCase().endsWith('.mp4') || 
                          url.toLowerCase().endsWith('.webm') || 
                          url.toLowerCase().endsWith('.ogg') ||
                          url.toLowerCase().endsWith('.mov');
          
          if (isVideo) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            
            const timer = setTimeout(() => {
              video.onloadedmetadata = null;
              video.onerror = null;
              resolve(false);
            }, 1000); // 1s timeout
            
            video.onloadedmetadata = () => {
              clearTimeout(timer);
              resolve(true);
            };
            video.onerror = () => {
              clearTimeout(timer);
              resolve(false);
            };
            video.src = url;
            video.load(); // Force browser request
          } else {
            const img = new Image();
            const timer = setTimeout(() => {
              img.onload = null;
              img.onerror = null;
              resolve(false);
            }, 1000); // 1s timeout
            
            img.onload = () => {
              clearTimeout(timer);
              resolve(true);
            };
            img.onerror = () => {
              clearTimeout(timer);
              resolve(false);
            };
            img.src = url;
          }
        });
      });
  }

  async function loadFolderMedia(folderPath, fallbackPattern, fallbackCount, fallbackFolder) {
    try {
      const response = await fetch(folderPath);
      if (!response.ok) throw new Error('Failed to fetch folder');
      const text = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'));
      
      const mediaFiles = [];
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        const decodedHref = decodeURIComponent(href);
        const filename = decodedHref.split('/').pop();
        
        if (filename.startsWith('.') || filename === '..' || href.includes('?')) return;
        
        const ext = filename.split('.').pop().toLowerCase();
        const isImg = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
        const isVid = ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
        
        if (isImg || isVid) {
          const fullPath = folderPath.endsWith('/') ? `${folderPath}${filename}` : `${folderPath}/${filename}`;
          mediaFiles.push({
            type: isImg ? 'image' : 'video',
            src: fullPath,
            name: filename
          });
        }
      });
      
      if (mediaFiles.length > 0) {
        return mediaFiles;
      }
    } catch (e) {
      console.warn(`Could not fetch directory listing for ${folderPath}, falling back to sequential scan.`, e);
    }
    
    // Fallback: Sequential scanning (CORS or file:// protocol fallback)
    const mediaFiles = [];
    const fallbackPath = fallbackFolder || folderPath;
    if (fallbackPattern && fallbackCount > 0) {
      const ext = fallbackPattern.split('.').pop();
      const baseName = fallbackPattern.replace(`-1.${ext}`, '');
      
      // 1. Scan for sequentially named images
      for (let i = 1; i <= fallbackCount; i++) {
        const src = `${fallbackPath}/${baseName}-${i}.${ext}`;
        const exists = await checkFileExists(src);
        if (exists) {
          mediaFiles.push({
            type: 'image',
            src: src,
            name: `${baseName}-${i}.${ext}`
          });
        }
      }

      // 2. Scan for sequentially named videos (e.g. vyoma2026-video-1.mp4)
      for (let i = 1; i <= 5; i++) {
        const src = `${fallbackPath}/${baseName}-video-${i}.mp4`;
        const exists = await checkFileExists(src);
        if (exists) {
          mediaFiles.push({
            type: 'video',
            src: src,
            name: `${baseName}-video-${i}.mp4`
          });
        }
      }
    }
    return mediaFiles;
  }

  function checkFileExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => {
        const video = document.createElement('video');
        video.src = url;
        video.onloadedmetadata = () => resolve(true);
        video.onerror = () => resolve(false);
      };
      img.src = url;
    });
  }

  function waitForImagesToLoad(container) {
    const mediaElements = Array.from(container.querySelectorAll('img, video'));
    const promises = mediaElements.map(el => {
      if (el.tagName === 'IMG') {
        if (el.complete) return Promise.resolve();
        return new Promise(resolve => {
          el.onload = resolve;
          el.onerror = resolve;
        });
      } else if (el.tagName === 'VIDEO') {
        if (el.readyState >= 1) return Promise.resolve();
        return new Promise(resolve => {
          el.onloadedmetadata = resolve;
          el.onerror = resolve;
        });
      }
      return Promise.resolve();
    });
    return Promise.all(promises);
  }

  function setupHardwareSlider(slider, track, originalCount) {
    // Disable CSS loop animation so JS can control compositor transforms
    track.style.animation = 'none';

    const loopWidth = track.scrollWidth / 2;
    const speedSec = parseFloat(slider.getAttribute('data-speed')) || 30;
    const fps = 60;
    const totalFrames = speedSec * fps;
    const pxPerFrame = loopWidth / totalFrames;
    
    let transformX = 0;
    let isPaused = false;
    let autoplayTimer = null;
    let transitionTimer = null;
    let animationFrameId;

    function step() {
      if (!isPaused) {
        transformX += pxPerFrame;
        if (transformX >= loopWidth) {
          transformX = 0;
        }
        track.style.transform = `translate3d(${-transformX}px, 0, 0)`;
      }
      animationFrameId = requestAnimationFrame(step);
    }
    
    animationFrameId = requestAnimationFrame(step);
    
    function pauseAutoplay() {
      isPaused = true;
      if (autoplayTimer) clearTimeout(autoplayTimer);
    }
    
    function resumeAutoplayAfterDelay() {
      if (autoplayTimer) clearTimeout(autoplayTimer);
      autoplayTimer = setTimeout(() => {
        isPaused = false;
      }, 1500);
    }

    slider.addEventListener('mouseenter', pauseAutoplay);
    slider.addEventListener('mouseleave', resumeAutoplayAfterDelay);
    slider.addEventListener('touchstart', pauseAutoplay, { passive: true });
    slider.addEventListener('touchend', resumeAutoplayAfterDelay, { passive: true });
    
    const showcase = slider.closest('.leadership-showcase');
    if (showcase) {
      const prevBtn = showcase.querySelector('.slider-arrow-prev');
      const nextBtn = showcase.querySelector('.slider-arrow-next');
      
      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          pauseAutoplay();
          
          if (transitionTimer) clearTimeout(transitionTimer);
          
          const firstChild = track.firstElementChild;
          const slideWidth = firstChild ? firstChild.offsetWidth + 16 : 330 + 16;
          
          let target = transformX - slideWidth;
          if (target < 0) {
            transformX = loopWidth + transformX;
            track.style.transform = `translate3d(${-transformX}px, 0, 0)`;
            track.offsetHeight; // force reflow
            
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            transformX = loopWidth + target;
            track.style.transform = `translate3d(${-transformX}px, 0, 0)`;
          } else {
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            transformX = target;
            track.style.transform = `translate3d(${-transformX}px, 0, 0)`;
          }
          
          transitionTimer = setTimeout(() => {
            track.style.transition = 'none';
          }, 500);
          
          resumeAutoplayAfterDelay();
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          pauseAutoplay();
          
          if (transitionTimer) clearTimeout(transitionTimer);
          
          const firstChild = track.firstElementChild;
          const slideWidth = firstChild ? firstChild.offsetWidth + 16 : 330 + 16;
          
          let target = transformX + slideWidth;
          track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
          transformX = target;
          track.style.transform = `translate3d(${-transformX}px, 0, 0)`;
          
          transitionTimer = setTimeout(() => {
            track.style.transition = 'none';
            if (transformX >= loopWidth) {
              transformX = transformX - loopWidth;
              track.style.transform = `translate3d(${-transformX}px, 0, 0)`;
            }
          }, 500);
          
          resumeAutoplayAfterDelay();
        });
      }
    }
  }

  function setupPublicationArrows(container, scrollArea) {
    const prevBtn = container.querySelector('.slider-arrow-prev');
    const nextBtn = container.querySelector('.slider-arrow-next');
    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const firstChild = scrollArea.firstElementChild;
      const slideWidth = firstChild ? firstChild.offsetWidth + 12 : 240 + 12;
      scrollArea.scrollBy({
        left: -slideWidth,
        behavior: 'smooth'
      });
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const firstChild = scrollArea.firstElementChild;
      const slideWidth = firstChild ? firstChild.offsetWidth + 12 : 240 + 12;
      scrollArea.scrollBy({
        left: slideWidth,
        behavior: 'smooth'
      });
    });
  }

  function bindLightboxEvents() {
    document.querySelectorAll('.leadership-slider-track, .publication-media-scroll').forEach(container => {
      const trackChildren = Array.from(container.children).filter(el => {
        return el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.classList.contains('slider-video-card');
      });
      
      const isLeadershipSlider = container.classList.contains('leadership-slider-track');
      const totalCount = trackChildren.length;
      const originalCount = isLeadershipSlider ? totalCount / 2 : totalCount;
      const clickableMedia = trackChildren.slice(0, originalCount);
      
      trackChildren.forEach((child, index) => {
        const originalIndex = index % originalCount;
        child.style.cursor = 'pointer';
        child.onclick = (e) => {
          e.preventDefault();
          openLightbox(clickableMedia, originalIndex);
        };
      });
    });
  }

  async function initDynamicMedia() {
    // 1. Initialize Publications Media
    const publicationContainers = document.querySelectorAll('.publication-media');
    for (const container of publicationContainers) {
      const folder = container.getAttribute('data-folder');
      const fallbackFolder = container.getAttribute('data-fallback-folder');
      const fallbackPattern = container.getAttribute('data-fallback-pattern');
      const fallbackCount = parseInt(container.getAttribute('data-fallback-count')) || 0;
      const scrollArea = container.querySelector('.publication-media-scroll');
      if (!scrollArea || !folder) continue;

      const mediaList = await loadFolderMedia(folder, fallbackPattern, fallbackCount, fallbackFolder);
      if (mediaList.length === 0) {
        container.style.display = 'none';
        continue;
      }

      container.style.display = '';
      scrollArea.innerHTML = '';
      mediaList.forEach(media => {
        if (media.type === 'image') {
          const img = document.createElement('img');
          img.src = media.src;
          img.alt = media.name;
          scrollArea.appendChild(img);
        } else {
          const videoCard = document.createElement('div');
          videoCard.className = 'slider-video-card';
          videoCard.innerHTML = `
            <video src="${media.src}" muted loop playsinline autoplay></video>
            <div class="video-play-overlay">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
          `;
          scrollArea.appendChild(videoCard);
        }
      });

      // Bind scroll arrows
      setupPublicationArrows(container, scrollArea);
    }

    // 2. Initialize Leadership Sliders
    const sliders = document.querySelectorAll('.leadership-slider');
    for (const slider of sliders) {
      const track = slider.querySelector('.leadership-slider-track');
      const folder = slider.getAttribute('data-folder');
      const fallbackFolder = slider.getAttribute('data-fallback-folder');
      const fallbackPattern = slider.getAttribute('data-fallback-pattern');
      const fallbackCount = parseInt(slider.getAttribute('data-fallback-count')) || 0;
      if (!track || !folder) continue;

      const mediaList = await loadFolderMedia(folder, fallbackPattern, fallbackCount, fallbackFolder);
      if (mediaList.length === 0) {
        setupHardwareSlider(slider, track, 6);
        continue;
      }

      track.innerHTML = '';
      
      const renderItems = (items) => {
        items.forEach(media => {
          if (media.type === 'image') {
            const img = document.createElement('img');
            img.src = media.src;
            img.alt = media.name;
            track.appendChild(img);
          } else {
            const videoCard = document.createElement('div');
            videoCard.className = 'slider-video-card';
            videoCard.innerHTML = `
              <video src="${media.src}" muted loop playsinline autoplay></video>
              <div class="video-play-overlay">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            `;
            track.appendChild(videoCard);
          }
        });
      };

      renderItems(mediaList);
      renderItems(mediaList);

      // Wait for dynamic slides to fully load before calculating slider widths
      await waitForImagesToLoad(track);

      // Play videos in the background
      track.querySelectorAll('video').forEach(vid => {
        vid.play().catch(e => console.log('Autoplay prevented', e));
      });

      setupHardwareSlider(slider, track, mediaList.length);
    }

    bindLightboxEvents();
    setupKeyboardSliderNavigation();
  }

  function setupKeyboardSliderNavigation() {
    let activeKeyboardSlider = null;

    document.querySelectorAll('.leadership-showcase, .publication-media').forEach(card => {
      card.addEventListener('mouseenter', () => {
        activeKeyboardSlider = card;
      });
      card.addEventListener('mouseleave', () => {
        if (activeKeyboardSlider === card) {
          activeKeyboardSlider = null;
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox && lightbox.classList.contains('active')) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        let activeCard = activeKeyboardSlider;
        
        if (!activeCard) {
          let closestCard = null;
          let minDistance = Infinity;
          const centerY = window.innerHeight / 2;
          
          document.querySelectorAll('.leadership-showcase, .publication-media').forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenterY = rect.top + rect.height / 2;
            const distance = Math.abs(centerY - cardCenterY);
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
              }
            }
          });
          activeCard = closestCard;
        }
        
        if (activeCard) {
          const prevBtn = activeCard.querySelector('.slider-arrow-prev');
          const nextBtn = activeCard.querySelector('.slider-arrow-next');
          
          if (e.key === 'ArrowLeft' && prevBtn) {
            e.preventDefault();
            prevBtn.click();
          } else if (e.key === 'ArrowRight' && nextBtn) {
            e.preventDefault();
            nextBtn.click();
          }
        }
      }
    });
  }

  window.addEventListener('load', initDynamicMedia);

  // ========== INITIAL PAGE LOAD ANIMATION ==========
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';
  });
});
