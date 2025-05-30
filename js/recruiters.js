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
    window.submitJobPosting = async function(event) {
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
        if (!data.contactEmail) {
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

        try {
            // Get token from localStorage (assuming user is logged in)
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to post a job');
                return;
            }

            // Send job posting to API
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    job_title: data.jobTitle,
                    company_name: data.companyName,
                    category: data.category,
                    job_type: data.jobType,
                    experience_level: data.experienceLevel,
                    province: data.province,
                    city: data.city,
                    salary_min: data.salaryMin || null,
                    salary_max: data.salaryMax || null,
                    job_description: data.jobDescription,
                    requirements: data.requirements,
                    contact_name: data.contactName,
                    contact_email: data.contactEmail,
                    contact_phone: data.contactPhone || ''
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to post job');
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
                // Show success message
                alert('Job posted successfully! It will now appear in the correct category.');
                
                // Reset form
                event.target.reset();
                
                // Redirect to job listings
                window.location.href = 'job-seekers.html';
            }
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Error posting job: ' + error.message);
        }
    };

    // Function to update category counters
    function updateCategoryCounters() {
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const categories = document.querySelectorAll('#category option');
        
        // Reset all counters
        categories.forEach(option => {
            if (option.value) {
                const count = jobs.filter(job => job.category === option.value).length;
                option.textContent = `${option.textContent.split('(')[0]} (${count})`;
            }
        });
    }

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
