/* ==================================================
   PAGE LOADER – FAILSAFE (RUNS FIRST)
================================================== */
(() => {
  function hideLoader() {
    document.body.classList.add("loaded");
    const loader = document.getElementById("page-loader");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, 600);
    }
  }

  // Normal load
  window.addEventListener("load", hideLoader);

  // Absolute fallback (never get stuck)
  setTimeout(hideLoader, 3000);
})();

/* ==================================================
   GSAP SETUP
================================================== */
gsap.registerPlugin(ScrollTrigger);

/* HERO INTRO */
gsap.from(".hero-content h1 span", {
  opacity: 0,
  y: 40,
  duration: 1,
  ease: "power4.out"
});

gsap.from(".hero-content p", {
  opacity: 0,
  y: 20,
  duration: 1,
  delay: 0.4,
  ease: "power4.out"
});

gsap.from(".hero-buttons a", {
  opacity: 0,
  y: 20,
  duration: 0.6,
  stagger: 0.15,
  delay: 0.7,
  ease: "power4.out"
});

/* SECTION HEADINGS */
document.querySelectorAll(".reveal").forEach(el => {
  gsap.from(el, {
    opacity: 0,
    y: 60,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 85%"
    }
  });
});

/* EXPERIENCE CARDS */
gsap.from(".exp-card", {
  opacity: 0,
  y: 60,
  duration: 0.8,
  stagger: 0.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".experience",
    start: "top 75%"
  }
});

/* PROJECT CARDS */
gsap.from(".project-card", {
  opacity: 0,
  y: 80,
  duration: 0.9,
  stagger: 0.25,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".projects",
    start: "top 75%"
  }
});

/* ==================================================
   SKILLS – BARS
================================================== */
document.querySelectorAll(".skill-fill").forEach(bar => {
  gsap.to(bar, {
    width: bar.dataset.percent + "%",
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: bar,
      start: "top 85%"
    }
  });
});

/* ==================================================
   SKILLS – COUNTERS
================================================== */
document.querySelectorAll(".counter").forEach(counter => {
  ScrollTrigger.create({
    trigger: counter,
    start: "top 85%",
    onEnter: () => {
      let current = 0;
      const target = Number(counter.dataset.count);
      const step = target / 60;

      function update() {
        current += step;
        if (current < target) {
          counter.textContent = Math.round(current) + "%";
          requestAnimationFrame(update);
        } else {
          counter.textContent = target + "%";
        }
      }

      update();
    }
  });
});

/* ==================================================
   THREE.JS HERO BACKGROUND
   (SINGLE, SCOPED CANVAS)
================================================== */
(() => {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const particleCount = window.innerWidth < 768 ? 400 : 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const material = new THREE.PointsMaterial({
    color: 0x00ffd5,
    size: 0.02,
    transparent: true,
    opacity: 0.8
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  function animate() {
    particles.rotation.y += 0.0008;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ===============================
   FLOATING CONTACT CTA
================================ */
const fab = document.getElementById("contact-fab");

if (fab) {
  fab.addEventListener("click", () => {
    document.getElementById("contact").scrollIntoView({
      behavior: "smooth"
    });
  });
}

/* ===============================
   ENHANCED COPY EMAIL TO CLIPBOARD
================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".copy-email").forEach(card => {
    card.addEventListener("click", e => {
      e.preventDefault();

      const email = card.dataset.email;
      const copyStatus = card.querySelector(".copy-status");
      const hint = card.querySelector(".copy-hint");

      if (!email) return;

      // Modern clipboard API with fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showCopySuccess(copyStatus, hint);
        }).catch(() => {
          fallbackCopy(email, copyStatus, hint);
        });
      } else {
        fallbackCopy(email, copyStatus, hint);
      }
    });
  });
});

function showCopySuccess(copyStatus, hint) {
  // Show copy status badge
  if (copyStatus) {
    copyStatus.classList.add("show");
    setTimeout(() => {
      copyStatus.classList.remove("show");
    }, 2000);
  }

  // Update hint text
  if (hint) {
    const originalText = hint.textContent;
    hint.textContent = "Copied ✓";
    hint.style.color = "#00ffd5";
    
    setTimeout(() => {
      hint.textContent = originalText;
      hint.style.color = "";
    }, 2000);
  }
}

function fallbackCopy(email, copyStatus, hint) {
  const tempInput = document.createElement("textarea");
  tempInput.value = email;
  tempInput.style.position = "fixed";
  tempInput.style.opacity = "0";
  document.body.appendChild(tempInput);
  tempInput.select();
  tempInput.setSelectionRange(0, 99999);

  try {
    document.execCommand("copy");
    showCopySuccess(copyStatus, hint);
  } catch (err) {
    if (hint) {
      hint.textContent = "Copy failed";
    }
  }

  document.body.removeChild(tempInput);
}

/* ===============================
   CONTACT METHOD FILTER
================================ */
document.querySelectorAll(".method-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const method = btn.dataset.method;
    
    // Update active button
    document.querySelectorAll(".method-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    // Filter contact cards
    const cards = document.querySelectorAll(".contact-card");
    
    cards.forEach(card => {
      if (method === "all") {
        card.style.display = "flex";
        gsap.fromTo(card, 
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
        );
      } else {
        const category = card.dataset.category || "";
        if (category.includes(method)) {
          card.style.display = "flex";
          gsap.fromTo(card, 
            { opacity: 0, scale: 0.9, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
          );
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.9,
            y: 20,
            duration: 0.3,
            onComplete: () => {
              card.style.display = "none";
            }
          });
        }
      }
    });
  });
});

/* ===============================
   CONTACT CARDS ANIMATION
================================ */
gsap.from(".contact-card", {
  opacity: 0,
  y: 50,
  scale: 0.9,
  duration: 0.6,
  stagger: 0.1,
  ease: "back.out(1.7)",
  scrollTrigger: {
    trigger: ".contact-links",
    start: "top 80%"
  }
});

/* ===============================
   REAL GEMINI AI DEMO
================================ */
const demoBtn = document.getElementById("demo-btn");

if (demoBtn) {
  demoBtn.addEventListener("click", async () => {
    const input = document.getElementById("demo-input").value.trim();
    const output = document.getElementById("demo-output");

    if (!input) {
      output.innerHTML = "<p>Please paste some text to analyze.</p>";
      return;
    }

    output.innerHTML = "<p>Analyzing with AI… ⏳</p>";

    try {
      const res = await fetch("https://gemini-backend-dscf.onrender.com/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input })
      });

      const data = await res.json();
      output.innerHTML = `<pre>${data.output}</pre>`;
    } catch (err) {
      output.innerHTML = "<p>AI service unavailable.</p>";
    }
  });
}

/* ===============================
   GSAP ANIMATION – AI DEMO
================================ */
gsap.from(".ai-demo-box", {
  opacity: 0,
  y: 80,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".ai-demo",
    start: "top 75%"
  }
});

/* ===============================
   GSAP ANIMATION – CERTIFICATIONS
================================ */
gsap.from(".cert-card", {
  autoAlpha: 0,
  y: 40,
  duration: 0.6,
  stagger: 0.15,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".certifications",
    start: "top 75%"
  }
});

/* ===============================
   LOTTIE ANIMATION TRIGGER
================================ */
ScrollTrigger.create({
  trigger: ".about",
  start: "top 70%",
  onEnter: () => {
    const anim = document.querySelector(".about-animation");
    if (anim) {
      anim.classList.add("active");
    }
  }
});

/* ===============================
   SKILLS – ACCORDION INTERACTION
================================ */
document.querySelectorAll(".skill-header").forEach(header => {
  header.addEventListener("click", () => {
    const card = header.parentElement;

    // Close all other cards
    document.querySelectorAll(".skill-card").forEach(c => {
      if (c !== card) {
        c.classList.remove("active");
        c.classList.add("inactive");
      }
    });

    // Toggle current card
    card.classList.toggle("active");
    card.classList.remove("inactive");
  });
});

/* ===============================
   TERMINAL HERO INTRO
================================ */
const terminalLines = [
  ">>> import analytics, ai, automation",
  "",
  ">>> name = 'Hemant Solanki'",
  ">>> role = 'Senior Data Analyst | AI Developer'",
  "",
  ">>> experience = 4.5  # years",
  "",
  ">>> skills = [",
  "    'Data Accuracy & Quality',",
  "    'Business Intelligence',",
  "    'Python & SQL Automation',",
  "    'AI-powered Applications'",
  "  ]",
  "",
  ">>> impact = {",
  "    'efficiency': '+60%',",
  "    'data_accuracy': '+30%',",
  "    'adoption': '+25%'",
  "  }",
  "",
  ">>> print('Let's build something impactful with data..')"
];

const terminal = document.getElementById("terminal-text");
let lineIndex = 0;
let charIndex = 0;

function typeTerminal() {
  if (!terminal) return;

  if (lineIndex < terminalLines.length) {
    if (charIndex < terminalLines[lineIndex].length) {
      terminal.textContent += terminalLines[lineIndex][charIndex];
      charIndex++;
      setTimeout(typeTerminal, 25);
    } else {
      terminal.textContent += "\n";
      charIndex = 0;
      lineIndex++;
      setTimeout(typeTerminal, 120);
    }
  }
}

window.addEventListener("load", () => {
  setTimeout(typeTerminal, 600);
});

/* ===============================
   THINKING UPGRADE ANIMATION
================================ */
gsap.from(".think-step", {
  opacity: 0,
  y: 40,
  duration: 0.7,
  stagger: 0.15,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".thinking-upgrade",
    start: "top 75%"
  }
});