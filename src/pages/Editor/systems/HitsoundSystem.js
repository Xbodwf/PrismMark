export class HitsoundSystem {
  constructor() {
    this.audioContext = null
    this.sounds = new Map()
    this.volume = 0.5
    this.initialized = false
  }

  async initialize() {
    if (this.initialized) return

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      await this.loadDefaultSounds()
      this.initialized = true
    } catch (error) {
      console.warn("Failed to initialize hitsound system:", error)
    }
  }

  async loadDefaultSounds() {
    // 生成简单的打拍音
    const kickSound = this.generateKickSound()
    this.sounds.set("kick", kickSound)
  }

  generateKickSound() {
    const sampleRate = this.audioContext.sampleRate
    const duration = 0.1 // 100ms
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    // 生成简单的kick音效
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      const envelope = Math.exp(-t * 30) // 快速衰减
      const frequency = 60 * (1 - t * 5) // 频率下降
      data[i] = envelope * Math.sin(2 * Math.PI * frequency * t) * 0.3
    }

    return buffer
  }

  async playSound(soundName = "kick") {
    if (!this.initialized || !this.audioContext) return

    try {
      const buffer = this.sounds.get(soundName)
      if (!buffer) return

      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()

      source.buffer = buffer
      gainNode.gain.value = this.volume

      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      source.start()
    } catch (error) {
      console.warn("Failed to play hitsound:", error)
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.sounds.clear()
    this.initialized = false
  }
}

export default HitsoundSystem
