// Enhanced JavaScript for JOB NOW Portal

// Job Categories with counters
const jobCategories = {
    'accounting': { name: 'Accounting & Finance', count: 0 },
    'it': { name: 'Information Technology', count: 0 },
    'marketing': { name: 'Marketing & Sales', count: 0 },
    'healthcare': { name: 'Healthcare & Medical', count: 0 },
    'education': { name: 'Education & Training', count: 0 },
    'engineering': { name: 'Engineering', count: 0 },
    'retail': { name: 'Retail & Customer Service', count: 0 },
    'hospitality': { name: 'Hospitality & Tourism', count: 0 },
    'manufacturing': { name: 'Manufacturing & Production', count: 0 },
    'construction': { name: 'Construction & Property', count: 0 },
    'legal': { name: 'Legal & Compliance', count: 0 },
    'transport': { name: 'Transport & Logistics', count: 0 },
    'agriculture': { name: 'Agriculture & Mining', count: 0 },
    'media': { name: 'Media & Communications', count: 0 },
    'government': { name: 'Government & NGO', count: 0 }
};

// Sample jobs database with categories
let jobsDatabase = [
    {
        id: 1,
        title: 'Senior Software Developer',
        company: 'TechCorp SA',
        location: 'Cape Town, Western Cape',
        category: 'it',
        type: 'Full-time',
        salary: 'R45,000 - R65,000',
        salaryMin: 45000,
        posted: '2 days ago',
        description: 'We are looking for an experienced software developer to join our growing team...',
        requirements: 'Bachelor\'s degree in Computer Science, 5+ years experience with React and Node.js...'
    },
    {
        id: 2,
        title: 'Financial Analyst',
        company: 'FinanceFirst',
        location: 'Johannesburg, Gauteng',
        category: 'accounting',
        type: 'Full-time',
        salary: 'R35,000 - R50,000',
        salaryMin: 35000,
        posted: '1 day ago',
        description: 'Join our finance team to analyze market trends and provide strategic insights...',
        requirements: 'CFA or CA(SA) preferred, 3+ years experience in financial analysis...'
    },
    {
        id: 3,
        title: 'Marketing Manager',
        company: 'BrandBuilders',
        location: 'Durban, KwaZulu-Natal',
        category: 'marketing',
        type: 'Full-time',
        salary: 'R40,000 - R55,000',
        salaryMin: 40000,
        posted: '3 days ago',
        description: 'Lead our marketing initiatives and drive brand awareness across digital channels...',
        requirements: 'Marketing degree, 4+ years experience in digital marketing, Google Ads certified...'
    },
    {
        id: 4,
        title: 'Registered Nurse',
        company: 'Wellness Hospital',
        location: 'Pretoria, Gauteng',
        category: 'healthcare',
        type: 'Full-time',
        salary: 'R25,000 - R35,000',
        salaryMin: 25000,
        posted: '1 day ago',
        description: 'Provide exceptional patient care in our modern hospital facility...',
        requirements: 'Nursing degree, SANC registration, 2+ years hospital experience...'
    },
    {
        id: 5,
        title: 'Primary School Teacher',
        company: 'ABC Primary School',
        location: 'Port Elizabeth, Eastern Cape',
        category: 'education',
        type: 'Full-time',
        salary: 'R22,000 - R28,000',
        salaryMin: 22000,
        posted: '4 days ago',
        description: 'Inspiring young minds in our well-equipped learning environment...',
        requirements: 'Teaching qualification, SACE registration, passion for education...'
    }
];

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('nav-menu-active');
    }
}

// Update category counters
function updateCategoryCounters() {
    // Reset all counters
    Object.keys(jobCategories).forEach(key => {
        jobCategories[key].count = 0;
    });
    
    // Count jobs in each category
    jobsDatabase.forEach(job => {
        if (jobCategories[job.category]) {
            jobCategories[job.category].count++;
        }
    });
    
    // Update display
    displayJobCategories();
}

// Display job categories
function displayJobCategories() {
    const categoriesGrid = document.getElementById('jobCategoriesGrid');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (!categoriesGrid) return;
    
    let categoriesHTML = '';
    let filterOptionsHTML = '<option value="">All Categories</option>';
    
    Object.keys(jobCategories).forEach(key => {
        const category = jobCategories[key];
        const iconMap = {
            'accounting': '💰',
            'it': '💻',
            'marketing': '🎯',
            'healthcare': '🏥',
            'education': '📚',
            'engineering': '⚙️',
            'retail': '🛍️',
            'hospitality': '🏨',
            'manufacturing': '🏭',
            'construction': '🏗️',
            'legal': '⚖️',
            'transport': '🚛',
            'agriculture': '🌾',
            'media': '📺',
            'government': '🏛️'
        };
        
        categoriesHTML += `
            <div class="category-card" onclick="filterByCategory('${key}')" style="cursor: pointer;">
                <div class="card" style="text-align: center; padding: 25px; transition: all 0.3s ease; border: 2px solid transparent;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">${iconMap[key] || '💼'}</div>
                    <h3 style="color: var(--primary-blue); margin-bottom: 15px; font-size: 1.1em;">${category.name}</h3>
                    <div class="job-count" style="background: var(--gradient-orange); color: white; padding: 10px 18px; border-radius: 25px; display: inline-block; font-weight: bold; box-shadow: var(--shadow-light);">
                        ${category.count} jobs
                    </div>
                </div>
            </div>
        `;
        
        filterOptionsHTML += `<option value="${key}">${category.name}</option>`;
    });
    
    categoriesGrid.innerHTML = categoriesHTML;
    
    if (categoryFilter) {
        categoryFilter.innerHTML = filterOptionsHTML;
    }
}

// Filter by category
function filterByCategory(categoryKey) {
    const categoryFilter = document.getElementById('categoryFilter');
    const sectionTitle = document.getElementById('sectionTitle');
    
    if (categoryFilter) {
        categoryFilter.value = categoryKey;
    }
    
    if (sectionTitle) {
        if (categoryKey) {
            sectionTitle.textContent = jobCategories[categoryKey].name + ' Jobs';
        } else {
            sectionTitle.textContent = 'All Jobs';
        }
    }
    
    filterJobs();
}

// Display filtered jobs
function filterJobs() {
    const keywordSearch = document.getElementById('keywordSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const provinceFilter = document.getElementById('provinceFilter')?.value || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const salaryFilter = document.getElementById('salaryFilter')?.value || '';
    const jobResults = document.getElementById('jobResults');
    const jobCount = document.getElementById('jobCount');
    
    if (!jobResults) return;
    
    // Filter jobs
    let filteredJobs = jobsDatabase.filter(job => {
        const matchesKeyword = !keywordSearch || 
            job.title.toLowerCase().includes(keywordSearch) ||
            job.company.toLowerCase().includes(keywordSearch) ||
            job.description?.toLowerCase().includes(keywordSearch) ||
            job.requirements?.toLowerCase().includes(keywordSearch);
        
        const matchesCategory = !categoryFilter || job.category === categoryFilter;
        const matchesProvince = !provinceFilter || job.location.toLowerCase().includes(provinceFilter.replace('-', ' '));
        const matchesType = !typeFilter || job.type.toLowerCase().replace('-', '') === typeFilter;
        const matchesSalary = !salaryFilter || (job.salaryMin && job.salaryMin >= parseInt(salaryFilter));
        
        return matchesKeyword && matchesCategory && matchesProvince && matchesType && matchesSalary;
    });
    
    // Update job count
    if (jobCount) {
        jobCount.textContent = `${filteredJobs.length} jobs found`;
    }
    
    // Display jobs
    if (filteredJobs.length === 0) {
        jobResults.innerHTML = `
            <div class="card" style="text-align: center; padding: 60px;">
                <div style="font-size: 4rem; margin-bottom: 20px; color: var(--medium-gray);">🔍</div>
                <h3 style="color: var(--primary-blue);">No jobs found</h3>
                <p style="margin-bottom: 30px;">Try adjusting your filters or check back later for new opportunities.</p>
                <button onclick="clearFilters()" class="btn btn-secondary">Clear All Filters</button>
            </div>
        `;
        return;
    }
    
    let jobsHTML = '';
    filteredJobs.forEach(job => {
        const categoryName = jobCategories[job.category]?.name || 'Other';
        jobsHTML += `
            <div class="card" style="margin-bottom: 25px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; right: 0; background: var(--gradient-blue); color: white; padding: 5px 15px; border-radius: 0 0 0 15px; font-size: 12px; font-weight: bold;">
                    ${job.posted}
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; padding-top: 10px;">
                    <div style="flex: 1;">
                        <h3 style="color: var(--primary-blue); margin-bottom: 8px; font-size: 1.4rem;">${job.title}</h3>
                        <p style="color: var(--dark-gray); margin-bottom: 8px; font-size: 1.1rem;"><strong>${job.company}</strong></p>
                        <p style="color: var(--medium-gray); margin-bottom: 8px; display: flex; align-items: center;">
                            <span style="margin-right: 8px;">📍</span> ${job.location}
                        </p>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <span style="background: var(--light-orange); color: var(--accent-orange); padding: 6px 12px; border-radius: 15px; margin-right: 10px; font-size: 13px; font-weight: bold;">
                        ${categoryName}
                    </span>
                    <span style="background: var(--light-gray); color: var(--dark-gray); padding: 6px 12px; border-radius: 15px; margin-right: 10px; font-size: 13px;">
                        ${job.type}
                    </span>
                    <span style="background: var(--light-blue); color: var(--primary-blue); padding: 6px 12px; border-radius: 15px; font-size: 13px; font-weight: bold;">
                        ${job.salary}
                    </span>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                    <div style="flex: 1; min-width: 200px;">
                        <p style="margin: 0; color: var(--medium-gray); font-size: 14px; line-height: 1.5;">
                            ${job.description ? job.description.substring(0, 120) + '...' : 'Click to view full job description and requirements.'}
                        </p>
                    </div>
                    <button class="btn btn-primary" onclick="openApplicationModal('${job.title}', '${job.company}')" style="min-width: 120px;">
                        Apply Now
                    </button>
                </div>
            </div>
        `;
    });
    
    jobResults.innerHTML = jobsHTML;
}

// Job Application Modal Functions
let currentJobTitle = '';
let currentCompany = '';

window.openApplicationModal = function(jobTitle, company) {
    currentJobTitle = jobTitle;
    currentCompany = company;
    document.getElementById('modalJobTitle').textContent = `Apply for ${jobTitle}`;
    document.getElementById('applicationModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
};

window.closeApplicationModal = function() {
    document.getElementById('applicationModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('applicationForm').reset();
    document.getElementById('uploadedFileDisplay').innerHTML = '';
    
    // Reset file upload area
    const uploadArea = document.getElementById('cvUploadArea');
    if (uploadArea) {
        uploadArea.style.display = 'block';
    }
};

// File Upload Handling
window.handleFileUpload = function(event) {
    const file = event.target.files[0];
    const uploadArea = document.getElementById('cvUploadArea');
    const displayArea = document.getElementById('uploadedFileDisplay');
    
    if (file) {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            event.target.value = '';
            return;
        }
        
        // Validate file type
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
            alert('Please upload a PDF, DOC, or DOCX file');
            event.target.value = '';
            return;
        }
        
        // Display uploaded file
        displayArea.innerHTML = `
            <div class="uploaded-file">
                <div class="file-info">
                    <span class="file-icon">📄</span>
                    <div>
                        <div><strong>${file.name}</strong></div>
                        <div style="font-size: 12px; color: #666;">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                </div>
                <button type="button" class="remove-file" onclick="removeFile()">&times;</button>
            </div>
        `;
        
        uploadArea.style.display = 'none';
    }
};

window.removeFile = function() {
    document.getElementById('cvUpload').value = '';
    document.getElementById('uploadedFileDisplay').innerHTML = '';
    document.getElementById('cvUploadArea').style.display = 'block';
};

// Submit Application
window.submitApplication = function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    if (!data.applicantName || !data.applicantEmail || !data.applicantPhone || !data.applicantLocation || !data.cvUpload || !data.dataConsent) {
        alert('Please fill in all required fields and upload your CV.');
        return;
    }
    
    // Simulate application submission
    alert(`🎉 Application Submitted Successfully!\n\nThank you ${data.applicantName}! Your application for "${currentJobTitle}" at ${currentCompany} has been submitted.\n\nWhat happens next:\n• Your CV will be reviewed within 48 hours\n• If selected, you'll be contacted for an interview\n• We'll keep you updated via email\n\nGood luck with your application!`);
    
    closeApplicationModal();
};

// Drag and drop functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything when page loads
    updateCategoryCounters();
    filterJobs();
    
    // Setup drag and drop for file upload
    const uploadArea = document.getElementById('cvUploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                document.getElementById('cvUpload').files = files;
                handleFileUpload({ target: { files: files } });
            }
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeApplicationModal();
            }
        });
    }
    
    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    });
    
    document.querySelectorAll('.card, .fade-in-up').forEach(el => {
        observer.observe(el);
    });
});

// Utility functions
window.clearFilters = function() {
    const inputs = ['keywordSearch', 'categoryFilter', 'provinceFilter', 'typeFilter', 'salaryFilter'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    const sectionTitle = document.getElementById('sectionTitle');
    if (sectionTitle) sectionTitle.textContent = 'All Jobs';
    
    filterJobs();
};

// Make functions globally available
window.toggleMobileMenu = toggleMobileMenu;
window.filterByCategory = filterByCategory;
window.filterJobs = filterJobs;
window.updateCategoryCounters = updateCategoryCounters;