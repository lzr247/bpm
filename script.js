class BPMMetronome {
  constructor() {
    this.bpm = 180;
    this.isPlaying = false;
    this.currentBeat = 0;
    this.intervalId = null;
    this.beatInterval = null;

    this.beatNumberEl = document.getElementById("beatNumber");
    this.beatIndicatorEl = document.getElementById("beatIndicator");
    this.bpmSlider = document.getElementById("bpmSlider");
    this.bpmValueEl = document.getElementById("bpmValue");
    this.playPauseBtn = document.getElementById("playPauseBtn");

    this.init();
  }

  init() {
    this.bpmSlider.addEventListener("input", (e) => {
      this.setBPM(parseInt(e.target.value));
    });

    this.playPauseBtn.addEventListener("click", () => {
      this.toggle();
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

    // Add active class for visual feedback
    this.beatNumberEl.classList.add("active");
    this.beatIndicatorEl.classList.add("active");

    // Remove active class after a short duration
    setTimeout(() => {
      this.beatNumberEl.classList.remove("active");
      this.beatIndicatorEl.classList.remove("active");
    }, 100);
  }
}

// Initialize the metronome when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new BPMMetronome();
});
