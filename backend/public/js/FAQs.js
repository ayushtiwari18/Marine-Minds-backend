document.addEventListener("DOMContentLoaded", function () {
  const faqSection = document.getElementById("FAQs-section");
  if (!faqSection) return;

  const faqs = faqSection.querySelectorAll("[data-faq]");

  faqs.forEach((faq) => {
    const question = faq.querySelector(".faq-question");
    if (!question) return;

    question.addEventListener("click", () => {
      // Close all other FAQs
      faqs.forEach((otherFaq) => {
        if (otherFaq !== faq && otherFaq.classList.contains("open")) {
          otherFaq.classList.remove("open");
        }
      });

      // Toggle the clicked FAQ
      faq.classList.toggle("open");
    });
  });
});
document.addEventListener("click", function (event) {
  if (event.target.closest(".faq-question")) {
    const faq = event.target.closest("[data-faq]");
    if (faq) {
      const faqSection = faq.closest("#FAQs-section");
      if (faqSection) {
        faqSection.querySelectorAll("[data-faq].open").forEach((openFaq) => {
          if (openFaq !== faq) openFaq.classList.remove("open");
        });
        faq.classList.toggle("open");
      }
    }
  }
});
