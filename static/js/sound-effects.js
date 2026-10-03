/**
 * Web Audio API Sound Synthesizer for Prompt Tutor
 * Generates futuristic sound effects procedurally without any external audio files.
 */
class SoundController {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.09 + 0.3);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(this.audioCtx.currentTime + idx * 0.09);
        osc.stop(this.audioCtx.currentTime + idx * 0.09 + 0.3);
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  playRocketLaunch() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 1. Low Engine Rumble (Brownian-like noise using buffer)
      const bufferSize = ctx.sampleRate * 2.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 1.2);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 2.0);

      const rumbleGain = ctx.createGain();
      rumbleGain.gain.setValueAtTime(0.05, now);
      rumbleGain.gain.linearRampToValueAtTime(0.35, now + 0.8);
      rumbleGain.gain.exponentialRampToValueAtTime(0.01, now + 2.2);

      noise.connect(filter);
      filter.connect(rumbleGain);
      rumbleGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 2.2);

      // 2. High-pitch Ascent / Thruster Sweep
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 2.0);

      oscGain.gain.setValueAtTime(0.01, now + 0.4);
      oscGain.gain.linearRampToValueAtTime(0.18, now + 1.2);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 2.1);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now + 0.4);
      osc.stop(now + 2.1);
    } catch (e) {
      console.warn("Audio launch error:", e);
    }
  }
}

window.soundController = new SoundController();
