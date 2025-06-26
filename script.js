// Background Animation
class BackgroundAnimation {
    constructor() {
        this.canvas = document.getElementById('backgroundCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.dots = [];
        this.mouse = { x: 0, y: 0 };
        this.maxDistance = 150;
        this.dotCount = 50;
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createDots();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createDots() {
        this.dots = [];
        for (let i = 0; i < this.dotCount; i++) {
            this.dots.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -100;
            this.mouse.y = -100;
        });
    }
    
    updateDots() {
        this.dots.forEach(dot => {
            // Update position
            dot.x += dot.vx;
            dot.y += dot.vy;
            
            // Bounce off edges
            if (dot.x <= 0 || dot.x >= this.canvas.width) dot.vx *= -1;
            if (dot.y <= 0 || dot.y >= this.canvas.height) dot.vy *= -1;
            
            // Keep dots within bounds
            dot.x = Math.max(0, Math.min(this.canvas.width, dot.x));
            dot.y = Math.max(0, Math.min(this.canvas.height, dot.y));
            
            // React to mouse
            const dx = this.mouse.x - dot.x;
            const dy = this.mouse.y - dot.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.maxDistance) {
                const force = (this.maxDistance - distance) / this.maxDistance;
                dot.x -= dx * force * 0.02;
                dot.y -= dy * force * 0.02;
                dot.opacity = Math.min(1, dot.opacity + force * 0.1);
            } else {
                dot.opacity = Math.max(0.3, dot.opacity - 0.01);
            }
        });
    }
    
    drawDots() {
        this.dots.forEach(dot => {
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(59, 130, 246, ${dot.opacity})`;
            this.ctx.fill();
        });
    }
    
    drawLines() {
        this.dots.forEach((dot1, i) => {
            this.dots.slice(i + 1).forEach(dot2 => {
                const dx = dot1.x - dot2.x;
                const dy = dot1.y - dot2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.maxDistance) {
                    const opacity = (this.maxDistance - distance) / this.maxDistance * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(dot1.x, dot1.y);
                    this.ctx.lineTo(dot2.x, dot2.y);
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateDots();
        this.drawLines();
        this.drawDots();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize background animation
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundAnimation();
});

// Load profile data from info.json
async function loadProfileData() {
    try {
        const response = await fetch('info.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        populateProfile(data);
    } catch (error) {
        console.error('Error loading profile data:', error);
        showError();
    }
}

// Populate the profile with data
function populateProfile(data) {
    const { personalInfo, technicalSkills, recentProjects, links, stylingPreferences } = data;
    
    // Update page title
    document.getElementById('pageTitle').textContent = `${personalInfo.name} - ${personalInfo.title}`;
    
    // Update profile information
    document.getElementById('name').textContent = personalInfo.name;
    document.getElementById('title').textContent = personalInfo.title;
    document.getElementById('location').textContent = personalInfo.location;
    document.getElementById('aboutMe').innerHTML = personalInfo.aboutMe.replace(/\n/g, '<br>');
    
    // Update contact information
    const emailLink = document.getElementById('email');
    emailLink.href = `mailto:${personalInfo.email}`;
    emailLink.textContent = personalInfo.email;
    
    const phoneLink = document.getElementById('phone');
    phoneLink.href = `tel:${personalInfo.phone}`;
    phoneLink.textContent = personalInfo.phone;
    
    // Update avatar with custom image
    document.getElementById('avatar').src = 'my.jpg';
    
    // Populate skills
    populateSkills(technicalSkills);
    
    // Populate projects
    populateProjects(recentProjects);
    
    // Populate social links
    populateSocialLinks(links);
    
    // Remove loading states
    removeLoadingStates();
}

// Get initials from name
function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
}

// Skill logos mapping (inline SVGs)
const skillLogos = {
    'HTML': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#E44D26" d="M27.854 116.354l-8.043-90.211h88.378l-8.051 90.197-36.192 10.033z"></path>
        <path fill="#F16529" d="M64 118.704l29.244-8.108 6.881-77.076H64z"></path>
        <path fill="#EBEBEB" d="M64 66.978H49.359l-1.01-11.331H64V44.583H36.257l.264 2.969 2.72 30.489H64zm0 28.733l-.049.013-12.321-3.328-.788-8.823H39.735l1.55 17.372 22.664 6.292.051-.015z"></path>
        <path d="M28.034 1.627h5.622v5.556H38.8V1.627h5.623v16.822H38.8v-5.633h-5.143v5.633h-5.623V1.627zm23.782 5.579h-4.95V1.627h15.525v5.579h-4.952v11.243h-5.623V7.206zm13.039-5.579h5.862l3.607 5.911 3.603-5.911h5.865v16.822h-5.601v-8.338l-3.867 5.981h-.098l-3.87-5.981v8.338h-5.502V1.627zm21.736 0h5.624v11.262h7.907v5.561H86.591V1.627z"></path>
        <path fill="#fff" d="M63.962 66.978v11.063h13.624L76.302 92.39l-12.34 3.331v11.51l22.682-6.286.166-1.87 2.6-29.127.27-2.97h-2.982zm0-22.395v11.064h26.725l.221-2.487.505-5.608.265-2.969z"></path>
    </svg>`,
    
    'CSS': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#1572B6" d="M18.814 114.123L8.76 1.352h110.48l-10.064 112.754-45.243 12.543z"></path>
        <path fill="#33A9DC" d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16z"></path>
        <path fill="#fff" d="M64.001 51.429h18.302l1.264-14.163H64.001V23.435h34.682l-.332 3.711-3.4 38.114h-30.95V51.429z"></path>
        <path fill="#EBEBEB" d="M64.083 87.349l-.061.018-15.403-4.159-.985-11.031H33.752l1.937 21.717 28.33 7.863.064-.018z"></path>
        <path fill="#fff" d="M81.127 64.675l-1.798 20.04-15.426 4.164v11.391l28.33-7.863.168-1.88 1.937-21.717H81.127z"></path>
        <path fill="#EBEBEB" d="M64.001 23.435v13.831H49.336l-.276-3.092-.598-6.712-.331-3.711h15.64zM64.001 51.431v13.831H50.42l-.276-3.092-.598-6.712-.332-3.711h14.187z"></path>
    </svg>`,
    
    'JavaScript': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185H1.408z"></path>
        <path fill="#323330" d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z"></path>
    </svg>`,
    'JavaFX': `<svg viewBox="0 0 128 128" class="skill-svg">
    <path fill="#0074BD" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"></path>
    <path fill="#EA2D2E" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"></path>
    <path fill="#0074BD" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"></path>
    <path fill="#EA2D2E" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"></path>
    <path fill="#0074BD" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"></path>
    </svg>`,
    
    'Java': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#0074BD" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"></path>
        <path fill="#EA2D2E" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"></path>
        <path fill="#0074BD" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"></path>
        <path fill="#EA2D2E" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"></path>
        <path fill="#0074BD" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"></path>
    </svg>`,
    
    'C++': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#00599c" d="M118.766 95.82c.89-1.543 1.441-3.28 1.441-4.843V36.78c0-1.558-.55-3.297-1.441-4.84l-55.32 31.94Zm0 0"></path>
        <path fill="#004482" d="m68.36 126.586 46.933-27.094c1.352-.781 2.582-2.129 3.473-3.672l-55.32-31.94L8.12 95.82c.89 1.543 2.121 2.89 3.473 3.672l46.933 27.094c2.703 1.562 7.13 1.562 9.832 0Zm0 0"></path>
        <path fill="#659ad2" d="M118.766 31.941c-.891-1.546-2.121-2.894-3.473-3.671L68.359 1.172c-2.703-1.563-7.129-1.563-9.832 0L11.594 28.27C8.89 29.828 6.68 33.66 6.68 36.78v54.196c0 1.562.55 3.3 1.441 4.843L63.445 63.88Zm0 0"></path>
        <path fill="#fff" d="M63.445 26.035c-20.867 0-37.843 16.977-37.843 37.844s16.976 37.844 37.843 37.844c13.465 0 26.024-7.247 32.77-18.91L79.84 73.335c-3.38 5.84-9.66 9.465-16.395 9.465-10.433 0-18.922-8.488-18.922-18.922 0-10.434 8.49-18.922 18.922-18.922 6.73 0 13.017 3.629 16.39 9.465l16.38-9.477c-6.75-11.664-19.305-18.91-32.77-18.91zM92.88 57.57v4.207h-4.207v4.203h4.207v4.207h4.203V65.98h4.203v-4.203h-4.203V57.57H92.88zm15.766 0v4.207h-4.204v4.203h4.204v4.207h4.207V65.98h4.203v-4.203h-4.203V57.57h-4.207z"></path>
    </svg>`,
    
    'C#': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#9B4F96" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"></path><path fill="#68217A" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"></path><path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM97 66.2l.9-4.3h-4.2v-4.7h5.1L100 51h4.9l-1.2 6.1h3.8l1.2-6.1h4.8l-1.2 6.1h2.4v4.7h-3.3l-.9 4.3h4.2v4.7h-5.1l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6h-2.4v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8l-.9 4.3z"></path>
    </svg>`,
    
    'Dart': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#00c4b3" d="M35.2 34.9l-8.3-8.3v59.7l.1 2.8c0 1.3.2 2.8.7 4.3l65.6 23.1 16.3-7.2-74.4-74.4z"></path>
        <path d="M27.7 93.4zm81.9 15.9l-16.3 7.2-65.4-23.1c1.3 4.8 4 10.1 7 13.2l21.3 21.2 47.6.1 5.8-18.6z" fill="#22d3c5"></path>
        <path fill="#0075c9" d="M1.7 65.1C-.4 67.3.7 72 4 75.5l14.7 14.8 9.2 3.3c-.3-1.5-.7-3-.7-4.3l-.1-2.8-.2-59.8m82.7 82.6l7.2-16.4-23-65.6c-1.5-.3-3-.6-4.3-.7l-2.9-.1-59.6.1"></path>
        <path d="M93.6 27.3c.2 0 .2 0 0 0zm16 82l17.7-5.8V54.8l-20.4-20.5c-3-3-8.3-5.8-13.2-7l23.1 65.6" fill="#00a8e1"></path>
        <path fill="#00c4b3" d="M90.5 18.2L75.7 3.5c-3.4-3.4-8-4.4-10.4-2.3L26.9 26.6h59.5l2.9.1c1.3 0 2.8.2 4.3.7l-3.1-9.2z"></path>
    </svg>`,
    
    'SQL': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#d1d1d1" d="M51.395 24.879c-27.422 0-49.649-3.832-49.649-8.535v92.261c0 4.727 22.227 8.536 49.649 8.536 27.421 0 49.648-3.832 49.648-8.536V16.29c0 4.758-22.227 8.59-49.648 8.59Zm0 0"></path>
        <path fill="#adadad" d="M1.746 16.29v92.315c0 4.727 22.227 8.536 49.649 8.536V24.879c-27.422 0-49.649-3.832-49.649-8.59Zm92.317 4.405v92.262c4.425-1.277 6.98-2.777 6.98-4.375V16.289c0 1.633-2.547 3.106-6.98 4.406Zm0 0"></path>
        <path fill="#939699" d="M101.043 16.313c0-4.723-22.23-8.555-49.648-8.555-27.422 0-49.649 3.832-49.649 8.555 0 4.726 22.227 8.558 49.649 8.558 27.417 0 49.648-3.832 49.648-8.558ZM1.746 74.332c0 4.727 22.227 8.535 49.649 8.535 27.421 0 49.648-3.832 49.648-8.535v6.984c0 4.723-22.227 8.532-49.648 8.532-27.422 0-49.649-3.832-49.649-8.532Zm0-30.75c0 4.723 22.227 8.535 49.649 8.535 27.421 0 49.648-3.836 49.648-8.535v6.98c0 4.727-22.227 8.536-49.648 8.536-27.422 0-49.649-3.832-49.649-8.535Zm0 0"></path>
        <path fill="#ecedf0" d="M126.64 93.09c0 16.281-13.195 29.48-29.476 29.48s-29.48-13.199-29.48-29.48 13.199-29.477 29.48-29.477 29.477 13.196 29.477 29.477Zm0 0"></path>
        <path fill="#3faa00" d="M123.004 93.09c0 14.273-11.57 25.84-25.84 25.84-14.273 0-25.84-11.567-25.84-25.84 0-14.27 11.567-25.84 25.84-25.84 14.27 0 25.84 11.57 25.84 25.84Zm0 0"></path>
        <path fill="#fff" d="m88.063 105.906 24.027-13.87-24.028-13.872Zm0 0"></path>
    </svg>`,
    
    'SQL Server': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#d1d1d1" d="M51.395 24.879c-27.422 0-49.649-3.832-49.649-8.535v92.261c0 4.727 22.227 8.536 49.649 8.536 27.421 0 49.648-3.832 49.648-8.536V16.29c0 4.758-22.227 8.59-49.648 8.59Zm0 0"></path>
        <path fill="#adadad" d="M1.746 16.29v92.315c0 4.727 22.227 8.536 49.649 8.536V24.879c-27.422 0-49.649-3.832-49.649-8.59Zm92.317 4.405v92.262c4.425-1.277 6.98-2.777 6.98-4.375V16.289c0 1.633-2.547 3.106-6.98 4.406Zm0 0"></path>
        <path fill="#939699" d="M101.043 16.313c0-4.723-22.23-8.555-49.648-8.555-27.422 0-49.649 3.832-49.649 8.555 0 4.726 22.227 8.558 49.649 8.558 27.417 0 49.648-3.832 49.648-8.558ZM1.746 74.332c0 4.727 22.227 8.535 49.649 8.535 27.421 0 49.648-3.832 49.648-8.535v6.984c0 4.723-22.227 8.532-49.648 8.532-27.422 0-49.649-3.832-49.649-8.532Zm0-30.75c0 4.723 22.227 8.535 49.649 8.535 27.421 0 49.648-3.836 49.648-8.535v6.98c0 4.727-22.227 8.536-49.648 8.536-27.422 0-49.649-3.832-49.649-8.535Zm0 0"></path>
        <path fill="#ecedf0" d="M126.64 93.09c0 16.281-13.195 29.48-29.476 29.48s-29.48-13.199-29.48-29.48 13.199-29.477 29.48-29.477 29.477 13.196 29.477 29.477Zm0 0"></path>
        <path fill="#3faa00" d="M123.004 93.09c0 14.273-11.57 25.84-25.84 25.84-14.273 0-25.84-11.567-25.84-25.84 0-14.27 11.567-25.84 25.84-25.84 14.27 0 25.84 11.57 25.84 25.84Zm0 0"></path>
        <path fill="#fff" d="m88.063 105.906 24.027-13.87-24.028-13.872Zm0 0"></path>
    </svg>`,
    
    'Flutter': `<svg viewBox="0 0 128 128" class="skill-svg">
        <g fill="#3FB6D3">
            <path d="M12.3 64.2L76.3 0h39.4L32.1 83.6zM76.3 128h39.4L81.6 93.9l34.1-34.8H76.3L42.2 93.5z"></path>
        </g>
        <path fill="#27AACD" d="M81.6 93.9l-20-20-19.4 19.6 19.4 19.6z"></path>
        <path fill="#19599A" d="M115.7 128L81.6 93.9l-20 19.2L76.3 128z"></path>
        <linearGradient id="flutter-original-a" gradientUnits="userSpaceOnUse" x1="59.365" y1="116.36" x2="86.825" y2="99.399">
            <stop offset="0" stop-color="#1b4e94"></stop>
            <stop offset=".63" stop-color="#1a5497"></stop>
            <stop offset="1" stop-color="#195a9b"></stop>
        </linearGradient>
        <path fill="url(#flutter-original-a)" d="M61.6 113.1l30.8-8.4-10.8-10.8z"></path>
    </svg>`,
    
    'ASP.NET': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#623697" d="M61.195 0h4.953c12.918.535 25.688 4.89 36.043 12.676 9.809 7.289 17.473 17.437 21.727 28.906 2.441 6.387 3.664 13.18 4.082 19.992v4.211c-.414 11.293-3.664 22.52-9.73 32.082-6.801 10.895-16.922 19.73-28.727 24.828A64.399 64.399 0 0165.082 128h-2.144c-11.735-.191-23.41-3.66-33.297-9.992-11.196-7.113-20.114-17.785-25.028-30.117C1.891 81.19.441 74.02 0 66.812v-4.957c.504-14.39 5.953-28.609 15.41-39.496C23.168 13.31 33.5 6.48 44.887 2.937 50.172 1.27 55.676.41 61.195 0M25.191 37.523c-.03 12.153-.011 24.305-.011 36.454 1.43.011 2.86.011 4.293.011-.075-10.433.101-20.863-.106-31.293.48.907.918 1.84 1.465 2.707C37.035 54.91 43.105 64.5 49.309 74c1.738-.023 3.476-.023 5.214.004-.003-12.16-.007-24.32.004-36.48a308.076 308.076 0 00-4.25-.012c.075 10.32-.136 20.64.125 30.949-6.507-10.352-13.101-20.645-19.695-30.945a370.85 370.85 0 00-5.516.007m38.844-.011c-.129 12.16-.004 24.32-.047 36.476 6.469-.015 12.938.024 19.41-.02a83.36 83.36 0 01.024-3.952c-5.012-.016-10.027.007-15.043-.02-.074-4.21-.004-8.426-.04-12.637 4.395-.078 8.79.012 13.18-.047-.011-1.277-.011-2.554-.019-3.832-4.387.141-8.773-.054-13.164.012.012-4.023.02-8.05.02-12.078 4.699 0 9.398-.02 14.093.012-.008-1.301 0-2.606.016-3.906-6.145-.016-12.29-.008-18.43-.008m22.602.054c.004 1.266.004 2.528.008 3.79 3.488-.04 6.972.109 10.46.035-.023 10.863.004 21.718-.011 32.574 1.46.043 2.93.035 4.39-.09-.12-5.992.118-11.988-.156-17.977.067-2.699-.07-5.394.117-8.09.106-2.14-.277-4.277-.035-6.417 3.516.047 7.035.015 10.55.015a59.774 59.774 0 01.075-3.832c-8.469-.105-16.937-.094-25.398-.008M13.55 69.094c-1.977.91-2.106 4.023-.149 5.027 1.72 1.18 4.305-.371 4.227-2.41.133-2.004-2.29-3.688-4.078-2.617m29.23 15.289c-4.277 3.469-4.226 11.195.5 14.25 2.668 1.695 6.102 1.344 8.922.215.012-.621.027-1.239.05-1.86-2.671 1.395-6.41 1.68-8.675-.61-2.965-3.237-2.297-9.269 1.613-11.476 2.211-1.164 4.907-.824 7.086.239-.007-.66-.004-1.32 0-1.98-3.097-1.099-6.922-1.04-9.496 1.222m17.207 2.71c-1.89.22-3.758 1.22-4.633 2.966-1.253 2.496-1.109 5.867.864 7.96 2.035 2.297 5.945 2.32 8.18.297 2.425-2.308 2.699-6.468.757-9.164-1.148-1.629-3.273-2.183-5.168-2.058m17.887 2.722c-1.66 2.883-1.332 7.25 1.598 9.211 2.183 1.22 4.933.832 7.074-.308-.004-.617.004-1.235.031-1.848-1.687 1.07-3.937 1.856-5.812.777-1.309-.722-1.704-2.257-1.914-3.625 2.875-.039 5.746-.082 8.625-.074-.075-1.828-.118-3.894-1.45-5.308-2.199-2.43-6.644-1.657-8.152 1.175m-8.414-2.336v12.008c.652 0 1.312 0 1.973.004.023-2.195-.04-4.394.023-6.594.016-1.27.527-2.558 1.484-3.414.801-.605 1.883-.27 2.801-.246-.012-.636-.02-1.27-.023-1.902-1.793-.398-3.336.652-4.242 2.117-.02-.633-.04-1.266-.051-1.894-.656-.024-1.313-.051-1.965-.079zm0 0"></path>
        <path d="M58.758 89.223c1.652-.805 4.023-.41 4.945 1.3 1.05 1.887 1.027 4.383-.137 6.211-1.52 2.286-5.527 1.786-6.523-.742-1.008-2.258-.617-5.484 1.715-6.77zm0 0M79.04 92.414c.046-1.574 1.144-3.137 2.726-3.48.976-.164 2.097.007 2.773.793.672.714.813 1.714.98 2.64-2.16.012-4.32-.031-6.48.047zm0 0"></path>
    </svg>`,
    
    'Git': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#F34F29" d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00-.001-11.501z"></path>
    </svg>`,
    
    'GitHub': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#181616" d="M64 0C28.7 0 0 28.7 0 64c0 28.3 18.3 52.3 43.8 60.8 3.2.6 4.4-1.4 4.4-3.1 0-1.5 0-6.5-.1-11.2-17.8 3.9-21.5-8.6-21.5-8.6-2.9-7.4-7.1-9.4-7.1-9.4-5.8-4 .4-3.9.4-3.9 6.4.4 9.8 6.6 9.8 6.6 5.7 9.8 15 7 18.6 5.3.6-4.1 2.2-7 4-8.6-14-1.6-28.7-7-28.7-31.1 0-6.9 2.5-12.5 6.6-16.9-.7-1.6-2.9-8 .6-16.7 0 0 5.4-1.7 17.6 6.5 5.1-1.4 10.6-2.1 16.1-2.1s11 .7 16.1 2.1c12.2-8.2 17.6-6.5 17.6-6.5 3.5 8.6 1.3 15.1.6 16.7 4.1 4.4 6.6 10 6.6 16.9 0 24.1-14.7 29.5-28.7 31.1 2.3 2 4.3 5.8 4.3 11.7 0 8.6-.1 15.5-.1 17.6 0 1.7 1.1 3.7 4.4 3.1C109.7 116.3 128 92.3 128 64c0-35.3-28.7-64-64-64z"></path>
    </svg>`,
    
    'Firebase': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#ffa000" d="M17.474 103.276 33.229 2.462a2.91 2.91 0 0 1 5.44-.924l16.294 30.39 6.494-12.366a2.91 2.91 0 0 1 5.15 0l43.97 83.714H17.474Z"></path>
        <path fill="#f57c00" d="M71.903 64.005 54.955 31.913l-37.481 71.363Z"></path>
        <path fill="#ffca28" d="M110.577 103.276 98.51 28.604a2.913 2.913 0 0 0-1.984-2.286 2.906 2.906 0 0 0-2.94.714l-76.112 76.243 42.115 23.618a8.728 8.728 0 0 0 8.51 0l42.478-23.618Z"></path>
        <path fill="#fff" fill-opacity=".2" d="M98.51 28.604a2.913 2.913 0 0 0-1.984-2.286 2.906 2.906 0 0 0-2.94.713L78.479 42.178 66.6 19.562a2.91 2.91 0 0 0-5.15 0l-6.494 12.365L38.662 1.538A2.91 2.91 0 0 0 35.605.044a2.907 2.907 0 0 0-2.384 2.425L17.474 103.276h-.051l.05.058.415.204 75.676-75.764a2.91 2.91 0 0 1 4.932 1.571l11.965 74.003.116-.073L98.51 28.603Zm-80.898 74.534L33.228 3.182A2.91 2.91 0 0 1 35.613.756a2.911 2.911 0 0 1 3.057 1.495l16.292 30.39 6.495-12.366a2.91 2.91 0 0 1 5.15 0L78.245 42.41 17.61 103.138Z"></path>
        <path fill="#a52714" d="M68.099 126.18a8.728 8.728 0 0 1-8.51 0l-42.015-23.55-.102.647 42.115 23.61a8.728 8.728 0 0 0 8.51 0l42.48-23.61-.11-.67-42.37 23.575z" opacity=".2"></path>
    </svg>`,
    
    'Database Management Systems': `<svg viewBox="0 0 128 128" class="skill-svg">
        <path fill="#336791" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0z"></path>
        <path fill="#fff" d="M32 32h64v8H32zm0 16h64v8H32zm0 16h64v8H32zm0 16h64v8H32z"></path>
    </svg>`
};

// Populate skills section
function populateSkills(skills) {
    // Programming Languages
    const languagesContainer = document.getElementById('languages');
    skills.languages.forEach(language => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        const logo = skillLogos[language];
        tag.innerHTML = logo ? `${logo} ${language}` : language;
        languagesContainer.appendChild(tag);
    });
    
    // Frameworks and Libraries
    const frameworksContainer = document.getElementById('frameworks');
    skills.frameworksAndLibraries.forEach(framework => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        const logo = skillLogos[framework];
        tag.innerHTML = logo ? `${logo} ${framework}` : framework;
        frameworksContainer.appendChild(tag);
    });
    
    // Tools and Technologies
    const toolsContainer = document.getElementById('tools');
    skills.toolsAndTechnologies.forEach(tool => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        const logo = skillLogos[tool];
        tag.innerHTML = logo ? `${logo} ${tool}` : tool;
        toolsContainer.appendChild(tag);
    });
}

// Populate projects section
function populateProjects(projects) {
    const projectsContainer = document.getElementById('projects');
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        const demoButton = project.liveDemoLink && project.liveDemoLink !== 'https://project-two.example.com' 
            ? `<a href="${project.liveDemoLink}" target="_blank" rel="noopener noreferrer" class="project-link demo">
                🌐 Live Demo
               </a>`
            : '';
        
        projectCard.innerHTML = `
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description.replace(/\n/g, '<br>')}</p>
            <div class="project-technologies">
                ${project.technologiesUsed.map(tech => {
                    const logo = skillLogos[tech];
                    return `<span class="project-tech-tag">${logo ? logo : ''} ${tech}</span>`;
                }).join('')}
            </div>
            <div class="project-links">
                <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="project-link github">
                    ${skillLogos['GitHub']} GitHub
                </a>
                ${demoButton}
            </div>
        `;
        
        projectsContainer.appendChild(projectCard);
    });
}

// Populate social links
function populateSocialLinks(links) {
    const socialLinksContainer = document.getElementById('socialLinks');
    
    // Create social link buttons
    const socialPlatforms = [
        { key: 'github', label: 'GitHub', logo: skillLogos['GitHub'] },
        { key: 'linkedin', label: 'LinkedIn', logo: `<svg viewBox="0 0 128 128" class="skill-svg">
            <path fill="#0077B5" d="M116 3H12a8.91 8.91 0 00-9 8.8v104.42a8.91 8.91 0 009 8.78h104a8.93 8.93 0 009-8.81V11.8A8.93 8.93 0 00116 3zM39.17 107H21.06V48.73h18.11zm-9-66.21a10.5 10.5 0 1110.49-10.5 10.5 10.5 0 01-10.49 10.5zM107 107H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53V48.73h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.05 47.28 107 59.35 107 75v32z"></path>
        </svg>` }
    ];
    
    socialPlatforms.forEach(platform => {
        if (links[platform.key]) {
            const button = document.createElement('a');
            button.href = links[platform.key];
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
            button.className = 'social-button';
            button.innerHTML = `${platform.logo} ${platform.label}`;
            
            socialLinksContainer.appendChild(button);
        }
    });
}

// Remove loading states
function removeLoadingStates() {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.classList.remove('loading');
    });
}

// Show error state
function showError() {
    document.getElementById('name').textContent = 'Error Loading Profile';
    document.getElementById('title').textContent = 'Please check your connection';
    document.getElementById('location').textContent = 'Unable to load profile data';
    document.getElementById('aboutMe').textContent = 'Please refresh the page or check your internet connection.';
    
    const socialLinksContainer = document.getElementById('socialLinks');
    socialLinksContainer.innerHTML = '<button class="social-button" onclick="location.reload()">🔄 Retry</button>';
}

// Add loading states
function addLoadingStates() {
    const elements = ['name', 'title', 'location', 'aboutMe', 'email', 'phone'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('loading');
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    addLoadingStates();
    loadProfileData();
});

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add intersection observer for animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.skill-category, .project-card, .section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}); 