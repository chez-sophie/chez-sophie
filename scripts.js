//
// PARALLAX
//
const PARALLAX_FACTOR = -0.2;
const parallaxElement = document.querySelector('.parallax');
let lastScrollY = window.scrollY;
let ticking = false;

function updateParallax() {
  const scrolled = window.scrollY;
  const heroHeight = document.querySelector('#hero').offsetHeight;

  if (scrolled <= heroHeight) {
    const offset = scrolled * PARALLAX_FACTOR;
    parallaxElement.style.transform = `translate3d(0, ${offset}px, 0)`;
  }

  ticking = false;
}

if (screen.width > 480) {
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
      });
      ticking = true;
    }
  });
}

updateParallax();

//
// IMAGE FADING
//
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.fade-slide-image');

  let observerOptions = {
    threshold: 0.33,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    })
  }, observerOptions);

  images.forEach((image) => {
    if (image) {
      observer.observe(image)
    }
  })
});

//
// MAP
//
document.addEventListener('DOMContentLoaded', function() {
  const mapContainer = document.getElementById('map');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadLeafletResources().then(initMap);
      observer.disconnect();
    }
  }, { threshold: 0.1 });
  observer.observe(mapContainer);
});

function loadLeafletResources() {
  return Promise.all([
    loadCSS('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'),
    loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'),
    loadCSS('https://unpkg.com/leaflet-gesture-handling/dist/leaflet-gesture-handling.min.css'),
    loadScript('https://unpkg.com/leaflet-gesture-handling'),
  ]);
}

function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function initMap() {
  const latlon = [47.353454938122596, 3.9372450418521536];

  var map = L.map('map', {
    gestureHandling: true,
  }).setView(latlon, 10);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  var marker = L.marker(latlon).addTo(map);
  marker.bindPopup("<b>Chez Sophie</b>");
}
