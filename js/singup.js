// Global variables
let currentUser = null;
let jobs = [];
let currentCategory = '';

// City data for provinces
const cityData = {
    'gauteng': ['Johannesburg', 'Pretoria', 'Soweto', 'Sandton', 'Midrand', 'Centurion', 'Roodepoort', 'Boksburg'],
    'western-cape': ['Cape Town', 'Stellenbosch', 'Paarl', 'Worcester', 'George', 'Mossel Bay', 'Hermanus'],
    'kwazulu-natal': ['Durban', 'Pietermaritzburg', 'Richards Bay', 'Newcastle', 'Ladysmith', 'Pinetown'],
    'eastern-cape': ['Port Elizabeth', 'East London', 'Uitenhage', 'King Williams Town', 'Grahamstown', 'Queenstown'],
    'limpopo': ['Polokwane', 'Thohoyandou', 'Tzaneen', 'Giyani', 'Musina', 'Bela-Bela'],
    'mpumalanga': ['Nelspruit', 'Witbank', 'Secunda', 'Standerton', 'Middelburg', 'Ermelo'],
    'north-west': ['Mahikeng', 'Rustenburg', 'Potchefstroom', 'Klerksdorp', 'Vryburg'],
    'northern-cape': ['Kimberley', 'Upington', 'Springbok', 'De Aar', 'Kuruman'],
    'free-state': ['Bloemfontein', 'Welkom', 'Kroonstad', 'Bethlehem', 'Sasolburg', 'Virginia']
};

// Category names mapping
const categoryNames = {
    'accounting': 'Accounting & Finance',
    'automobile': 'Automobile',
    'banking': 'Banking',
    'construction': 'Construction',
    'education': 'Education',
    'engineering': 'Engineering',
    'healthcare': 'Healthcare',
    'hospitality': 'Hospitality',
    'it': 'Information Technology',
    'legal': 'Legal',
    'manufacturing': 'Manufacturing',
    'marketing': 'Marketing & Sales',
    'retail': 'Retail',
    'other': 'Other'
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadStoredData();
    updateJobCounts();
    setupEventListeners();
    updateAuthUI();
    displayJobs();
});

// Load data from localStorage
function loadStoredData() {
    const storedUser = localStorage.getItem('currentUser');
    const storedJobs = localStorage.getItem('jobs');
    
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
    
    if (storedJobs) {
        jobs = JSON.parse(storedJobs);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('jobs', JSON.stringify(jobs));
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Job posting form
    const jobForm = document.getElementById('jobPostingForm');
    if (jobForm) {
        jobForm.addEventListener('submit', handleJobPosting);
    }
    
    // Password strength checking
    const passwordField = document.getElementById('signupPassword');
    const confirmField = document.getElementById('confirmPassword');
    
    if (passwordField) {
        passwordField.addEventListener('input', updatePasswordStrength);
        passwordField.addEventListener('input', checkPasswordMatch);
    }
    
    if (confirmField) {
        confirmField.addEventListener('input', checkPasswordMatch);
    }
}

// Section navigation
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update post-job section based on auth status
    if (sectionName === 'post-job') {
        updatePostJobSection();
    }
}

// Authentication UI updates
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userWelcome = document.getElementById('userWelcome');
    const token = localStorage.getItem('token');
    
    if (currentUser && token) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        userWelcome.textContent = `Welcome, ${currentUser.first_name}!`;
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        // Clear any stored data if no token
        localStorage.removeItem('token');
        currentUser = null;
    }
}

// Update post job section
function updatePostJobSection() {
    const loginRequired = document.getElementById('loginRequired');
    const jobPostingSection = document.getElementById('jobPostingSection');
    
    if (currentUser) {
        loginRequired.style.display = 'none';
        jobPostingSection.style.display = 'block';
        
        // Pre-fill user data
        document.getElementById('jobCompanyName').value = currentUser.companyName || '';
        document.getElementById('jobCompanySize').value = currentUser.companySize || '';
        document.getElementById('contactName').value = `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById('contactEmail').value = currentUser.email || '';
        document.getElementById('contactPhone').value = currentUser.phoneNumber || '';
    } else {
        loginRequired.style.display = 'block';
        jobPostingSection.style.display = 'none';
    }
}

// Modal functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signupModal').style.display = 'none';
}

function switchToSignup() {
    closeModal();
    openSignupModal();
}

function switchToLogin() {
    closeModal();
    openLoginModal();
}

// Password functions
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.parentNode.querySelector('.password-toggle');
    const icon = toggle.querySelector('.eye-icon');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.textContent = '🙈';
    } else {
        field.type = 'password';
        icon.textContent = '👁';
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;
    
    if (score < 30) {
        return { score, label: "Weak", color: "#EF4444" };
    } else if (score < 60) {
        return { score, label: "Fair", color: "#F59E0B" };
    } else if (score < 90) {
        return { score, label: "Good", color: "#3B82F6" };
    } else {
        return { score, label: "Strong", color: "#10B981" };
    }
}

function updatePasswordStrength() {
    const password = document.getElementById('signupPassword');
    const strengthContainer = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!password || !strengthContainer) return;
    
    const passwordValue = password.value;
    
    if (passwordValue.length === 0) {
        strengthContainer.style.display = 'none';
        return;
    }
    
    strengthContainer.style.display = 'block';
    const strength = calculatePasswordStrength(passwordValue);
    
    strengthFill.style.width = `${strength.score}%`;
    strengthFill.style.backgroundColor = strength.color;
    strengthText.textContent = strength.label;
    strengthText.style.color = strength.color;
}

function checkPasswordMatch() {
    const password = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const matchIcon = document.getElementById('passwordMatch');
    
    if (!password || !confirmPassword || !matchIcon) return;
    
    const passwordValue = password.value;
    const confirmValue = confirmPassword.value;
    
    if (confirmValue.length === 0) {
        matchIcon.textContent = '';
        return;
    }
    
    if (passwordValue === confirmValue) {
        matchIcon.textContent = '✓';
        matchIcon.style.color = '#10B981';
    } else {
        matchIcon.textContent = '✗';
        matchIcon.style.color = '#EF4444';
    }
}

// City update function
function updateCities() {
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    const selectedProvince = provinceSelect.value;
    
    // Clear existing cities
    citySelect.innerHTML = '<option value="">Select City/Town</option>';
    
    if (selectedProvince && cityData[selectedProvince]) {
        cityData[selectedProvince].forEach(city => {
            const option = document.createElement('option');
            option.value = city.toLowerCase().replace(/\s+/g, '-');
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// Handle signup form submission
async function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        password: formData.get('password'),
        email: formData.get('email'),
        first_name: formData.get('firstName'),
        last_name: formData.get('lastName'),
        company_name: formData.get('companyName'),
        company_size: formData.get('companySize'),
        phone_number: formData.get('phoneNumber')
    };
    
    // Validate passwords match
    if (data.password !== formData.get('confirmPassword')) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            showNotification(result.message || 'Registration failed', 'error');
            return;
        }
        
        // Save user data and token
        localStorage.setItem('token', result.token);
        currentUser = result.user;
        saveData();
        
        // Show success message and redirect
        showNotification('Account created successfully!', 'success');
        window.location.href = 'recruiters.html';
        
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('An error occurred during registration', 'error');
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    // Validate input
    if (!data.username || !data.password) {
        showNotification('Please enter both username and password', 'error');
        return;
    }
    
    try {
        console.log('Attempting login for user:', data.username);
        
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        console.log('Server response:', result);
        
        if (!response.ok) {
            showNotification(result.message || 'Invalid username or password', 'error');
            return;
        }
        
        // Store the JWT token
        localStorage.setItem('token', result.token);
        
        // Store user data
        currentUser = result.user;
        
        // Show success message
        showNotification('Login successful!', 'success');
        
        // Simple redirect
        document.location = 'recruiters.html';
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Server error. Please try again.', 'error');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear token and user data
        localStorage.removeItem('token');
        currentUser = null;
        
        // Update UI
        updateAuthUI();
        showSection('home');
        showNotification('Logged out successfully', 'success');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Job posting handler
function handleJobPosting(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login to post a job', 'error');
        return;
    }
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Create new job
    const newJob = {
        id: Date.now(),
        ...data,
        userId: currentUser.id,
        postedBy: `${currentUser.firstName} ${currentUser.lastName}`,
        postedAt: new Date().toISOString(),
        status: 'active'
    };
    
    jobs.push(newJob);
    saveData();
    updateJobCounts();
    displayJobs();
    
    // Reset form
    e.target.reset();
    
    showNotification('Job posted successfully!', 'success');
    showSection('jobs');
}

// Job display functions
function updateJobCounts() {
    const categories = ['accounting', 'automobile', 'banking', 'construction', 'education', 
                      'engineering', 'healthcare', 'hospitality', 'it', 'legal', 
                      'manufacturing', 'marketing', 'retail', 'other'];
    
    categories.forEach(category => {
        const count = jobs.filter(job => job.category === category).length;
        const countElement = document.getElementById(`${category}-count`);
        if (countElement) {
            countElement.textContent = `(${count})`;
        }
    });
     // Update total jobs counter
    const totalJobsElement = document.getElementById('totalJobs');
    if (totalJobsElement) {
        totalJobsElement.textContent = jobs.length;
    }
}

function displayJobs(filteredJobs = null) {
    const jobsList = document.getElementById('jobsList');
    const jobsTitle = document.getElementById('jobsTitle');
    const jobsToShow = filteredJobs || jobs;
    
    if (jobsToShow.length === 0) {
        jobsList.innerHTML = `
            <div class="no-jobs">
                <h4>${filteredJobs ? 'No jobs found' : 'No jobs posted yet'}</h4>
                <p>${filteredJobs ? 'Try adjusting your search criteria' : 'Be the first recruiter to post a job!'}</p>
                <button class="btn-primary" onclick="showSection('post-job')">Post a Job</button>
            </div>
        `;
        return;
    }
    
    // Update title
    if (currentCategory) {
        jobsTitle.textContent = `${categoryNames[currentCategory]} Jobs (${jobsToShow.length})`;
    } else {
        jobsTitle.textContent = `All Jobs (${jobsToShow.length})`;
    }
    
    // Display jobs
    jobsList.innerHTML = jobsToShow.map(job => createJobCard(job)).join('');
}

function createJobCard(job) {
    const salary = job.salaryMin && job.salaryMax 
        ? `R${parseInt(job.salaryMin).toLocaleString()} - R${parseInt(job.salaryMax).toLocaleString()}`
        : job.salaryMin 
        ? `From R${parseInt(job.salaryMin).toLocaleString()}`
        : job.salaryMax 
        ? `Up to R${parseInt(job.salaryMax).toLocaleString()}`
        : 'Salary Negotiable';
    
    const postedDate = new Date(job.postedAt).toLocaleDateString('en-ZA');
    
    return `
        <div class="job-card">
            <div class="job-header">
                <div>
                    <div class="job-title">${job.jobTitle}</div>
                    <div class="job-company">${job.companyName}</div>
                </div>
                <div class="job-meta">
                    <span>${job.jobType}</span>
                    <span>${job.experienceLevel}</span>
                    <span>${salary}</span>
                </div>
            </div>
            
            <div class="job-description">
                ${job.jobDescription.substring(0, 200)}${job.jobDescription.length > 200 ? '...' : ''}
            </div>
            
            <div class="job-tags">
                <span class="job-tag">${categoryNames[job.category]}</span>
                <span class="job-tag">${job.province}</span>
                <span class="job-tag">${job.city}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                <div class="job-actions">
                    <button class="btn-apply" onclick="applyForJob(${job.id})">Apply Now</button>
                    <button class="btn-details" onclick="viewJobDetails(${job.id})">View Details</button>
                </div>
                <small style="color: var(--muted);">Posted on ${postedDate}</small>
            </div>
        </div>
    `;
}

// Job filtering functions
function filterByCategory(category = '') {
    currentCategory = category;
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = category;
    }
    
    const filteredJobs = category ? jobs.filter(job => job.category === category) : jobs;
    displayJobs(filteredJobs);
}

function searchJobs() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    let filteredJobs = jobs;
    
    // Filter by category
    if (selectedCategory) {
        filteredJobs = filteredJobs.filter(job => job.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredJobs = filteredJobs.filter(job => 
            job.jobTitle.toLowerCase().includes(searchTerm) ||
            job.companyName.toLowerCase().includes(searchTerm) ||
            job.jobDescription.toLowerCase().includes(searchTerm) ||
            job.requirements.toLowerCase().includes(searchTerm)
        );
    }
    
    displayJobs(filteredJobs);
}

// Job actions
function applyForJob(jobId) {
    showNotification('Application feature coming soon!', 'info');
}

function viewJobDetails(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        alert(`Job Details:\n\nTitle: ${job.jobTitle}\nCompany: ${job.companyName}\nLocation: ${job.city}, ${job.province}\n\nDescription:\n${job.jobDescription}\n\nRequirements:\n${job.requirements}\n\nContact: ${job.contactEmail}`);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (e.target === loginModal) {
        closeModal();
    }
    if (e.target === signupModal) {
        closeModal();
    }
});

// Handle ESC key to close modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});