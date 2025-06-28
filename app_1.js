// Application Data
const appData = {
    currentUser: null,
    isLoggedIn: false,
    users: [
        {
            id: 1,
            name: "Arjun Patel",
            email: "arjun.patel@email.com",
            phone: "+91 98765 43210",
            trustScore: 785,
            verificationStatus: "verified",
            joinedDate: "2024-03-15",
            totalPooled: 15000,
            claimsSubmitted: 1,
            votesParticipated: 12,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        {
            id: 2,
            name: "Priya Sharma",
            email: "priya.sharma@email.com",
            phone: "+91 98765 43211",
            trustScore: 820,
            verificationStatus: "verified",
            joinedDate: "2024-02-20",
            totalPooled: 22000,
            claimsSubmitted: 0,
            votesParticipated: 18,
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        }
    ],
    pools: [
        {
            id: 1,
            name: "Tech Professionals Mobile Insurance",
            description: "Insurance for smartphones, laptops, and tablets for IT professionals",
            members: 12,
            maxMembers: 15,
            monthlyContribution: 500,
            totalPooled: 84000,
            coverageLimit: 50000,
            category: "Electronics",
            createdDate: "2024-01-15",
            activeClaims: 1,
            governance: "majority_vote",
            trustThreshold: 700
        },
        {
            id: 2,
            name: "College Hostel Gadget Protection",
            description: "Comprehensive protection for laptops, phones, and other electronics",
            members: 8,
            maxMembers: 20,
            monthlyContribution: 300,
            totalPooled: 28800,
            coverageLimit: 30000,
            category: "Electronics",
            createdDate: "2024-02-01",
            activeClaims: 0,
            governance: "peer_review",
            trustThreshold: 650
        }
    ],
    claims: [
        {
            id: 1,
            poolId: 1,
            submittedBy: "Arjun Patel",
            amount: 12000,
            reason: "Smartphone screen damage due to accidental drop",
            description: "My iPhone 14 screen got cracked when it fell from my pocket while getting out of an auto-rickshaw. Attaching repair quote from authorized service center.",
            status: "voting",
            submittedDate: "2024-06-25",
            votesFor: 8,
            votesAgainst: 2,
            totalVotes: 10,
            requiredVotes: 8,
            evidence: ["repair_quote.jpg", "damage_photo.jpg"],
            category: "Accidental Damage"
        }
    ],
    transactions: [
        {
            id: 1,
            type: "contribution",
            amount: 500,
            description: "Monthly contribution to Tech Professionals Pool",
            date: "2024-06-01",
            poolName: "Tech Professionals Mobile Insurance"
        },
        {
            id: 2,
            type: "refund",
            amount: 120,
            description: "Unused funds refund from previous month",
            date: "2024-05-31",
            poolName: "Tech Professionals Mobile Insurance"
        }
    ]
};

// DOM Elements
const elements = {
    // Navigation
    navbar: document.getElementById('navbar'),
    authNavbar: document.getElementById('auth-navbar'),
    navLinks: document.querySelectorAll('.nav-link'),
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    
    // Buttons
    loginBtn: document.getElementById('login-btn'),
    signupBtn: document.getElementById('signup-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    getStartedBtn: document.getElementById('get-started-btn'),
    learnMoreBtn: document.getElementById('learn-more-btn'),
    joinNowBtn: document.getElementById('join-now-btn'),
    
    // Modals
    loginModal: document.getElementById('login-modal'),
    signupModal: document.getElementById('signup-modal'),
    successModal: document.getElementById('success-modal'),
    modalCloses: document.querySelectorAll('.modal-close'),
    
    // Pages
    pages: document.querySelectorAll('.page'),
    
    // Forms
    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),
    poolCreationForm: document.getElementById('pool-creation-form'),
    claimForm: document.getElementById('claim-form'),
    
    // Dynamic content
    userName: document.getElementById('user-name'),
    userAvatar: document.getElementById('user-avatar'),
    userTrustScore: document.getElementById('user-trust-score'),
    
    // Gauges
    gauges: document.querySelectorAll('.gauge-fill'),
    
    // Tabs
    tabs: document.querySelectorAll('.tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // FAQ
    faqItems: document.querySelectorAll('.faq-item'),
    faqQuestions: document.querySelectorAll('.faq-question')
};

// Utility Functions
const utils = {
    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    },
    
    // Format date
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Show notification
    showNotification: (title, message, type = 'success') => {
        const modal = elements.successModal;
        const titleEl = document.getElementById('success-title');
        const messageEl = document.getElementById('success-message');
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        modal.classList.add('active');
    },
    
    // Hide modal
    hideModal: (modal) => {
        modal.classList.remove('active');
    },
    
    // Animate gauge
    animateGauge: (gaugeElement, score) => {
        const maxScore = 900;
        const minScore = 300;
        const scoreRange = maxScore - minScore;
        const normalizedScore = Math.max(0, Math.min(1, (score - minScore) / scoreRange));
        const maxDashOffset = 251.32;
        const targetOffset = maxDashOffset * (1 - normalizedScore * 0.7);
        
        gaugeElement.style.strokeDashoffset = targetOffset;
    },
    
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Validate form
    validateForm: (form) => {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    },
    
    // Show loading state on button
    setButtonLoading: (button, loading = true) => {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        } else {
            button.disabled = false;
            button.innerHTML = button.getAttribute('data-original-text') || 'Submit';
        }
    }
};

// Navigation Management
const navigation = {
    init: () => {
        // Add click listeners to navigation links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                if (page) {
                    navigation.showPage(page);
                    navigation.setActiveNavLink(link);
                }
            });
        });
        
        // Mobile nav toggle
        elements.navToggle?.addEventListener('click', () => {
            elements.navMenu.classList.toggle('active');
        });
        
        // Action buttons with data-page attributes
        document.querySelectorAll('[data-page]').forEach(button => {
            button.addEventListener('click', (e) => {
                const page = button.getAttribute('data-page');
                const action = button.getAttribute('data-action');
                
                if (page && appData.isLoggedIn) {
                    navigation.showPage(page);
                    if (action) {
                        navigation.handlePageAction(page, action);
                    }
                } else if (page && !appData.isLoggedIn) {
                    auth.showLogin();
                }
            });
        });
    },
    
    showPage: (pageId) => {
        // Hide all pages
        elements.pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Trigger page-specific initialization
            switch (pageId) {
                case 'dashboard':
                    dashboard.init();
                    break;
                case 'pools':
                    pools.init();
                    break;
                case 'claims':
                    claims.init();
                    break;
                case 'profile':
                    profile.init();
                    break;
            }
        }
        
        // Update URL hash
        window.location.hash = pageId;
    },
    
    setActiveNavLink: (activeLink) => {
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    },
    
    handlePageAction: (page, action) => {
        switch (page) {
            case 'pools':
                if (action === 'create') {
                    pools.showCreateTab();
                } else if (action === 'join') {
                    pools.showAvailableTab();
                }
                break;
            case 'claims':
                if (action === 'file') {
                    claims.showFileTab();
                } else if (action === 'vote') {
                    claims.showPendingTab();
                }
                break;
        }
    }
};

// Authentication Management
const auth = {
    init: () => {
        // Login/Signup buttons
        elements.loginBtn?.addEventListener('click', () => auth.showLogin());
        elements.signupBtn?.addEventListener('click', () => auth.showSignup());
        elements.logoutBtn?.addEventListener('click', () => auth.logout());
        
        // Modal close buttons
        elements.modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                utils.hideModal(modal);
            });
        });
        
        // Modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    utils.hideModal(modal);
                }
            });
        });
        
        // Switch between login/signup
        document.getElementById('switch-to-signup')?.addEventListener('click', (e) => {
            e.preventDefault();
            utils.hideModal(elements.loginModal);
            auth.showSignup();
        });
        
        document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            utils.hideModal(elements.signupModal);
            auth.showLogin();
        });
        
        // Form submissions
        elements.loginForm?.addEventListener('submit', auth.handleLogin);
        elements.signupForm?.addEventListener('submit', auth.handleSignup);
        
        // Success modal OK button
        document.getElementById('success-ok')?.addEventListener('click', () => {
            utils.hideModal(elements.successModal);
        });
    },
    
    showLogin: () => {
        elements.loginModal.classList.add('active');
    },
    
    showSignup: () => {
        elements.signupModal.classList.add('active');
    },
    
    handleLogin: (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        if (!utils.validateForm(e.target)) {
            utils.showNotification('Validation Error', 'Please fill in all required fields.', 'error');
            return;
        }
        
        submitBtn.setAttribute('data-original-text', submitBtn.textContent);
        utils.setButtonLoading(submitBtn, true);
        
        // Simulate login
        setTimeout(() => {
            appData.isLoggedIn = true;
            appData.currentUser = appData.users[0];
            
            utils.setButtonLoading(submitBtn, false);
            utils.hideModal(elements.loginModal);
            auth.updateUI();
            navigation.showPage('dashboard');
            
            utils.showNotification(
                'Welcome Back!',
                'You have successfully logged in to Sure Circle.'
            );
        }, 2000);
    },
    
    handleSignup: (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        if (!utils.validateForm(e.target)) {
            utils.showNotification('Validation Error', 'Please fill in all required fields.', 'error');
            return;
        }
        
        submitBtn.setAttribute('data-original-text', submitBtn.textContent);
        utils.setButtonLoading(submitBtn, true);
        
        // Simulate signup
        setTimeout(() => {
            appData.isLoggedIn = true;
            appData.currentUser = {
                id: 3,
                name: "New User",
                email: "new.user@email.com",
                trustScore: 650,
                verificationStatus: "pending",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            };
            
            utils.setButtonLoading(submitBtn, false);
            utils.hideModal(elements.signupModal);
            auth.updateUI();
            navigation.showPage('dashboard');
            
            utils.showNotification(
                'Account Created!',
                'Welcome to Sure Circle! Complete your profile to increase your trust score.'
            );
        }, 2000);
    },
    
    logout: () => {
        appData.isLoggedIn = false;
        appData.currentUser = null;
        auth.updateUI();
        navigation.showPage('home');
        
        utils.showNotification(
            'Logged Out',
            'You have successfully logged out. Come back soon!'
        );
    },
    
    updateUI: () => {
        if (appData.isLoggedIn && appData.currentUser) {
            // Show authenticated navbar
            elements.navbar.classList.add('hidden');
            elements.authNavbar.classList.remove('hidden');
            
            // Update user info
            if (elements.userName) {
                elements.userName.textContent = appData.currentUser.name.split(' ')[0];
            }
            if (elements.userAvatar) {
                elements.userAvatar.src = appData.currentUser.avatar;
            }
            if (elements.userTrustScore) {
                elements.userTrustScore.textContent = appData.currentUser.trustScore;
            }
        } else {
            // Show public navbar
            elements.navbar.classList.remove('hidden');
            elements.authNavbar.classList.add('hidden');
        }
    }
};

// Dashboard Management
const dashboard = {
    init: () => {
        dashboard.updateTrustScore();
        dashboard.updateStats();
        dashboard.updateActivity();
    },
    
    updateTrustScore: () => {
        if (!appData.currentUser) return;
        
        const gauge = document.getElementById('dashboard-gauge');
        const scoreElement = document.getElementById('user-trust-score');
        
        if (gauge && scoreElement) {
            scoreElement.textContent = appData.currentUser.trustScore;
            utils.animateGauge(gauge, appData.currentUser.trustScore);
        }
    },
    
    updateStats: () => {
        // Update dashboard stats with real data
        const stats = document.querySelectorAll('.stat-value');
        if (stats.length >= 4) {
            stats[0].textContent = utils.formatCurrency(appData.currentUser?.totalPooled || 15000);
            stats[1].textContent = '2';
            stats[2].textContent = '1';
            stats[3].textContent = utils.formatCurrency(500);
        }
    },
    
    updateActivity: () => {
        // Activity feed would be updated with real-time data
        console.log('Activity feed updated');
    }
};

// Pools Management
const pools = {
    init: () => {
        pools.setupTabs();
        pools.setupPoolCreation();
        pools.setupSearch();
    },
    
    setupTabs: () => {
        // Tab switching is handled by the global tab system
    },
    
    setupPoolCreation: () => {
        const form = elements.poolCreationForm;
        if (!form) return;
        
        // Trust score slider
        const slider = document.getElementById('trust-slider');
        const valueDisplay = document.getElementById('trust-value');
        
        if (slider && valueDisplay) {
            slider.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value;
            });
        }
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            if (!utils.validateForm(e.target)) {
                utils.showNotification('Validation Error', 'Please fill in all required fields.', 'error');
                return;
            }
            
            submitBtn.setAttribute('data-original-text', submitBtn.textContent);
            utils.setButtonLoading(submitBtn, true);
            
            // Simulate pool creation
            setTimeout(() => {
                utils.setButtonLoading(submitBtn, false);
                utils.showNotification(
                    'Pool Created!',
                    'Your insurance pool has been created successfully. Start inviting members!'
                );
                
                // Switch to my pools tab
                pools.showMyPoolsTab();
            }, 2000);
        });
    },
    
    setupSearch: () => {
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce((e) => {
                pools.filterPools(e.target.value);
            }, 300));
        }
    },
    
    filterPools: (searchTerm) => {
        // Implement pool filtering logic
        console.log('Filtering pools:', searchTerm);
    },
    
    showMyPoolsTab: () => {
        const tab = document.querySelector('[data-tab="my-pools"]');
        if (tab) {
            tab.click();
        }
    },
    
    showCreateTab: () => {
        const tab = document.querySelector('[data-tab="create-pool"]');
        if (tab) {
            tab.click();
        }
    },
    
    showAvailableTab: () => {
        const tab = document.querySelector('[data-tab="available-pools"]');
        if (tab) {
            tab.click();
        }
    }
};

// Claims Management
const claims = {
    uploadedFiles: [],
    
    init: () => {
        claims.setupTabs();
        claims.setupVoting();
        claims.setupClaimForm();
        claims.setupFileUpload();
    },
    
    setupTabs: () => {
        // Tab switching handled by global system
    },
    
    setupVoting: () => {
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const vote = e.target.getAttribute('data-vote');
                const originalText = e.target.innerHTML;
                
                e.target.disabled = true;
                e.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Voting...';
                
                setTimeout(() => {
                    claims.submitVote(vote);
                    e.target.disabled = false;
                    e.target.innerHTML = originalText;
                }, 1500);
            });
        });
    },
    
    setupClaimForm: () => {
        const form = elements.claimForm;
        if (!form) return;
        
        // Form validation on input change
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    field.classList.remove('error');
                }
                claims.updateSubmitButton();
            });
            
            field.addEventListener('change', () => {
                if (field.value.trim()) {
                    field.classList.remove('error');
                }
                claims.updateSubmitButton();
            });
        });
        
        // Amount validation
        const amountField = form.querySelector('input[name="amount"]');
        if (amountField) {
            amountField.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (value > 100000) {
                    e.target.value = 100000;
                    utils.showNotification('Amount Limit', 'Maximum claim amount is ₹1,00,000', 'warning');
                }
            });
        }
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            claims.submitClaim(e);
        });
        
        // Save draft button
        const saveDraftBtn = document.getElementById('save-draft-btn');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', () => {
                claims.saveDraft();
            });
        }
    },
    
    setupFileUpload: () => {
        const uploadArea = document.getElementById('file-upload-area');
        const fileInput = document.getElementById('file-input');
        const uploadedFilesContainer = document.getElementById('uploaded-files');
        
        if (!uploadArea || !fileInput || !uploadedFilesContainer) return;
        
        // Click to upload
        uploadArea.addEventListener('click', (e) => {
            if (e.target.closest('.uploaded-files')) return;
            fileInput.click();
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            claims.handleFileUpload(files);
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            claims.handleFileUpload(files);
        });
    },
    
    handleFileUpload: (files) => {
        const maxFiles = 5;
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (claims.uploadedFiles.length + files.length > maxFiles) {
            utils.showNotification('File Limit', `Maximum ${maxFiles} files allowed`, 'error');
            return;
        }
        
        files.forEach(file => {
            // Validate file type
            if (!allowedTypes.includes(file.type)) {
                utils.showNotification('Invalid File Type', `${file.name} is not a supported file type`, 'error');
                return;
            }
            
            // Validate file size
            if (file.size > maxSize) {
                utils.showNotification('File Too Large', `${file.name} exceeds 10MB limit`, 'error');
                return;
            }
            
            // Add file to uploaded files
            claims.uploadedFiles.push(file);
            claims.displayUploadedFile(file);
        });
        
        claims.updateSubmitButton();
    },
    
    displayUploadedFile: (file) => {
        const uploadedFilesContainer = document.getElementById('uploaded-files');
        if (!uploadedFilesContainer) return;
        
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        fileElement.innerHTML = `
            <div class="file-info">
                <i class="fas ${file.type.includes('image') ? 'fa-image' : 'fa-file-alt'}"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">(${(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <button type="button" class="remove-file" data-file-name="${file.name}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add remove functionality
        const removeBtn = fileElement.querySelector('.remove-file');
        removeBtn.addEventListener('click', () => {
            claims.removeFile(file.name);
            fileElement.remove();
            claims.updateSubmitButton();
        });
        
        uploadedFilesContainer.appendChild(fileElement);
    },
    
    removeFile: (fileName) => {
        claims.uploadedFiles = claims.uploadedFiles.filter(file => file.name !== fileName);
    },
    
    updateSubmitButton: () => {
        const form = elements.claimForm;
        const submitBtn = document.getElementById('submit-claim-btn');
        
        if (!form || !submitBtn) return;
        
        const requiredFields = form.querySelectorAll('[required]');
        let allFieldsValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                allFieldsValid = false;
            }
        });
        
        // Check if at least one file is uploaded
        const hasFiles = claims.uploadedFiles.length > 0;
        
        if (allFieldsValid && hasFiles) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('disabled');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled');
        }
    },
    
    submitVote: (vote) => {
        const action = vote === 'approve' ? 'approved' : 'rejected';
        utils.showNotification(
            'Vote Submitted',
            `You have ${action} this claim. Thank you for participating!`
        );
        
        // Update vote counts in UI
        claims.updateVoteCounts();
    },
    
    updateVoteCounts: () => {
        // Update vote progress bars and counts
        const votesFor = document.querySelector('.votes-for');
        const progressFill = document.querySelector('.vote-progress .progress-fill.success');
        
        if (votesFor) {
            votesFor.textContent = '9 For';
        }
        if (progressFill) {
            progressFill.style.width = '90%';
        }
    },
    
    submitClaim: (e) => {
        const form = e.target;
        const submitBtn = document.getElementById('submit-claim-btn');
        
        if (!utils.validateForm(form)) {
            utils.showNotification('Validation Error', 'Please fill in all required fields.', 'error');
            return;
        }
        
        if (claims.uploadedFiles.length === 0) {
            utils.showNotification('Missing Evidence', 'Please upload at least one supporting document.', 'error');
            return;
        }
        
        submitBtn.setAttribute('data-original-text', submitBtn.textContent);
        utils.setButtonLoading(submitBtn, true);
        
        // Simulate claim submission
        setTimeout(() => {
            utils.setButtonLoading(submitBtn, false);
            utils.showNotification(
                'Claim Submitted',
                'Your claim has been submitted successfully. Pool members will vote on it soon.'
            );
            
            // Reset form
            form.reset();
            claims.uploadedFiles = [];
            document.getElementById('uploaded-files').innerHTML = '';
            claims.updateSubmitButton();
            
            // Switch to my claims tab
            claims.showMyClaimsTab();
        }, 3000);
    },
    
    saveDraft: () => {
        const form = elements.claimForm;
        if (!form) return;
        
        const formData = new FormData(form);
        const draftData = {};
        
        for (let [key, value] of formData.entries()) {
            draftData[key] = value;
        }
        
        // Save to localStorage (simulation)
        try {
            localStorage.setItem('sureCircle_claimDraft', JSON.stringify(draftData));
            utils.showNotification('Draft Saved', 'Your claim has been saved as a draft.');
        } catch (e) {
            utils.showNotification('Save Failed', 'Unable to save draft. Please try again.', 'error');
        }
    },
    
    showPendingTab: () => {
        const tab = document.querySelector('[data-tab="pending-votes"]');
        if (tab) {
            tab.click();
        }
    },
    
    showMyClaimsTab: () => {
        const tab = document.querySelector('[data-tab="my-claims"]');
        if (tab) {
            tab.click();
        }
    },
    
    showFileTab: () => {
        const tab = document.querySelector('[data-tab="file-claim"]');
        if (tab) {
            tab.click();
        }
    }
};

// Profile Management
const profile = {
    init: () => {
        profile.updateTrustScore();
        profile.setupForm();
        profile.setupSecurity();
    },
    
    updateTrustScore: () => {
        if (!appData.currentUser) return;
        
        const gauge = document.getElementById('profile-gauge');
        if (gauge) {
            utils.animateGauge(gauge, appData.currentUser.trustScore);
        }
    },
    
    setupForm: () => {
        const form = document.querySelector('.profile-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            submitBtn.setAttribute('data-original-text', submitBtn.textContent);
            utils.setButtonLoading(submitBtn, true);
            
            setTimeout(() => {
                utils.setButtonLoading(submitBtn, false);
                utils.showNotification(
                    'Profile Updated',
                    'Your profile information has been updated successfully.'
                );
            }, 1500);
        });
    },
    
    setupSecurity: () => {
        document.querySelectorAll('.security-item button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.textContent;
                
                if (text.includes('Enable')) {
                    utils.showNotification(
                        '2FA Enabled',
                        'Two-factor authentication has been enabled for your account.'
                    );
                    e.target.textContent = 'Disable';
                    e.target.classList.remove('btn--primary');
                    e.target.classList.add('btn--error');
                } else if (text.includes('Change')) {
                    utils.showNotification(
                        'Password Changed',
                        'Your password has been updated successfully.'
                    );
                }
            });
        });
    }
};

// Tab System
const tabs = {
    init: () => {
        elements.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                tabs.switchTab(tabId, tab);
            });
        });
    },
    
    switchTab: (tabId, tabElement) => {
        // Remove active class from all tabs in the same group
        const tabGroup = tabElement.closest('.tabs');
        const tabsInGroup = tabGroup.querySelectorAll('.tab');
        const contentContainer = tabGroup.nextElementSibling;
        
        tabsInGroup.forEach(t => t.classList.remove('active'));
        tabElement.classList.add('active');
        
        // Switch tab content
        const tabContents = contentContainer.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }
};

// FAQ System
const faq = {
    init: () => {
        elements.faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.closest('.faq-item');
                faq.toggleFAQ(faqItem);
            });
        });
    },
    
    toggleFAQ: (faqItem) => {
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        elements.faqItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    }
};

// Animations and Effects
const animations = {
    init: () => {
        animations.setupScrollAnimations();
        animations.setupHoverEffects();
        animations.initializeGauges();
    },
    
    setupScrollAnimations: () => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        document.querySelectorAll('.step, .testimonial, .pool-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    },
    
    setupHoverEffects: () => {
        // Add hover effects to interactive elements
        document.querySelectorAll('.pool-card, .claim-card, .action-btn').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    },
    
    initializeGauges: () => {
        // Initialize all gauges with animation
        setTimeout(() => {
            elements.gauges.forEach(gauge => {
                utils.animateGauge(gauge, 785);
            });
        }, 1000);
    }
};

// Event Handlers for CTA Buttons
const ctaHandlers = {
    init: () => {
        // Get Started button
        elements.getStartedBtn?.addEventListener('click', () => {
            if (appData.isLoggedIn) {
                navigation.showPage('dashboard');
            } else {
                auth.showSignup();
            }
        });
        
        // Learn More button
        elements.learnMoreBtn?.addEventListener('click', () => {
            navigation.showPage('about');
        });
        
        // Join Now button
        elements.joinNowBtn?.addEventListener('click', () => {
            if (appData.isLoggedIn) {
                navigation.showPage('pools');
            } else {
                auth.showSignup();
            }
        });
        
        // Create Pool button
        document.getElementById('create-pool-btn')?.addEventListener('click', () => {
            pools.showCreateTab();
        });
        
        // Browse Pools button
        document.getElementById('browse-pools-btn')?.addEventListener('click', () => {
            pools.showAvailableTab();
        });
        
        // File Claim button
        document.getElementById('file-claim-btn')?.addEventListener('click', () => {
            claims.showFileTab();
        });
    }
};

// Responsive Handling
const responsive = {
    init: () => {
        responsive.handleResize();
        window.addEventListener('resize', utils.debounce(responsive.handleResize, 250));
    },
    
    handleResize: () => {
        const width = window.innerWidth;
        
        // Close mobile menu on resize to desktop
        if (width > 768) {
            elements.navMenu.classList.remove('active');
        }
        
        // Adjust grid layouts for mobile
        responsive.adjustLayouts(width);
    },
    
    adjustLayouts: (width) => {
        // Responsive layout adjustments
        const dashboardGrid = document.querySelector('.dashboard-grid');
        const poolsGrid = document.querySelector('.pools-grid');
        
        if (width <= 768) {
            // Mobile adjustments
            if (dashboardGrid) {
                dashboardGrid.style.gridTemplateColumns = '1fr';
            }
            if (poolsGrid) {
                poolsGrid.style.gridTemplateColumns = '1fr';
            }
        } else {
            // Desktop adjustments
            if (dashboardGrid) {
                dashboardGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
            }
            if (poolsGrid) {
                poolsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
            }
        }
    }
};

// Real-time Updates Simulation
const realTimeUpdates = {
    init: () => {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            realTimeUpdates.updateDashboard();
        }, 30000);
    },
    
    updateDashboard: () => {
        if (!appData.isLoggedIn) return;
        
        // Simulate minor updates to create dynamic feel
        const activities = document.querySelectorAll('.activity-time');
        activities.forEach(activity => {
            // Update relative times
            if (activity.textContent.includes('2 days')) {
                activity.textContent = '2 days ago';
            }
        });
    }
};

// Data Persistence (Local Storage simulation)
const storage = {
    save: (key, data) => {
        try {
            localStorage.setItem(`sureCircle_${key}`, JSON.stringify(data));
        } catch (e) {
            console.warn('Storage not available');
        }
    },
    
    load: (key) => {
        try {
            const data = localStorage.getItem(`sureCircle_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Storage not available');
            return null;
        }
    },
    
    init: () => {
        // Load saved user state
        const savedUser = storage.load('currentUser');
        if (savedUser) {
            appData.currentUser = savedUser;
            appData.isLoggedIn = true;
            auth.updateUI();
        }
    }
};

// Initialize Application
const app = {
    init: () => {
        // Initialize all modules
        storage.init();
        navigation.init();
        auth.init();
        tabs.init();
        faq.init();
        animations.init();
        ctaHandlers.init();
        responsive.init();
        realTimeUpdates.init();
        
        // Handle initial route
        const hash = window.location.hash.substring(1);
        if (hash && appData.isLoggedIn) {
            navigation.showPage(hash);
        } else if (hash && !appData.isLoggedIn) {
            auth.showLogin();
        }
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                navigation.showPage(hash);
            } else {
                navigation.showPage('home');
            }
        });
        
        console.log('Sure Circle application initialized successfully!');
    }
};

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', app.init);

// Export for testing
window.SureCircle = {
    app,
    appData,
    utils,
    navigation,
    auth,
    dashboard,
    pools,
    claims,
    profile
};