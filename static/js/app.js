/**
 * Main Application Logic for Prompt Tutor
 * Manages UI interactions, transitions, rocket animation, scoring, and comparisons.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements - Page 1
  const welcomePage = document.getElementById('welcomePage');
  const userNameInput = document.getElementById('userNameInput');
  const dynamicGreeting = document.getElementById('dynamicGreeting');
  const launchAcademyBtn = document.getElementById('launchAcademyBtn');

  // Elements - Rocket Launch
  const rocketOverlay = document.getElementById('rocketLaunchOverlay');
  const rocketWrapper = document.getElementById('rocketWrapper');
  const rocketFlames = document.getElementById('rocketFlames');
  const warpFlash = document.getElementById('warpFlash');
  const launchStatusTitle = document.getElementById('launchStatusTitle');
  const launchStatusSubtitle = document.getElementById('launchStatusSubtitle');

  // Elements - Page 2 Main App
  const mainAppPage = document.getElementById('mainAppPage');
  const userDisplayName = document.getElementById('userDisplayName');
  const userInitials = document.getElementById('userInitials');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const apiModalBtn = document.getElementById('apiModalBtn');
  const apiKeyModal = document.getElementById('apiKeyModal');
  const closeApiKeyModal = document.getElementById('closeApiKeyModal');
  const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // Navigation Tabs
  const navTabBtns = document.querySelectorAll('.nav-tab-btn');
  const moduleViews = document.querySelectorAll('.module-view');

  // Prompt Coach Elements
  const promptInput = document.getElementById('promptInput');
  const promptCharCount = document.getElementById('promptCharCount');
  const promptWordCount = document.getElementById('promptWordCount');
  const analyzePromptBtn = document.getElementById('analyzePromptBtn');
  const clearPromptBtn = document.getElementById('clearPromptBtn');
  const exampleChips = document.querySelectorAll('.example-chip');
  const categoryPills = document.querySelectorAll('.category-pill');

  // Results Dashboard Elements
  const resultsDashboard = document.getElementById('resultsDashboard');
  const scoreRadialProgress = document.getElementById('scoreRadialProgress');
  const scoreNumValue = document.getElementById('scoreNumValue');
  const scoreVerdictBadge = document.getElementById('scoreVerdictBadge');
  const barClarity = document.getElementById('barClarity');
  const valClarity = document.getElementById('valClarity');
  const barPersona = document.getElementById('barPersona');
  const valPersona = document.getElementById('valPersona');
  const barConstraints = document.getElementById('barConstraints');
  const valConstraints = document.getElementById('valConstraints');
  const barGuidance = document.getElementById('barGuidance');
  const valGuidance = document.getElementById('valGuidance');
  const coachCritiqueList = document.getElementById('coachCritiqueList');
  const betterPromptContent = document.getElementById('betterPromptContent');
  const copyBetterPromptBtn = document.getElementById('copyBetterPromptBtn');
  const tryBetterPromptBtn = document.getElementById('tryBetterPromptBtn');

  // Dual Output Elements
  const userOutputContent = document.getElementById('userOutputContent');
  const betterOutputContent = document.getElementById('betterOutputContent');
  const viewToggleSplit = document.getElementById('viewToggleSplit');
  const viewToggleStacked = document.getElementById('viewToggleStacked');
  const dualOutputGrid = document.getElementById('dualOutputGrid');
  const livePreviewContainer = document.getElementById('livePreviewContainer');
  const livePreviewFrame = document.getElementById('livePreviewFrame');
  const toggleLivePreviewBtn = document.getElementById('toggleLivePreviewBtn');

  // Image Studio Elements
  const imagePromptInput = document.getElementById('imagePromptInput');
  const generateImagesBtn = document.getElementById('generateImagesBtn');
  const imageStyleChips = document.querySelectorAll('.style-chip');
  const imageResultsGrid = document.getElementById('imageResultsGrid');
  const userGeneratedImage = document.getElementById('userGeneratedImage');
  const betterGeneratedImage = document.getElementById('betterGeneratedImage');
  const userImageSpinner = document.getElementById('userImageSpinner');
  const betterImageSpinner = document.getElementById('betterImageSpinner');
  const userImagePromptText = document.getElementById('userImagePromptText');
  const betterImagePromptText = document.getElementById('betterImagePromptText');
  const imageImprovementsList = document.getElementById('imageImprovementsList');
  const copyBetterImagePromptBtn = document.getElementById('copyBetterImagePromptBtn');

  // User State
  let currentUser = {
    name: 'Explorer',
    activeCategory: 'all',
    activeImageStyle: 'cinematic',
    soundEnabled: true
  };

  // Init Stars Canvas
  initStarsCanvas();

  // Toast Helper
  function showToast(msg, duration = 3000) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = msg;
    toastNotification.classList.add('active');
    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, duration);
  }

  // ============================================================
  // PAGE 1: USER NAME & DYNAMIC GREETING
  // ============================================================
  if (userNameInput) {
    userNameInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val.length > 0) {
        dynamicGreeting.innerHTML = `👋 Welcome, <span style="color:#ffffff;font-weight:700;">${escapeHtml(val)}</span>! Ready to engineer extraordinary AI prompts?`;
        dynamicGreeting.classList.add('active');
      } else {
        dynamicGreeting.classList.remove('active');
      }
    });

    userNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        launchAcademy();
      }
    });
  }

  if (launchAcademyBtn) {
    launchAcademyBtn.addEventListener('click', launchAcademy);
  }

  // ============================================================
  // ROCKET LAUNCH ANIMATION SEQUENCE
  // ============================================================
  function launchAcademy() {
    const rawName = userNameInput ? userNameInput.value.trim() : '';
    currentUser.name = rawName || 'Pioneer';

    // Play synthesized launch sound
    if (window.soundController) {
      window.soundController.playRocketLaunch();
    }

    // Step 1: Show Overlay & Rumble
    rocketOverlay.classList.add('active');
    rocketWrapper.classList.add('rumble');
    launchStatusTitle.textContent = "IGNITING THRUSTERS...";
    launchStatusSubtitle.textContent = `Preparing navigation system for ${currentUser.name}`;

    // Step 2: Ignite Flames
    setTimeout(() => {
      rocketFlames.classList.add('ignite');
      launchStatusTitle.textContent = "MAXIMUM THRUST REACHED!";
    }, 600);

    // Step 3: Blast Off upwards
    setTimeout(() => {
      rocketFlames.classList.add('full-thrust');
      rocketWrapper.classList.remove('rumble');
      rocketWrapper.classList.add('blast-off');
      launchStatusTitle.textContent = "WARP JUMP INITIATED 🚀";
    }, 1200);

    // Step 4: Hyperspace Flash
    setTimeout(() => {
      warpFlash.classList.add('active');
    }, 2200);

    // Step 5: Transition to Main App
    setTimeout(() => {
      // Hide Page 1, Show Page 2
      welcomePage.classList.add('hidden');
      rocketOverlay.classList.remove('active');
      rocketWrapper.classList.remove('blast-off');
      rocketFlames.classList.remove('ignite', 'full-thrust');
      warpFlash.classList.remove('active');

      mainAppPage.classList.add('active');

      // Update user badge in header
      if (userDisplayName) userDisplayName.textContent = currentUser.name;
      if (userInitials) {
        const initials = currentUser.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'P';
        userInitials.textContent = initials;
      }

      showToast(`🚀 Welcome to Prompt Tutor Academy, ${currentUser.name}!`);
    }, 2800);
  }

  // ============================================================
  // NAVIGATION TABS
  // ============================================================
  navTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.soundController) window.soundController.playClick();
      const targetModule = btn.dataset.module;

      navTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      moduleViews.forEach(view => {
        if (view.id === targetModule) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });
    });
  });

  // Sound Toggle
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (window.soundController) {
        const isMuted = window.soundController.toggleMute();
        soundToggleBtn.textContent = isMuted ? '🔇' : '🔊';
        showToast(isMuted ? 'Sound FX Muted' : 'Sound FX Enabled');
      }
    });
  }

  // API Key Modal
  if (apiModalBtn && apiKeyModal) {
    apiModalBtn.addEventListener('click', () => {
      apiKeyInput.value = window.aiEngine.getApiKey();
      apiKeyModal.classList.add('active');
    });

    closeApiKeyModal.addEventListener('click', () => {
      apiKeyModal.classList.remove('active');
    });

    saveApiKeyBtn.addEventListener('click', () => {
      window.aiEngine.setApiKey(apiKeyInput.value);
      apiKeyModal.classList.remove('active');
      showToast('API Key configuration saved!');
      if (window.soundController) window.soundController.playSuccess();
    });
  }

  // ============================================================
  // MODULE 1: PROMPT COACH & SCORER
  // ============================================================
  if (promptInput) {
    promptInput.addEventListener('input', updateCharAndWordCount);
  }

  function updateCharAndWordCount() {
    const text = promptInput.value;
    promptCharCount.textContent = `${text.length} chars`;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    promptWordCount.textContent = `${words} words`;
  }

  // Quick example chips
  exampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (window.soundController) window.soundController.playClick();
      promptInput.value = chip.dataset.prompt;
      updateCharAndWordCount();
      // Auto analyze when clicking example
      analyzeCurrentPrompt();
    });
  });

  // Category pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (window.soundController) window.soundController.playClick();
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentUser.activeCategory = pill.dataset.category;
    });
  });

  if (clearPromptBtn) {
    clearPromptBtn.addEventListener('click', () => {
      if (window.soundController) window.soundController.playClick();
      promptInput.value = '';
      updateCharAndWordCount();
      resultsDashboard.classList.remove('active');
    });
  }

  if (analyzePromptBtn) {
    analyzePromptBtn.addEventListener('click', analyzeCurrentPrompt);
  }

  function analyzeCurrentPrompt() {
    const raw = promptInput.value.trim();
    if (!raw) {
      showToast('⚠️ Please enter a prompt to analyze!');
      promptInput.focus();
      return;
    }

    if (window.soundController) window.soundController.playClick();

    analyzePromptBtn.disabled = true;
    analyzePromptBtn.innerHTML = 'Analyzing... ⚡';

    setTimeout(() => {
      // 1. Score the prompt
      const scoreData = window.aiEngine.scorePrompt(raw, currentUser.activeCategory);

      // 2. Generate the better prompt
      const betterPrompt = window.aiEngine.generateBetterPrompt(raw, scoreData.detectedType);

      // 3. Generate dual outputs
      const dualOutputs = window.aiEngine.generateDualOutputs(raw, betterPrompt);

      // 4. Render results
      renderAnalysisResults(scoreData, betterPrompt, dualOutputs);

      analyzePromptBtn.disabled = false;
      analyzePromptBtn.innerHTML = 'Analyze & Score Prompt ⚡';

      if (window.soundController && scoreData.total >= 70) {
        window.soundController.playSuccess();
      }

      // Smooth scroll to results
      resultsDashboard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 400);
  }

  function renderAnalysisResults(scoreData, betterPrompt, dualOutputs) {
    resultsDashboard.classList.add('active');

    // Animate score dial
    const targetOffset = 440 - (440 * scoreData.total) / 100;
    scoreRadialProgress.style.strokeDashoffset = targetOffset;
    scoreNumValue.textContent = scoreData.total;

    // Color gradient stroke
    if (scoreData.total >= 78) {
      scoreRadialProgress.style.stroke = 'var(--accent-emerald)';
    } else if (scoreData.total >= 50) {
      scoreRadialProgress.style.stroke = 'var(--accent-amber)';
    } else {
      scoreRadialProgress.style.stroke = 'var(--accent-rose)';
    }

    // Verdict Badge
    scoreVerdictBadge.textContent = scoreData.verdict;
    scoreVerdictBadge.className = `score-verdict-badge ${scoreData.verdictClass}`;

    // Metric Breakdown Bars
    valClarity.textContent = `${scoreData.clarity}/25`;
    barClarity.style.width = `${(scoreData.clarity / 25) * 100}%`;

    valPersona.textContent = `${scoreData.persona}/25`;
    barPersona.style.width = `${(scoreData.persona / 25) * 100}%`;

    valConstraints.textContent = `${scoreData.constraints}/25`;
    barConstraints.style.width = `${(scoreData.constraints / 25) * 100}%`;

    valGuidance.textContent = `${scoreData.guidance}/25`;
    barGuidance.style.width = `${(scoreData.guidance / 25) * 100}%`;

    // AI Coach Critique
    coachCritiqueList.innerHTML = '';
    scoreData.critique.forEach(tip => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="critique-icon">💡</span> <span>${escapeHtml(tip)}</span>`;
      coachCritiqueList.appendChild(li);
    });

    // Better Prompt Card
    betterPromptContent.textContent = betterPrompt;

    // Dual Outputs
    userOutputContent.textContent = dualOutputs.userOutput;
    betterOutputContent.textContent = dualOutputs.betterOutput;

    // Live preview handling
    if (dualOutputs.hasLivePreview) {
      toggleLivePreviewBtn.style.display = 'inline-flex';
      toggleLivePreviewBtn.dataset.html = dualOutputs.betterOutput;
    } else {
      toggleLivePreviewBtn.style.display = 'none';
      livePreviewContainer.classList.remove('active');
    }
  }

  // Copy Better Prompt
  if (copyBetterPromptBtn) {
    copyBetterPromptBtn.addEventListener('click', () => {
      const text = betterPromptContent.textContent;
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Copied Better Prompt to clipboard!');
        if (window.soundController) window.soundController.playClick();
      });
    });
  }

  // Try in prompt input
  if (tryBetterPromptBtn) {
    tryBetterPromptBtn.addEventListener('click', () => {
      promptInput.value = betterPromptContent.textContent;
      updateCharAndWordCount();
      promptInput.scrollIntoView({ behavior: 'smooth' });
      analyzeCurrentPrompt();
    });
  }

  // View toggle (Split vs Stacked)
  if (viewToggleSplit && viewToggleStacked) {
    viewToggleSplit.addEventListener('click', () => {
      viewToggleSplit.classList.add('active');
      viewToggleStacked.classList.remove('active');
      dualOutputGrid.classList.remove('stacked-view');
    });

    viewToggleStacked.addEventListener('click', () => {
      viewToggleStacked.classList.add('active');
      viewToggleSplit.classList.remove('active');
      dualOutputGrid.classList.add('stacked-view');
    });
  }

  // Live Interactive Preview Toggle
  if (toggleLivePreviewBtn) {
    toggleLivePreviewBtn.addEventListener('click', () => {
      if (livePreviewContainer.classList.contains('active')) {
        livePreviewContainer.classList.remove('active');
        toggleLivePreviewBtn.textContent = '▶ Run Live Interactive Preview';
      } else {
        livePreviewContainer.classList.add('active');
        const htmlCode = toggleLivePreviewBtn.dataset.html;
        livePreviewFrame.srcdoc = htmlCode;
        toggleLivePreviewBtn.textContent = '✕ Close Live Preview';
        livePreviewContainer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ============================================================
  // MODULE 2: IMAGE PROMPT STUDIO
  // ============================================================
  imageStyleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (window.soundController) window.soundController.playClick();
      imageStyleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentUser.activeImageStyle = chip.dataset.style;
    });
  });

  if (generateImagesBtn) {
    generateImagesBtn.addEventListener('click', generateImageComparison);
  }

  function generateImageComparison() {
    const raw = imagePromptInput.value.trim();
    if (!raw) {
      showToast('⚠️ Please enter an image prompt!');
      imagePromptInput.focus();
      return;
    }

    if (window.soundController) window.soundController.playClick();

    generateImagesBtn.disabled = true;
    generateImagesBtn.innerHTML = 'Generating Visuals... 🎨';

    const enhanced = window.aiEngine.enhanceImagePrompt(raw, currentUser.activeImageStyle);

    // Show image container & spinners
    imageResultsGrid.style.display = 'grid';
    userImageSpinner.style.display = 'flex';
    betterImageSpinner.style.display = 'flex';

    userImagePromptText.textContent = enhanced.rawPrompt;
    betterImagePromptText.textContent = enhanced.betterPrompt;

    // Load User Prompt Image
    const img1 = new Image();
    img1.onload = () => {
      userGeneratedImage.src = enhanced.userImageUrl;
      userImageSpinner.style.display = 'none';
    };
    img1.onerror = () => {
      userImageSpinner.innerHTML = `<span style="color:#f87171">Image preview ready</span>`;
      userGeneratedImage.src = enhanced.userImageUrl;
    };
    img1.src = enhanced.userImageUrl;

    // Load Better Prompt Image
    const img2 = new Image();
    img2.onload = () => {
      betterGeneratedImage.src = enhanced.betterImageUrl;
      betterImageSpinner.style.display = 'none';
      if (window.soundController) window.soundController.playSuccess();
    };
    img2.onerror = () => {
      betterImageSpinner.innerHTML = `<span style="color:#f87171">Image preview ready</span>`;
      betterGeneratedImage.src = enhanced.betterImageUrl;
    };
    img2.src = enhanced.betterImageUrl;

    // Render improvements list
    imageImprovementsList.innerHTML = '';
    enhanced.improvements.forEach(imp => {
      const li = document.createElement('li');
      li.innerHTML = `✓ ${escapeHtml(imp)}`;
      imageImprovementsList.appendChild(li);
    });

    generateImagesBtn.disabled = false;
    generateImagesBtn.innerHTML = 'Generate & Compare Visuals 🎨';

    imageResultsGrid.scrollIntoView({ behavior: 'smooth' });
  }

  if (copyBetterImagePromptBtn) {
    copyBetterImagePromptBtn.addEventListener('click', () => {
      const text = betterImagePromptText.textContent;
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Copied Better Image Prompt!');
        if (window.soundController) window.soundController.playClick();
      });
    });
  }

  // ============================================================
  // MODULE 4: CHALLENGES ARENA
  // ============================================================
  const challengeButtons = document.querySelectorAll('.start-challenge-btn');
  challengeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const promptToLoad = btn.dataset.vaguePrompt;
      // Switch to Module 1
      navTabBtns[0].click();
      promptInput.value = promptToLoad;
      updateCharAndWordCount();
      analyzeCurrentPrompt();
      showToast('Challenge loaded! Try refining this prompt to score 85+');
    });
  });

  // Helpers
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Background Starfield Canvas
  function initStarsCanvas() {
    const canvas = document.getElementById('starsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const starCount = 140;
    const stars = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2
      });
    }

    function animateStars() {
      ctx.clearRect(0, 0, width, height);

      for (let star of stars) {
        star.phase += star.speed;
        const currentAlpha = star.alpha * (0.6 + 0.4 * Math.sin(star.phase));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.fill();
      }

      requestAnimationFrame(animateStars);
    }

    animateStars();
  }
});
