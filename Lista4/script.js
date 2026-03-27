(() => {
  const employeesCarouselEl = document.getElementById("employeesCarousel");
  if (employeesCarouselEl && window.mdb?.Carousel) {
    const carouselInner = employeesCarouselEl.querySelector(".carousel-inner");
    const employeeCards = carouselInner
      ? Array.from(carouselInner.querySelectorAll(".carousel-item .row > div")).map((n) => n.cloneNode(true))
      : [];
    const minCardWidth = 280;
    const maxPerSlide = 3;

    let currentPerSlide = 0;
    let carousel = null;

    const getPerSlide = () => {
      const width = employeesCarouselEl.clientWidth || window.innerWidth;
      return Math.max(1, Math.min(maxPerSlide, Math.floor(width / minCardWidth)));
    };

    const buildSlides = (perSlide) => {
      if (!carouselInner || !employeeCards.length) return;

      carouselInner.innerHTML = "";
      for (let i = 0; i < employeeCards.length; i += perSlide) {
        const item = document.createElement("div");
        item.className = `carousel-item${i === 0 ? " active" : ""}`;

        const row = document.createElement("div");
        row.className = "row g-4 justify-content-center";

        employeeCards.slice(i, i + perSlide).forEach((card) => {
          const col = card.cloneNode(true);
          col.className = "col";
          row.appendChild(col);
        });

        item.appendChild(row);
        carouselInner.appendChild(item);
      }
    };

    const ensureCarouselLayout = () => {
      const nextPerSlide = getPerSlide();
      if (nextPerSlide === currentPerSlide && carousel) return;

      currentPerSlide = nextPerSlide;
      const existing = window.mdb.Carousel.getInstance(employeesCarouselEl);
      existing?.dispose?.();

      buildSlides(currentPerSlide);
      carousel = new window.mdb.Carousel(employeesCarouselEl, { interval: false, touch: true });
      window.mdb?.initMDB?.({});
    };

    ensureCarouselLayout();

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
      if (deltaX > threshold) carousel?.prev?.();
      if (deltaX < -threshold) carousel?.next?.();
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

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ensureCarouselLayout();
      }, 120);
    });
  }

  const chartCanvas = document.getElementById("travelChart");
  if (chartCanvas && window.Chart) {
    const chartLabels = ["Włochy", "Hiszpania", "Japonia", "Islandia", "Portugalia", "Grecja"];
    const chartData = [278, 98, 165, 72, 184, 59];
    const chartColors = [
      "rgba(13,110,253,0.75)",
      "rgba(220,53,69,0.75)",
      "rgba(25,135,84,0.75)",
      "rgba(255,193,7,0.75)",
      "rgba(13,202,240,0.75)",
      "rgba(111,66,193,0.75)",
    ];

    const isMobileChart = () => window.matchMedia("(max-width: 767.98px)").matches;
    const setChartCanvasHeight = () => {
      chartCanvas.height = isMobileChart() ? 320 : 190;
    };

    const buildChartOptions = () => {
      const mobile = isMobileChart();
      return {
        indexAxis: mobile ? "y" : "x",
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1100, easing: "easeOutQuart" },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.08)" },
            ticks: {
              precision: 0,
              color: "#6c757d",
              font: { size: mobile ? 11 : 12 },
            },
          },
          y: {
            grid: { display: !mobile },
            ticks: {
              color: "#495057",
              autoSkip: false,
              font: { size: mobile ? 11 : 13, weight: "600" },
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              boxWidth: mobile ? 10 : 14,
              boxHeight: mobile ? 10 : 14,
              color: "#212529",
              font: { size: mobile ? 11 : 12, weight: "600" },
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x ?? ctx.parsed.y} rezerwacji`,
            },
          },
        },
      };
    };

    let travelChart = null;
    const createChart = () => {
      if (travelChart) return;
      setChartCanvasHeight();
      travelChart = new Chart(chartCanvas, {
        type: "bar",
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: "Liczba rezerwacji (2026)",
              data: chartData,
              backgroundColor: chartColors,
              borderWidth: 1,
              barThickness: isMobileChart() ? 18 : 28,
              maxBarThickness: isMobileChart() ? 24 : 36,
            },
          ],
        },
        options: buildChartOptions(),
      });
    };

    const chartSection = document.getElementById("destinations-chart") || chartCanvas;
    const chartObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            createChart();
            chartObserver.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    chartObserver.observe(chartSection);

    let chartResizeTimer = null;
    window.addEventListener("resize", () => {
      if (!travelChart) return;
      window.clearTimeout(chartResizeTimer);
      chartResizeTimer = window.setTimeout(() => {
        setChartCanvasHeight();
        travelChart.options = buildChartOptions();
        travelChart.data.datasets[0].barThickness = isMobileChart() ? 18 : 28;
        travelChart.data.datasets[0].maxBarThickness = isMobileChart() ? 24 : 36;
        travelChart.resize();
        travelChart.update("none");
      }, 120);
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
