(() => {
  const introEl = document.getElementById("intro");
  if (introEl) {
    let latestY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = Math.max(0, latestY);
      const offset = Math.min(120, y * 0.18);
      introEl.style.backgroundPosition = `center calc(50% + ${offset}px)`;
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        latestY = window.scrollY;
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
  }

  const employeesCarouselEl = document.getElementById("employeesCarousel");
  if (employeesCarouselEl && window.mdb?.Carousel) {
    const carousel =
      window.mdb.Carousel.getInstance(employeesCarouselEl) ||
      new window.mdb.Carousel(employeesCarouselEl, { interval: false, touch: true });

    let startX = null;
    let isPointerDown = false;

    const onPointerDown = (e) => {
      isPointerDown = true;
      startX = e.clientX;
      employeesCarouselEl.setPointerCapture?.(e.pointerId);
    };

    const onPointerUp = (e) => {
      if (!isPointerDown || startX === null) return;
      const deltaX = e.clientX - startX;
      const threshold = 50;
      if (deltaX > threshold) carousel.prev();
      if (deltaX < -threshold) carousel.next();
      isPointerDown = false;
      startX = null;
      employeesCarouselEl.releasePointerCapture?.(e.pointerId);
    };

    employeesCarouselEl.addEventListener("pointerdown", onPointerDown);
    employeesCarouselEl.addEventListener("pointerup", onPointerUp);
    employeesCarouselEl.addEventListener("pointercancel", () => {
      isPointerDown = false;
      startX = null;
    });
  }

  const chartCanvas = document.getElementById("travelChart");
  if (chartCanvas && window.Chart) {
    new Chart(chartCanvas, {
      type: "bar",
      data: {
        labels: ["Włochy", "Hiszpania", "Japonia", "Islandia", "Portugalia", "Grecja"],
        datasets: [
          {
            label: "Liczba rezerwacji (2026)",
            data: [278, 98, 165, 72, 184, 59],
            backgroundColor: [
              "rgba(13,110,253,0.75)",
              "rgba(220,53,69,0.75)",
              "rgba(25,135,84,0.75)",
              "rgba(255,193,7,0.75)",
              "rgba(13,202,240,0.75)",
              "rgba(111,66,193,0.75)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1100, easing: "easeOutQuart" },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#495057", font: { size: 13, weight: "600" } },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.08)" },
            ticks: { precision: 0, color: "#6c757d", font: { size: 12 } },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: { boxWidth: 14, boxHeight: 14, color: "#212529", font: { weight: "600" } },
          },
          animation: { duration: 250 },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} rezerwacji`,
            },
          },
        },
      },
    });
  }

  const magnetButtons = document.querySelectorAll(".btn-magnet");
  magnetButtons.forEach((btn) => {
    const strength = 10;
    const onMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
    };
    const onLeave = () => {
      btn.style.transform = "";
    };
    btn.addEventListener("pointermove", onMove);
    btn.addEventListener("pointerleave", onLeave);
  });

  const tiltCards = document.querySelectorAll(".tilt-card");
  tiltCards.forEach((card) => {
    const maxTilt = 10;
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const tiltY = (px - 0.5) * (maxTilt * 2);
      const tiltX = (0.5 - py) * (maxTilt * 2);
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
    };
    const onLeave = () => {
      card.style.transform = "";
    };
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
  });

  const counters = document.querySelectorAll(".counter");
  if (counters.length) {
    const animateCounter = (el) => {
      const to = Number(el.dataset.counterTo || "0");
      const suffix = el.dataset.counterSuffix || "";
      const duration = 900;
      const start = performance.now();
      const from = 0;

      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.round(from + (to - from) * eased);
        el.textContent = `${value}${suffix}`;
        if (t < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            if (!el.dataset.counterDone) {
              el.dataset.counterDone = "1";
              animateCounter(el);
            }
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => io.observe(c));
  }

  const animatedSections = document.querySelectorAll(".animate-on-scroll");
  if (animatedSections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    animatedSections.forEach((el) => observer.observe(el));
  }

  const forms = document.querySelectorAll("form[novalidate]");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        alert("Dziękujemy! Wiadomość została wysłana.");
      }
      form.classList.add("was-validated");
    });
  });
})();
