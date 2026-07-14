console.log("Profile website loaded successfully.");

// Highlight the current section's nav link as the user scrolls
const sections = document.querySelectorAll("section[id], header[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const setActiveLink = () => {
  let currentId = "home";
  const scrollY = window.scrollY + 120;

  sections.forEach((section) => {
    if (scrollY >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.style.color = link.getAttribute("href") === `#${currentId}` ? "var(--amber)" : "";
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();

// Log outbound project/contact clicks (useful for local debugging)
document.querySelectorAll("a[target='_blank']").forEach((link) => {
  link.addEventListener("click", () => {
    console.log(`Opening: ${link.href}`);
  });
});
