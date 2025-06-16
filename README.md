# FreeAI Studio

A modern, professional web application for generating AI images using the Together.AI API with dual FLUX model support.

## ✨ Features

### 🎨 **AI Image Generation**
- Generate high-quality AI images from text prompts
- **Dual Model Support**: Toggle between FLUX.1-schnell (Cheap) and FLUX.1-schnell-Free (Free)
- Customizable image dimensions (512px, 768px, 1024px)
- Adjustable generation steps (1-4 steps)
- Real-time progress tracking with animated progress bars

### 🖼️ **Image Management**
- Download generated images in high quality
- Copy image URLs to clipboard
- **Local Gallery System**: Automatically saves last 50 generated images
- Modal image viewer for full-size viewing
- Image metadata tracking (prompt, dimensions, model used)

### 🎯 **User Experience**
- **Foundation CSS Framework**: Professional, responsive design
- **Monochrome Green Theme**: Soft, muted color palette
- **Side-by-side Layout**: Control panel (45%) + Result panel (50%) on desktop
- **Mobile Responsive**: Stacked layout on screens < 800px
- **Smart Navigation**: Multi-section app (Generator, Gallery, Settings)
- **Example Prompts**: Quick-start buttons for inspiration

### 🔧 **Technical Features**
- Local storage of API key for convenience (never sent to our servers)
- **Smart Deployment**: Conditional Cloudflare Pages project creation
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Accessibility**: Proper ARIA labels and semantic HTML

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/robertefreeman/rovodev-eval.git
   cd rovodev-eval
   ```

2. **Open in browser**
   - Open `index.html` in your web browser
   - Or deploy to any static hosting service

3. **Get API Key**
   - Sign up at [Together.AI](https://together.ai)
   - Get your API key from the dashboard

4. **Start Creating**
   - Enter your Together.AI API key
   - Choose your model (Free or Cheap)
   - Write a prompt and generate!

## 🎛️ Model Options

| Model | Label | Cost | Speed | Quality |
|-------|-------|------|-------|---------|
| `FLUX.1-schnell` | Cheap | Paid | Fast | High |
| `FLUX.1-schnell-Free` | Free | Free | Fast | High |

Toggle between models using the switch in the control panel.

## 🏗️ Technologies Used

### **Frontend**
- **HTML5**: Semantic markup with accessibility features
- **Foundation CSS 6.8.1**: Professional responsive framework
- **Vanilla JavaScript ES6+**: Modern JavaScript without dependencies
- **CSS Grid & Flexbox**: Advanced layout systems
- **CSS Custom Properties**: Consistent theming system

### **Backend/API**
- **Together.AI API**: AI model hosting and inference
- **FLUX Models**: State-of-the-art image generation

### **Deployment**
- **Cloudflare Pages**: Static site hosting with global CDN
- **GitHub Actions**: Automated CI/CD pipeline
- **Wrangler CLI**: Cloudflare deployment tooling

## 🌐 Deployment

### **Automatic Deployment**
This project uses GitHub Actions for automatic deployment to Cloudflare Pages:

1. **Push to main branch** triggers deployment
2. **Smart project handling**: Creates project if needed, updates if exists
3. **Live at**: https://freeai-app-2024.pages.dev

### **Manual Deployment**
```bash
# Install Wrangler CLI
npm install -g wrangler

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=freeai-app-2024
```

## 🔒 Privacy & Security

- **API keys stored locally**: Never transmitted to our servers
- **No user tracking**: No analytics or user data collection
- **Client-side only**: All processing happens in your browser
- **Secure transmission**: All API calls use HTTPS

## 🎨 Design System

### **Color Palette**
- **Primary**: `#7a8a7a` (Muted gray-green)
- **Secondary**: `#f5f7f5` (Pale green background)
- **Success**: `#6b7b6b` (Darker green accents)
- **Background**: Soft green gradient

### **Layout**
- **Desktop**: Side-by-side layout with flexible widths
- **Mobile**: Stacked layout with full-width cards
- **Spacing**: Generous margins and padding throughout
- **Typography**: Inter font family for modern readability

## 📱 Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive enhancement**: Basic functionality without JavaScript

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://freegen.r0b.cc](https://freegen.r0b.cc)
- **GitHub**: [https://github.com/robertefreeman/rovodev-eval](https://github.com/robertefreeman/rovodev-eval)
- **Together.AI**: [https://together.ai](https://together.ai)

---

**Made with ❤️ by Free** | Powered by Together.AI and FLUX