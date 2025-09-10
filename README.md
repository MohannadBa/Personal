# Personal Website

A responsive, modern personal website for software engineering students and tech enthusiasts. Features a dark theme with a centered card design, smooth animations, and social media integration.

## Features

- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🎯 **Centered Card Layout**: Clean, focused design with rounded corners
- ✨ **Smooth Animations**: Hover effects and transitions for better UX
- 🔗 **Social Media Integration**: Dynamic social links with platform icons
- 📝 **JSON Configuration**: Easy to customize via `info.json` file
- 🖼️ **Profile Image Support**: Custom avatar with fallback placeholder

## Customization

### Profile Information

Edit the `info.json` file to update your profile:

```json
{
  "profile": {
    "name": "Your Name",
    "location": "Your Location",
    "bio": "Your bio description",
    "avatar": "your-photo.jpg"
  }
}
```

### Social Media Links

Add or modify your social media links in the `socialLinks` array:

```json
{
  "socialLinks": [
    {
      "label": "GitHub",
      "url": "https://github.com/yourusername"
    },
    {
      "label": "LinkedIn",
      "url": "https://linkedin.com/in/yourusername"
    }
  ]
}
```

### Supported Social Platforms

The website automatically adds icons for these platforms:
- GitHub 🐙
- LinkedIn 💼
- Twitter 🐦
- Instagram 📷
- Frontend Mentor 🎯
- YouTube 📺
- Facebook 📘
- Discord 💬

### Theme Customization

You can customize the theme colors by editing the CSS variables in `styles.css`:

```css
:root {
  --background-color: #141414;
  --card-background: #1f1f1f;
  --text-color: #ffffff;
  --accent-color: #c4f82a;
  --button-color: #333333;
}
```

## File Structure

```
MyWebsite/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript for dynamic content
├── info.json           # Profile configuration
└── README.md           # This file
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Features in Detail

### Responsive Design
- Mobile-first approach
- Breakpoints at 480px and 360px
- Flexible card sizing
- Optimized typography scaling

### Animations
- Smooth hover effects on buttons
- Card lift animation on hover
- Avatar scale effect
- Loading pulse animation

### Accessibility
- Semantic HTML structure
- Proper alt text for images
- Keyboard navigation support
- High contrast color scheme

## Deployment

You can deploy this website to any static hosting service:

- **GitHub Pages**: Push to a GitHub repository and enable Pages
- **Vercel**: Connect your GitHub repository

## Local Development

To run the website locally:

1. Clone or download the files
2. Open `index.html` in your browser


## Customization Tips

1. **Profile Image**: Replace the placeholder with your actual photo
2. **Colors**: Modify the CSS variables to match your brand
3. **Fonts**: Change the font family in the CSS
4. **Layout**: Adjust padding and margins for different screen sizes
5. **Animations**: Modify transition durations and effects

Made with ❤️
