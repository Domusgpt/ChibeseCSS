class ParticleVerse {
    constructor() {
        this.container = document.getElementById('particle-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.particles = new THREE.BufferGeometry();
        this.touch = { x: 0, y: 0, active: false };
        this.time = 0;
        
        this.init();
    }

    init() {
        // Renderer Setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Particle System
        const pos = new Float32Array(15000 * 3);
        for(let i = 0; i < 15000; i++) {
            pos[i*3] = (Math.random() - 0.5) * 10;
            pos[i*3+1] = (Math.random() - 0.5) * 10;
            pos[i*3+2] = (Math.random() - 0.5) * 10;
        }
        
        this.particles.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        
        this.material = new THREE.ShaderMaterial({
            vertexShader: `...`, // Keep original shader code
            fragmentShader: `...`, // Keep original shader code
            uniforms: {
                time: { value: 0 },
                touch: { value: new THREE.Vector2(0, 0) }
            },
            transparent: true,
            depthWrite: false
        });

        this.particleSystem = new THREE.Points(this.particles, this.material);
        this.scene.add(this.particleSystem);
        this.camera.position.z = 5;

        // Event Listeners
        window.addEventListener('resize', () => this.resize());
        this.initTouch();
        this.animate();
    }

    initTouch() {
        const updateTouch = (x, y) => {
            this.touch.x = (x / window.innerWidth) * 2 - 1;
            this.touch.y = -(y / window.innerHeight) * 2 + 1;
            this.material.uniforms.touch.value.set(this.touch.x * 5, this.touch.y * 5);
        };

        window.addEventListener('touchstart', (e) => {
            this.touch.active = true;
            updateTouch(e.touches[0].clientX, e.touches[0].clientY);
        });

        window.addEventListener('touchmove', (e) => {
            updateTouch(e.touches[0].clientX, e.touches[0].clientY);
        });

        window.addEventListener('touchend', () => {
            this.touch.active = false;
        });
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        this.time += 0.005;
        this.material.uniforms.time.value = this.time;
        this.particleSystem.rotation.x += 0.001;
        this.particleSystem.rotation.y += 0.0005;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize Systems
const particleVerse = new ParticleVerse();

// Gyro Handler
let gyroEnabled = false;
document.body.addEventListener('touchend', async () => {
    try {
        if(typeof DeviceOrientationEvent !== 'undefined' && 
           typeof DeviceOrientationEvent.requestPermission === 'function') {
            const permission = await DeviceOrientationEvent.requestPermission();
            gyroEnabled = permission === 'granted';
        }
    } catch(e) {
        console.log('Gyro access denied');
    }
}, { once: true });

// Final Initialization
window.addEventListener('load', () => {
    document.getElementById('preloader').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('preloader').remove();
        particleVerse.renderer.setAnimationLoop(() => {
            particleVerse.renderer.render(particleVerse.scene, particleVerse.camera);
        });
    }, 1000);
});