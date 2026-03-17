// ====================== SCRIPT.JS - COMPLETE FUNCTIONALITY ======================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initAOS();
    initNavigation();
    initTypingEffect();
    initFABModals();
    initAIChat();
    initFAQ();
    initNewsletterForm();
    initStatsCounter();
    initScrollEffects();
    initSmoothScroll();
    loadDynamicContent();
    injectSchemaMarkup(); // SEO enhancement
});

// ====================== AOS INITIALIZATION ======================
function initAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });
}

// ====================== NAVIGATION ======================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ====================== TYPING EFFECT ======================
function initTypingEffect() {
    const typedText = document.getElementById('typed-text');
    if (!typedText) return;
    
    // Updated words for Sialkot and better keywords
    const words = ['Dietitian in Sialkot', 'Nutritionist', 'PCOS Expert', 'Weight Loss Coach'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typedText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isWaiting = true;
            setTimeout(() => {
                isDeleting = true;
                isWaiting = false;
            }, 2000);
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(type, isWaiting ? 2000 : speed);
    }
    
    type();
}

// ====================== FAB MODALS ======================
function initFABModals() {
    const aiChatBtn = document.getElementById('aiChatBtn');
    const quickContactBtn = document.getElementById('quickContactBtn');
    const aiModal = document.getElementById('aiModal');
    const quickModal = document.getElementById('quickContactModal');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const quickCloseBtn = document.getElementById('quickCloseBtn');
    
    // Open AI Chat
    if (aiChatBtn) {
        aiChatBtn.addEventListener('click', function() {
            aiModal.classList.add('active');
            quickModal.classList.remove('active');
        });
    }
    
    // Open Quick Contact
    if (quickContactBtn) {
        quickContactBtn.addEventListener('click', function() {
            quickModal.classList.add('active');
            aiModal.classList.remove('active');
        });
    }
    
    // Close AI Chat
    if (aiCloseBtn) {
        aiCloseBtn.addEventListener('click', function() {
            aiModal.classList.remove('active');
        });
    }
    
    // Close Quick Contact
    if (quickCloseBtn) {
        quickCloseBtn.addEventListener('click', function() {
            quickModal.classList.remove('active');
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (aiModal && e.target === aiModal) {
            aiModal.classList.remove('active');
        }
        if (quickModal && e.target === quickModal) {
            quickModal.classList.remove('active');
        }
    });
}

// ====================== AI CHAT FUNCTIONALITY ======================
function initAIChat() {
    const chatBody = document.getElementById('aiChatBody');
    const userInput = document.getElementById('aiUserInput');
    const sendBtn = document.getElementById('aiSendBtn');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    
    if (!chatBody || !userInput || !sendBtn) return;
    
    // AI Response database - enhanced with more specific answers
    const aiResponses = {
        'sialkot': 'Yes, I am based in Sialkot and offer in-person consultations. You can visit my clinic or book an online session. Call +92 326 3651982 for directions.',
        'pcos': 'For PCOS management, I recommend focusing on: 1️⃣ Low glycemic index foods 2️⃣ Anti-inflammatory diet 3️⃣ Regular meal timings 4️⃣ Adequate protein intake. Would you like a detailed PCOS diet plan tailored for you?',
        'weight loss': 'For healthy weight loss, consider: 1️⃣ Calorie deficit of 300-500 kcal 2️⃣ High protein intake 3️⃣ Regular exercise 4️⃣ Adequate sleep. I can create a personalized plan based on your lifestyle!',
        'weight gain': 'For healthy weight gain: 1️⃣ Calorie surplus 2️⃣ Strength training 3️⃣ Frequent meals 4️⃣ Healthy fats like nuts, avocados. Let me know your current weight and target!',
        'diabetes': 'Diabetes management focuses on: 1️⃣ Consistent carb intake 2️⃣ Fiber-rich foods 3️⃣ Regular monitoring 4️⃣ Portion control. Would you like specific meal suggestions for blood sugar control?',
        'appointment': '📅 You can book an appointment through our Appointment page, call +92 326 3651982, or send a message on WhatsApp. We offer both in-person (Sialkot) and online consultations worldwide.',
        'cost': '💰 Initial consultation is PKR 2,500. Follow-up sessions are PKR 1,500. Monthly packages start from PKR 5,000 including weekly check-ins and diet plan adjustments.',
        'online': '🌐 Yes! We offer online consultations via Zoom or WhatsApp video call for clients worldwide. Same quality service from the comfort of your home.',
        'meal plan': '🥗 I create personalized meal plans based on your: 1) Health goals 2) Food preferences 3) Lifestyle 4) Medical conditions. Book a consultation to get started!',
        'pcos diet': 'For PCOS, include: Whole grains, lean proteins, leafy greens, berries, nuts, seeds. Avoid: Sugary foods, processed carbs, dairy (for some).',
        'detox': '🌿 I don\'t recommend extreme detox diets. Instead, focus on whole foods, adequate water, and removing processed foods for natural body cleansing.',
        'hello': '👋 Hello! I\'m Maryam\'s AI assistant. How can I help you with your nutrition questions today?',
        'hi': '👋 Hi there! Great to hear from you. What nutrition topic would you like to discuss? (PCOS, weight loss, diabetes, etc.)',
        'thank': '😊 You\'re welcome! Feel free to ask if you have more questions.',
        'thanks': '😊 You\'re welcome! Feel free to ask if you have more questions.',
        'location': '📍 I am located in Sialkot, Pakistan. I offer both in-person and online consultations.',
        'sialkot': '📍 Yes, I practice in Sialkot. You can book an in-person appointment or online consultation.',
        'contact': '📞 You can reach me at +92 326 3651982, email dnmaryamshahrukh@gmail.com, or via WhatsApp.',
        'hours': '⏰ Working hours: Mon-Fri 9am-8pm, Sat 10am-4pm. Closed on Sundays.'
    };
    
    // Send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message
        addMessage(message, 'user');
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get AI response
        setTimeout(() => {
            removeTypingIndicator();
            const response = getAIResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
            <span class="message-time">${time}</span>
        `;
        
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'ai-message bot-message typing-indicator';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="message-content">
                <p><i class="fa-solid fa-circle" style="font-size: 0.5rem; margin: 0 2px; animation: bounce 1s infinite;"></i>
                <i class="fa-solid fa-circle" style="font-size: 0.5rem; margin: 0 2px; animation: bounce 1s infinite 0.2s;"></i>
                <i class="fa-solid fa-circle" style="font-size: 0.5rem; margin: 0 2px; animation: bounce 1s infinite 0.4s;"></i></p>
            </div>
        `;
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Get AI response based on message
    function getAIResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        // Check for keywords
        for (const [key, response] of Object.entries(aiResponses)) {
            if (lowerMsg.includes(key)) {
                return response;
            }
        }
        
        // Check for combined keywords
        if (lowerMsg.includes('pcos') && lowerMsg.includes('diet')) {
            return aiResponses['pcos diet'];
        }
        if (lowerMsg.includes('book') || lowerMsg.includes('appointment')) {
            return aiResponses['appointment'];
        }
        if (lowerMsg.includes('price') || lowerMsg.includes('fee') || lowerMsg.includes('cost')) {
            return aiResponses['cost'];
        }
        
        // Default response
        return "🤔 I understand you're asking about nutrition. Could you please be more specific? You can ask about PCOS, weight loss, diabetes, meal plans, appointments, costs, or location (Sialkot). I'm here to help! 😊";
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Suggestion chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            userInput.value = this.textContent.replace(/[🔹📍💰]/g, '').trim(); // Clean icons
            sendMessage();
        });
    });
}

// ====================== FAQ ACCORDION ======================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ====================== NEWSLETTER FORM ======================
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const privacyChecked = this.querySelector('input[type="checkbox"]').checked;
            
            if (!privacyChecked) {
                showNotification('Please accept the privacy policy', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for subscribing! 🎉 You\'ll receive our weekly nutrition tips.', 'success');
            this.reset();
            
            // Here you can integrate with email service
            console.log('Newsletter subscription:', email);
        });
    }
}

// ====================== STATS COUNTER (updated for new about section) ======================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number, .stat-large');
    
    function animateNumber(element, target) {
        let current = 0;
        const increment = target / 50; // 50 steps
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.classList.contains('stat-number') && element.id === 'statSuccess' ? '%' : element.classList.contains('stat-number') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.classList.contains('stat-number') && element.id === 'statSuccess' ? '%' : element.classList.contains('stat-number') ? '+' : '');
            }
        }, 20);
    }
    
    // Intersection Observer for stats
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    // Extract number from text content
                    let targetText = stat.textContent.replace(/[^0-9]/g, '');
                    if (targetText) {
                        const target = parseInt(targetText);
                        if (!isNaN(target)) {
                            animateNumber(stat, target);
                        }
                    }
                });
                observer.disconnect(); // Only animate once
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.hero-stats, .about-stats-grid');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// ====================== SCROLL EFFECTS ======================
function initScrollEffects() {
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Check on initial load
}

// ====================== SMOOTH SCROLL ======================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ====================== DYNAMIC CONTENT LOADING ======================
function loadDynamicContent() {
    // Load certificates from localStorage or use default
    loadCertificates();
    
    // Load blog posts from localStorage or use default
    loadBlogPosts();
}

function loadCertificates() {
    const certificatesGrid = document.getElementById('certificatesGrid');
    if (!certificatesGrid) return;
    
    // Get certificates from localStorage (if any)
    let certificates = JSON.parse(localStorage.getItem('certificates')) || [
        {
            icon: 'fa-graduation-cap',
            title: 'BS in Nutrition',
            description: 'Strong academic foundation in human nutrition and diet planning from recognized institution'
        },
        {
            icon: 'fa-flask',
            title: 'MPhil (HND)',
            description: 'Advanced studies focusing on clinical and therapeutic nutrition with research experience'
        },
        {
            icon: 'fa-certificate',
            title: 'Certified Clinical Nutritionist',
            description: 'Professional certification in nutrition counseling and medical nutrition therapy'
        },
        {
            icon: 'fa-briefcase',
            title: 'Clinical Experience',
            description: '8+ years experience in clinical settings helping clients achieve sustainable results'
        }
    ];
    
    // Clear existing content
    certificatesGrid.innerHTML = '';
    
    // Add certificates to grid
    certificates.forEach((cert, index) => {
        const card = document.createElement('div');
        card.className = 'certificate-card';
        card.setAttribute('data-aos', 'flip-up');
        card.setAttribute('data-aos-delay', index * 100);
        
        card.innerHTML = `
            <div class="card-icon">
                <i class="fa-solid ${cert.icon}"></i>
            </div>
            <h3>${cert.title}</h3>
            <p>${cert.description}</p>
        `;
        
        certificatesGrid.appendChild(card);
    });
}

function loadBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    
    // Get blog posts from localStorage (if any) - updated to 4 posts
    let blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [
        {
            image: 'images/blog-1.avif',
            category: 'Nutrition',
            title: 'Healthy Eating for Busy People',
            description: 'Learn how to maintain a balanced diet even with a busy lifestyle and demanding schedule.',
            link: 'services.html'
        },
        {
            image: 'images/blog-2.jpg',
            category: "Women's Health",
            title: 'PCOS Diet: What to Eat & Avoid',
            description: 'A complete guide to managing PCOS through nutrition and lifestyle modifications.',
            link: '#'
        },
        {
            image: 'images/blog-3.jpg',
            category: 'Weight Management',
            title: 'Sustainable Weight Loss Tips',
            description: 'Evidence-based strategies for healthy, sustainable weight loss without extreme dieting.',
            link: '#'
        },
        {
            image: 'images/blog-4.jpg',
            category: 'Diabetes Care',
            title: 'Diabetes-Friendly Meal Plan',
            description: 'Balanced meals that help regulate blood sugar without compromising on taste.',
            link: '#'
        }
    ];
    
    // Clear existing content
    blogGrid.innerHTML = '';
    
    // Add blog posts to grid
    blogPosts.forEach((post, index) => {
        const article = document.createElement('article');
        article.className = 'blog-card';
        article.setAttribute('data-aos', 'fade-up');
        article.setAttribute('data-aos-delay', index * 100);
        
        article.innerHTML = `
            <div class="card-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Nutrition+Blog'">
                <div class="card-category"><i class="fa-regular ${getCategoryIcon(post.category)}"></i> ${post.category}</div>
            </div>
            <div class="card-content">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <a href="${post.link}" class="read-more">Read Article <i class="fa-regular fa-arrow-right"></i></a>
            </div>
        `;
        
        blogGrid.appendChild(article);
    });
}

// Helper for blog category icons
function getCategoryIcon(category) {
    const icons = {
        'Nutrition': 'fa-bowl-food',
        'Women\'s Health': 'fa-female',
        'Weight Management': 'fa-weight-scale',
        'Diabetes Care': 'fa-droplet'
    };
    return icons[category] || 'fa-newspaper';
}

// ====================== NOTIFICATION SYSTEM ======================
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) existingNotif.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-exclamation';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fa-regular ${iconClass}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fa-regular fa-xmark"></i></button>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        color: #333;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 9999;
        animation: slideUp 0.3s ease;
        border-left: 4px solid ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        font-family: 'Montserrat', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// ====================== ADDITIONAL STYLES FOR NOTIFICATIONS ======================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #999;
        transition: color 0.3s;
    }
    
    .notification-close:hover {
        color: #333;
    }
    
    .notification-success i {
        color: #4CAF50;
    }
    
    .notification-error i {
        color: #f44336;
    }
    
    .notification-info i {
        color: #2196F3;
    }
    
    /* Typing indicator animation */
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
    }

    /* Menu open state */
    body.menu-open {
        overflow: hidden;
    }
`;

document.head.appendChild(style);

// ====================== LOCAL STORAGE MANAGEMENT ======================
// Admin panel se data save karne ke liye functions
window.saveCertificates = function(certificates) {
    localStorage.setItem('certificates', JSON.stringify(certificates));
    loadCertificates(); // Reload certificates
    showNotification('Certificates updated successfully!', 'success');
};

window.saveBlogPosts = function(posts) {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    loadBlogPosts(); // Reload blog posts
    showNotification('Blog posts updated successfully!', 'success');
};

// ====================== APPOINTMENT FORM HANDLER ======================
// This will be used on appointment.html page
window.handleAppointmentSubmit = function(formData) {
    // Format message for WhatsApp
    const message = `*New Appointment Request*%0A
%0A*Name:* ${formData.name}
%0A*Phone:* ${formData.phone}
%0A*Service:* ${formData.service || 'Not specified'}
%0A*Preferred Date:* ${formData.date || 'Not specified'}
%0A*Message:* ${formData.message || 'No message'}
%0A
%0A*Submitted:* ${new Date().toLocaleString()}`;
    
    // Open WhatsApp with formatted message
    window.open(`https://wa.me/923263651982?text=${message}`, '_blank');
    
    showNotification('Redirecting to WhatsApp...', 'success');
};

// ====================== EXPORT FUNCTIONS FOR OTHER PAGES ======================
window.showNotification = showNotification;

// ====================== SCHEMA MARKUP INJECTION (SEO) ======================
function injectSchemaMarkup() {
    // Remove any existing schema to avoid duplication
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(schema => {
        if (schema.textContent.includes('LocalBusiness') || schema.textContent.includes('FAQPage')) {
            schema.remove();
        }
    });

    // LocalBusiness Schema (updated for Sialkot)
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Dietitian Maryam Shahrukh",
        "image": "https://ahwm2n1.github.io/Dn-Maryam/images/dietitian-maryam.png",
        "@id": "https://ahwm2n1.github.io/Dn-Maryam",
        "url": "https://ahwm2n1.github.io/Dn-Maryam/",
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
            "latitude": 32.4945, // Approx for Sialkot
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
        "sameAs": [
            "https://www.instagram.com/dietitian_sajal", // Updated to provided Instagram
            "https://www.facebook.com/yourprofile/" // Add actual FB if available
        ],
        "areaServed": {
            "@type": "City",
            "name": "Sialkot"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Nutrition Services",
            "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Weight Loss Diet Plan"}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "PCOS Diet Consultation"}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Diabetes Meal Planning"}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Holistic Wellness Coaching"}}
            ]
        }
    };

    // FAQ Schema (Dynamically generated from your existing FAQ items)
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
    script1.textContent = JSON.stringify(localBusinessSchema);
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
