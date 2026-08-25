/**
 * Mayur Vaidya — Portfolio JavaScript Interactions
 * Vanilla JS, no external libraries.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. THEME TOGGLER
  // ==========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const themeKey = 'mayur-portfolio-theme';

  // Apply theme class helper
  function applyTheme(theme) {
    if (theme === 'light') {
      body.classList.add('theme-light');
      if (themeToggle) themeToggle.textContent = '☾'; // Toggle icon to show moon in light mode
    } else {
      body.classList.remove('theme-light');
      if (themeToggle) themeToggle.textContent = '☀'; // Toggle icon to show sun in dark mode
    }
  }

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem(themeKey) || 'dark';
  applyTheme(savedTheme);

  // Toggle click listener
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = body.classList.contains('theme-light');
      const targetTheme = isLight ? 'dark' : 'light';
      localStorage.setItem(themeKey, targetTheme);
      applyTheme(targetTheme);
    });
  }

  // ==========================================================================
  // 2. SCROLL SPY & SOLID HEADER SCROLL STATE
  // ==========================================================================
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function scrollSpy() {
    const scrollPosition = window.scrollY + 100; // Offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Solid border class on nav after scroll count
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', scrollSpy, { passive: true });
  scrollSpy(); // Initial call

  // ==========================================================================
  // 3. MOBILE OVERLAY NAVIGATION MENU
  // ==========================================================================
  const navToggle = document.getElementById('navToggle');
  const navOverlay = document.getElementById('navOverlay');
  const overlayLinks = document.querySelectorAll('.overlay-links a');

  function toggleMobileMenu() {
    const isActive = navToggle.classList.toggle('active');
    navOverlay.classList.toggle('active', isActive);

    // Prevent document body scrolling when overlay is active
    if (isActive) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  }

  if (navToggle && navOverlay) {
    navToggle.addEventListener('click', toggleMobileMenu);

    // Tap links to close menu
    overlayLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu();
      });
    });
  }

  // ==========================================================================
  // 4. VERTICAL-IN TO HORIZONTAL PROJECT METER MOUSE-WHEEL SCROLL
  // ==========================================================================
  const projectStrips = document.querySelectorAll('.project-image-strip');

  projectStrips.forEach(strip => {
    strip.addEventListener('wheel', (e) => {
      // If user scrolls vertical, translate to horizontal scroll action
      if (e.deltaY !== 0) {
        e.preventDefault();
        strip.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  });

  // ==========================================================================
  // 5. GALLERY LIGHTBOX ATTACHMENTS
  // ==========================================================================
  const lightbox = document.getElementById('mediaLightbox');
  const lightboxMedia = document.getElementById('lightboxMediaContainer');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  // Gather all thumbnail triggers
  const galleryItems = Array.from(document.querySelectorAll('.cert-thumb, .award-thumb, .lightbox-trigger'));
  let activeLightboxIndex = 0;

  function renderLightboxMedia(index) {
    const item = galleryItems[index];
    if (!item) return;

    lightboxMedia.innerHTML = '';

    // Create new element in Lightbox container depending on media type
    if (item.tagName.toLowerCase() === 'video') {
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      lightboxMedia.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || 'Full size view';
      lightboxMedia.appendChild(img);
    }

    // Update Caption text based on alt attributes
    let captionText = item.alt;
    const certRow = item.closest('.cert-row');
    const certViewerDiv = item.closest('.certs-viewer');
    const awardRow = item.closest('.award-row');

    if (certRow) {
      const name = certRow.querySelector('.cert-name')?.textContent;
      const issuer = certRow.querySelector('.cert-issuer')?.textContent;
      captionText = name ? `${name} — ${issuer}` : item.alt;
    } else if (certViewerDiv) {
      const name = certViewerDiv.querySelector('#certViewerTitle')?.textContent;
      const issuerAndYear = certViewerDiv.querySelector('#certViewerIssuer')?.textContent;
      captionText = name && issuerAndYear ? `${name} — ${issuerAndYear}` : item.alt;
    } else if (awardRow) {
      const name = awardRow.querySelector('.award-name')?.textContent;
      const desc = awardRow.querySelector('.award-description')?.textContent;
      captionText = name ? `${name}: ${desc}` : item.alt;
    }

    lightboxCaption.textContent = captionText;
  }

  function openLightbox(index) {
    activeLightboxIndex = index;
    renderLightboxMedia(activeLightboxIndex);
    lightbox.classList.add('active');
    body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxMedia.innerHTML = '';
    body.style.overflow = '';
  }

  function showNextMedia() {
    if (galleryItems.length === 0) return;
    activeLightboxIndex = (activeLightboxIndex + 1) % galleryItems.length;
    renderLightboxMedia(activeLightboxIndex);
  }

  function showPrevMedia() {
    if (galleryItems.length === 0) return;
    activeLightboxIndex = (activeLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
    renderLightboxMedia(activeLightboxIndex);
  }

  // Bind triggers
  galleryItems.forEach((thumb, idx) => {
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(idx);
    });
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  // Action listeners
  if (lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevMedia);
    lightboxNext.addEventListener('click', showNextMedia);

    // Close on click-outside
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper') || e.target === lightboxMedia) {
        closeLightbox();
      }
    });

    // Keyboard bindings (Escape and Arrow keys)
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextMedia();
      if (e.key === 'ArrowLeft') showPrevMedia();
    });
  }

  // ==========================================================================
  // 6. CONTACT FORM SUBMISSION
  // ==========================================================================
  const awardViewer = document.getElementById('awardsViewer');
  const awardViewerImage = document.getElementById('awardViewerImage');
  const awardViewerTitle = document.getElementById('awardViewerTitle');
  const awardViewerDescription = document.getElementById('awardViewerDescription');
  const awardViewerCount = document.getElementById('awardViewerCount');
  const awardPrev = document.getElementById('awardPrev');
  const awardNext = document.getElementById('awardNext');
  const awards = [
    {
      src: 'Awards and Achievements/PID185-1.jpg',
      alt: 'Certificate of Participation for Design and Implementation of IoT Based Energy Monitoring System for Smart Energy Meters',
      title: 'Design and Implementation of IoT Based Energy Monitoring System for Smart Energy Meters',
      description: 'Certificate of Participation, presented at the 4th Odisha International Conference on Electrical Power Engineering, Communication and Computing Technology (ODICON 2026).'
    },
    {
      src: 'Awards and Achievements/ChatGPT Image May 12, 2026, 01_14_46 PM (1).png',
      alt: 'Certificate of Appreciation for securing the Consolation Prize at Abhiyantram',
      title: 'Consolation Prize — Abhiyantram: A Project Competition',
      description: 'Certificate of Appreciation for securing the Consolation Prize at Abhiyantram, held during M-Pulse 2026 at PES Modern College of Engineering, Pune.'
    }
  ];
  let activeAwardIndex = 0;

  function renderAward(index) {
    if (!awardViewer || !awards[index]) return;
    const award = awards[index];
    awardViewerImage.src = award.src;
    awardViewerImage.alt = award.alt;
    awardViewerTitle.textContent = award.title;
    awardViewerDescription.textContent = award.description;
    awardViewerCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(awards.length).padStart(2, '0')}`;
  }

  function changeAward(direction) {
    activeAwardIndex = (activeAwardIndex + direction + awards.length) % awards.length;
    renderAward(activeAwardIndex);
  }

  if (awardViewer) {
    awardPrev.addEventListener('click', () => changeAward(-1));
    awardNext.addEventListener('click', () => changeAward(1));
  }

  // ==========================================================================
  // 6b. CERTIFICATIONS GALLERY SLIDER
  // ==========================================================================
  const certs = [
    {
      src: 'Certifications/AWS AI Practitioner Certificate.png',
      alt: 'AWS Certified AI Practitioner',
      title: 'AWS Certified AI Practitioner',
      issuer: 'AWS',
      year: '2026'
    },
    {
      src: 'Certifications/Udemy AWS AI Certificate UC-979fec30-46e2-45ae-9b32-ec87a344bf3f_copy-1.jpg',
      alt: 'Ultimate AWS Certified AI Practitioner (AIF-C01)',
      title: 'Ultimate AWS Certified AI Practitioner (AIF-C01)',
      issuer: 'Udemy',
      year: '2026'
    },
    {
      src: 'Certifications/Introduction to Artificial Intelligence.jpg',
      alt: 'Introduction to Artificial Intelligence',
      title: 'Introduction to Artificial Intelligence',
      issuer: 'IBM',
      year: '2025'
    },
    {
      src: 'Certifications/Machine Learning And Deep Learning.jpg',
      alt: 'Machine Learning and Deep Learning',
      title: 'Machine Learning and Deep Learning',
      issuer: 'Udemy',
      year: '2025'
    },
    {
      src: 'Certifications/Natural Language Processing and Computer Vision.jpg',
      alt: 'NLP and Computer Vision',
      title: 'NLP and Computer Vision',
      issuer: 'Udemy',
      year: '2025'
    },
    {
      src: 'Certifications/Your Future in AI -The Job Landscape.jpg',
      alt: 'Your Future in AI — The Job Landscape',
      title: 'Your Future in AI — The Job Landscape',
      issuer: 'IBM',
      year: '2025'
    }
  ];
  let activeCertIndex = 0;

  const certViewer = document.getElementById('certsViewer');
  const certViewerImage = document.getElementById('certViewerImage');
  const certViewerTitle = document.getElementById('certViewerTitle');
  const certViewerIssuer = document.getElementById('certViewerIssuer');
  const certViewerCount = document.getElementById('certViewerCount');
  const certPrev = document.getElementById('certPrev');
  const certNext = document.getElementById('certNext');

  function renderCert(index) {
    if (!certViewer || !certs[index]) return;
    const cert = certs[index];
    certViewerImage.src = cert.src;
    certViewerImage.alt = cert.alt;
    certViewerTitle.textContent = cert.title;
    certViewerIssuer.textContent = `${cert.issuer} · ${cert.year}`;
    certViewerCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(certs.length).padStart(2, '0')}`;
  }

  function changeCert(direction) {
    activeCertIndex = (activeCertIndex + direction + certs.length) % certs.length;
    renderCert(activeCertIndex);
  }

  if (certViewer) {
    certPrev.addEventListener('click', () => changeCert(-1));
    certNext.addEventListener('click', () => changeCert(1));
  }

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check client validation
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitButton = contactForm.querySelector('.form-submit');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      const previousStatus = contactForm.querySelector('.form-status');
      if (previousStatus) previousStatus.remove();

      const formData = {
          name: contactForm.querySelector('[name="name"]').value.trim(),
          email: contactForm.querySelector('[name="email"]').value.trim(),
          subject: contactForm.querySelector('[name="subject"]').value.trim(),
          message: contactForm.querySelector('[name="message"]').value.trim()
      };

      fetch(contactForm.action, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
      })
      .then(async (response) => {
          const result = await response.json();

          if (!response.ok || !result.success) {
              throw new Error(result.message || "Form submission failed");
          }

          const successMessage = document.createElement('div');
          successMessage.className = 'form-success';
          successMessage.setAttribute('role', 'status');

          const heading = document.createElement('h4');
          heading.textContent = 'Message sent successfully';

          const message = document.createElement('p');
          message.textContent =
              'Thank you for getting in touch. I will respond to your inquiry shortly.';

          successMessage.append(heading, message);

          contactForm.parentElement.replaceChild(successMessage, contactForm);
      })
      .catch((error) => {
          console.error("Contact form error:", error);

          const previousError = contactForm.querySelector('.form-error');
          if (previousError) previousError.remove();

          const errorMessage = document.createElement('p');
          errorMessage.className = 'form-status form-error';
          errorMessage.setAttribute('role', 'alert');
          errorMessage.textContent =
              'Unable to send your message. Please try again later or contact me directly at mayurvaidya.mmv@gmail.com.';

          contactForm.appendChild(errorMessage);
      })
      .finally(() => {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
      });
    });
  }

  // ==========================================================================
  // 7. SCROLL REVEAL OBSERVER
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

});
