/* =============================
   Корейский язык — TOPIK I
   Скрипты: аккордеон и задания
   ============================= */

document.addEventListener("DOMContentLoaded", () => {
  initAccordion();
  initExercises();
  openFromHash();
  if (document.querySelector(".comic")) {
    trackGoal("watch_comic");
  }
});

/* ---------- Метрика: цели для обоих счётчиков ---------- */

const METRICA_IDS = [113306247, 113307696];

function trackGoal(goal) {
  if (typeof window.ym !== "function") return;
  METRICA_IDS.forEach((id) => window.ym(id, "reachGoal", goal));
}

/* ---------- Акордеон с текстами ---------- */

function initAccordion() {
  const heads = document.querySelectorAll(".accordion-head");

  heads.forEach((head) => {
    head.addEventListener("click", () => {
      const item = head.closest(".accordion-item");
      if (item.classList.toggle("open")) {
        trackGoal("open_text");
      }
    });
  });
}

/* ---------- Задания с проверкой ответа ---------- */

function initExercises() {
  const exercises = document.querySelectorAll(".exercise");

  exercises.forEach((ex) => {
    const correctIndex = parseInt(ex.dataset.answer, 10);
    const options = ex.querySelectorAll(".option");
    const feedback = ex.querySelector(".feedback");

    options.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        // если уже отвечали — блокируем
        if (ex.dataset.done === "true") return;
        ex.dataset.done = "true";

        if (index === correctIndex) {
          btn.classList.add("correct");
          feedback.textContent = "정답! (Правильно!)";
          feedback.classList.add("show", "good");
          trackGoal("correct_answer");
        } else {
          btn.classList.add("wrong");
          options[correctIndex].classList.add("correct");
          feedback.textContent = "아니요… (Неверно, правильный ответ подсвечен)";
          feedback.classList.add("show", "bad");
        }

        options.forEach((b) => (b.disabled = true));

        // цель: все 3 задания текста отвечены
        const body = ex.closest(".accordion-body");
        const allDone =
          body &&
          [...body.querySelectorAll(".exercise")].every(
            (e) => e.dataset.done === "true"
          );
        if (allDone) trackGoal("all_answers");
      });
    });
  });
}

/* ---------- Открывать текст, если в адресе есть #text-N ---------- */

function openFromHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const item = document.querySelector(hash);
  if (item && item.classList.contains("accordion-item")) {
    item.classList.add("open");
    trackGoal("open_text");
  }
}
