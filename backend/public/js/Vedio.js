document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("background-video");
  const videoContainer = document.querySelector(".video-container");

  let isHovering = false; // Track if mouse is hovering over video container

  videoContainer.addEventListener("mousemove", (e) => {
    if (!isHovering) return; // Only create ripples if hovering

    const rect = videoContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    createRipple(x, y);
  });

  videoContainer.addEventListener("mouseenter", () => {
    isHovering = true;
    video.play(); // Start playing the video when the mouse enters
  });

  videoContainer.addEventListener("mouseleave", () => {
    isHovering = false;
    video.pause(); // Pause the video when the mouse leaves
  });

  function createRipple(x, y) {
    const ripple = document.createElement("div");
    ripple.classList.add("ripple");
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    videoContainer.appendChild(ripple);

    // Remove ripple after animation completes to prevent DOM overload
    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  }
});
