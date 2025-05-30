// Enhanced JavaScript for JOB NOW Portal

// Job Categories with counters and icons
const jobCategories = {
    'accounting': { name: 'Accounting & Finance', count: 0, icon: '💰' },
    'it': { name: 'Information Technology', count: 0, icon: '💻' },
    'marketing': { name: 'Marketing & Sales', count: 0, icon: '🎯' },
    'healthcare': { name: 'Healthcare & Medical', count: 0, icon: '🏥' },
    'education': { name: 'Education & Training', count: 0, icon: '📚' },
    'engineering': { name: 'Engineering', count: 0, icon: '⚙️' },
    'retail': { name: 'Retail & Customer Service', count: 0, icon: '🛍️' },
    'hospitality': { name: 'Hospitality & Tourism', count: 0, icon: '🏨' },
    'manufacturing': { name: 'Manufacturing & Production', count: 0, icon: '🏭' },
    'construction': { name: 'Construction & Property', count: 0, icon: '🏗️' },
    'legal': { name: 'Legal & Compliance', count: 0, icon: '⚖️' },
    'transport': { name: 'Transport & Logistics', count: 0, icon: '🚛' },
    'agriculture': { name: 'Agriculture & Mining', count: 0, icon: '🌾' },
    'media': { name: 'Media & Communications', count: 0, icon: '📺' },
    'government': { name: 'Government & NGO', count: 0, icon: '🏛️' }
};

// Display job categories in grid
function displayJobCategories() {
    const categoriesGrid = document.getElementById('jobCategoriesGrid');
    if (!categoriesGrid) return;

    let categoriesHTML = '';
    Object.entries(jobCategories).forEach(([key, category]) => {
        categoriesHTML += `
            <div class="category-card" onclick="filterByCategory('${key}')" style="cursor: pointer;">
                <div class="card" style="text-align: center; padding: 25px; transition: all 0.3s ease; border: 2px solid transparent;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">${category.icon}</div>
                    <h3 style="color: var(--primary-blue); margin-bottom: 15px; font-size: 1.1em;">${category.name}</h3>
                    <div class="job-count" style="background: var(--gradient-orange); color: white; padding: 10px 18px; border-radius: 25px; display: inline-block; font-weight: bold; box-shadow: var(--shadow-light);">
                        ${category.count} jobs
                    </div>
                </div>
            </div>
        `;
    });

    categoriesGrid.innerHTML = categoriesHTML;
}

// Fetch jobs from API
async function fetchJobs(filters = {}) {
    try {
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.job_type) queryParams.append('job_type', filters.job_type);
        if (filters.province) queryParams.append('province', filters.province);
        if (filters.city) queryParams.append('city', filters.city);
        if (filters.keyword) queryParams.append('keyword', filters.keyword);
        if (filters.salary_min) queryParams.append('salary_min', filters.salary_min);

        const response = await fetch(`/api/jobs?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch jobs');
        }

        const jobs = await response.json();
        
        // Reset counters
        Object.keys(jobCategories).forEach(category => {
            jobCategories[category].count = 0;
        });

        // Update category counters
        jobs.forEach(job => {
            if (jobCategories[job.category]) {
                jobCategories[job.category].count++;
            }
        });

        // Update category displays
        updateCategoryDisplay();
        displayJobCategories();
        
        // Update job count display
        const jobCount = document.getElementById('jobCount');
        if (jobCount) {
            jobCount.textContent = `${jobs.length} jobs found`;
        }

        return jobs;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        showNotification('Error loading jobs. Please try again.', 'error');
        return [];
    }
}

// Update category display
function updateCategoryDisplay() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;

    categoryList.innerHTML = Object.entries(jobCategories)
        .map(([key, { name, count }]) => `
            <li>
                <a href="#" onclick="filterByCategory('${key}'); return false;">
                    ${name} <span class="count">${count}</span>
                </a>
            </li>
        `).join('');
        
    // Also update category filter dropdown if it exists
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        let filterOptionsHTML = '<option value="">All Categories</option>';
        Object.entries(jobCategories).forEach(([key, { name, count }]) => {
            filterOptionsHTML += `<option value="${key}">${name} (${count})</option>`;
        });
        categoryFilter.innerHTML = filterOptionsHTML;
    }
}

// Filter jobs by category
async function filterByCategory(category) {
    const jobs = await fetchJobs({ category });
    displayJobs(jobs);
    
    // Update section title if it exists
    const sectionTitle = document.getElementById('sectionTitle');
    if (sectionTitle) {
        sectionTitle.textContent = category ? `${jobCategories[category].name} Jobs` : 'All Jobs';
    }
}

// Display jobs in the container
function displayJobs(jobs) {
    const jobsContainer = document.getElementById('jobResults');
    if (!jobsContainer) return;

    if (jobs.length === 0) {
        jobsContainer.innerHTML = `
            <div class="card" style="text-align: center; padding: 60px;">
                <div style="font-size: 4rem; margin-bottom: 20px; color: var(--medium-gray);">🔍</div>
                <h3 style="color: var(--primary-blue);">No jobs found</h3>
                <p style="margin-bottom: 30px;">Try adjusting your filters or check back later for new opportunities.</p>
                <button onclick="clearFilters()" class="btn btn-secondary">Clear All Filters</button>
            </div>
        `;
        return;
    }

    jobsContainer.innerHTML = jobs.map(job => createJobCard(job)).join('');
}

// Create job card HTML
function createJobCard(job) {
    const salary = job.salary_min && job.salary_max 
        ? `R${parseInt(job.salary_min).toLocaleString()} - R${parseInt(job.salary_max).toLocaleString()}`
        : job.salary_min 
        ? `From R${parseInt(job.salary_min).toLocaleString()}`
        : job.salary_max 
        ? `Up to R${parseInt(job.salary_max).toLocaleString()}`
        : 'Salary Negotiable';
    
    const postedDate = new Date(job.created_at).toLocaleDateString('en-ZA');
    
    return `
        <div class="card" style="margin-bottom: 25px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; right: 0; background: var(--gradient-blue); color: white; padding: 5px 15px; border-radius: 0 0 0 15px; font-size: 12px; font-weight: bold;">
                Posted ${postedDate}
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; padding-top: 10px;">
                <div style="flex: 1;">
                    <h3 style="color: var(--primary-blue); margin-bottom: 8px; font-size: 1.4rem;">${job.job_title}</h3>
                    <p style="color: var(--dark-gray); margin-bottom: 8px; font-size: 1.1rem;"><strong>${job.company_name}</strong></p>
                    <p style="color: var(--medium-gray); margin-bottom: 8px; display: flex; align-items: center;">
                        <span style="margin-right: 8px;">📍</span> ${job.city}, ${job.province}
                    </p>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <span style="background: var(--light-orange); color: var(--accent-orange); padding: 6px 12px; border-radius: 15px; margin-right: 10px; font-size: 13px; font-weight: bold;">
                    ${jobCategories[job.category]?.name || job.category}
                </span>
                <span style="background: var(--light-gray); color: var(--dark-gray); padding: 6px 12px; border-radius: 15px; margin-right: 10px; font-size: 13px;">
                    ${job.job_type}
                </span>
                <span style="background: var(--light-blue); color: var(--primary-blue); padding: 6px 12px; border-radius: 15px; font-size: 13px; font-weight: bold;">
                    ${salary}
                </span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1; min-width: 200px;">
                    <p style="margin: 0; color: var(--medium-gray); font-size: 14px; line-height: 1.5;">
                        ${job.job_description ? job.job_description.substring(0, 120) + '...' : 'Click to view full job description and requirements.'}
                    </p>
                </div>
                <button class="btn btn-primary" onclick="openApplicationModal(${job.id})" style="min-width: 120px;">
                    Apply Now
                </button>
            </div>
        </div>
    `;
}

// Clear all filters
function clearFilters() {
    const keywordSearch = document.getElementById('keywordSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const provinceFilter = document.getElementById('provinceFilter');
    const typeFilter = document.getElementById('typeFilter');
    const salaryFilter = document.getElementById('salaryFilter');
    const sectionTitle = document.getElementById('sectionTitle');
    
    if (keywordSearch) keywordSearch.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (provinceFilter) provinceFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    if (salaryFilter) salaryFilter.value = '';
    if (sectionTitle) sectionTitle.textContent = 'All Jobs';
    
    fetchJobs().then(jobs => displayJobs(jobs));
}

// Initialize jobs and categories on page load
document.addEventListener('DOMContentLoaded', async () => {
    displayJobCategories(); // Display categories first with 0 counts
    const jobs = await fetchJobs(); // This will update the counts and redisplay
    displayJobs(jobs);
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('nav-menu-active');
    }
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

// Make functions globally available
window.toggleMobileMenu = toggleMobileMenu;
window.filterByCategory = filterByCategory;
window.clearFilters = clearFilters;