// Career Journey Data
const experiencesData = [
  {
    logo: "assets/images/company/clubmed.png",
    company: "Club Med",
    position: "Reception Traffic Manager",
    period: "Jul 2015 - Dec 2016, Full-time",
    skills: [
      "Time Orchestration",
      "Customer Satisfaction Management",
      "Budget Management",
      "Financial Analysis",
    ],
  },
  {
    logo: "assets/images/company/agoda.png",
    company: "Agoda",
    position: "Operations Coordinator",
    period: "Jan 2017 - Mar 2018, Full-time",
    skills: [
      "Customer Relationship Management",
      "Negotiation",
      "Key Account Management",
      "Training Skills",
    ],
  },
  {
    logo: "assets/images/company/airbnb.png",
    company: "Airbnb",
    position: "Experience Ambassador (Guangzhou)",
    period: "May 2019 - Jun 2020, Freelance",
    skills: ["Communication", "Market Sourcing", "Multi-tasking"],
  },
  {
    logo: "assets/images/company/samsung.png",
    company: "Samsung",
    position: "Chinese AI Creative Writer",
    period: "Jun 2021 - Mar 2024, Full-time",
    skills: [
      "NLP",
      "Project Lifecycle Management",
      "Product Management",
      "Market Research",
    ],
  },
  {
    logo: "assets/images/company/thesoul.png",
    company: "TheSoul Publishing",
    position: "Lead Social Media Manager",
    period: "Mar 2021 - Aug 2024, Freelance",
    skills: [
      "Social Media Marketing",
      "Stakeholder Management",
      "Resource Allocation",
      "Program Scheduling",
      "Asana",
    ],
  },
  {
    logo: "assets/images/company/google.png",
    company: "Google",
    position: "Transcreator",
    period: "Aug 2024 - Aug 2025, Part-time",
    skills: [
      "Translation and Localization",
      "Quality Assurance",
      "Prompt Engineering",
    ],
  },
  {
    logo: "assets/images/company/dda.png",
    company: "Dialogue Design Agency",
    position: "Localization Project Manager",
    period: "Apr 2024 - Present, Full-time",
    skills: [
      "Localization",
      "AI & LLM",
      "Program Planning",
      "Agile",
      "Leadership",
      "Documentation",
      "Data Annotation",
    ],
  },
];

let currentExperienceIndex = 0;
let isReversed = false;
let canvas, ctx;
let resizeTimeout;

function initCareerJourney() {
  const careerSection = document.getElementById("career-journey-content");
  if (!careerSection) return;

  canvas = document.getElementById("journey-canvas");
  if (!canvas) return;

  ctx = canvas.getContext("2d");
  resizeCanvas();

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
    }, 250);
  });

  const nextBtn = document.getElementById("next-experience-btn");
  const reverseBtn = document.getElementById("reverse-order-btn");
  const startJourneyBtn = document.getElementById("start-career-journey-btn");

  if (startJourneyBtn) {
    startJourneyBtn.addEventListener("click", () => {
      const intro = document.querySelector(".career-intro");
      const header = document.querySelector(".career-header");
      if (intro) intro.classList.add("hidden");
      if (header) header.style.display = "flex";
      showNextExperience();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", showNextExperience);
  }

  if (reverseBtn) {
    reverseBtn.addEventListener("click", toggleOrder);
  }

  // Reset journey when section becomes active
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.target.classList.contains("active") &&
        mutation.target.id === "career-journey-content"
      ) {
        resetJourney();
      }
    });
  });

  observer.observe(careerSection, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

function resizeCanvas() {
  if (!canvas) return;
  const container = canvas.parentElement;
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  redrawConnectors();
}

function resetJourney() {
  currentExperienceIndex = 0;
  isReversed = false;
  const timeline = document.getElementById("journey-timeline");
  const nextBtn = document.getElementById("next-experience-btn");
  const reverseBtn = document.getElementById("reverse-order-btn");
  const intro = document.querySelector(".career-intro");
  const header = document.querySelector(".career-header");

  if (timeline) timeline.innerHTML = "";
  if (nextBtn) {
    nextBtn.style.display = "none";
  }
  if (reverseBtn) {
    reverseBtn.style.display = "none";
    reverseBtn.classList.remove("reversed");
  }
  if (intro) {
    intro.classList.remove("hidden");
  }
  if (header) {
    header.style.display = "none";
  }

  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function showNextExperience() {
  if (currentExperienceIndex >= experiencesData.length) return;

  const timeline = document.getElementById("journey-timeline");
  const reverseBtn = document.getElementById("reverse-order-btn");
  const experience = experiencesData[currentExperienceIndex];

  const card = createExperienceCard(experience, currentExperienceIndex);

  // Remove previous connector and next button
  const existingNextBtn = timeline.querySelector(".next-button-wrapper");
  const existingConnector = timeline.querySelector(".experience-connector");
  if (existingNextBtn) {
    existingNextBtn.remove();
  }
  if (existingConnector) {
    existingConnector.remove();
  }

  timeline.appendChild(card);

  setTimeout(() => {
    card.classList.add("visible");
  }, 50);

  currentExperienceIndex++;

  // After card is visible, show connector and next button if not last card
  if (currentExperienceIndex < experiencesData.length) {
    setTimeout(() => {
      // Create connector with animated downward arrow along dashed line
      const connector = document.createElement("div");
      connector.className = "experience-connector";
      connector.innerHTML = `
        <svg width="24" height="60" viewBox="0 0 24 60" class="connector-svg">
          <line x1="12" y1="0" x2="12" y2="60" stroke="#ebebeb" stroke-width="2" stroke-dasharray="5,5"/>
          <line x1="12" y1="0" x2="12" y2="60" stroke="#FF385C" stroke-width="2" stroke-dasharray="5,5" opacity="0.35"/>
          <path d="M7 0 L12 8 L17 0" stroke="#FF385C" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0">
            <animateTransform attributeName="transform" type="translate"
              values="0 -4; 0 52"
              dur="1.6s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.25 0.1 0.25 1" />
            <animate attributeName="opacity"
              values="0; 1; 1; 0"
              keyTimes="0; 0.08; 0.82; 1"
              dur="1.6s"
              repeatCount="indefinite" />
          </path>
        </svg>
      `;
      timeline.appendChild(connector);

      // Create next button wrapper
      const nextBtnWrapper = document.createElement("div");
      nextBtnWrapper.className = "next-button-wrapper";
      nextBtnWrapper.innerHTML = `
        <button class="inline-next-button">
          <span>Next Experience</span>
        </button>
      `;
      timeline.appendChild(nextBtnWrapper);

      // Add click handler to inline button
      const inlineBtn = nextBtnWrapper.querySelector(".inline-next-button");
      inlineBtn.addEventListener("click", showNextExperience);

      // Animate connector
      setTimeout(() => {
        connector.classList.add("visible");
      }, 50);
    }, 300);
  } else {
    // All experiences shown, show reverse button
    setTimeout(() => {
      if (reverseBtn) {
        reverseBtn.style.display = "flex";
      }
    }, 300);
  }
}

function createExperienceCard(experience, index) {
  const card = document.createElement("div");
  card.className = "experience-card";
  card.setAttribute("data-index", index);

  const skillsHTML =
    experience.skills.length > 0
      ? `<div class="skills-container">
        ${experience.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
      </div>`
      : "";

  card.innerHTML = `
    <div class="experience-left">
      <div class="company-logo-container">
        <img src="${experience.logo}" alt="${experience.company}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'">
      </div>
      <div class="company-name">${experience.company}</div>
    </div>
    <div class="experience-right">
      <div class="position-title">${experience.position}</div>
      <div class="work-period">${experience.period}</div>
      ${skillsHTML}
    </div>
  `;

  return card;
}

function drawConnector(fromIndex, toIndex) {
  const cards = document.querySelectorAll(".experience-card");
  if (fromIndex >= cards.length || toIndex >= cards.length) return;

  const fromCard = cards[fromIndex];
  const toCard = cards[toIndex];

  const fromRect = fromCard.getBoundingClientRect();
  const toRect = toCard.getBoundingClientRect();
  const containerRect = canvas.parentElement.getBoundingClientRect();

  const startY = fromRect.bottom - containerRect.top;
  const endY = toRect.top - containerRect.top;
  const height = endY - startY;

  if (height <= 0) return;

  ctx.beginPath();
  ctx.strokeStyle = "#FF385C";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);

  const x = canvas.width / 2;
  ctx.moveTo(x, startY);
  ctx.lineTo(x, endY);
  ctx.stroke();

  ctx.stroke();
}

function redrawConnectors() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function toggleOrder() {
  const timeline = document.getElementById("journey-timeline");
  const reverseBtn = document.getElementById("reverse-order-btn");
  const cards = Array.from(timeline.querySelectorAll(".experience-card"));

  isReversed = !isReversed;
  reverseBtn.classList.toggle("reversed");

  // Fade out all cards
  cards.forEach((card) => card.classList.remove("visible"));

  setTimeout(() => {
    // Clear canvas
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Reverse and re-append
    cards.reverse().forEach((card, index) => {
      timeline.appendChild(card);
      setTimeout(() => {
        card.classList.add("visible");
      }, index * 100);
    });

    // Redraw connectors after all cards are visible
    setTimeout(
      () => {
        redrawConnectors();
      },
      cards.length * 100 + 200,
    );
  }, 400);
}
