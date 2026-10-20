const screens = [
  { title: "Home", image: "01 Home.png", alt: "Home screen with nearby books, search and genre discovery", description: "A welcoming neighborhood feed introduces Borrowly and surfaces books close by." },
  { title: "Find a Book", image: "02 Find a Book.png", alt: "Find a book screen with search and genre filters", description: "Search by title or author, or start with a genre and browse nearby." },
  { title: "Search Results", image: "03 Search Results.png", alt: "Search results for books available nearby", description: "Compare available reads and distance at a glance." },
  { title: "Book Details", image: "04 Book Details.png", alt: "Book details screen for The Alchemist", description: "Get to know the book, its availability, and the person lending it." },
  { title: "Lender Profile", image: "05 Lender Profile.png", alt: "Profile for a book lender", description: "Put a friendly face and useful context behind each nearby listing." },
  { title: "Select Duration", image: "06 Select Duration.png", alt: "Choose the borrowing duration", description: "Choose when to borrow and when the book is due back." },
  { title: "Handover Method", image: "07 Handover Method.png", alt: "Choose a handover method", description: "Agree how the book will make its way between neighbors." },
  { title: "Confirm Request", image: "08 Confirm Request.png", alt: "Review book borrowing request details", description: "Review the dates, handover, and costs before sending a request." },
  { title: "Request Sent", image: "09 Request Sent.png", alt: "Confirmation that the borrowing request was sent", description: "A clear confirmation explains what happens while the lender responds." },
  { title: "Borrowing Status", image: "10 Borrowing Status.png", alt: "Track the status of a book borrowing request", description: "Keep the request and borrowing timeline easy to revisit." }
];

const wireframes = screens.map((screen, index) => ({
  ...screen,
  image: `${String(index + 1).padStart(2, "0")} ${screen.title} Wireframe.png`,
  alt: `${screen.title} wireframe`
}));

const stepContent = [
  ["Start with what’s nearby.", "Open on a welcoming neighborhood feed. See available books close by, get inspired, and begin with a simple search."],
  ["A search for your next chapter.", "Search by title, author, or a little inspiration—or browse by genre to find a book that feels right."],
  ["See what’s waiting nearby.", "Browse matching books with helpful details like availability, lender, and distance."],
  ["Get to know the book.", "Explore the book details and see who has it before deciding to send a request."],
  ["Know who you’re borrowing from.", "Meet the lender and feel confident about the person sharing their shelf."],
  ["Set a time that works.", "Choose the borrowing duration and make the return date clear from the start."],
  ["Make the handover easy.", "Choose a practical way to collect the book and coordinate with your neighbor."],
  ["Check the details together.", "Review the book, dates, handover, and costs before sending your request."],
  ["Send a thoughtful request.", "The lender gets a clear request, and you know what to expect while they respond."],
  ["Keep the story on track.", "Follow your borrowing status and stay up to date on what happens next."]
];

const imagePath = (file, collection = "UI Screens") => `./${encodeURIComponent(collection).replaceAll("%2F", "/")}/${encodeURIComponent(file)}`;
const gallery = document.querySelector("#screen-gallery");
const lightbox = document.querySelector("#screen-lightbox");
let currentGallery = screens;
let currentScreen = 0;
let currentStep = 0;

function renderGallery(items, collection) {
  currentGallery = items;
  gallery.replaceChildren(...items.map((screen, index) => {
    const card = document.createElement("article");
    card.className = "screen-card";
    const button = document.createElement("button");
    button.className = "screen-card-button";
    button.type = "button";
    button.setAttribute("aria-label", `Enlarge ${screen.title} ${collection === "Wireframes" ? "wireframe" : "screen"}`);
    button.innerHTML = `<span class="screen-thumb"><img src="${imagePath(screen.image, collection)}" alt="${screen.alt}" loading="lazy"><span class="thumb-zoom" aria-hidden="true">↗</span></span><span class="screen-meta"><span class="screen-title">${screen.title}</span><span class="screen-number">${String(index + 1).padStart(2, "0")}</span></span>`;
    button.addEventListener("click", () => openLightbox(index));
    card.append(button);
    return card;
  }));
  document.querySelector("#gallery-count").textContent = `${items.length} ${collection === "Wireframes" ? "wireframes" : "screens"}`;
}

function setStep(index) {
  currentStep = (index + screens.length) % screens.length;
  const screen = screens[currentStep];
  document.querySelectorAll(".journey-step").forEach((button, step) => {
    const selected = step === currentStep;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  document.querySelector("#step-count").textContent = `${String(currentStep + 1).padStart(2, "0")} / 10`;
  document.querySelector("#step-index").textContent = `STEP ${String(currentStep + 1).padStart(2, "0")}`;
  document.querySelector("#step-title").textContent = stepContent[currentStep][0];
  document.querySelector("#step-description").textContent = stepContent[currentStep][1];
  const image = document.querySelector("#journey-image");
  image.src = imagePath(screen.image);
  image.alt = screen.alt;
  document.querySelector("#progress-fill").style.width = `${((currentStep + 1) / screens.length) * 100}%`;
}

function openLightbox(index) {
  currentScreen = index;
  const screen = currentGallery[currentScreen];
  const collection = document.querySelector(".gallery-tab.is-active").dataset.gallery === "wireframes" ? "Wireframes" : "UI Screens";
  document.querySelector("#lightbox-image").src = imagePath(screen.image, collection);
  document.querySelector("#lightbox-image").alt = screen.alt;
  document.querySelector("#lightbox-caption").textContent = `${String(currentScreen + 1).padStart(2, "0")} / ${currentGallery.length} · ${screen.title}${collection === "Wireframes" ? " wireframe" : ""}`;
  lightbox.showModal();
}

function moveLightbox(direction) {
  openLightbox((currentScreen + direction + currentGallery.length) % currentGallery.length);
}

document.querySelectorAll(".journey-step").forEach(button => {
  button.addEventListener("click", () => setStep(Number(button.dataset.step)));
});
document.querySelector("#step-prev").addEventListener("click", () => setStep(currentStep - 1));
document.querySelector("#step-next").addEventListener("click", () => setStep(currentStep + 1));
document.querySelectorAll(".gallery-tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".gallery-tab").forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    renderGallery(button.dataset.gallery === "wireframes" ? wireframes : screens, button.dataset.gallery === "wireframes" ? "Wireframes" : "UI Screens");
  });
});
document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
document.querySelector(".lightbox-prev").addEventListener("click", () => moveLightbox(-1));
document.querySelector(".lightbox-next").addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) lightbox.close();
});
document.addEventListener("keydown", event => {
  if (!lightbox.open) return;
  if (event.key === "ArrowRight") moveLightbox(1);
  if (event.key === "ArrowLeft") moveLightbox(-1);
});

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  menuButton.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  nav.classList.toggle("is-open", !expanded);
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
}));

renderGallery(screens, "UI Screens");
setStep(0);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach(element => observer.observe(element));
} else {
  document.querySelectorAll("[data-reveal]").forEach(element => element.classList.add("is-visible"));
}
