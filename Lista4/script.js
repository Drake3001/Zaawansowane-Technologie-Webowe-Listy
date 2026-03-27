(() => {
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
        maintainAspectRatio: true,
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

  const forms = document.querySelectorAll("form[novalidate]");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        alert("Dziękujemy! Wiadomość została wysłana.");
        form.reset();
        form.classList.remove("was-validated");
      }
      form.classList.add("was-validated");
    });
  });
})();
