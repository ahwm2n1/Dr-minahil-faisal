// ====================== SERVICES.JS - ADDITIONAL FUNCTIONALITY ======================
// This file contains specific functionality for services.html
// Updated for Dietitian Irfa-Khan - Lahore

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initServicesPage();
    initServiceFilters();
    initPricingToggle();
    initComparisonTable();
    loadServicesFromStorage();
    initServiceBooking();
    initReviewSlider();
    injectServicesSchema(); // SEO enhancement
});

// ====================== SERVICES PAGE INITIALIZATION ======================
function initServicesPage() {
    console.log('Services page initialized for Dietitian Irfa-Khan');
    
    // Update active nav state
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === 'services.html') {
            link.classList.add('active');
        }
    });
    
    // Animate service cards on scroll
    animateServiceCards();
    
    // Initialize tooltips
    initTooltips();
}

// ====================== SERVICE CARDS ANIMATION ======================
function animateServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ====================== SERVICE FILTERS ======================
function initServiceFilters() {
    // Create filter buttons if they don't exist
    const servicesSection = document.querySelector('.services-page');
    if (!servicesSection) return;
    
    const filterContainer = document.createElement('div');
    filterContainer.className = 'service-filters';
    filterContainer.setAttribute('data-aos', 'fade-up');
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-filter="all">All Services</button>
        <button class="filter-btn" data-filter="weight">Weight Management</button>
        <button class="filter-btn" data-filter="women">Women's Health</button>
        <button class="filter-btn" data-filter="chronic">Chronic Conditions</button>
        <button class="filter-btn" data-filter="wellness">Wellness</button>
    `;
    
    // Insert filters before services grid
    const servicesGrid = document.getElementById('servicesGrid');
    if (servicesGrid) {
        servicesSection.insertBefore(filterContainer, servicesGrid);
    }
    
    // Add filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter services
            serviceCards.forEach((card, index) => {
                const category = getServiceCategory(card.querySelector('h3').textContent);
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Show notification
            showNotification(`Showing ${filter === 'all' ? 'all services' : filter + ' services'}`, 'info');
        });
    });
}

// Helper function to determine service category
function getServiceCategory(title) {
    if (title.includes('Weight')) return 'weight';
    if (title.includes('PCOS') || title.includes('Prenatal')) return 'women';
    if (title.includes('Diabetes') || title.includes('Heart')) return 'chronic';
    return 'wellness';
}

// ====================== PRICING TOGGLE (Monthly/Yearly) ======================
function initPricingToggle() {
    const servicesSection = document.querySelector('.services-page');
    if (!servicesSection) return;
    
    const pricingToggle = document.createElement('div');
    pricingToggle.className = 'pricing-toggle';
    pricingToggle.setAttribute('data-aos', 'fade-up');
    pricingToggle.innerHTML = `
        <span class="toggle-label active" data-plan="monthly">Monthly</span>
        <div class="toggle-switch">
            <div class="toggle-slider"></div>
        </div>
        <span class="toggle-label" data-plan="yearly">Yearly <span class="save-badge">Save 20%</span></span>
    `;
    
    // Insert toggle before services grid
    const servicesGrid = document.getElementById('servicesGrid');
    if (servicesGrid) {
        servicesSection.insertBefore(pricingToggle, servicesGrid);
    }
    
    // Add toggle functionality
    const toggleSwitch = document.querySelector('.toggle-switch');
    const labels = document.querySelectorAll('.toggle-label');
    const monthlyPrices = {
        'Weight Management': 3500,
        'PCOS/PCOD Management': 4000,
        'Diabetes Management': 4000,
        'Heart Health': 3800,
        'Prenatal Nutrition': 4500,
        'Gut Health': 3800
    };
    
    if (toggleSwitch) {
        toggleSwitch.addEventListener('click', function() {
            const isYearly = this.classList.contains('yearly');
            
            if (isYearly) {
                // Switch to monthly
                this.classList.remove('yearly');
                labels[0].classList.add('active');
                labels[1].classList.remove('active');
                updatePrices('monthly');
            } else {
                // Switch to yearly
                this.classList.add('yearly');
                labels[1].classList.add('active');
                labels[0].classList.remove('active');
                updatePrices('yearly');
            }
        });
    }
    
    function updatePrices(plan) {
        const prices = document.querySelectorAll('.price');
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach((card, index) => {
            const title = card.querySelector('h3').textContent;
            let basePrice = monthlyPrices[title] || 3500;
            
            if (plan === 'yearly') {
                // 20% discount for yearly
                const yearlyPrice = basePrice * 12 * 0.8;
                prices[index].textContent = `PKR ${Math.round(yearlyPrice)}`;
                
                // Update period
                const period = card.querySelector('.period');
                if (period) period.textContent = '/year';
            } else {
                prices[index].textContent = `PKR ${basePrice}`;
                const period = card.querySelector('.period');
                if (period) period.textContent = '/month';
            }
        });
    }
}

// ====================== COMPARISON TABLE ======================
function initComparisonTable() {
    const servicesSection = document.querySelector('.services-page');
    if (!servicesSection) return;
    
    const comparisonSection = document.createElement('section');
    comparisonSection.className = 'comparison-section';
    comparisonSection.setAttribute('data-aos', 'fade-up');
    comparisonSection.innerHTML = `
        <div class="container">
            <div class="section-header">
                <span class="section-subtitle"><i class="fa-regular fa-table"></i> Compare Plans</span>
                <h2 class="section-title">Choose the Right Plan for You</h2>
                <p class="section-description">Compare features across our nutrition packages</p>
            </div>
            
            <div class="comparison-table-wrapper">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Features</th>
                            <th>Basic</th>
                            <th>Standard <span class="popular-badge">Popular</span></th>
                            <th>Premium</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Initial Consultation</td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                        </tr>
                        <tr>
                            <td>Personalized Meal Plan</td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                        </tr>
                        <tr>
                            <td>Weekly Follow-ups</td>
                            <td><i class="fa-regular fa-xmark" style="color: #f44336;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                        </tr>
                        <tr>
                            <td>WhatsApp Support</td>
                            <td><i class="fa-regular fa-xmark" style="color: #f44336;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                        </tr>
                        <tr>
                            <td>Progress Tracking</td>
                            <td><i class="fa-regular fa-xmark" style="color: #f44336;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                        </tr>
                        <tr>
                            <td>Recipe Database Access</td>
                            <td><i class="fa-regular fa-xmark" style="color: #f44336;"></i></td>
                            <td><i class="fa-regular fa-xmark" style="color: #f44336;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                        </tr>
                        <tr>
                            <td>Monthly Check-in</td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                            <td><i class="fa-regular fa-check" style="color: #4CAF50;"></i></td>
                        </tr>
                        <tr>
                            <td>Price</td>
                            <td>PKR 2,500/session</td>
                            <td>PKR 3,500/month</td>
                            <td>PKR 4,500/month</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><a href="appointment.html" class="btn btn-outline btn-sm">Select</a></td>
                            <td><a href="appointment.html" class="btn btn-primary btn-sm">Select</a></td>
                            <td><a href="appointment.html" class="btn btn-outline btn-sm">Select</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Insert comparison after services grid
    const servicesGrid = document.getElementById('servicesGrid');
    if (servicesGrid) {
        servicesGrid.parentElement.parentElement.appendChild(comparisonSection);
    }
}

// ====================== LOAD SERVICES FROM LOCALSTORAGE ======================
function loadServicesFromStorage() {
    // Get services from localStorage (if any from admin panel)
    const storedServices = JSON.parse(localStorage.getItem('services')) || [];
    
    if (storedServices.length > 0) {
        updateServicesWithStoredData(storedServices);
    }
}

function updateServicesWithStoredData(services) {
    const serviceCards = document.querySelectorAll('.service-card');
    
    services.forEach((service, index) => {
        if (serviceCards[index]) {
            const card = serviceCards[index];
            
            // Update icon if provided
            if (service.icon) {
                const iconEl = card.querySelector('.service-icon i');
                if (iconEl) {
                    iconEl.className = `fa-solid ${service.icon}`;
                }
            }
            
            // Update title
            const titleEl = card.querySelector('h3');
            if (titleEl && service.title) {
                titleEl.textContent = service.title;
            }
            
            // Update description
            const descEl = card.querySelector('.service-description');
            if (descEl && service.description) {
                descEl.textContent = service.description;
            }
            
            // Update price
            const priceEl = card.querySelector('.price');
            if (priceEl && service.price) {
                priceEl.textContent = `PKR ${service.price}`;
            }
            
            // Update features
            const features = card.querySelectorAll('.feature');
            if (service.features && service.features.length > 0) {
                features.forEach((feature, i) => {
                    if (service.features[i]) {
                        feature.innerHTML = `<i class="fa-regular fa-check"></i> ${service.features[i]}`;
                    }
                });
            }
        }
    });
}

// ====================== SERVICE BOOKING HANDLER ======================
function initServiceBooking() {
    const bookButtons = document.querySelectorAll('.service-btn');
    
    bookButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get service details
            const card = this.closest('.service-card');
            const serviceName = card.querySelector('h3').textContent;
            const servicePrice = card.querySelector('.price').textContent;
            
            // Save selected service to sessionStorage
            sessionStorage.setItem('selectedService', JSON.stringify({
                name: serviceName,
                price: servicePrice,
                date: new Date().toISOString()
            }));
            
            // Show confirmation
            showNotification(`Selected: ${serviceName}`, 'success');
            
            // Redirect to appointment page
            setTimeout(() => {
                window.location.href = 'appointment.html';
            }, 1000);
        });
    });
}

// ====================== REVIEW SLIDER ======================
function initReviewSlider() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (!reviewsGrid) return;
    
    // Add slider controls for mobile
    if (window.innerWidth <= 768) {
        const reviewsContainer = document.createElement('div');
        reviewsContainer.className = 'reviews-slider-container';
        
        // Wrap reviews in slider
        const reviews = document.querySelectorAll('.review-card');
        const wrapper = document.createElement('div');
        wrapper.className = 'reviews-slider';
        
        reviews.forEach(review => {
            wrapper.appendChild(review.cloneNode(true));
        });
        
        reviewsGrid.innerHTML = '';
        reviewsGrid.appendChild(wrapper);
        
        // Add navigation dots
        const dots = document.createElement('div');
        dots.className = 'slider-dots';
        
        for (let i = 0; i < reviews.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => slideTo(i));
            dots.appendChild(dot);
        }
        
        reviewsGrid.appendChild(dots);
        
        // Slider functionality
        let currentSlide = 0;
        
        function slideTo(index) {
            currentSlide = index;
            wrapper.style.transform = `translateX(-${index * 100}%)`;
            
            // Update dots
            document.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        // Auto slide
        setInterval(() => {
            currentSlide = (currentSlide + 1) % reviews.length;
            slideTo(currentSlide);
        }, 5000);
    }
}

// ====================== TOOLTIPS ======================
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = el.dataset.tooltip;
            
            document.body.appendChild(tooltip);
            
            const rect = el.getBoundingClientRect();
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            
            el.addEventListener('mouseleave', () => {
                tooltip.remove();
            }, { once: true });
        });
    });
}

// ====================== ADDITIONAL STYLES FOR SERVICES PAGE ======================
const serviceStyles = document.createElement('style');
serviceStyles.textContent = `
    /* Service Filters */
    .service-filters {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 3rem;
        flex-wrap: wrap;
    }
    
    .filter-btn {
        padding: 0.75rem 1.5rem;
        border: 1px solid rgba(193, 123, 76, 0.3);
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: var(--radius-full);
        color: var(--dark);
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition-fast);
    }
    
    .filter-btn:hover,
    .filter-btn.active {
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        color: white;
        border-color: transparent;
    }
    
    /* Pricing Toggle */
    .pricing-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        margin-bottom: 3rem;
    }
    
    .toggle-label {
        font-weight: 500;
        color: var(--dark-light);
        cursor: pointer;
        transition: var(--transition-fast);
    }
    
    .toggle-label.active {
        color: var(--primary);
    }
    
    .save-badge {
        background: var(--accent);
        color: var(--dark);
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-full);
        font-size: 0.7rem;
        margin-left: 0.5rem;
    }
    
    .toggle-switch {
        width: 60px;
        height: 30px;
        background: rgba(193, 123, 76, 0.2);
        border-radius: 30px;
        position: relative;
        cursor: pointer;
        transition: var(--transition-fast);
    }
    
    .toggle-slider {
        width: 26px;
        height: 26px;
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        border-radius: 50%;
        position: absolute;
        top: 2px;
        left: 2px;
        transition: var(--transition-fast);
    }
    
    .toggle-switch.yearly .toggle-slider {
        left: 32px;
    }
    
    /* Comparison Table */
    .comparison-section {
        padding: 6rem 0;
    }
    
    .comparison-table-wrapper {
        overflow-x: auto;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: var(--radius-lg);
        padding: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .comparison-table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
    }
    
    .comparison-table th {
        padding: 1.5rem 1rem;
        font-size: 1.1rem;
        color: var(--primary);
        border-bottom: 2px solid rgba(193, 123, 76, 0.3);
    }
    
    .comparison-table td {
        padding: 1rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .comparison-table tr:last-child td {
        border-bottom: none;
    }
    
    .comparison-table td:first-child {
        font-weight: 500;
        text-align: left;
    }
    
    .popular-badge {
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-full);
        font-size: 0.7rem;
        margin-left: 0.5rem;
    }
    
    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
    
    /* Review Slider (Mobile) */
    @media (max-width: 768px) {
        .reviews-slider-container {
            overflow: hidden;
            position: relative;
        }
        
        .reviews-slider {
            display: flex;
            transition: transform 0.5s ease;
        }
        
        .reviews-slider .review-card {
            flex: 0 0 100%;
            margin-right: 1rem;
        }
        
        .slider-dots {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 2rem;
        }
        
        .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(193, 123, 76, 0.3);
            cursor: pointer;
            transition: var(--transition-fast);
        }
        
        .dot.active {
            background: var(--primary);
            transform: scale(1.2);
        }
    }
    
    /* Custom Tooltip */
    .custom-tooltip {
        position: fixed;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        font-size: 0.8rem;
        z-index: 9999;
        pointer-events: none;
        animation: fadeIn 0.2s ease;
    }
    
    .custom-tooltip::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid rgba(0, 0, 0, 0.8);
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(serviceStyles);

// ====================== EXPORT FUNCTIONS FOR ADMIN PANEL ======================
window.updateServices = function(services) {
    localStorage.setItem('services', JSON.stringify(services));
    updateServicesWithStoredData(services);
    showNotification('Services updated successfully!', 'success');
};

window.addService = function(service) {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    services.push(service);
    localStorage.setItem('services', JSON.stringify(services));
    location.reload(); // Reload to show new service
};

window.deleteService = function(index) {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    services.splice(index, 1);
    localStorage.setItem('services', JSON.stringify(services));
    location.reload();
};

// ====================== BOOKING TRACKING ======================
window.trackServiceBooking = function(serviceName) {
    // Track for analytics
    console.log(`Service booked: ${serviceName} for Dietitian Irfa-Khan`);
    
    // Store in localStorage for retargeting
    localStorage.setItem('lastViewedService', serviceName);
    localStorage.setItem('serviceInterest', new Date().toISOString());
    
    // Show personalized message
    showNotification(`Great choice! Let's schedule your ${serviceName} consultation with Dietitian Irfa-Khan.`, 'success');
    
    return true;
};

// ====================== SERVICES PAGE SCHEMA MARKUP (Updated for Irfa-Khan/Lahore) ======================
function injectServicesSchema() {
    // Remove any existing schema to avoid duplication
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(schema => {
        if (schema.textContent.includes('MedicalBusiness') || schema.textContent.includes('FAQPage')) {
            schema.remove();
        }
    });

    // MedicalBusiness + Service Schema
    const services = [];
    document.querySelectorAll('.service-card').forEach(card => {
        const title = card.querySelector('h3')?.textContent || '';
        const description = card.querySelector('.service-description')?.textContent || '';
        const priceEl = card.querySelector('.price')?.textContent || 'PKR 3,500';
        const features = [];
        card.querySelectorAll('.feature').forEach(f => {
            features.push(f.textContent.trim());
        });
        
        services.push({
            "@type": "Service",
            "name": title,
            "description": description,
            "provider": {
                "@type": "Person",
                "name": "Dietitian Irfa-Khan",
                "credential": "Clinical Nutritionist"
            },
            "areaServed": {
                "@type": "City",
                "name": "Lahore"
            },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": title,
                "itemListElement": features.map(f => ({
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": f
                    }
                }))
            },
            "offers": {
                "@type": "Offer",
                "price": priceEl.replace('PKR', '').trim().split('/')[0],
                "priceCurrency": "PKR",
                "availability": "https://schema.org/InStock",
                "validFrom": new Date().toISOString().split('T')[0]
            }
        });
    });

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "@id": "https://ahwm2n1.github.io/Dn-Maryam/services.html",
        "name": "Dietitian Irfa-Khan - Clinical Nutritionist Services in Lahore",
        "description": "Professional nutrition and dietetics services in Lahore specializing in weight management, PCOS, diabetes, and holistic wellness.",
        "url": "https://ahwm2n1.github.io/Dn-Maryam/services.html",
        "telephone": "+92 319 3241959",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lahore",
            "addressRegion": "Punjab",
            "addressCountry": "PK"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Nutrition Services",
            "itemListElement": services
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "500",
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": [
            {
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": "Sarah Khan"
                },
                "reviewBody": "Irfa-Khan's PCOS diet plan changed my life. My periods are regular now, I've lost 12 kg."
            },
            {
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": "Ahmed Raza"
                },
                "reviewBody": "My HbA1c dropped from 8.5 to 6.2 in just 4 months with Irfa-Khan's diabetes management plan."
            },
            {
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": "Fatima Ali"
                },
                "reviewBody": "I gained 8 kg of healthy weight in 3 months with her personalized weight gain plan."
            }
        ]
    };

    // FAQ Schema
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
    script1.textContent = JSON.stringify(serviceSchema);
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
