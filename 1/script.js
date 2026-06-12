/**
 * ТехноУчёт v1.0 — Service Dashboard Logic
 */

(function () {
  'use strict';

  // ─── State ────────────────────────────────────────────────
  let activeCount = parseInt(
    document.getElementById('activeCounter').textContent,
    10
  );

  // ─── completeRepair ───────────────────────────────────────
  /**
   * @param {HTMLButtonElement} btn — кнопка «Завершить ремонт»
   */
  window.completeRepair = function (btn) {
    const row = btn.closest('tr');
    if (!row) return;

    // 1. Обновляем badge статуса
    const badge = row.querySelector('.status-badge');
    if (badge) {
      badge.textContent = '';          // очищаем, перепишем через ::before + текст
      badge.className = 'status-badge status--done';
      badge.textContent = 'Готов';
    }

    // 2. Деактивируем кнопку
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Завершён';

    // 3. Визуально гасим строку
    row.classList.add('row--done');

    // 4. Уменьшаем счётчик активных ремонтов
    activeCount = Math.max(0, activeCount - 1);
    updateCounter(activeCount);

    // 5. Обновляем карточку «Готовы к выдаче»
    const statReady = document.getElementById('statReady');
    if (statReady) {
      statReady.textContent = parseInt(statReady.textContent, 10) + 1;
    }

    // 6. Обновляем карточку «В работе»
    const statInWork = document.getElementById('statInWork');
    if (statInWork) {
      const current = parseInt(statInWork.textContent, 10);
      statInWork.textContent = Math.max(0, current - 1);
    }
  };

  // ─── updateCounter ────────────────────────────────────────
  function updateCounter(value) {
    const el = document.getElementById('activeCounter');
    if (!el) return;

    el.textContent = value;

    // Маленькая анимация «прыжка»
    el.classList.remove('bump');
    // Форсируем reflow, чтобы класс добавился заново
    void el.offsetWidth;
    el.classList.add('bump');

    el.addEventListener('transitionend', () => {
      el.classList.remove('bump');
    }, { once: true });

    // Когда ремонтов не осталось — гасим акцент
    if (value === 0) {
      el.style.color = 'var(--text-muted)';
    }
  }

})();