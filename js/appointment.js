// ====================== APPOINTMENT.JS - COMPLETE FUNCTIONALITY ======================
// This file contains specific functionality for appointment.html
// Updated for Dietitian Sajal - Sialkot

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initAppointmentPage();
    initAppointmentForm();
    initDatePicker();
    initServiceSelector();
    initFormValidation();
    loadSelectedService();
    injectAppointmentSchema(); // SEO enhancement
});

// ====================== APPOINTMENT PAGE INITIALIZATION ======================
function initAppointmentPage() {
    console.log('Appointment page initialized for Dietitian Sajal');
    
    // Update active nav state
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === 'appointment.html') {
            link.classList.add('active');
        }
    });
    
    // Set minimum date for date picker (today)
    setMinDate();
}

// ====================== SET MINIMUM DATE ======================
function setMinDate() {
    const dateInput = document.getElementById('appointmentDate');
    if (!dateInput) return;
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    dateInput.min = `${yyyy}-${mm}-${dd}`;
}

// ====================== APPOINTMENT FORM INITIALIZATION ======================
function initAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            showNotification('Please fill all required fields correctly', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('submitAppointment');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = collectFormData();
        
        // Send to WhatsApp
        sendToWhatsApp(formData);
    });
}

// ====================== COLLECT FORM DATA ======================
function collectFormData() {
    return {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        service: document.getElementById('service').value,
        consultationType: document.querySelector('input[name="consultationType"]:checked')?.value || 'in-person',
        notes: document.getElementById('notes').value,
        timestamp: new Date().toLocaleString()
    };
}

// ====================== FORM VALIDATION ======================
function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const service = document.getElementById('service').value;
    const terms = document.getElementById('terms').checked;
    
    // Basic validation
    if (!fullName || !email || !phone || !date || !time || !service || !terms) {
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    // Phone validation (Pakistan format)
    const phoneRegex = /^(\+92|0|92)?[0-9]{10,13}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }
    
    // Date validation (not past)
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Please select a future date', 'error');
        return false;
    }
    
    return true;
}

// ====================== SEND TO WHATSAPP ======================
function sendToWhatsApp(data) {
    // Format the message for WhatsApp
    const message = formatWhatsAppMessage(data);
    
    // Encode for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp number (updated for Dietitian Sajal)
    const whatsappNumber = '923263651982'; // Without + and spaces
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Show success message
    showNotification('Redirecting to WhatsApp...', 'success');
    
    // Reset loading state
    setTimeout(() => {
        const submitBtn = document.getElementById('submitAppointment');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        document.getElementById('appointmentForm').reset();
        
        // Show thank you message
        showThankYouMessage(data.fullName);
    }, 1500);
}

// ====================== FORMAT WHATSAPP MESSAGE ======================
function formatWhatsAppMessage(data) {
    const consultationTypeText = data.consultationType === 'in-person' ? 'In-Person (Sialkot)' : 'Video Call (Zoom/WhatsApp)';
    
    return `
*NEW APPOINTMENT REQUEST - Dietitian Sajal*
═══════════════════════

*👤 PERSONAL INFORMATION*
• Full Name: ${data.fullName}
• Email: ${data.email}
• Phone: ${data.phone}

*📅 APPOINTMENT DETAILS*
• Date: ${formatDate(data.date)}
• Time: ${data.time}
• Service: ${data.service}
• Type: ${consultationTypeText}
• Location: Sialkot (for in-person)

*📝 ADDITIONAL NOTES*
${data.notes || 'No additional notes provided'}

*⏰ SUBMITTED*
${data.timestamp}

═══════════════════════
_This appointment request was sent from the website_
`;
}

// ====================== FORMAT DATE ======================
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ====================== SHOW THANK YOU MESSAGE ======================
function showThankYouMessage(name) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'thankyou-modal';
    modal.innerHTML = `
        <div class="thankyou-content">
            <div class="thankyou-icon">
                <i class="fa-regular fa-circle-check"></i>
            </div>
            <h3>Thank You, ${name}!</h3>
            <p>Your appointment request has been sent successfully to Dietitian Sajal.</p>
            <p class="thankyou-note">You will receive a confirmation on WhatsApp within 2-3 hours.</p>
            <button class="btn btn-primary thankyou-close">OK</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for modal
    const style = document.createElement('style');
    style.textContent = `
        .thankyou-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }
        
        .thankyou-content {
            background: white;
            padding: 3rem;
            border-radius: 30px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.5s ease;
        }
        
        .thankyou-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
        }
        
        .thankyou-icon i {
            font-size: 3rem;
            color: white;
        }
        
        .thankyou-content h3 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: #1e1e2f;
        }
        
        .thankyou-content p {
            color: #666;
            margin-bottom: 0.5rem;
        }
        
        .thankyou-note {
            background: #f8f8f8;
            padding: 1rem;
            border-radius: 12px;
            margin: 1.5rem 0;
            font-size: 0.9rem;
            color: #c17b4c !important;
        }
        
        .thankyou-close {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #c17b4c, #9e5c32);
            border: none;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Close modal
    const closeBtn = modal.querySelector('.thankyou-close');
    closeBtn.addEventListener('click', function() {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // Close on click outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

// ====================== DATE PICKER INITIALIZATION ======================
function initDatePicker() {
    const dateInput = document.getElementById('appointmentDate');
    if (!dateInput) return;
    
    // Disable weekends (optional)
    dateInput.addEventListener('input', function() {
        const selectedDate = new Date(this.value);
        const day = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
        
        if (day === 0) {
            showNotification('Sundays are closed. Please select another day.', 'error');
            this.value = '';
        }
    });
    
    // Add available dates hint
    const hint = document.createElement('small');
    hint.className = 'date-hint';
    hint.textContent = 'Available: Monday - Saturday (Sialkot time)';
    hint.style.cssText = `
        display: block;
        color: #999;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    `;
    
    dateInput.parentNode.appendChild(hint);
}

// ====================== SERVICE SELECTOR ======================
function initServiceSelector() {
    const serviceSelect = document.getElementById('service');
    if (!serviceSelect) return;
    
    // Add price information
    const servicePrices = {
        'Weight Management': 'PKR 3,500/month',
        'PCOS/PCOD Management': 'PKR 4,000/month',
        'Diabetes Management': 'PKR 4,000/month',
        'Heart Health': 'PKR 3,800/month',
        'Prenatal Nutrition': 'PKR 4,500/month',
        'Gut Health': 'PKR 3,800/month',
        'General Consultation': 'PKR 2,500/session'
    };
    
    serviceSelect.addEventListener('change', function() {
        const selected = this.value;
        if (selected && servicePrices[selected]) {
            showNotification(`${selected}: ${servicePrices[selected]}`, 'info', 3000);
        }
    });
}

// ====================== LOAD SELECTED SERVICE ======================
function loadSelectedService() {
    // Check if service was selected from services page
    const selectedService = sessionStorage.getItem('selectedService');
    
    if (selectedService) {
        try {
            const service = JSON.parse(selectedService);
            const serviceSelect = document.getElementById('service');
            
            if (serviceSelect && service.name) {
                // Find and select the matching service
                const options = serviceSelect.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].text === service.name) {
                        options[i].selected = true;
                        break;
                    }
                }
                
                // Show notification
                showNotification(`Service pre-selected: ${service.name}`, 'success');
                
                // Clear session storage
                sessionStorage.removeItem('selectedService');
            }
        } catch (e) {
            console.error('Error loading selected service:', e);
        }
    }
}

// ====================== FORM VALIDATION (REAL-TIME) ======================
function initFormValidation() {
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 12) value = value.slice(0, 12);
            
            // Format for Pakistan numbers
            if (value.startsWith('92')) {
                this.value = '+' + value;
            } else if (value.startsWith('0')) {
                this.value = value;
            } else {
                this.value = value;
            }
        });
    }
    
    // Real-time validation
    const inputs = document.querySelectorAll('.appointment-form input, .appointment-form select, .appointment-form textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// ====================== VALIDATE SINGLE FIELD ======================
function validateField(field) {
    const fieldId = field.id;
    
    switch(fieldId) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value) && field.value.trim() !== '') {
                showFieldError(field, 'Please enter a valid email');
            } else {
                clearFieldError(field);
            }
            break;
            
        case 'phone':
            const phoneRegex = /^(\+92|0|92)?[0-9]{10,13}$/;
            if (!phoneRegex.test(field.value.replace(/\s/g, '')) && field.value.trim() !== '') {
                showFieldError(field, 'Please enter a valid Pakistan number');
            } else {
                clearFieldError(field);
            }
            break;
    }
}

// ====================== SHOW FIELD ERROR ======================
function showFieldError(field, message) {
    field.style.borderColor = '#f44336';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
    
    // Add error message
    const error = document.createElement('small');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = `
        color: #f44336;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(error);
}

// ====================== CLEAR FIELD ERROR ======================
function clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
}

// ====================== NOTIFICATION SYSTEM ======================
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `appointment-notification notification-${type}`;
    
    // Icons for different types (Font Awesome 6)
    const icons = {
        success: 'fa-regular fa-circle-check',
        error: 'fa-regular fa-circle-exclamation',
        info: 'fa-regular fa-circle-info'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        </div>
        <div class="notification-progress"></div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        color: #333;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#c17b4c'};
        min-width: 300px;
        max-width: 400px;
    `;
    
    // Progress bar style
    const progressStyle = `
        .notification-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#c17b4c'};
            width: 100%;
            animation: progress ${duration}ms linear;
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes progress {
            from {
                width: 100%;
            }
            to {
                width: 0%;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = progressStyle;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
            styleSheet.remove();
        }, 300);
    }, duration);
}

// ====================== BOOKING SLOTS MANAGEMENT ======================
const bookingSlots = {
    getBookedSlots: function(date) {
        // This would normally fetch from a backend
        // For demo, return empty array
        return [];
    },
    
    isSlotAvailable: function(date, time) {
        const bookedSlots = this.getBookedSlots(date);
        return !bookedSlots.includes(time);
    }
};

// ====================== EXPORT FUNCTIONS ======================
window.bookAppointment = function(serviceName) {
    // Function to quickly book from other pages
    sessionStorage.setItem('selectedService', JSON.stringify({
        name: serviceName,
        date: new Date().toISOString()
    }));
    window.location.href = 'appointment.html';
};

window.checkAvailability = function(date) {
    // Check available slots for a date
    return bookingSlots.getBookedSlots(date);
};

// ====================== ADDITIONAL STYLES ======================
const appointmentStyles = document.createElement('style');
appointmentStyles.textContent = `
    /* Date hint styling */
    .date-hint {
        display: block;
        color: #999;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        padding-left: 0.5rem;
    }
    
    /* Field error animation */
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .form-group input:invalid:not(:placeholder-shown) {
        animation: shake 0.5s ease;
    }
    
    /* Loading button animation */
    .submit-btn.loading {
        position: relative;
        pointer-events: none;
        opacity: 0.8;
    }
    
    .submit-btn.loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid white;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    /* Success animation for form */
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .submit-btn:not(.loading):hover {
        animation: pulse 1s infinite;
    }
    
    /* Fade out animation */
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;

document.head.appendChild(appointmentStyles);

// ====================== APPOINTMENT PAGE SCHEMA MARKUP ======================
function injectAppointmentSchema() {
    // Remove any existing schema to avoid duplication
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(schema => {
        if (schema.textContent.includes('MedicalBusiness') || schema.textContent.includes('FAQPage')) {
            schema.remove();
        }
    });

    // MedicalBusiness + LocalBusiness Schema (Updated for Sajal/Sialkot)
    const appointmentSchema = {
        "@context": "https://schema.org",
        "@type": ["MedicalBusiness", "LocalBusiness"],
        "name": "Dietitian Sajal - Clinical Nutritionist",
        "image": "https://ahwm2n1.github.io/Dn-Maryam/images/dietitian-sajal.png",
        "url": "https://ahwm2n1.github.io/Dn-Maryam/appointment.html",
        "telephone": "+92 326 3651982",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Sialkot",
            "addressRegion": "Punjab",
            "addressCountry": "PK"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 32.4945,
            "longitude": 74.5229
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "20:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "10:00",
                "closes": "16:00"
            }
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Consultation Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Initial Nutrition Consultation",
                        "description": "60-minute comprehensive nutrition assessment and personalized diet plan",
                        "price": "2500",
                        "priceCurrency": "PKR"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Follow-up Session",
                        "description": "30-minute follow-up consultation to track progress and adjust plan",
                        "price": "1500",
                        "priceCurrency": "PKR"
                    }
                }
            ]
        },
        "sameAs": [
            "https://www.instagram.com/dietitian_sajal"
        ],
        "potentialAction": {
            "@type": "ReserveAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://ahwm2n1.github.io/Dn-Maryam/appointment.html",
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                ]
            },
            "result": {
                "@type": "Reservation",
                "name": "Appointment Booking"
            }
        }
    };

    // FAQ Schema for Appointment FAQs
    const faqItems = document.querySelectorAll('.faq-item');
    const faqList = [];
    faqItems.forEach(item => {
        const questionEl = item.querySelector('.faq-question h3');
        const answerEl = item.querySelector('.faq-answer p');
        if (questionEl && answerEl) {
            // Clean question text (remove icon if present)
            let questionText = questionEl.textContent.replace(/[🔹📍💰]/g, '').trim();
            faqList.push({
                "@type": "Question",
                "name": questionText,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answerEl.textContent
                }
            });
        }
    });

    // Inject schemas
    const script1 = document.createElement('script');
    script1.type = 'application/ld+json';
    script1.textContent = JSON.stringify(appointmentSchema);
    document.head.appendChild(script1);

    if (faqList.length > 0) {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqList
        };
        const script2 = document.createElement('script');
        script2.type = 'application/ld+json';
        script2.textContent = JSON.stringify(faqSchema);
        document.head.appendChild(script2);
    }

}
