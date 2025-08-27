// Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const statusEl = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit');

    // Collect form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name')?.trim() || '',
        email: formData.get('email')?.trim() || '',
        phone: formData.get('phone')?.trim() || '',
        subject: formData.get('subject')?.trim() || '',
        reason: formData.get('reason') || '',
        message: formData.get('message')?.trim() || '',
        consent: formData.get('consent') === 'on',
        _honeypot: formData.get('_honeypot') || ''
    };

    // Client-side validation
    const errors = [];
    if (!data.name) errors.push({ id: 'name-error', msg: 'Full Name is required' });
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push({ id: 'email-error', msg: 'Valid Email is required' });
    if (data.phone && !/^[+]?\d[\d\s()-]{6,}$/.test(data.phone)) errors.push({ id: 'phone-error', msg: 'Phone format looks invalid' });
    if (!data.subject) errors.push({ id: 'subject-error', msg: 'Subject is required' });
    if (!data.reason) errors.push({ id: 'reason-error', msg: 'Reason is required' });
    if (!data.message) errors.push({ id: 'message-error', msg: 'Message is required' });
    if (!data.consent) errors.push({ id: 'consent-error', msg: 'Consent is required' });
    if (data._honeypot) errors.push({ id: 'form-status', msg: 'Submission blocked' });

    // Reset error messages
    document.querySelectorAll('.text-red-600').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });

    // Display errors if any
    if (errors.length) {
        errors.forEach(({ id, msg }) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = msg;
                el.classList.remove('hidden');
            }
        });
        statusEl.className = 'text-sm text-red-600';
        statusEl.textContent = errors[0].msg;
        return;
    }

    // Update UI for submission
    statusEl.className = 'text-sm text-gray-700';
    statusEl.textContent = 'Sending your message...';
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-60', 'cursor-not-allowed');

    try {
        // Submit to Formspree
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Success feedback
            if (typeof gsap !== 'undefined') {
                gsap.to(form, { duration: 0.15, x: 6, yoyo: true, repeat: 2 });
            }
            statusEl.className = 'text-sm text-green-600';
            statusEl.textContent = 'Message sent successfully! Check your email.';
            form.reset();
        } else {
            // Handle server errors
            statusEl.className = 'text-sm text-red-600';
            statusEl.textContent = 'Failed to send message. Try again later.';
        }
    } catch (error) {
        // Handle network errors
        statusEl.className = 'text-sm text-red-600';
        statusEl.textContent = 'Network error. Please try again or email directly.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
    }
});

// Accessibility: Clear form errors on input
document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea').forEach(input => {
    input.addEventListener('input', () => {
        const errorEl = document.getElementById(`${input.id}-error`);
        if (errorEl) {
            errorEl.classList.add('hidden');
            errorEl.textContent = '';
        }
    });
});

// Accessibility: Close form errors with Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.text-red-600').forEach(el => {
            el.classList.add('hidden');
            el.textContent = '';
        });
        document.getElementById('form-status').textContent = '';
    }
});