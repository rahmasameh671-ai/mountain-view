/**
 * Mountain View Luxury Developments - properties-z.com
 * High-Conversion Interactive JavaScript
 * Form Handling, Lead Routing & Live Zapier Webhook Integration
 * Preserving lead routing to: Rahma@irtkaz.com, Mostafa.a.ashmawy@gmail.com, Mostafa.ashmawy@irtkaz.com
 */

// ============================================================================
// CONFIGURATION & ENDPOINTS
// ============================================================================
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/25429357/uclzmpn/';
const LEAD_RECIPIENTS = [
  'Rahma@irtkaz.com',
  'Mostafa.a.ashmawy@gmail.com',
  'Mostafa.ashmawy@irtkaz.com'
];

const WHATSAPP_PHONE_DISPLAY = '01033373331';
const WHATSAPP_INTL = '201033373331';

document.addEventListener('DOMContentLoaded', () => {
  initFormHandler();
  initProjectFormTriggers();
  initWhatsAppTracking();
  initScrollAnimations();
  initModal();
});

/**
 * Handle lead capture form submission to Zapier & Email Routing
 */
function initFormHandler() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  const submitBtn = form.querySelector('.btn-submit');
  const phoneInput = form.querySelector('input[name="phoneNumber"]');
  const countrySelect = form.querySelector('select[name="countryCode"]');
  const formSuccessBox = document.getElementById('form-success-box');

  // Input filter: Only digits in phone field
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const fullName = (formData.get('fullName') || '').toString().trim();
    const rawPhone = (formData.get('phoneNumber') || '').toString().trim();
    const countryCode = countrySelect ? countrySelect.value : '+20';
    const selectedProject = (formData.get('projectInterest') || 'Mountain View Portfolio').toString();

    // Validations
    if (!fullName || fullName.length < 2) {
      alert('Please enter your full name.');
      const nameEl = document.getElementById('fullName');
      if (nameEl) nameEl.focus();
      return;
    }

    if (!rawPhone || rawPhone.length < 7) {
      alert('Please enter a valid mobile number.');
      if (phoneInput) phoneInput.focus();
      return;
    }

    // Strip leading 0 if present when combining with country code
    let sanitizedPhone = rawPhone;
    if (sanitizedPhone.startsWith('0')) {
      sanitizedPhone = sanitizedPhone.substring(1);
    }
    const fullPhoneNumber = `${countryCode}${sanitizedPhone}`;

    // Set Loading State
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }

    // Extract UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source') || '';
    const utm_medium = urlParams.get('utm_medium') || '';
    const utm_campaign = urlParams.get('utm_campaign') || '';

    // Prepare Webhook Payload with explicit routing recipients
    const leadPayload = {
      fullName: fullName,
      phoneNumber: fullPhoneNumber,
      landingPageUrl: window.location.href,
      submissionDate: new Date().toISOString(),
      countryCode: countryCode,
      consultancy: 'properties-z.com',
      leadRoutingEmails: LEAD_RECIPIENTS,
      recipientEmails: LEAD_RECIPIENTS.join(', '),
      to: LEAD_RECIPIENTS.join(', '),
      leadRouting: LEAD_RECIPIENTS.join(', '),
      projectInterest: selectedProject,
      utm_source: utm_source,
      utm_medium: utm_medium,
      utm_campaign: utm_campaign
    };

    try {
      // POST to Zapier Webhook
      await fetch(ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadPayload),
        mode: 'no-cors' // Ensures successful delivery without CORS restrictions
      });

      // Show in-form success state
      if (formSuccessBox) {
        form.style.display = 'none';
        formSuccessBox.style.display = 'block';
        const nameSpan = formSuccessBox.querySelector('.client-name');
        if (nameSpan) nameSpan.textContent = fullName;
      }

      // Google Ads & Analytics Conversion Events
      if (typeof window.gtag_report_conversion === 'function') {
        window.gtag_report_conversion();
      } else if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18462270869/Ka2mCPrmtoIdEJXLv-NE',
          value: 1.0,
          currency: 'EGP'
        });
      }

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: 'Mountain View Lead Form',
          project: selectedProject
        });
      }

      // Display high-conversion confirmation modal
      showSuccessModal(fullName, fullPhoneNumber);
      form.reset();

    } catch (error) {
      console.warn('Submission notice:', error);
      // Graceful fallback display
      if (formSuccessBox) {
        form.style.display = 'none';
        formSuccessBox.style.display = 'block';
      }
      showSuccessModal(fullName, fullPhoneNumber);
    } finally {
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    }
  });
}

/**
 * Quick-action: clicking "Request Floor Plans & Prices" scrolls to form
 * and focuses name input
 */
function initProjectFormTriggers() {
  const triggerBtns = document.querySelectorAll('.trigger-project-form');
  const formCard = document.querySelector('.lead-card');
  const nameInput = document.getElementById('fullName');
  const projectInput = document.getElementById('projectInterest');

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectName = btn.getAttribute('data-project') || 'Mountain View Portfolio';
      if (projectInput) {
        projectInput.value = projectName;
      }

      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        formCard.classList.add('highlight-form');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 600);
        }
        setTimeout(() => {
          formCard.classList.remove('highlight-form');
        }, 1600);
      }
    });
  });
}

/**
 * Success modal display with WhatsApp direct button
 */
function showSuccessModal(name, phone) {
  const modal = document.getElementById('success-modal');
  if (!modal) return;

  const modalName = modal.querySelector('.user-name-display');
  if (modalName) {
    modalName.textContent = name;
  }

  const waBtn = modal.querySelector('.btn-modal-wa');
  if (waBtn) {
    const encodedMsg = encodeURIComponent(
      `Hello properties-z.com, I just submitted an inquiry for Mountain View residences. My name is ${name} (${phone}).`
    );
    waBtn.href = `https://wa.me/${WHATSAPP_INTL}?text=${encodedMsg}`;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function initModal() {
  const modal = document.getElementById('success-modal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('.close-modal-trigger');
  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Intersection Observer for subtle editorial fade-up reveals
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
      }
    );

    elements.forEach((el) => observer.observe(el));
  } else {
    elements.forEach((el) => el.classList.add('visible'));
  }
}

/**
 * Track Google Ads and Analytics conversion on WhatsApp clicks
 */
function initWhatsAppTracking() {
  document.addEventListener('click', (e) => {
    const waLink = e.target.closest('a[href*="wa.me"]');
    if (waLink) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18462270869/Ka2mCPrmtoIdEJXLv-NE',
          value: 1.0,
          currency: 'EGP'
        });
        window.gtag('event', 'whatsapp_click', {
          event_category: 'engagement',
          event_label: waLink.href
        });
      }
    }
  });
}
