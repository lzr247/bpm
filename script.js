class BPMMetronome {
  constructor() {
    this.bpm = 180;
    this.isPlaying = false;
    this.currentBeat = 0;
    this.intervalId = null;
    this.beatInterval = null;
    this.soundEnabled = true;

    // Initialize Web Audio API
    this.audioContext = null;

    this.beatNumberEl = document.getElementById("beatNumber");
    this.beatIndicatorEl = document.getElementById("beatIndicator");
    this.bpmSlider = document.getElementById("bpmSlider");
    this.bpmValueEl = document.getElementById("bpmValue");
    this.playPauseBtn = document.getElementById("playPauseBtn");
    this.soundToggleBtn = document.getElementById("soundToggleBtn");

    this.init();
  }

  init() {
    this.bpmSlider.addEventListener("input", (e) => {
      this.setBPM(parseInt(e.target.value));
    });

    this.playPauseBtn.addEventListener("click", () => {
      this.toggle();
    });

    this.soundToggleBtn.addEventListener("click", () => {
      this.toggleSound();
    });

    this.updateBPMDisplay();
  }

  setBPM(newBPM) {
    this.bpm = newBPM;
    this.updateBPMDisplay();

    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  updateBPMDisplay() {
    this.bpmValueEl.textContent = this.bpm;
  }

  calculateBeatInterval() {
    // Convert BPM to milliseconds per beat
    const beatsPerSecond = this.bpm / 60;
    const millisecondsPerBeat = 1000 / beatsPerSecond;
    return millisecondsPerBeat;
  }

  start() {
    this.isPlaying = true;
    this.currentBeat = 0;
    this.playPauseBtn.textContent = "STOP";
    this.playPauseBtn.classList.add("playing");

    const interval = this.calculateBeatInterval();

    // Play immediately
    this.playBeat();

    // Then continue at interval
    this.intervalId = setInterval(() => {
      this.playBeat();
    }, interval);
  }

  stop() {
    this.isPlaying = false;
    this.currentBeat = 0;
    this.playPauseBtn.textContent = "START";
    this.playPauseBtn.classList.remove("playing");

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Reset visual state
    this.beatNumberEl.textContent = "1";
    this.beatNumberEl.classList.remove("active");
    this.beatIndicatorEl.classList.remove("active");
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  playBeat() {
    // Cycle through 1-2-3-4
    this.currentBeat = (this.currentBeat % 4) + 1;

    // Update display
    this.beatNumberEl.textContent = this.currentBeat;

    // Play sound if enabled
    if (this.soundEnabled) {
      this.playSound();
    }

    // Add active class for visual feedback
    this.beatNumberEl.classList.add("active");
    this.beatIndicatorEl.classList.add("active");

    // Remove active class after a short duration
    setTimeout(() => {
      this.beatNumberEl.classList.remove("active");
      this.beatIndicatorEl.classList.remove("active");
    }, 100);
  }

  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playSound() {
    this.initAudioContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Different pitch for beat 1 (higher) vs beats 2-4 (lower)
    oscillator.frequency.value = this.currentBeat === 1 ? 1000 : 800;
    oscillator.type = "sine";

    // Quick beep sound
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.1
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    
    if (this.soundEnabled) {
      this.soundToggleBtn.innerHTML = '<span class="sound-icon">🔊</span> SOUND ON';
      this.soundToggleBtn.classList.remove("muted");
    } else {
      this.soundToggleBtn.innerHTML = '<span class="sound-icon">🔇</span> SOUND OFF';
      this.soundToggleBtn.classList.add("muted");
    }
  }
}

// Initialize the metronome when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new BPMMetronome();
});
