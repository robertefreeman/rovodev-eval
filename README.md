# Flux Image Generator

A simple web application that generates images using the Flux Schnell AI model via Together.AI's API. Built for deployment on Cloudflare Pages.

## 🎨 Features

- **Simple Interface**: Clean, user-friendly design
- **Flux Schnell Model**: Fast, high-quality image generation
- **Customizable Parameters**: Adjust dimensions, steps, and prompts
- **Download & Share**: Download generated images or copy URLs
- **Responsive Design**: Works on desktop and mobile
- **Local Storage**: Securely stores API key locally
- **No Backend Required**: Pure client-side application

## 🚀 Live Demo

[View Live App](https://flux-image-generator.pages.dev) - **Automated deployment active!** ✅

## 📋 Prerequisites

- A [Together.AI](https://together.ai) account and API key
- A [Cloudflare](https://cloudflare.com) account (for deployment)

## 🛠️ Setup Instructions

### 1. Get Together.AI API Key

1. Sign up at [Together.AI](https://together.ai)
2. Navigate to your API settings
3. Generate a new API key
4. Copy the key for use in the application

### 2. Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/robertefreeman/rovodev-eval.git
   cd rovodev-eval
   ```

2. Open `index.html` in your browser or serve it locally:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Or simply open index.html in your browser
   ```

3. Enter your Together.AI API key in the application
4. Start generating images!

### 3. Deploy to Cloudflare Pages

#### Option A: Automated Deployment (Recommended)

This repository includes GitHub Actions for automated deployment. Follow these steps:

##### 🔑 Required GitHub Secrets

You need to add **2 secrets** to your GitHub repository for automated deployment:

| Secret Name | Description | How to Get It |
|-------------|-------------|---------------|
| `CLOUDFLARE_API_TOKEN` | API token for Cloudflare authentication | [Create API Token](#creating-cloudflare-api-token) |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account identifier | [Find Account ID](#finding-cloudflare-account-id) |

##### 📋 Step-by-Step Setup

**Step 1: Find Your Cloudflare Account ID**
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. In the right sidebar, you'll see **Account ID**
3. Click the copy button next to it
4. Save this value - you'll need it for GitHub secrets

**Step 2: Create Cloudflare API Token**
1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Select **"Custom token"**
4. Configure the token:
   - **Token name**: `GitHub Actions Deployment`
   - **Permissions**:
     - `Cloudflare Pages:Edit`
     - `Account:Read`
   - **Account Resources**: Include your account
   - **Zone Resources**: Include all zones
5. Click **"Continue to summary"** → **"Create Token"**
6. **Copy the token immediately** - you won't see it again!

**Step 3: Add Secrets to GitHub**
1. Go to your GitHub repository: `https://github.com/robertefreeman/rovodev-eval`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add each secret:

   **First Secret:**
   ```
   Name: CLOUDFLARE_API_TOKEN
   Value: [Paste your API token from Step 2]
   ```

   **Second Secret:**
   ```
   Name: CLOUDFLARE_ACCOUNT_ID
   Value: [Paste your Account ID from Step 1]
   ```

   > ⚠️ **Important**: Copy the names exactly as shown above (case-sensitive)

**Step 4: Test Deployment**
1. Make any small change to your repository (e.g., edit this README)
2. Commit and push to the `main` branch
3. Go to **Actions** tab to watch the deployment
4. Your app will be live at: `https://flux-image-generator.pages.dev`

##### ✅ Verification

After setup, every push to `main` will:
- ✅ Automatically deploy to Cloudflare Pages
- ✅ Show deployment status in GitHub Actions
- ✅ Provide live URL in deployment summary
- ✅ Create preview deployments for pull requests

📖 **[Detailed Deployment Guide](DEPLOYMENT.md)** | 🔧 **[Troubleshooting](DEPLOYMENT.md#troubleshooting)**

#### Option B: Manual Deployment

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Pages** → **Create a project**
3. Connect your GitHub account and select this repository
4. Configure build settings:
   - **Build command**: Leave empty (static site)
   - **Build output directory**: `/` (root directory)
5. Click **Save and Deploy**

#### Option C: Direct Upload

1. Go to **Pages** → **Create a project** → **Direct Upload**
2. Upload the following files:
   - `index.html`
   - `style.css`
   - `script.js`
3. Click **Save and Deploy**

## 🎯 Usage

1. **Enter API Key**: Input your Together.AI API key (stored locally)
2. **Write Prompt**: Describe the image you want to generate
3. **Adjust Settings**: 
   - Choose image dimensions (512px to 1024px)
   - Set steps (1-4, higher = better quality but slower)
4. **Generate**: Click the generate button or press Ctrl+Enter
5. **Download/Share**: Save the image or copy its URL

## 🔧 Configuration

### Supported Parameters

- **Model**: `black-forest-labs/FLUX.1-schnell` (fixed)
- **Dimensions**: 512×512, 768×768, 1024×1024, and custom combinations
- **Steps**: 1-4 (Flux Schnell is optimized for 1-4 steps)
- **Format**: URL response format

### API Limits

- Free tier: Check Together.AI pricing for current limits
- Rate limiting: Handled automatically by the API

## 🔒 Security & Privacy

- **API Key Storage**: Stored locally in browser's localStorage
- **No Server**: All processing happens client-side
- **HTTPS**: Secure communication with Together.AI API
- **No Data Collection**: No user data is collected or stored

## 🎨 Customization

### Styling
Edit `style.css` to customize the appearance:
- Colors and gradients
- Layout and spacing
- Responsive breakpoints

### Functionality
Modify `script.js` to add features:
- Additional model parameters
- Image editing capabilities
- Batch generation

## 📱 Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid API Key"**
   - Verify your Together.AI API key is correct
   - Check if your account has sufficient credits

2. **"Network Error"**
   - Check your internet connection
   - Verify Together.AI service status

3. **"Image Failed to Load"**
   - The generated image URL may have expired
   - Try generating a new image

4. **CORS Errors**
   - Make sure you're accessing the app via HTTPS
   - Local file:// protocol may cause issues

### Getting Help

- Check [Together.AI Documentation](https://docs.together.ai)
- Open an issue on this repository
- Contact Together.AI support for API-related issues

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- [Together.AI](https://together.ai) for providing the API
- [Black Forest Labs](https://blackforestlabs.ai) for the Flux model
- [Cloudflare Pages](https://pages.cloudflare.com) for free hosting

## 🔧 Quick Reference

### GitHub Secrets Required for Deployment

| Secret Name | Where to Find It | Purpose |
|-------------|------------------|---------|
| `CLOUDFLARE_API_TOKEN` | [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) | Authenticate with Cloudflare API |
| `CLOUDFLARE_ACCOUNT_ID` | [Cloudflare Dashboard](https://dash.cloudflare.com) (right sidebar) | Identify your Cloudflare account |

### Important URLs

- **Live App**: `https://flux-image-generator.pages.dev`
- **GitHub Actions**: `https://github.com/robertefreeman/rovodev-eval/actions`
- **Cloudflare Dashboard**: `https://dash.cloudflare.com/pages`
- **Together.AI API**: `https://api.together.xyz/playground`

### API Token Permissions Required

When creating your Cloudflare API token, ensure it has:
- ✅ `Cloudflare Pages:Edit`
- ✅ `Account:Read`
- ✅ Access to your account resources

---

**Note**: This application requires a Together.AI API key. API usage may incur costs based on Together.AI's pricing structure.
