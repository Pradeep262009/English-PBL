/**
 * The Great Derangement - Interactive Presentation Engine (Bright Projector Edition)
 * Amitav Ghosh Chapter 1 | English PBL Presentation
 * Presenters: Kiran, Suriya, Hari, Yogesh, Pradeep
 */

// Global State
let currentSlideIndex = 0;
const totalSlides = 9;
let isDeckMode = true; // Slide-by-slide presentation mode
let audioContext = null;
let ambientGainNode = null;
let isAudioPlaying = false;

// Speaker Cue Cards Data
const speakerNotesData = {
  0: {
    speaker: "Team Introduction",
    badge: "Cover",
    time: "30 - 45s",
    points: [
      "Introduce the book: 'The Great Derangement' by Amitav Ghosh.",
      "Frame the core problem: Why has modern literature failed to address the biggest threat of our era — climate change?",
      "Briefly introduce the 5 speakers: Kiran, Suriya, Hari, Yogesh, and Pradeep."
    ],
    tip: "Speak with calm authority. Stand tall facing the audience and state the title clearly."
  },
  1: {
    speaker: "Team Roadmap",
    badge: "Overview",
    time: "45s",
    points: [
      "Walk the audience through the presentation arc: from the 1978 Delhi tornado to modern fiction's blindspot, the science-culture divide, India's 2047 vision, and global SDGs.",
      "Highlight that each speaker investigates one step in turning the 'unthinkable' into action."
    ],
    tip: "Keep this brief and energetic. It builds anticipation for each team member's segment."
  },
  2: {
    speaker: "Speaker 1 · Kiran",
    badge: "1978 Delhi Tornado",
    time: "1.5 - 2 mins",
    points: [
      "Describe the sudden March 17, 1978 Delhi tornado that struck North Delhi campus.",
      "Emphasize 'Shattered Reality': Ghosh personally witnessed it, yet it felt completely untellable and surreal.",
      "Explain 'False Dismissal': Why society labeled it an isolated 'freak accident'.",
      "Conclude with Ghosh's Core Diagnosis: The climate crisis is fundamentally a cultural and imaginative failure."
    ],
    tip: "Use sensory words: 'black skies', 'roaring vortex'. Click 'Simulate Vortex' to heighten audience focus!"
  },
  3: {
    speaker: "Speaker 2 · Suriya",
    badge: "Literature & The Unthinkable",
    time: "1.5 - 2 mins",
    points: [
      "Explain 'Predictable Realism': The modern novel was shaped by bourgeois regularity, focusing on individual domestic life.",
      "Discuss 'Improbable Extremes': Serious fiction banished freak storms to sci-fi, fearing accusations of melodrama.",
      "Highlight 'Scale Blindness': Human novels track a single lifetime; climate change operates across geological millennia."
    ],
    tip: "Emphasize the paradox: Reality has become radically wild, yet serious literature remains stubbornly tame."
  },
  4: {
    speaker: "Speaker 3 · Hari",
    badge: "Science vs. Culture",
    time: "1.5 - 2 mins",
    points: [
      "Critique 'Siloed Knowledge': Climate science is trapped in IPCC graphs and technical jargon that fails to move hearts.",
      "Champion 'Cultural Awakening': The climate crisis requires writers, artists, and poets to translate facts into shared human emotion.",
      "Argue for collective responsibility: Moving away from hyper-individual guilt to shared civilizational mobilization."
    ],
    tip: "Contrast the left and right sides: point out how data alone paralyzes, but storytelling mobilizes."
  },
  5: {
    speaker: "Speaker 4 · Yogesh",
    badge: "Viksit Bharat 2047",
    time: "1.5 - 2 mins",
    points: [
      "Anchor the theory in India's future: Viksit Bharat 2047 cannot be realized without climate resilience.",
      "Highlight Economic Exposure: Extreme heatwaves and monsoon failures directly threaten agricultural yields and GDP growth.",
      "Showcase Resilient Systems: Green towers, passive solar cooling, vertical farming, and decentralized water management.",
      "Emphasize Proactive Readiness: Transitioning from reactive disaster relief to proactive urban planning."
    ],
    tip: "Hover over the green skyscraper hotspots to demonstrate how smart infrastructure protects Indian cities."
  },
  6: {
    speaker: "Speaker 5 · Pradeep",
    badge: "Global SDGs",
    time: "1.5 - 2 mins",
    points: [
      "Connect India's local efforts to the United Nations 2030 Agenda.",
      "Analyze SDG 13 (Climate Action): Urgent decarbonization and disaster risk governance.",
      "Analyze SDG 11 (Sustainable Cities & Communities): Designing resilient infrastructure that protects vulnerable populations.",
      "Demonstrate how Amitav Ghosh's Chapter 1 provides the moral foundation for achieving both SDGs."
    ],
    tip: "Show how local city resilience (SDG 11) is the frontline shield for global climate stability (SDG 13)."
  },
  7: {
    speaker: "Team Synthesis",
    badge: "Key Takeaways",
    time: "1 min",
    points: [
      "Summarize the 4 pillars: Cultural Failure, Narrative Blindness, National Resilience, and Shared Action.",
      "Reiterate that solutions require both literary imagination and systemic engineering."
    ],
    tip: "Have team members speak in unison or chime in on their respective takeaway card for cohesive teamwork marks."
  },
  8: {
    speaker: "Grand Finale",
    badge: "Conclusion",
    time: "45s",
    points: [
      "Deliver the culminating statement: 'Imagination Must Catch Up With Reality'.",
      "Thank the professor, evaluator, and peers.",
      "Invite questions and announce readiness for the Q&A discussion."
    ],
    tip: "End with conviction and open the Q&A modal if the evaluator asks tough critical questions."
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Setup Ambient Particle Canvas
  initStormCanvas();

  // Setup Initial Deck Mode
  applyMode(isDeckMode);

  // Setup Keyboard Navigation
  setupKeyboardControls();

  // Update Speaker Notes initially
  updateSpeakerNotes(currentSlideIndex);

  // Update Progress Bar & Counter
  updateSlideIndicators();
  updateProgress();
});

// -----------------------------------------------------------------------------
// Slide Navigation Engine
// -----------------------------------------------------------------------------
function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  currentSlideIndex = index;
  
  const slides = document.querySelectorAll('.presentation-slide');
  slides.forEach((slide, i) => {
    if (i === currentSlideIndex) {
      slide.classList.add('active-slide');
    } else {
      slide.classList.remove('active-slide');
    }
  });

  updateSlideIndicators();
  updateSpeakerNotes(currentSlideIndex);
  updateProgress();
  playTransitionSfx();
}

function nextSlide() {
  if (currentSlideIndex < totalSlides - 1) {
    goToSlide(currentSlideIndex + 1);
  } else {
    showToast("Final slide reached");
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    goToSlide(currentSlideIndex - 1);
  }
}

function updateSlideIndicators() {
  // Update discreet slide counter in header
  const numElem = document.getElementById('current-slide-num');
  if (numElem) {
    numElem.textContent = String(currentSlideIndex + 1).padStart(2, '0');
  }

  // Active Speaker Pill in Navbar
  const pills = document.querySelectorAll('.speaker-pill');
  pills.forEach(pill => {
    const speakerNum = parseInt(pill.getAttribute('data-speaker'), 10);
    // Slide 2 = Speaker 1, Slide 3 = Speaker 2, Slide 4 = Speaker 3, etc.
    if (currentSlideIndex === speakerNum + 1) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

function updateProgress() {
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    const percentage = ((currentSlideIndex + 1) / totalSlides) * 100;
    progressBar.style.width = `${percentage}%`;
  }
}

function applyMode(deckMode) {
  const body = document.body;
  const slides = document.querySelectorAll('.presentation-slide');

  body.classList.add('deck-mode');
  body.classList.remove('scroll-mode');
  slides.forEach((slide, i) => {
    if (i === currentSlideIndex) {
      slide.classList.add('active-slide');
    } else {
      slide.classList.remove('active-slide');
    }
  });
}

// -----------------------------------------------------------------------------
// Speaker Notes / Cue Cards Panel
// -----------------------------------------------------------------------------
function toggleSpeakerNotes() {
  const panel = document.getElementById('speaker-notes-panel');
  if (panel) {
    panel.classList.toggle('translate-x-full');
  }
}

function updateSpeakerNotes(slideIdx) {
  const data = speakerNotesData[slideIdx] || speakerNotesData[0];
  const nameElem = document.getElementById('note-speaker-name');
  const badgeElem = document.getElementById('note-speaker-badge');
  const listElem = document.getElementById('note-points-list');
  const tipElem = document.getElementById('note-delivery-tip');

  if (nameElem) nameElem.textContent = data.speaker;
  if (badgeElem) badgeElem.textContent = data.badge;
  if (tipElem) tipElem.textContent = data.tip;

  if (listElem) {
    listElem.innerHTML = data.points
      .map(pt => `<li class="flex items-start gap-2.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span><span>${pt}</span></li>`)
      .join('');
  }
}

// -----------------------------------------------------------------------------
// Keyboard & Presentation Controls
// -----------------------------------------------------------------------------
function setupKeyboardControls() {
  window.addEventListener('keydown', (e) => {
    // If modal is open, let ESC close it
    if (e.key === 'Escape') {
      closeQAModal();
      closeSourcesModal();
      const panel = document.getElementById('speaker-notes-panel');
      if (panel && !panel.classList.contains('translate-x-full')) {
        panel.classList.add('translate-x-full');
      }
      return;
    }

    // Direct Speaker Jump: keys 1 to 5
    if (e.key === '1') { goToSlide(2); return; } // Kiran
    if (e.key === '2') { goToSlide(3); return; } // Suriya
    if (e.key === '3') { goToSlide(4); return; } // Hari
    if (e.key === '4') { goToSlide(5); return; } // Yogesh
    if (e.key === '5') { goToSlide(6); return; } // Pradeep
    if (e.key === '0' || e.key.toLowerCase() === 'h') { goToSlide(0); return; } // Home Cover

    // Next Slide: Right Arrow, Spacebar, PageDown, Enter
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
      e.preventDefault();
      nextSlide();
    } 
    // Previous Slide: Left Arrow, PageUp, Backspace
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
      e.preventDefault();
      prevSlide();
    } 
    else if (e.key.toLowerCase() === 'p') {
      toggleSpeakerNotes();
    } 
    else if (e.key.toLowerCase() === 'f') {
      toggleFullScreen();
    } 
    else if (e.key.toLowerCase() === 'm') {
      toggleAtmosphereAudio();
    }
  });

  // Optional: Click on empty slide area or presenter clicker advances
  document.addEventListener('click', (e) => {
    // Ignore clicks on buttons, links, modals, inputs, and the top nav
    if (e.target.closest('button, a, input, #speaker-notes-panel, #qa-modal, #sources-modal, header')) {
      return;
    }
    // Advance on general slide click
    nextSlide();
  });
}

// -----------------------------------------------------------------------------
// Fullscreen Toggle
// -----------------------------------------------------------------------------
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// -----------------------------------------------------------------------------
// Interactive Atmospheric Canvas (Subtle Light Theme Dust & Wind)
// -----------------------------------------------------------------------------
function initStormCanvas() {
  const canvas = document.getElementById('storm-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedX: Math.random() * 1.5 + 0.3,
      speedY: Math.random() * 0.8 - 0.4,
      opacity: Math.random() * 0.25 + 0.1,
      color: Math.random() > 0.6 ? '#c2410c' : '#94a3b8'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around
      if (p.x > width) p.x = 0;
      if (p.x < 0) p.x = width;
      if (p.y > height) p.y = 0;
      if (p.y < 0) p.y = height;
    }

    requestAnimationFrame(render);
  }

  render();
}

// Tornado Glitch Interactive Effect
function triggerTornadoGlitch() {
  const slide = document.getElementById('slide-2');
  if (slide) {
    slide.classList.add('tornado-shake');
    showToast("🌪️ 1978 Delhi Tornado simulation triggered!");
    playWindGustAudio();
    setTimeout(() => {
      slide.classList.remove('tornado-shake');
    }, 700);
  }
}

// -----------------------------------------------------------------------------
// Web Audio Synthesizer
// -----------------------------------------------------------------------------
function initAudio() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtx();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

function toggleAtmosphereAudio() {
  initAudio();
  const icon = document.getElementById('sound-icon');

  if (!isAudioPlaying) {
    startAtmosphereSynthesizer();
    isAudioPlaying = true;
    if (icon) {
      icon.setAttribute('data-lucide', 'volume-2');
      if (window.lucide) window.lucide.createIcons();
    }
    showToast("Ambient atmospheric sound enabled");
  } else {
    stopAtmosphereSynthesizer();
    isAudioPlaying = false;
    if (icon) {
      icon.setAttribute('data-lucide', 'volume-x');
      if (window.lucide) window.lucide.createIcons();
    }
    showToast("Ambient sound muted");
  }
}

function startAtmosphereSynthesizer() {
  if (!audioContext) return;

  const bufferSize = audioContext.sampleRate * 2;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    output[i] = (b0 + b1 + b2) * 0.03;
  }

  const whiteNoise = audioContext.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(240, audioContext.currentTime);

  ambientGainNode = audioContext.createGain();
  ambientGainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
  ambientGainNode.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 1.2);

  whiteNoise.connect(filter);
  filter.connect(ambientGainNode);
  ambientGainNode.connect(audioContext.destination);

  whiteNoise.start();
  window.currentWindSource = whiteNoise;
}

function stopAtmosphereSynthesizer() {
  if (ambientGainNode && audioContext) {
    ambientGainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
    setTimeout(() => {
      if (window.currentWindSource) {
        window.currentWindSource.stop();
        window.currentWindSource.disconnect();
      }
    }, 500);
  }
}

function playTransitionSfx() {
  if (!audioContext || !isAudioPlaying) return;
  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, audioContext.currentTime + 0.12);
    gain.gain.setValueAtTime(0.03, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + 0.12);
  } catch (e) {}
}

function playWindGustAudio() {
  initAudio();
  if (!audioContext) return;
  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(150, audioContext.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(70, audioContext.currentTime + 0.7);
    gain.gain.setValueAtTime(0.01, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + 0.3);
    gain.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + 0.75);
  } catch (e) {}
}

// -----------------------------------------------------------------------------
// Modals & Notifications
// -----------------------------------------------------------------------------
function openQAModal() {
  const modal = document.getElementById('qa-modal');
  if (modal) modal.classList.remove('hidden'), modal.classList.add('flex');
}

function closeQAModal() {
  const modal = document.getElementById('qa-modal');
  if (modal) modal.classList.add('hidden'), modal.classList.remove('flex');
}

function openSourcesModal() {
  const modal = document.getElementById('sources-modal');
  if (modal) modal.classList.remove('hidden'), modal.classList.add('flex');
}

function closeSourcesModal() {
  const modal = document.getElementById('sources-modal');
  if (modal) modal.classList.add('hidden'), modal.classList.remove('flex');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgElem = document.getElementById('toast-msg');
  if (toast && msgElem) {
    msgElem.textContent = msg;
    toast.classList.remove('translate-y-24', 'opacity-0');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0');
    }, 2500);
  }
}
