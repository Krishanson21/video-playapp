<template>
  <main class="video-poc-container">
    <div class="cinema-banner-fluid-strip">
      <button class="player-nav prev" @click="previousVideo" aria-label="Previous Video">❮</button>
      
      <div class="video-frame-wrapper">
        <iframe 
          :src="`https://player.vimeo.com/video/${videoIds[currentIndex]}?autoplay=1&muted=0&api=1`"
          allow="autoplay; fullscreen; picture-in-picture" 
          allowfullscreen
          class="native-vimeo-iframe-frame"
        ></iframe>
      </div>

      <button class="player-nav next" @click="nextVideo" aria-label="Next Video">❯</button>
    </div>

    <div class="player-main-center-wrapper">
      <div class="poc-layout-grid">
        
        <section class="player-left-workspace">
          <div class="video-meta-card">
            <h1 class="video-display-title">{{ activeMetadata.title }}</h1>
            <div class="video-stats-strip">
              <span id="dynamic-up-next-string"><strong>Up Next:</strong> {{ upNextTitle }}</span>
            </div>

            <div class="utility-actions-row">
              <button class="action-trigger-btn"><i class="fa-regular fa-paper-plane"></i> Share</button>
              <button class="action-trigger-btn"><i class="fa-regular fa-heart"></i> Like</button>
              <button class="action-trigger-btn"><i class="fa-regular fa-flag"></i> Report</button>
            </div>

            <div class="channel-attribution-block">
              <div class="channel-logo-avatar">
                <img :src="activeMetadata.author_avatar" alt="Channel Owner" />
              </div>
              <div class="channel-text-details">
                <h3>{{ activeMetadata.author_name }}</h3>
                <p class="video-description-paragraph">{{ activeMetadata.description }}</p>
              </div>
            </div>
          </div>

          <div class="recommendations-carousel-section">
            <div class="carousel-header-row">
              <h3>Playlist Collection</h3>
              <div class="autoplay-toggle-wrapper">
                <span>Autoplay</span>
                <label class="switch-toggle-widget">
                  <input type="checkbox" v-model="autoplayEnabled" />
                  <span class="slider-round-track"></span>
                </label>
              </div>
            </div>

            <div class="thumbnails-horizontal-track">
              <div 
                v-for="(video, index) in processedPlaylist" 
                :key="video.id"
                class="thumbnail-card-item"
                :class="{ 'active-track-playing': index === currentIndex }"
                @click="loadVideoByIndex(index)"
              >
                <div class="card-image-box">
                  <img :src="video.thumbnail_url" :alt="video.title" />
                  <div class="thumbnail-play-overlay">
                    <span>▶</span>
                  </div>
                </div>
                <h4 class="thumbnail-card-title">{{ video.title }}</h4>
                <span class="thumbnail-card-meta">{{ video.author_name }}</span>
              </div>
            </div>
          </div>
        </section>

        <aside class="sidebar-right-panel">
          <div class="sidebar-sticky-card">
            <div class="comments-container-header">
              <h3 class="comments-count-title">Comments ({{ activeComments.length }})</h3>
            </div>
            <div class="comments-scroller-view">
              <div v-for="(comment, idx) in activeComments" :key="idx" class="comment-item-row">
                <div class="comment-avatar-circle">
                  <img :src="comment.userAvatar" alt="User Profile" />
                </div>
                <div class="comment-content-block">
                  <h4>{{ comment.username }}</h4>
                  <p>{{ comment.text }}</p>
                </div>
              </div>
            </div>
            <div class="comment-input-bar-wrapper">
              <input 
                type="text" 
                placeholder="Join the discussion..." 
                v-model="newCommentText"
                @keyup.enter="postComment"
                class="comment-input-field" 
              />
              <button class="deck-btn-send" @click="postComment"><i class="fa-regular fa-paper-plane"></i></button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from '#app'

const route = useRoute()
const router = useRouter()

const videoIds = [76979871, 818471133, 347119414, 524340546, 224392349, 192318923]
const currentIndex = ref(0)
const autoplayEnabled = ref(true)
const newCommentText = ref('')
const processedPlaylist = ref([])

const localDiscussionsRepository = ref({
  76979871: [
    { username: 'Banco E-AMAZÔNIA', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format', text: 'Stunning cinematography tracks! The festival showcase layout looks crisp.' },
    { username: 'alzareef company', userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&auto=format', text: 'Incredible frame metrics.' }
  ],
  818471131: [
    { username: 'Design Lead Core', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format', text: 'The motion graphics design system transitions are outstanding!' }
  ],
  347119414: [
    { username: 'Cinema Pro Guild', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format', text: 'This workshop breakdown covers everything required for modern production lighting setups.' }
  ]
})

const activeMetadata = computed(() => {
  const apiData = processedPlaylist.value[currentIndex.value]
  
  if (apiData) {
    return {
      title: apiData.title,
      author_name: apiData.author_name,
      author_avatar: apiData.author_portrait || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      description: apiData.description || 'No description provided for this video.'
    }
  }
  
  return {
    title: 'Loading video details...',
    author_name: 'Vimeo Network Team',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
    description: 'Resolving stream context from server...'
  }
})

const upNextTitle = computed(() => {
  if (!autoplayEnabled.value) return 'Autoplay is turned off'
  if (processedPlaylist.value.length === 0) return 'Loading compilation metadata...'
  
  const nextIndex = (currentIndex.value + 1) % videoIds.length
  return processedPlaylist.value[nextIndex]?.title || 'Loading next track...'
})

const activeComments = computed(() => {
  const currentId = videoIds[currentIndex.value]
  return localDiscussionsRepository.value[currentId] || [
    { username: 'Vimeo Viewer', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format', text: 'Amazing implementation of this video component stream!' }
  ]
})

async function fetchLiveVimeoMetadata(id) {
  try {
    const rawTargetUrl = `https://vimeo.com/api/v2/video/${id}.json`
    const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(rawTargetUrl)}`
    
    const response = await fetch(proxiedUrl)
    const data = await response.json()
    const payload = data[0]
    
    let descriptiveText = payload.description || 'Official media asset node.'
    if (descriptiveText.includes('<br')) {
      descriptiveText = descriptiveText.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '')
    }

    return {
      id: id,
      title: payload.title || 'Vimeo Production Node',
      author_name: payload.user_name || 'Vimeo Creator',
      thumbnail_url: payload.thumbnail_large || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
      description: descriptiveText,
      author_portrait: payload.user_portrait_large || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format'
    }
  } catch (error) {
    return {
      id: id,
      title: `Vimeo Broadcast Reel - System Node ${id}`,
      author_name: 'Production Collective',
      thumbnail_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
      description: 'Official production content stream managed dynamically via integrated Vimeo metadata APIs.',
      author_portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format'
    }
  }
}

function syncRouteState() {
  const queryId = Number(route.query.id)
  if (queryId && videoIds.includes(queryId)) {
    currentIndex.value = videoIds.indexOf(queryId)
  } else {
    currentIndex.value = 0
  }
}

function loadVideoByIndex(index) {
  currentIndex.value = index
  router.push({ query: { id: videoIds[index] } })
}

function nextVideo() {
  const index = (currentIndex.value + 1) % videoIds.length
  loadVideoByIndex(index)
}

function previousVideo() {
  const index = (currentIndex.value - 1 + videoIds.length) % videoIds.length
  loadVideoByIndex(index)
}

function postComment() {
  if (!newCommentText.value.trim()) return
  const currentId = videoIds[currentIndex.value]
  if (!localDiscussionsRepository.value[currentId]) {
    localDiscussionsRepository.value[currentId] = []
  }
  localDiscussionsRepository.value[currentId].push({
    username: 'Verified User',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format',
    text: newCommentText.value.trim()
  })
  newCommentText.value = ''
}

function handleKeyboardNavigation(e) {
  if (e.key === 'ArrowRight') nextVideo()
  if (e.key === 'ArrowLeft') previousVideo()
}

onMounted(async () => {
  syncRouteState()
  
  const aggregationCollector = []
  for (const id of videoIds) {
    const videoMetadata = await fetchLiveVimeoMetadata(id)
    aggregationCollector.push(videoMetadata)
  }
  processedPlaylist.value = aggregationCollector

  window.addEventListener('keydown', handleKeyboardNavigation)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboardNavigation)
})
</script>

<style>
@import '~/assets/css/video-player.css';
</style>