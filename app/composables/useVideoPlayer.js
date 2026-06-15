import { ref, nextTick, onMounted } from 'vue'

export function useVideoPlayer() {
  const mainVideoElement = ref(null)
  const isAutoplayEnabled = ref(true)
  const currentTrackIndex = ref(0)
  const isCurrentlyPlaying = ref(false)
  const trackTimelinePercent = ref(0)
  const formattedTimeDisplay = ref('00:00')
  const currentVolume = ref(1)
  const isMuted = ref(false)
  const videoPlaylist = ref([
    {
      id: 'vid-1',
      title: 'Act Like an Owner',
      description: 'Embracing an ownership mindset transforms how you lead, how you show up, and how you drive meaningful results. Acting like an owner is about stepping into full responsibility for your area — owning not just the outcomes, but the thinking, decisions, and behaviors that create them. It means looking ahead, anticipating challenges before they surface, and asking the important questions others may overlook.',
      videoUrl: '/video/owner.mp4', 
      thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop',
      duration: '9:56',
      views: '165K',
      uploadedAt: '1 day ago'
    },
    {
      id: 'vid-2',
      title: 'Strategic Vision & Thinking',
      description: 'Learn how to elevate your daily tactical routines into high-level organizational thinking matrices. Discover the critical blueprints needed to align cross-functional teams with overarching corporate OKRs.',
      videoUrl: '/video/strategic.mp4', 
      thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop',
      duration: '14:22',
      views: '89K',
      uploadedAt: '3 days ago'
    },
    {
      id: 'vid-3',
      title: 'Driving Execution Excellence',
      description: 'A comprehensive study on reducing production friction, hitting execution deadlines, and scaling output models consistently across software environments.',
      videoUrl: '/video/execution.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop',
      duration: '11:05',
      views: '210K',
      uploadedAt: '1 week ago'
    }
  ])

  const activeVideo = ref(videoPlaylist.value[0])

  // Utility to convert seconds into tidy timestamp strings
  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function switchActiveVideo(index) {
    currentTrackIndex.value = index
    activeVideo.value = videoPlaylist.value[index]
    isCurrentlyPlaying.value = true
    
    nextTick(() => {
      if (mainVideoElement.value) {
        mainVideoElement.value.pause()
        mainVideoElement.value.load()
        trackTimelinePercent.value = 0
        formattedTimeDisplay.value = '00:00'
        
        mainVideoElement.value.volume = isMuted.value ? 0 : currentVolume.value
        
        mainVideoElement.value.play()
          .then(() => { isCurrentlyPlaying.value = true })
          .catch((e) => console.log("Autoplay interaction blocked check:", e))
      }
    })
  }

  function handleVideoEnded() {
    if (!isAutoplayEnabled.value) return
    const targetNextIndex = currentTrackIndex.value + 1
    if (targetNextIndex < videoPlaylist.value.length) {
      switchActiveVideo(targetNextIndex)
    } else {
      switchActiveVideo(0)
    }
  }

  function togglePlaybackState() {
    if (!mainVideoElement.value) return
    if (mainVideoElement.value.paused) {
      mainVideoElement.value.play()
        .then(() => { isCurrentlyPlaying.value = true })
        .catch((e) => console.log(e))
    } else {
      mainVideoElement.value.pause()
      isCurrentlyPlaying.value = false
    }
  }

  function updateTrackTimeline() {
    if (!mainVideoElement.value) return
    const current = mainVideoElement.value.currentTime
    const duration = mainVideoElement.value.duration
    
    if (duration) {
      trackTimelinePercent.value = (current / duration) * 100
      formattedTimeDisplay.value = formatTime(current)
    }
  }

  function scrubToTimelineFrame(event) {
    if (!mainVideoElement.value || !mainVideoElement.value.duration) return
    const trackBounds = event.currentTarget.getBoundingClientRect()
    const clickRelativeX = event.clientX - trackBounds.left
    const computePercent = Math.max(0, Math.min(1, clickRelativeX / trackBounds.width))
    
    trackTimelinePercent.value = computePercent * 100
    mainVideoElement.value.currentTime = computePercent * mainVideoElement.value.duration
  }

  function toggleFullscreenView() {
    if (!mainVideoElement.value) return
    const playerWrapper = mainVideoElement.value.parentElement
    if (!document.fullscreenElement) {
      playerWrapper.requestFullscreen?.() || playerWrapper.webkitRequestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  function adjustPlayerVolume(event) {
    const inputVolumeValue = parseFloat(event.target.value)
    currentVolume.value = inputVolumeValue
    
    if (mainVideoElement.value) {
      mainVideoElement.value.volume = inputVolumeValue
      isMuted.value = inputVolumeValue === 0
    }
  }

  function toggleMuteState() {
    if (!mainVideoElement.value) return
    isMuted.value = !isMuted.value
    mainVideoElement.value.volume = isMuted.value ? 0 : currentVolume.value
  }

  return {
    mainVideoElement,
    isAutoplayEnabled,
    isCurrentlyPlaying,
    trackTimelinePercent,
    formattedTimeDisplay,
    currentVolume,
    isMuted,
    videoPlaylist,
    activeVideo,
    switchActiveVideo,
    handleVideoEnded,
    togglePlaybackState,
    updateTrackTimeline,
    scrubToTimelineFrame,
    toggleFullscreenView,
    adjustPlayerVolume,
    toggleMuteState
  }
}