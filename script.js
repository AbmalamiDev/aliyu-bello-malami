const menuButton = document.querySelector('.menu-toggle');
const siteNavigation = document.querySelector('.site-nav');

if (menuButton && siteNavigation) {
    const closeMenu = () => {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        siteNavigation.classList.remove('is-open');
    };

    menuButton.addEventListener('click', () => {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!isExpanded));
        menuButton.setAttribute('aria-label', isExpanded ? 'Open navigation' : 'Close navigation');
        siteNavigation.classList.toggle('is-open', !isExpanded);
    });

    siteNavigation.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });
}

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    const fields = [...contactForm.querySelectorAll('input, textarea')];
    const status = document.querySelector('#form-status');

    const validateField = (field) => {
        const errorElement = document.querySelector(`#${field.id}-error`);
        const value = field.value.trim();
        let message = '';

        if (!value) {
            message = 'This field is required.';
        } else if (field.type === 'email' && field.validity.typeMismatch) {
            message = 'Enter a valid email address.';
        } else if (value.length < Number(field.getAttribute('minlength'))) {
            message = `Please enter at least ${field.getAttribute('minlength')} characters.`;
        }

        field.setAttribute('aria-invalid', String(Boolean(message)));
        if (errorElement) errorElement.textContent = message;
        return !message;
    };

    fields.forEach((field) => {
        field.addEventListener('input', () => {
            if (field.getAttribute('aria-invalid') === 'true') validateField(field);
            status.textContent = '';
        });
    });

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const invalidFields = fields.filter((field) => !validateField(field));

        if (invalidFields.length) {
            status.textContent = 'Please review the highlighted fields.';
            invalidFields[0].focus();
            return;
        }

        // Connect an email service or backend here before treating a valid message as sent.
        status.textContent = 'Your message is valid, but it has not been sent. Please email me directly for now.';
    });
}