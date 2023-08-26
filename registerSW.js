if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
    navigator.serviceWorker.register('/history.cache.controller.js', { scope: '/' })
  })
}