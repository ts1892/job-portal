(function() {
    'use strict';

    // South African provinces and their major cities
    const provincesCities = {
        'gauteng': [
            'Johannesburg',
            'Pretoria',
            'Germiston',
            'Benoni',
            'Boksburg',
            'Krugersdorp',
            'Roodepoort',
            'Sandton',
            'Soweto',
            'Randburg'
        ],
        'western-cape': [
            'Cape Town',
            'Stellenbosch',
            'Paarl',
            'George',
            'Worcester',
            'Mossel Bay',
            'Hermanus',
            'Knysna',
            'Bellville',
            'Goodwood'
        ],
        'kwazulu-natal': [
            'Durban',
            'Pietermaritzburg',
            'Newcastle',
            'Richards Bay',
            'Ladysmith',
            'Pinetown',
            'Chatsworth',
            'Umlazi',
            'Phoenix',
            'Empangeni'
        ],
        'eastern-cape': [
            'Port Elizabeth',
            'East London',
            'Uitenhage',
            'King Williams Town',
            'Mdantsane',
            'Grahamstown',
            'Queenstown',
            'Bhisho',
            'Fort Beaufort',
            'Cradock'
        ],
        'limpopo': [
            'Polokwane',
            'Thohoyandou',
            'Lebowakgomo',
            'Mokopane',
            'Tzaneen',
            'Phalaborwa',
            'Louis Trichardt',
            'Musina',
            'Bela-Bela',
            'Giyani'
        ],
        'mpumalanga': [
            'Nelspruit',
            'Witbank',
            'Middelburg',
            'Secunda',
            'Standerton',
            'Ermelo',
            'Bethal',
            'Barberton',
            'White River',
            'Sabie'
        ],
        'north-west': [
            'Mahikeng',
            'Rustenburg',
            'Klerksdorp',
            'Potchefstroom',
            'Brits',
            'Lichtenburg',
            'Vryburg',
            'Zeerust',
            'Schweizer-Reneke',
            'Hartbeespoort'
        ],
        'northern-cape': [
            'Kimberley',
            'Upington',
            'Springbok',
            'De Aar',
            'Kuruman',
            'Postmasburg',
            'Calvinia',
            'Carnarvon',
            'Prieska',
            'Britstown'
        ],
        'free-state': [
            'Bloemfontein',
            'Welkom',
            'Kroonstad',
            'Bethlehem',
            'Sasolburg',
            'Virginia',
            'Odendaalsrus',
            'Phuthaditjhaba',
            'Parys',
            'Vredefort'
        ]
    };

    // Update cities dropdown based on selected province
    window.updateCities = function() {
        const provinceSelect = document.getElementById('province');
        const citySelect = document.getElementById('city');
        const selectedProvince = provinceSelect.value;

        // Clear current options
        citySelect.innerHTML = '<option value="">Select City/Town</option>';

        if (selectedProvince && provincesCities[selectedProvince]) {
            provincesCities[selectedProvince].forEach(city => {
                const option = document.createElement('option');
                option.value = city.toLowerCase().replace(/\s+/g, '-');
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
    };

    
    // Submit job posting form
    window.submitJobPosting = function(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // Validate required fields
        const requiredFields = [
            'jobTitle', 'category', 'jobType', 'experienceLevel', 
            'province', 'city', 'jobDescription', 'requirements',
            'companyName', 'contactName', 'contactEmail'
        ];
        
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
                document.getElementById(field).focus();
                return;
            }
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.contactEmail)) {
            alert('Please enter a valid email address.');
            document.getElementById('contactEmail').focus();
            return;
        }
        
        // Check if terms are accepted
        if (!data.termsAccept) {
            alert('Please accept the Terms of Service and Privacy Policy.');
            document.getElementById('termsAccept').focus();
            return;
        }
        
        // Simulate payment process
        const confirmed = confirm(`Job Posting Summary:
        
Title: ${data.jobTitle}
Company: ${data.companyName}
Location: ${data.city}, ${data.province}
Category: ${data.category}

Total Fee: R100.00

Click OK to proceed to payment.`);
        
        if (confirmed) {
            // In a real application, this would redirect to a payment gateway
            alert('Thank you! Your job posting has been submitted. You will be redirected to complete payment of R100.00. Your job will go live within 24 hours after payment confirmation.');
            
            // Reset form
            event.target.reset();
            document.getElementById('city').innerHTML = '<option value="">Select City/Town</option>';
        }
    };

    // Initialize page
    document.addEventListener('DOMContentLoaded', function() {
        // Set minimum date for application deadline to today
        const deadlineInput = document.getElementById('applicationDeadline');
        if (deadlineInput) {
            const today = new Date().toISOString().split('T')[0];
            deadlineInput.setAttribute('min', today);
        }

        // Auto-fill province and city if coming from search
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('location')) {
            const provinceSelect = document.getElementById('province');
            if (provinceSelect) {
                provinceSelect.value = urlParams.get('location');
                updateCities();
            }
        }

        // Salary validation
        const salaryMinInput = document.getElementById('salaryMin');
        const salaryMaxInput = document.getElementById('salaryMax');
        
        if (salaryMinInput && salaryMaxInput) {
            function validateSalaryRange() {
                const min = parseInt(salaryMinInput.value) || 0;
                const max = parseInt(salaryMaxInput.value) || 0;
                
                if (min > 0 && max > 0 && min > max) {
                    salaryMaxInput.setCustomValidity('Maximum salary must be greater than minimum salary');
                } else {
                    salaryMaxInput.setCustomValidity('');
                }
            }
            
            salaryMinInput.addEventListener('input', validateSalaryRange);
            salaryMaxInput.addEventListener('input', validateSalaryRange);
        }

        // Character count for text areas
        const textAreas = document.querySelectorAll('textarea');
        textAreas.forEach(textArea => {
            const maxLength = textArea.getAttribute('maxlength');
            if (maxLength) {
                const counter = document.createElement('div');
                counter.className = 'form-help';
                counter.style.textAlign = 'right';
                textArea.parentNode.appendChild(counter);
                
                function updateCounter() {
                    const remaining = maxLength - textArea.value.length;
                    counter.textContent = `${remaining} characters remaining`;
                    counter.style.color = remaining < 50 ? '#E53E3E' : '#666';
                }
                
                textArea.addEventListener('input', updateCounter);
                updateCounter();
            }
        });
    });
})();
