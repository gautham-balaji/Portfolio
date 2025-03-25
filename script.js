document.addEventListener('DOMContentLoaded', function () {
    // ---------------------------
    // 1) Basic Utilities & Listeners
    // ---------------------------
    window.addEventListener('scroll', function () {
      // Scroll progress bar
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.querySelector('.scroll-progress').style.width = scrolled + '%';
  
      // Back to Top button
      const backToTop = document.getElementById('backToTop');
      backToTop.style.display = window.scrollY > 200 ? 'block' : 'none';
  
      // Parallax hero
      const hero = document.querySelector('.hero');
      hero.style.transform = `translateY(${window.scrollY * 0.2}px)`;
  
      // Navbar active link
      document.querySelectorAll('.nav-link').forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });
  
    document.getElementById('backToTop').addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  
    // Smooth Scroll for in-page links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  
    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
    });
  
    // ---------------------------
    // 2) Infinite Scrolling Carousel (pixel-based, 350px tile)
    // ---------------------------
    const carousel = document.querySelector('.carousel');
    const items = Array.from(document.querySelectorAll('.project-item'));
    if (carousel && items.length > 0) {
      let isPaused = false;
      let position = 0;
      const scrollSpeed = 1.5;
  
      // Calculate item width + margin
      const itemWidth = items[0].offsetWidth +
        parseFloat(getComputedStyle(items[0]).marginLeft) +
        parseFloat(getComputedStyle(items[0]).marginRight);
  
      // Duplicate items for seamless loop
      function cloneItems() {
        items.forEach(item => {
          const clone = item.cloneNode(true);
          carousel.appendChild(clone);
        });
      }
      cloneItems();
  
      // Animate
      function animateCarousel() {
        if (!isPaused) {
          position -= scrollSpeed;
          // Once we pass -itemWidth, move the first item to the end
          if (position <= -itemWidth) {
            position += itemWidth;
            carousel.appendChild(carousel.firstElementChild);
            cloneItems();
          }
          carousel.style.transform = `translateX(${position}px)`;
        }
        requestAnimationFrame(animateCarousel);
      }
      animateCarousel();
  
      carousel.addEventListener('mouseenter', () => { isPaused = true; });
      carousel.addEventListener('mouseleave', () => { isPaused = false; });
  
      // Clickable items
      document.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('click', function () {
          const githubLink = this.getAttribute('data-github') || '#';
          window.open(githubLink, '_blank');
        });
      });
    }
  
    // ---------------------------
    // 3) Three.js Background
    // ---------------------------
    const threeContainer = document.getElementById('three-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeContainer.appendChild(renderer.domElement);
  
    // Starfield
    const particlesCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 6;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.01,
      color: 0x00aaff,
      transparent: true,
      opacity: 1
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
  
    camera.position.z = 3;
    const light = new THREE.PointLight(0x00aaff, 1, 100);
    light.position.set(0, 0, 2);
    scene.add(light);
  
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      light.position.x = mouseX * 2;
      light.position.y = mouseY * 2;
    });
  
    function animate() {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.001;
      particlesMesh.position.x = mouseX * 0.1;
      particlesMesh.position.y = mouseY * 0.1;
      renderer.render(scene, camera);
    }
    animate();
  
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  
    // ---------------------------
    // 4) GSAP Animations
    // ---------------------------
    gsap.registerPlugin(ScrollTrigger);
  
    // Simple scramble function
    const SCRAMBLE_CHARS = "!@#$%^&*()_+[]{}|;:<>,.?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    function scrambleText(el, finalText, speed = 50) {
      let currentLength = 0;
      let scrambledArr = new Array(finalText.length).fill("");
  
      const interval = setInterval(() => {
        for (let i = 0; i < scrambledArr.length; i++) {
          if (i < currentLength) {
            scrambledArr[i] = finalText[i];
          } else {
            scrambledArr[i] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }
        el.textContent = scrambledArr.join("");
        currentLength++;
        if (currentLength > finalText.length) {
          clearInterval(interval);
          el.textContent = finalText;
        }
      }, speed);
    }
  
    const tl = gsap.timeline();
  
    // ~5 second scramble => 14 chars * 350ms = ~4900ms
    tl.call(() => {
      const myNameEl = document.getElementById('myName');
      myNameEl.textContent = ""; 
      scrambleText(myNameEl, "Gautham Balaji", 350);
    }, null, 0);
  
    // Fade in #aboutMe
    tl.from("#aboutMe", {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: "power3.out",
      delay: 1.5
    });
  
    // Fade in hero-left if needed
    tl.from(".hero-left", {
      duration: 1,
      x: -50,
      opacity: 0,
      ease: "power3.out",
      delay: -0.5
    });
  
    // Parallax effect on the .carousel
    gsap.to(".carousel", {
      scrollTrigger: {
        trigger: "#projects",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      },
      y: -100
    });
  
    // ---------------------------
    // 5) DVD Bounce for Picture in Top-Right (only after click)
    // ---------------------------
    const dvdContainer = document.getElementById('dvd-bounce-container');
    const dvdImage = document.getElementById('dvd-bounce');
    let dvdX = 0, dvdY = 0;        
    let dvdDX = 1.5, dvdDY = 1.2;  
    let isBouncing = false;
  
    function bounceDVD() {
      if (!isBouncing) return;
  
      const containerRect = dvdContainer.getBoundingClientRect();
      const maxX = containerRect.width - dvdImage.offsetWidth;
      const maxY = containerRect.height - dvdImage.offsetHeight;
  
      dvdX += dvdDX;
      dvdY += dvdDY;
  
      // Bounce horizontally
      if (dvdX <= 0 || dvdX >= maxX) {
        dvdDX *= -1;
      }
      // Bounce vertically
      if (dvdY <= 0 || dvdY >= maxY) {
        dvdDY *= -1;
      }
  
      dvdImage.style.left = dvdX + 'px';
      dvdImage.style.top = dvdY + 'px';
  
      requestAnimationFrame(bounceDVD);
    }
  
    // Start bounce on image click
    dvdImage.addEventListener('click', () => {
      isBouncing = true;
      bounceDVD(); 
    });
  });
  