let audio
let timer
Component({
  properties: {
    audioUrl: {
      type: String
    },
    startTime: {
      type: Number
    },
    endTime: {
      type: Number
    },

  },
  data: {
    audioStatus: 0,
    schedule: 0,
    now: 0
  },
  lifetimes: {
    ready() {
      audio = wx.createInnerAudioContext()
      audio.src = this.data.audioUrl
      audio.onTimeUpdate(() => {})
      audio.onEnded(() => {
        this.setData({
          audioStatus: 2,
        })
      })
      audio.onPause(() => {
        clearInterval(timer)
        // this.setData({
        //   audioStatus: 0
        // })
      })
      audio.onPlay(() => {
        audio.duration
        timer = setInterval(() => {
          let schedule = (audio.currentTime / audio.duration) * 100
          this.setData({
            schedule: schedule
          })
        }, 50);
        this.setData({
          audioStatus: 1,
        })
      })
    },
    detached() {
      audio.stop()
      clearInterval(timer)
    },
  },
  methods: {
    closeModal() {
      this.triggerEvent('close', false)
    },
    playAudio() {
      this.setData({
        audioStatus: 1,
      })
      setTimeout(() => {
        audio.play()
      }, 500);
    },
    stopAudio() {
      audio.pause()
      this.setData({
        audioStatus: 0
      })
    },
    refreshAudio() {
      setTimeout(() => {
        audio.play()
        this.setData({
          audioStatus: 1,
        })
      }, 100);
    },
    sliderChange(e) {
      audio.stop()
      clearInterval(timer)
      let schedule = e.detail.value
      if (audio.duration != 0) {
        let nt = (audio.duration * schedule) / 100
        audio.seek(nt)
        setTimeout(() => {
          audio.play()
          this.setData({
            audioStatus: 1
          })
        }, 100);
      }
    },
  }
})