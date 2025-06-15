# 🚀 Automated Deployment Setup

This guide will help you set up automated deployment to Cloudflare Pages using GitHub Actions.

## 📋 Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository**: This repository with the workflow file
3. **Cloudflare API Token**: For authentication

## 🔧 Setup Instructions

### Step 1: Get Cloudflare Account ID

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. In the right sidebar, copy your **Account ID**
3. Save this for later - you'll need it for GitHub secrets

### Step 2: Create Cloudflare API Token

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Use **"Custom token"** template
4. Configure the token:
   - **Token name**: `GitHub Actions - Flux App`
   - **Permissions**:
     - `Cloudflare Pages:Edit`
     - `Account:Read`
     - `Zone:Read` (if using custom domain)
   - **Account Resources**: Include your account
   - **Zone Resources**: Include all zones (or specific zone if using custom domain)
5. Click **"Continue to summary"** → **"Create Token"**
6. **Copy the token** - you won't see it again!

### Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add:

   **Secret 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: The API token you just created

   **Secret 2:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: Your Cloudflare Account ID from Step 1

### Step 4: Configure Project Name (Optional)

The workflow uses `flux-image-generator` as the project name. To change it:

1. Edit `.github/workflows/deploy.yml`
2. Change the `PROJECT_NAME` environment variable:
   ```yaml
   env:
     PROJECT_NAME: your-custom-name
   ```

## 🎯 How It Works

### Automatic Deployment Triggers

The workflow automatically deploys when:
- ✅ **Push to main branch** - Production deployment
- ✅ **Pull request to main** - Preview deployment

### Deployment Process

1. **Checkout Code**: Downloads repository files
2. **Validate Files**: Ensures HTML files exist and are valid
3. **Deploy to Cloudflare**: Uses Wrangler to deploy to Pages
4. **Summary**: Shows deployment details in GitHub Actions

### Deployment URLs

- **Production**: `https://flux-image-generator.pages.dev`
- **Preview**: `https://[commit-hash].flux-image-generator.pages.dev`

## 🔍 Monitoring Deployments

### GitHub Actions

1. Go to **Actions** tab in your repository
2. Click on any workflow run to see details
3. Check the deployment summary for the live URL

### Cloudflare Dashboard

1. Go to **Pages** in Cloudflare Dashboard
2. Click on your project (`flux-image-generator`)
3. View deployment history and logs

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid API Token"**
   - Verify the token has correct permissions
   - Check if token has expired
   - Ensure Account ID is correct

2. **"Project not found"**
   - The project will be created automatically on first deployment
   - Ensure project name doesn't conflict with existing projects

3. **"Permission denied"**
   - Check API token permissions include `Cloudflare Pages:Edit`
   - Verify Account ID matches the token's account

4. **"HTML validation failed"**
   - Ensure `index.html` exists and is not empty
   - Check for syntax errors in HTML files

### Getting Help

- **GitHub Actions Logs**: Check the Actions tab for detailed error messages
- **Cloudflare Support**: [Cloudflare Community](https://community.cloudflare.com/)
- **Wrangler Docs**: [Cloudflare Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)

## 🔒 Security Best Practices

1. **API Token Scope**: Use minimal required permissions
2. **Token Rotation**: Regularly rotate API tokens
3. **Secret Management**: Never commit secrets to repository
4. **Access Control**: Limit who can modify GitHub secrets

## 🎉 Success!

Once configured, every push to main will automatically:
1. Deploy your app to Cloudflare Pages
2. Provide a live URL
3. Show deployment status in GitHub

Your Flux Image Generator will be live at:
**https://flux-image-generator.pages.dev**

---

## 📝 Quick Reference

### Required GitHub Secrets
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Workflow File
- `.github/workflows/deploy.yml`

### Project Name
- Default: `flux-image-generator`
- Customizable in workflow file

### Deployment URL
- `https://[PROJECT_NAME].pages.dev`