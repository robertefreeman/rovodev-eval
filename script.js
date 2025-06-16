class FluxImageGenerator {
    constructor() {
        this.apiKey = '';
        this.isGenerating = false;
        this.currentSection = 'generator';
        this.generatedImages = JSON.parse(localStorage.getItem('generated_images') || '[]');
        this.initializeFoundation();
        this.initializeElements();
        this.bindEvents();
        this.loadSavedApiKey();
        this.updateModelDescription();
        this.initializeAnimations();
        this.updateImageCounter();
    }

    initializeFoundation() {
        // Initialize Foundation components
        $(document).foundation();
    }

    initializeElements() {
        this.elements = {
            apiKey: document.getElementById('api-key'),
            prompt: document.getElementById('prompt'),
            width: document.getElementById('width'),
            height: document.getElementById('height'),
            steps: document.getElementById('steps'),
            generateBtn: document.getElementById('generate-btn'),
            btnText: document.querySelector('.btn-text'),
            btnLoading: document.querySelector('.btn-loading'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error'),
            errorMessage: document.getElementById('error-message'),
            result: document.getElementById('result'),
            placeholder: document.getElementById('placeholder'),
            generatedImage: document.getElementById('generated-image'),
            downloadBtn: document.getElementById('download-btn'),
            copyUrlBtn: document.getElementById('copy-url-btn'),
            usedPrompt: document.getElementById('used-prompt'),
            usedDimensions: document.getElementById('used-dimensions'),
            usedSteps: document.getElementById('used-steps'),
            usedModel: document.getElementById('used-model'),
            modelToggle: document.getElementById('model-toggle'),
            modelDescription: document.getElementById('model-description'),
            progressBar: document.getElementById('progress-bar'),
            imagesGenerated: document.getElementById('images-generated'),
            generatorSection: document.getElementById('generator-section'),
            gallerySection: document.getElementById('gallery-section'),
            settingsSection: document.getElementById('settings-section'),
            galleryGrid: document.getElementById('gallery-grid')
        };
    }

    bindEvents() {
        this.elements.generateBtn.addEventListener('click', () => this.generateImage());
        this.elements.apiKey.addEventListener('input', () => this.saveApiKey());
        this.elements.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.elements.copyUrlBtn.addEventListener('click', () => this.copyImageUrl());
        this.elements.modelToggle.addEventListener('change', () => this.updateModelDescription());
        
        // Navigation events
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.switchSection(section);
            });
        });
        
        // Allow Enter key in prompt textarea to trigger generation
        this.elements.prompt.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generateImage();
            }
        });

        // Handle example prompt buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prompt = e.target.getAttribute('data-prompt');
                this.elements.prompt.value = prompt;
                this.elements.prompt.focus();
            });
        });
    }

    loadSavedApiKey() {
        const savedKey = localStorage.getItem('together_ai_api_key');
        if (savedKey) {
            this.elements.apiKey.value = savedKey;
            this.apiKey = savedKey;
        }
    }

    updateModelDescription() {
        const isFreeModel = this.elements.modelToggle.checked;
        if (isFreeModel) {
            this.elements.modelDescription.textContent = 'Using FLUX.1-schnell-Free model (Free tier)';
        } else {
            this.elements.modelDescription.textContent = 'Using standard FLUX.1-schnell model';
        }
    }

    getSelectedModel() {
        return this.elements.modelToggle.checked ? 
            'black-forest-labs/FLUX.1-schnell-Free' : 
            'black-forest-labs/FLUX.1-schnell';
    }

    initializeAnimations() {
        // Trigger animations on page load
        setTimeout(() => {
            document.querySelectorAll('[data-animate-in]').forEach(el => {
                el.style.opacity = '1';
            });
        }, 100);
    }

    updateImageCounter() {
        if (this.elements.imagesGenerated) {
            this.elements.imagesGenerated.textContent = this.generatedImages.length.toLocaleString();
        }
    }

    switchSection(sectionName) {
        // Hide all sections
        this.elements.generatorSection.style.display = 'none';
        this.elements.gallerySection.style.display = 'none';
        this.elements.settingsSection.style.display = 'none';

        // Show selected section
        switch(sectionName) {
            case 'generator':
                this.elements.generatorSection.style.display = 'block';
                break;
            case 'gallery':
                this.elements.gallerySection.style.display = 'block';
                this.loadGallery();
                break;
            case 'settings':
                this.elements.settingsSection.style.display = 'block';
                break;
        }

        this.currentSection = sectionName;
        
        // Update active navigation
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === sectionName) {
                btn.classList.add('active');
            }
        });
    }

    loadGallery() {
        if (!this.elements.galleryGrid) return;
        
        this.elements.galleryGrid.innerHTML = '';
        
        if (this.generatedImages.length === 0) {
            this.elements.galleryGrid.innerHTML = `
                <div class="cell text-center">
                    <div class="callout secondary">
                        <h5>No images yet</h5>
                        <p>Generate your first image to see it here!</p>
                        <button class="button primary" onclick="app.switchSection('generator')">
                            🎨 Start Creating
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        this.generatedImages.reverse().forEach((image, index) => {
            const imageCard = document.createElement('div');
            imageCard.className = 'cell';
            imageCard.innerHTML = `
                <div class="card">
                    <img src="${image.url}" alt="${image.prompt}" onclick="app.viewImage('${image.url}', '${image.prompt}')">
                    <div class="card-section">
                        <p class="subheader">${image.prompt.substring(0, 50)}${image.prompt.length > 50 ? '...' : ''}</p>
                        <small>${new Date(image.timestamp).toLocaleDateString()}</small>
                    </div>
                </div>
            `;
            this.elements.galleryGrid.appendChild(imageCard);
        });
    }

    viewImage(url, prompt) {
        // Create modal or lightbox to view image
        const modal = document.createElement('div');
        modal.className = 'reveal large';
        modal.setAttribute('data-reveal', '');
        modal.innerHTML = `
            <img src="${url}" alt="${prompt}" style="width: 100%; height: auto;">
            <div class="callout secondary margin-top-1">
                <p><strong>Prompt:</strong> ${prompt}</p>
            </div>
            <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
            </button>
        `;
        
        document.body.appendChild(modal);
        $(modal).foundation().foundation('open');
        
        // Remove modal when closed
        $(modal).on('closed.zf.reveal', function() {
            document.body.removeChild(modal);
        });
    }

    saveApiKey() {
        this.apiKey = this.elements.apiKey.value.trim();
        if (this.apiKey) {
            localStorage.setItem('together_ai_api_key', this.apiKey);
        }
    }

    validateInputs() {
        if (!this.apiKey) {
            throw new Error('Please enter your Together.AI API key');
        }

        const prompt = this.elements.prompt.value.trim();
        if (!prompt) {
            throw new Error('Please enter a prompt for image generation');
        }

        const steps = parseInt(this.elements.steps.value);
        if (steps < 1 || steps > 4) {
            throw new Error('Steps must be between 1 and 4');
        }

        return {
            prompt,
            width: parseInt(this.elements.width.value),
            height: parseInt(this.elements.height.value),
            steps
        };
    }

    async generateImage() {
        if (this.isGenerating) return;

        try {
            // Validate inputs
            const params = this.validateInputs();
            
            // Update UI
            this.setGeneratingState(true);
            this.hideError();
            this.hideResult();

            // Make API call
            const imageUrl = await this.callTogetherAI(params);

            // Display result
            this.displayResult(imageUrl, params);

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setGeneratingState(false);
        }
    }

    async callTogetherAI(params) {
        const response = await fetch('https://api.together.xyz/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.getSelectedModel(),
                prompt: params.prompt,
                width: params.width,
                height: params.height,
                steps: params.steps,
                n: 1,
                response_format: 'url'
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.data || !data.data[0] || !data.data[0].url) {
            throw new Error('Invalid response from API - no image URL received');
        }

        return data.data[0].url;
    }

    setGeneratingState(isGenerating) {
        this.isGenerating = isGenerating;
        this.elements.generateBtn.disabled = isGenerating;
        
        if (isGenerating) {
            this.elements.btnText.style.display = 'none';
            this.elements.btnLoading.style.display = 'inline';
            this.elements.loading.style.display = 'block';
            this.elements.placeholder.style.display = 'none';
            this.startProgressAnimation();
        } else {
            this.elements.btnText.style.display = 'inline';
            this.elements.btnLoading.style.display = 'none';
            this.elements.loading.style.display = 'none';
            this.stopProgressAnimation();
        }
    }

    startProgressAnimation() {
        if (!this.elements.progressBar) return;
        
        let progress = 0;
        this.progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            this.elements.progressBar.style.width = progress + '%';
        }, 500);
    }

    stopProgressAnimation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = '100%';
            setTimeout(() => {
                this.elements.progressBar.style.width = '0%';
            }, 500);
        }
    }

    showError(message) {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.textContent = message;
        }
        this.elements.error.style.display = 'block';
    }

    hideError() {
        this.elements.error.style.display = 'none';
    }

    hideResult() {
        this.elements.result.style.display = 'none';
        this.elements.placeholder.style.display = 'flex';
    }

    displayResult(imageUrl, params) {
        this.elements.generatedImage.src = imageUrl;
        this.elements.usedPrompt.textContent = params.prompt;
        this.elements.usedDimensions.textContent = `${params.width} × ${params.height}`;
        this.elements.usedSteps.textContent = params.steps;
        if (this.elements.usedModel) {
            this.elements.usedModel.textContent = this.getSelectedModel().split('/')[1];
        }
        this.elements.placeholder.style.display = 'none';
        this.elements.result.style.display = 'block';

        // Store current image URL for download/copy functions
        this.currentImageUrl = imageUrl;

        // Save to gallery
        this.saveToGallery(imageUrl, params);
    }

    saveToGallery(imageUrl, params) {
        const imageData = {
            url: imageUrl,
            prompt: params.prompt,
            width: params.width,
            height: params.height,
            steps: params.steps,
            model: this.getSelectedModel(),
            timestamp: new Date().toISOString()
        };

        this.generatedImages.push(imageData);
        
        // Keep only last 50 images to prevent localStorage bloat
        if (this.generatedImages.length > 50) {
            this.generatedImages = this.generatedImages.slice(-50);
        }

        localStorage.setItem('generated_images', JSON.stringify(this.generatedImages));
        this.updateImageCounter();
    }

    async downloadImage() {
        if (!this.currentImageUrl) return;

        try {
            const response = await fetch(this.currentImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `flux-generated-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            window.URL.revokeObjectURL(url);
        } catch (error) {
            this.showError('Failed to download image: ' + error.message);
        }
    }

    async copyImageUrl() {
        if (!this.currentImageUrl) return;

        try {
            await navigator.clipboard.writeText(this.currentImageUrl);
            
            // Show temporary feedback
            const originalText = this.elements.copyUrlBtn.textContent;
            this.elements.copyUrlBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.elements.copyUrlBtn.textContent = originalText;
            }, 2000);
        } catch (error) {
            this.showError('Failed to copy URL: ' + error.message);
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FluxImageGenerator();
});

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const generateBtn = document.getElementById('generate-btn');
        if (!generateBtn.disabled) {
            generateBtn.click();
        }
    }
});