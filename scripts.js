class QuantumReality {
    constructor() {
        this.initEngine();
        this.createMultiverse();
        this.initChaosInteractions();
        this.narrative = new QuantumNarrative(this.scene);
    }

    initEngine() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#quantumCanvas'),
            antialias: false,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.camera.position.z = 15;
        
        this.clock = new THREE.Clock();
        this.pointer = new THREE.Vector2();
        this.tapHistory = [];
    }

    createMultiverse() {
        this.primaryStorm = this.createParticleSystem(20000, 0.3, 0x00f3ff);
        this.chaosField = this.createParticleSystem(50000, 0.1, 0xbc13fe);
        this.chaosField.rotation.x = Math.PI/4;
        
        const noiseTexture = new THREE.CanvasTexture(this.generateSpaceNoise());
        this.scene.background = noiseTexture;
    }

    createParticleSystem(count, size, color) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        
        for(let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 50;
            positions[i+1] = (Math.random() - 0.5) * 50;
            positions[i+2] = (Math.random() - 0.5) * 50;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            size: size,
            color: color,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const system = new THREE.Points(geometry, material);
        this.scene.add(system);
        return system;
    }

    generateSpaceNoise() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        
        for(let i = 0; i < imageData.data.length; i += 4) {
            const value = Math.random() * 255;
            imageData.data[i] = value;
            imageData.data[i+1] = value;
            imageData.data[i+2] = value;
            imageData.data[i+3] = 255;
        }
        
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    initChaosInteractions() {
        window.addEventListener('resize', () => this.onWindowResize());
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const time = this.clock.getElapsedTime();
        
        this.primaryStorm.rotation.y += 0.001;
        this.chaosField.rotation.x += 0.0005;
        
        this.primaryStorm.position.y = Math.sin(time) * 0.5;
        this.chaosField.position.x = Math.cos(time * 0.5) * 0.3;
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

class QuantumNarrative {
    constructor(scene) {
        this.scene = scene;
        this.interactionCount = 0;
        this.initStoryTriggers();
        this.createConsultationPortal();
    }

    initStoryTriggers() {
        const manifesto = document.querySelector('.quantum-manifest');
        window.addEventListener('scroll', () => {
            const triggerPoint = window.innerHeight * 0.6;
            if(window.scrollY > triggerPoint) {
                manifesto.classList.add('manifest-active');
                this.emitParticleWave();
            }
        });
    }

    emitParticleWave() {
        const particles = [];
        for(let i = 0; i < 50; i++) {
            const p = document.createElement('div');
            p.className = 'story-particle';
            p.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--quantum-blue);
                left: ${window.innerWidth/2}px;
                top: ${window.innerHeight}px;
                border-radius: 50%;
                pointer-events: none;
            `;
            document.body.appendChild(p);
            
            gsap.to(p, {
                x: (Math.random() - 0.5) * 100 - 50,
                y: -window.innerHeight/2,
                opacity: 0,
                duration: 2,
                onComplete: () => p.remove()
            });
        }
    }

    createConsultationPortal() {
        const portal = document.getElementById('consultPortal');
        const interfaceElement = portal.querySelector('.portal-interface');
        
        portal.addEventListener('click', (e) => {
            e.stopPropagation();
            this.interactionCount++;
            this.createHologramRipple(portal);
            
            if(this.interactionCount === 1) {
                gsap.to(interfaceElement, {
                    display: 'block',
                    opacity: 1,
                    y: -140,
                    duration: 0.5
                });
            } else {
                this.initiateContactSequence();
            }
        });
    }

    createHologramRipple(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            width: 120px;
            height: 120px;
            border: 2px solid var(--quantum-blue);
            border-radius: 50%;
            left: ${element.offsetLeft}px;
            top: ${element.offsetTop}px;
            pointer-events: none;
        `;
        document.body.appendChild(ripple);
        
        gsap.to(ripple, {
            width: 300,
            height: 300,
            opacity: 0,
            duration: 1,
            onComplete: () => ripple.remove()
        });
    }

    initiateContactSequence() {
        gsap.to(this.scene.children, {
            z: 100,
            duration: 2,
            ease: "power4.inOut",
            stagger: 0.1
        });
        
        document.querySelector('.portal-interface').innerHTML = `
            <div class="hologram-input" style="animation-delay: 0.2s"></div>
            <div class="hologram-input" style="animation-delay: 0.4s"></div>
            <div class="transmission-button">INITIATE TRANSMISSION</div>
        `;
    }
}

new QuantumReality();