const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let autoScrollAnimation;
const scrollbar = document.querySelector(".custom-scrollbar");
const scrollThumb = document.querySelector(".scroll-thumb");
const scrollNumbers = document.querySelector(".scroll-numbers");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingBar = document.getElementById("loadingBar");

const frames = {
  currentIndex: 1,
  maxIndex: 7552,
};

const images = new Map();

function preloadAllImages() {
  const preloadPromises = [];
  for (let i = 1; i <= frames.maxIndex; i++) {
    preloadPromises.push(preloadImage(i));
  }
  return Promise.all(preloadPromises);
}

function preloadImage(index) {
  return new Promise((resolve, reject) => {
    if (images.has(index)) {
      resolve(images.get(index));
      return;
    }

    const imageUrl = `https://my-threejs-3d-models.s3.amazonaws.com/foodChainFrames/frame_${index
      .toString()
      .padStart(4, "0")}.jpeg`;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      images.set(index, img);
      updateLoadingProgress(index);
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error(`Image load failed at index ${index}`));
    };
  });
}

function updateLoadingProgress(loadedIndex) {
  const progress = (loadedIndex / frames.maxIndex) * 100;
  loadingBar.style.width = `${progress}%`;
}

function loadImage(index) {
  if (index >= 1 && index <= frames.maxIndex) {
    const img = images.get(index);
    if (img) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      const scale = Math.max(scaleX, scaleY);

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const offsetX = (canvas.width - newWidth) / 2;
      const offsetY = (canvas.height - newHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
      frames.currentIndex = index;
    }
  }
}

function startAnimation() {
  ScrollTrigger.create({
    trigger: ".parent",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    markers: true,
    onUpdate: function (self) {
      const index = Math.floor(
        gsap.utils.mapRange(0, 1, 1, frames.maxIndex, self.progress)
      );
      loadImage(index);
      updateScrollbar();
    },
  });
}

function autoScroll() {
  const duration = 60; // Duration of auto-scroll in seconds
  const scrollDistance =
    document.documentElement.scrollHeight - window.innerHeight;

  autoScrollAnimation = gsap.to(window, {
    duration: duration,
    scrollTo: scrollDistance,
    ease: "none",
    onUpdate: updateScrollbar,
  });

  window.addEventListener("wheel", interruptAutoScroll);
  window.addEventListener("touchstart", interruptAutoScroll);
  scrollbar.addEventListener("mousedown", interruptAutoScroll);
}

function interruptAutoScroll() {
  if (autoScrollAnimation) {
    autoScrollAnimation.kill(); // Stop the auto-scroll animation
    autoScrollAnimation = null;

    window.removeEventListener("wheel", interruptAutoScroll);
    window.removeEventListener("touchstart", interruptAutoScroll);
  }
}

function updateScrollbar() {
  const scrollPercentage =
    window.scrollY /
    (document.documentElement.scrollHeight - window.innerHeight);
  const thumbHeight = Math.max(
    20,
    (scrollbar.clientHeight * window.innerHeight) /
      document.documentElement.scrollHeight
  );
  scrollThumb.style.height = `${thumbHeight}px`;
  scrollThumb.style.top = `${
    scrollPercentage * (scrollbar.clientHeight - thumbHeight)
  }px`;
}

function showScrollNumber(e) {
  const rect = scrollbar.getBoundingClientRect();
  const percentage = (e.clientY - rect.top) / rect.height;
  const frameNumber = Math.floor(percentage * frames.maxIndex);
  const meters = frameNumber;

  scrollNumbers.textContent = `${meters}m`;
  scrollNumbers.style.top = `${e.clientY - rect.top}px`;
}

scrollbar.addEventListener("mousemove", showScrollNumber);
scrollbar.addEventListener("mouseleave", () => {
  scrollNumbers.textContent = "";
});

window.addEventListener("scroll", updateScrollbar);
window.addEventListener("resize", updateScrollbar);

updateScrollbar();

// Preload all images before starting the animation
preloadAllImages()
  .then(() => {
    // Hide the loading overlay once all images are preloaded
    loadingOverlay.style.display = "none";
    startAnimation();
    autoScroll();
  })
  .catch((error) => {
    console.error("Error preloading images:", error);
  });
