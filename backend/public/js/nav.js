document.addEventListener("DOMContentLoaded", function () {
  const navbarToggle = document.querySelector(".navbar-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  navbarToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    this.classList.toggle("active");
  });

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      const parent = this.parentElement;
      const dropdownMenu = parent.querySelector(".dropdown-menu");

      dropdownMenu.classList.toggle("active");

      // Close other open dropdowns
      dropdownToggles.forEach((otherToggle) => {
        if (otherToggle !== this) {
          const otherParent = otherToggle.parentElement;
          const otherDropdownMenu = otherParent.querySelector(".dropdown-menu");
          otherDropdownMenu.classList.remove("active");
        }
      });
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item")) {
      const dropdownMenus = document.querySelectorAll(".dropdown-menu");
      dropdownMenus.forEach((menu) => menu.classList.remove("active"));
    }
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      navMenu.classList.remove("active");
      navbarToggle.classList.remove("active");
    }
  });
});
