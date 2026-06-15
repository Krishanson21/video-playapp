<template>
  <main class="video-poc-container">
    
    <div class="cinema-banner-fluid-strip">
      
      <video 
        ref="mainVideoElement"
        :src="activeVideo.videoUrl" 
        autoplay
        class="main-html5-player"
        @ended="handleVideoEnded"
        @timeupdate="updateTrackTimeline"
        @click="togglePlaybackState"
      ></video>

      <div 
        class="video-click-overlay" 
        :class="{ 'is-hidden': isCurrentlyPlaying }"
        @click="togglePlaybackState"
      >
        <div class="hologram-play-trigger">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>

      <div class="custom-video-control-deck">
        <button class="deck-btn" @click="togglePlaybackState" aria-label="Play/Pause">
          <i :class="isCurrentlyPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
        </button>

        <div class="timeline-scrubber-wrapper">
          <span class="floating-timestamp-pill" :style="{ left: trackTimelinePercent + '%' }">
            {{ formattedTimeDisplay }}
          </span>
          <div class="custom-progress-bar-track" @mousedown="scrubToTimelineFrame">
            <div class="progress-active-fill" :style="{ width: trackTimelinePercent + '%' }"></div>
          </div>
        </div>

        <div class="deck-right-actions">
          <div class="volume-slider-box vertical-hover-container">
            <div class="vertical-slider-popover">
              <input 
                type="range" 
                min="0" max="1" step="0.1" 
                orient="vertical"
                :value="isMuted ? 0 : currentVolume" 
                @input="adjustPlayerVolume"
                class="volume-range-widget vertical-slider"
              />
            </div>
            <button class="deck-btn compact-padding" @click="toggleMuteState" aria-label="Mute Control">
              <i :class="isMuted ? 'fa-solid fa-volume-xmark' : currentVolume < 0.5 ? 'fa-solid fa-volume-low' : 'fa-solid fa-volume-high'"></i>
            </button>
          </div>

          <button class="deck-btn compact-padding" @click="togglePopOutWindow" aria-label="Pop-out Window">
            <i class="fa-solid fa-window-restore"></i>
          </button>

          <div class="settings-menu-container">
              <button class="deck-btn compact-padding" @click="isSettingsMenuOpen = !isSettingsMenuOpen" aria-label="Settings">
                <i class="fa-solid fa-gear" :class="{ 'gear-spin-active': isSettingsMenuOpen }"></i>
              </button>
              
              <div v-if="isSettingsMenuOpen" class="settings-popup-card">
                <div class="settings-popup-header">Quality Options</div>
                <button 
                  v-for="quality in ['1080p', '720p', '480p', 'Auto']" 
                  :key="quality"
                  class="quality-option-row"
                  :class="{ 'is-active-quality': selectedQuality === quality }"
                  @click="changeVideoQuality(quality)"
                >
                  <i class="fa-solid fa-check check-mark-icon"></i>
                  <span>{{ quality }}</span>
                </button>
              </div>
            </div>
          
          <button class="deck-btn compact-padding" @click="toggleFullscreenView" aria-label="Fullscreen Expansion"><i class="fa-solid fa-expand"></i></button>
          <span class="vimeo-brand-tag">vimeo</span>
        </div>
      </div>
    </div>

    <div class="player-main-center-wrapper">
      <div class="poc-layout-grid">
        
        <section class="player-left-workspace">
          <div class="video-meta-card">
            <h1 class="video-display-title">{{ activeVideo.title }}</h1>
            <div class="video-stats-strip">
              <span>{{ activeVideo.views }} views</span>
              <span class="bullet-divider">•</span>
              <span>{{ activeVideo.uploadedAt }}</span>
            </div>

            <div class="utility-actions-row">
              <button class="action-trigger-btn" aria-label="Share"><i class="fa-regular fa-paper-plane"></i></button>
              <button class="action-trigger-btn" aria-label="Favorite"><i class="fa-regular fa-heart"></i></button>
              <button class="action-trigger-btn" aria-label="Flag"><i class="fa-regular fa-flag"></i></button>
            </div>

            <hr class="section-divider" />

            <div class="channel-attribution-block">
              <div class="channel-logo-avatar">
                <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop" alt="Avatar" />
              </div>
              <div class="channel-text-details">
                <h3>Starbucks Global Academy</h3>
                <p class="video-description-paragraph">{{ activeVideo.description }}</p>
              </div>
            </div>
          </div>

          <div class="recommendations-carousel-section">
            <div class="carousel-header-row">
              <h3>Autoplay next</h3>
              <div class="autoplay-toggle-wrapper">
                <label class="switch-toggle-widget">
                  <input type="checkbox" v-model="isAutoplayEnabled" />
                  <span class="slider-round-track"></span>
                </label>
              </div>
            </div>

            <div class="thumbnails-horizontal-track">
              <div 
                v-for="(video, index) in videoPlaylist" 
                :key="video.id"
                class="thumbnail-card-item"
                @click="switchActiveVideo(index)"
              >
                <div class="card-image-box">
                  <img :src="video.thumbnailUrl" :alt="video.title" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside class="sidebar-right-panel">
          <div class="sidebar-sticky-card">
            <span class="comment-spec-placeholder">comment section</span>
          </div>
        </aside>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const { 
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
  toggleMuteState,
  togglePopOutWindow
} = useVideoPlayer()

const isSettingsMenuOpen = ref(false)
const selectedQuality = ref('Auto')

function changeVideoQuality(quality) {
  selectedQuality.value = quality
  isSettingsMenuOpen.value = false
  alert(`Quality successfully changed to: ${quality}`)
}
</script>

<style scoped>
@import '~/assets/css/video-player.css';
</style>