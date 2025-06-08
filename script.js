document.addEventListener('DOMContentLoaded', function() {
    // Get form and result elements
    const calorieForm = document.getElementById('calorie-form');
    const resultContainer = document.getElementById('result');
    const recalculateBtn = document.getElementById('recalculate');
    
    // Language selector elements
    const currentLanguage = document.getElementById('current-language');
    const languageDropdown = document.getElementById('language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    
    // Check if device is touch-enabled
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    // Add event listeners
    calorieForm.addEventListener('submit', calculateCalories);
    recalculateBtn.addEventListener('click', resetCalculator);
    
    // Language selector event listeners
    currentLanguage.addEventListener('click', toggleLanguageDropdown);
    
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
            toggleLanguageDropdown();
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-selector')) {
            languageDropdown.classList.remove('show');
        }
    });
    
    // Initialize language from localStorage or use default (tr)
    initializeLanguage();
    
    // Add smooth entry animation to form elements
    animateFormElements();
    
    // Adjust for mobile viewports
    adjustForMobileViewports();
    window.addEventListener('resize', adjustForMobileViewports);
    
    // Initialize language from localStorage or use default (tr)
    function initializeLanguage() {
        let savedLang = localStorage.getItem('preferredLanguage') || 'en';
        changeLanguage(savedLang);
    }
    
    // Toggle language dropdown visibility
    function toggleLanguageDropdown() {
        languageDropdown.classList.toggle('show');
    }
    
    // Change language function
    function changeLanguage(lang) {
        // Save selected language to localStorage
        localStorage.setItem('preferredLanguage', lang);
        
        // Set active class on selected language
        languageOptions.forEach(option => {
            if (option.getAttribute('data-lang') === lang) {
                option.classList.add('active');
                
                // Update current language display
                const flagSrc = option.querySelector('img').src;
                const langText = option.querySelector('span').textContent;
                
                currentLanguage.querySelector('img').src = flagSrc;
                currentLanguage.querySelector('span').textContent = langText;
            } else {
                option.classList.remove('active');
            }
        });
        
        // Set RTL for Arabic and Hebrew
        if (lang === 'ar' || lang === 'he') {
            document.body.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', lang);
        } else {
            document.body.removeAttribute('dir');
            document.documentElement.setAttribute('lang', lang);
        }
        
        // Update all text elements with the selected language
        if (translations && translations[lang]) {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[lang][key]) {
                    if (element.tagName === 'INPUT' && element.getAttribute('type') === 'text') {
                        element.setAttribute('placeholder', translations[lang][key]);
                    } else if (element.tagName === 'OPTION') {
                        element.textContent = translations[lang][key];
                    } else {
                        element.innerHTML = translations[lang][key];
                    }
                }
            });
            
            // Update document title
            document.title = lang === 'tr' ? 'Modern Kalori Hesaplayıcı' : 
                            (lang === 'en' ? 'Modern Calorie Calculator' :
                            (lang === 'fr' ? 'Calculateur de Calories Moderne' :
                            (lang === 'es' ? 'Calculadora de Calorías Moderna' :
                            (lang === 'ar' ? 'حاسبة السعرات الحرارية الحديثة' :
                            (lang === 'he' ? 'מחשבון קלוריות מודרני' :
                            (lang === 'de' ? 'Moderner Kalorienrechner' :
                            (lang === 'it' ? 'Calcolatore di Calorie Moderno' :
                            (lang === 'ru' ? 'Современный Калькулятор Калорий' :
                            (lang === 'zh' ? '现代卡路里计算器' : 'Modern Calorie Calculator')))))))));
        }
    }
    
    // Calculate calories function
    function calculateCalories(e) {
        e.preventDefault();
        
        // Validate form before proceeding
        if (!validateForm()) {
            return false;
        }
        
        // Add loading effect
        const submitBtn = document.querySelector('button[type="submit"]');
        const lang = localStorage.getItem('preferredLanguage') || 'tr';
        const calculatingText = translations[lang]['calculating'] || 'Calculating...';
        
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> ${calculatingText}`;
        submitBtn.disabled = true;
        
        // Get form values
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const age = parseInt(document.getElementById('age').value);
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const activityLevel = parseFloat(document.getElementById('activity').value);
        const goal = document.querySelector('input[name="goal"]:checked').value;
        
        // Simulate delay for calculation (for UX purposes)
        setTimeout(() => {
            // Calculate BMR using Mifflin-St Jeor Equation
            let bmr;
            if (gender === 'male') {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }
            
            // Calculate maintenance calories
            const maintenanceCalories = Math.round(bmr * activityLevel);
            
            // Calculate goal calories
            let goalCalories;
            if (goal === 'lose') {
                goalCalories = Math.round(maintenanceCalories * 0.8); // 20% deficit
            } else if (goal === 'gain') {
                goalCalories = Math.round(maintenanceCalories * 1.15); // 15% surplus
            } else {
                goalCalories = maintenanceCalories;
            }
            
            // Calculate macronutrients
            // Protein: 30%, Carbs: 45%, Fat: 25%
            const proteinCalories = Math.round(goalCalories * 0.3);
            const carbsCalories = Math.round(goalCalories * 0.45);
            const fatsCalories = Math.round(goalCalories * 0.25);
            
            const proteinGrams = Math.round(proteinCalories / 4); // 4 calories per gram
            const carbsGrams = Math.round(carbsCalories / 4); // 4 calories per gram
            const fatsGrams = Math.round(fatsCalories / 9); // 9 calories per gram
            
            // Recalculate actual calories based on rounded grams to ensure accuracy
            const actualProteinCalories = proteinGrams * 4;
            const actualCarbsCalories = carbsGrams * 4;
            const actualFatsCalories = fatsGrams * 9;
            
            // Update results in the DOM
            document.getElementById('bmr-value').textContent = Math.round(bmr);
            document.getElementById('maintenance-value').textContent = maintenanceCalories;
            document.getElementById('goal-value').textContent = goalCalories;
            
            const currentLang = localStorage.getItem('preferredLanguage') || 'tr';
            const calText = translations[currentLang]['cal'] || 'cal';
            
            document.getElementById('protein-grams').textContent = `${proteinGrams}g`;
            document.getElementById('protein-calories').textContent = `${actualProteinCalories} ${calText}`;
            
            document.getElementById('carbs-grams').textContent = `${carbsGrams}g`;
            document.getElementById('carbs-calories').textContent = `${actualCarbsCalories} ${calText}`;
            
            document.getElementById('fats-grams').textContent = `${fatsGrams}g`;
            document.getElementById('fats-calories').textContent = `${actualFatsCalories} ${calText}`;
            
            // Show results
            calorieForm.classList.add('d-none');
            resultContainer.classList.remove('d-none');
            
            // Reset button state
            const calculateText = translations[currentLang]['calculate-button'] || 'Calculate Calories';
            submitBtn.innerHTML = `<span>${calculateText}</span><i class="fas fa-calculator ms-2"></i>`;
            submitBtn.disabled = false;
            
            // Smooth scroll to results with fallback for iOS
            try {
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                window.scrollTo(0, resultContainer.offsetTop);
            }
            
            // Add animation effects to result cards
            animateResults();
        }, isTouchDevice ? 800 : 1200); // Shorter delay on touch devices
    }
    
    // Function to adjust UI for mobile viewports
    function adjustForMobileViewports() {
        const windowWidth = window.innerWidth;
        const labelSpans = document.querySelectorAll('.gender-btn span, .goal-btn span');
        
        if (windowWidth <= 375) {
            labelSpans.forEach(span => {
                span.style.display = 'none';
            });
        } else {
            labelSpans.forEach(span => {
                span.style.display = 'inline';
            });
        }
        
        // Adjust padding for better touch targets on small screens
        if (windowWidth <= 575) {
            document.querySelectorAll('.form-control, .form-select').forEach(el => {
                el.style.padding = '0.75rem 1rem';
            });
        }
    }
    
    // Validate the form
    function validateForm() {
        const age = document.getElementById('age');
        const height = document.getElementById('height');
        const weight = document.getElementById('weight');
        
        let isValid = true;
        
        if (!validateInput(age)) isValid = false;
        if (!validateInput(height)) isValid = false;
        if (!validateInput(weight)) isValid = false;
        
        return isValid;
    }
    
    // Reset calculator function
    function resetCalculator() {
        // Add exit animation
        resultContainer.style.opacity = '0';
        resultContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            calorieForm.classList.remove('d-none');
            resultContainer.classList.add('d-none');
            calorieForm.reset();
            
            // Reset form styles
            const formInputs = document.querySelectorAll('input[type="number"]');
            formInputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
            // Reset result container styles
            resultContainer.style.opacity = '1';
            resultContainer.style.transform = 'translateY(0)';
            
            // Animate form elements again
            animateFormElements();
            
            // Smooth scroll to form with fallback for iOS
            try {
                calorieForm.scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                window.scrollTo(0, calorieForm.offsetTop);
            }
        }, 300);
    }
    
    // Animate form elements on load
    function animateFormElements() {
        const formElements = document.querySelectorAll('.form-label, .form-control, .form-select, .gender-toggle, .goals-container, button[type="submit"]');
        
        formElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Animate results with a delay for each card
    function animateResults() {
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }, index * 150);
        });
        
        // Animate progress bars
        setTimeout(() => {
            const progressBars = document.querySelectorAll('.progress-bar');
            progressBars.forEach((bar, index) => {
                const width = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.transition = 'width 1s ease';
                    bar.style.width = width;
                }, index * 200);
            });
        }, 600);
        
        // Animate nutrition breakdown headings
        const nutritionHeading = document.querySelector('.nutrition-breakdown h4');
        nutritionHeading.style.opacity = '0';
        nutritionHeading.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            nutritionHeading.style.transition = 'all 0.5s ease';
            nutritionHeading.style.opacity = '1';
            nutritionHeading.style.transform = 'translateX(0)';
        }, 800);
    }
    
    // Form validation with visual feedback
    const formInputs = document.querySelectorAll('input[type="number"]');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
        
        // Add focus effects - only on non-touch devices
        if (!isTouchDevice) {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-5px)';
                this.parentElement.style.transition = 'transform 0.3s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        }
    });
    
    function validateInput(input) {
        const min = parseInt(input.getAttribute('min'));
        const max = parseInt(input.getAttribute('max'));
        const value = parseInt(input.value);
        
        if (isNaN(value) || value < min || value > max) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            return false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            return true;
        }
    }
    
    // Add hover effects for interactive elements - only on non-touch devices
    if (!isTouchDevice) {
        const interactiveElements = document.querySelectorAll('.gender-btn, .goal-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
                this.style.transition = 'all 0.3s ease';
            });
            
            el.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }
    
    // Add click effect on radio buttons - works for both touch and mouse
    const radioButtons = document.querySelectorAll('.btn-check');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            const clickEffect = document.createElement('div');
            clickEffect.classList.add('click-effect');
            
            const label = document.querySelector(`label[for="${this.id}"]`);
            label.appendChild(clickEffect);
            
            setTimeout(() => {
                clickEffect.remove();
            }, 500);
        });
    });
    
    // Add passive touch events for better performance on mobile
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
}); 
