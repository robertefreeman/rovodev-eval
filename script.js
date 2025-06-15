class FluxImageGenerator {
    constructor() {
        this.apiKey = '';
        this.isGenerating = false;
        this.initializeElements();
        this.bindEvents();
        this.loadSavedApiKey();
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
            result: document.getElementById('result'),
            generatedImage: document.getElementById('generated-image'),
            downloadBtn: document.getElementById('download-btn'),
            copyUrlBtn: document.getElementById('copy-url-btn'),
            usedPrompt: document.getElementById('used-prompt'),
            usedDimensions: document.getElementById('used-dimensions'),
            usedSteps: document.getElementById('used-steps')
        };
    }

    bindEvents() {
        this.elements.generateBtn.addEventListener('click', () => this.generateImage());
        this.elements.apiKey.addEventListener('input', () => this.saveApiKey());
        this.elements.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.elements.copyUrlBtn.addEventListener('click', () => this.copyImageUrl());
        
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
                model: 'black-forest-labs/FLUX.1-schnell',
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
        } else {
            this.elements.btnText.style.display = 'inline';
            this.elements.btnLoading.style.display = 'none';
            this.elements.loading.style.display = 'none';
        }
    }

    showError(message) {
        this.elements.error.textContent = message;
        this.elements.error.style.display = 'block';
    }

    hideError() {
        this.elements.error.style.display = 'none';
    }

    hideResult() {
        this.elements.result.style.display = 'none';
    }

    displayResult(imageUrl, params) {
        this.elements.generatedImage.src = imageUrl;
        this.elements.usedPrompt.textContent = params.prompt;
        this.elements.usedDimensions.textContent = `${params.width} × ${params.height}`;
        this.elements.usedSteps.textContent = params.steps;
        this.elements.result.style.display = 'block';

        // Store current image URL for download/copy functions
        this.currentImageUrl = imageUrl;
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
    new FluxImageGenerator();
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