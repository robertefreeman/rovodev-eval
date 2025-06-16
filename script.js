/**
 * FreeAI Studio - Clean AI Image Generator
 * Uses FLUX.1-schnell-Free model via Together.AI API
 */

class FreeAIGenerator {
    constructor() {
        this.apiKey = '';
        this.isGenerating = false;
        this.currentImageUrl = null;
        this.progressInterval = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadSavedApiKey();
        this.initializeFoundation();
    }

    initializeFoundation() {
        // Initialize Foundation components
        $(document).foundation();
    }

    initializeElements() {
        this.elements = {
            // Form elements
            apiKey: document.getElementById('api-key'),
            prompt: document.getElementById('prompt'),
            width: document.getElementById('width'),
            height: document.getElementById('height'),
            steps: document.getElementById('steps'),
            stepsValue: document.getElementById('steps-value'),
            generateBtn: document.getElementById('generate-btn'),
            btnText: document.querySelector('.btn-text'),
            btnLoading: document.querySelector('.btn-loading'),
            
            // State elements
            placeholderState: document.getElementById('placeholder-state'),
            loadingState: document.getElementById('loading-state'),
            errorState: document.getElementById('error-state'),
            successState: document.getElementById('success-state'),
            
            // Result elements
            generatedImage: document.getElementById('generated-image'),
            downloadBtn: document.getElementById('download-btn'),
            copyUrlBtn: document.getElementById('copy-url-btn'),
            progressBar: document.getElementById('progress-bar'),
            errorMessage: document.getElementById('error-message'),
            
            // Details elements
            usedPrompt: document.getElementById('used-prompt'),
            usedDimensions: document.getElementById('used-dimensions'),
            usedSteps: document.getElementById('used-steps')
        };
    }

    bindEvents() {
        // Form submission
        document.getElementById('generation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateImage();
        });

        // API key input
        this.elements.apiKey.addEventListener('input', () => this.saveApiKey());

        // Steps slider
        this.elements.steps.addEventListener('input', (e) => {
            this.elements.stepsValue.textContent = e.target.value;
        });

        // Example prompts
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prompt = e.target.getAttribute('data-prompt');
                this.elements.prompt.value = prompt;
                this.elements.prompt.focus();
            });
        });

        // Action buttons
        this.elements.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.elements.copyUrlBtn.addEventListener('click', () => this.copyImageUrl());

        // Keyboard shortcuts
        this.elements.prompt.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.generateImage();
            }
        });
    }

    loadSavedApiKey() {
        const savedKey = localStorage.getItem('freeai_api_key');
        if (savedKey) {
            this.elements.apiKey.value = savedKey;
            this.apiKey = savedKey;
        }
    }

    saveApiKey() {
        this.apiKey = this.elements.apiKey.value.trim();
        if (this.apiKey) {
            localStorage.setItem('freeai_api_key', this.apiKey);
        }
    }

    async generateImage() {
        if (this.isGenerating) return;

        // Validate inputs
        if (!this.validateInputs()) return;

        // Get parameters
        const params = this.getGenerationParams();
        
        try {
            this.setGeneratingState(true);
            this.showLoadingState();
            
            const imageUrl = await this.callAPI(params);
            
            this.displayResult(imageUrl, params);
            this.showSuccessState();
            
        } catch (error) {
            console.error('Generation failed:', error);
            this.showErrorState(error.message);
        } finally {
            this.setGeneratingState(false);
        }
    }

    validateInputs() {
        if (!this.apiKey) {
            this.showErrorState('Please enter your Together.AI API key');
            this.elements.apiKey.focus();
            return false;
        }

        if (!this.elements.prompt.value.trim()) {
            this.showErrorState('Please enter a prompt describing the image you want to create');
            this.elements.prompt.focus();
            return false;
        }

        return true;
    }

    getGenerationParams() {
        return {
            prompt: this.elements.prompt.value.trim(),
            width: parseInt(this.elements.width.value),
            height: parseInt(this.elements.height.value),
            steps: parseInt(this.elements.steps.value)
        };
    }

    async callAPI(params) {
        const response = await fetch('https://api.together.xyz/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'black-forest-labs/FLUX.1-schnell-Free',
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
            throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.data || !data.data[0] || !data.data[0].url) {
            throw new Error('Invalid response from API');
        }

        return data.data[0].url;
    }

    setGeneratingState(isGenerating) {
        this.isGenerating = isGenerating;
        this.elements.generateBtn.disabled = isGenerating;
        
        if (isGenerating) {
            this.elements.btnText.style.display = 'none';
            this.elements.btnLoading.style.display = 'flex';
            this.startProgressAnimation();
        } else {
            this.elements.btnText.style.display = 'flex';
            this.elements.btnLoading.style.display = 'none';
            this.stopProgressAnimation();
        }
    }

    startProgressAnimation() {
        if (!this.elements.progressBar) return;
        
        let progress = 0;
        this.progressInterval = setInterval(() => {
            progress += Math.random() * 10 + 5;
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

    showPlaceholderState() {
        this.hideAllStates();
        this.elements.placeholderState.style.display = 'block';
    }

    showLoadingState() {
        this.hideAllStates();
        this.elements.loadingState.style.display = 'block';
    }

    showErrorState(message) {
        this.hideAllStates();
        this.elements.errorMessage.textContent = message;
        this.elements.errorState.style.display = 'block';
    }

    showSuccessState() {
        this.hideAllStates();
        this.elements.successState.style.display = 'block';
    }

    hideAllStates() {
        this.elements.placeholderState.style.display = 'none';
        this.elements.loadingState.style.display = 'none';
        this.elements.errorState.style.display = 'none';
        this.elements.successState.style.display = 'none';
    }

    displayResult(imageUrl, params) {
        this.currentImageUrl = imageUrl;
        
        // Set image
        this.elements.generatedImage.src = imageUrl;
        this.elements.generatedImage.alt = `Generated image: ${params.prompt}`;
        
        // Set details
        this.elements.usedPrompt.textContent = params.prompt;
        this.elements.usedDimensions.textContent = `${params.width} × ${params.height}`;
        this.elements.usedSteps.textContent = params.steps;
    }

    async downloadImage() {
        if (!this.currentImageUrl) return;

        try {
            const response = await fetch(this.currentImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `freeai-generated-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            window.URL.revokeObjectURL(url);
            
            this.showNotification('Image downloaded successfully!', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            this.showNotification('Failed to download image', 'error');
        }
    }

    async copyImageUrl() {
        if (!this.currentImageUrl) return;

        try {
            await navigator.clipboard.writeText(this.currentImageUrl);
            this.showNotification('Image URL copied to clipboard!', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('Failed to copy URL', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `callout ${type === 'success' ? 'success' : 'alert'}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    resetToPlaceholder() {
        this.showPlaceholderState();
        this.currentImageUrl = null;
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FreeAIGenerator();
});

// Global function for reset button
window.resetToPlaceholder = () => {
    if (window.app) {
        window.app.resetToPlaceholder();
    }
};