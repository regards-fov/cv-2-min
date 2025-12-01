// tooltip.js - Directive Vue pour tooltips au survol avec condition

const createTooltip = (el, binding) => {
    const config = typeof binding.value === 'string'
        ? { text: binding.value, show: true }
        : binding.value;

    if (!config.show) return;

    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'custom-tooltip';
    tooltipEl.textContent = config.text;
    tooltipEl.style.cssText = `
      position: absolute;
      background: #1a1a1a;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      white-space: nowrap;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(tooltipEl);
    el._tooltip = tooltipEl;

    const position = binding.arg || 'top';

    const showTooltip = () => {
        const rect = el.getBoundingClientRect();

        switch (position) {
            case 'top':
                tooltipEl.style.left = rect.left + rect.width / 2 + 'px';
                tooltipEl.style.top = rect.top - 8 + 'px';
                tooltipEl.style.transform = 'translate(-50%, -100%)';
                break;
            case 'bottom':
                tooltipEl.style.left = rect.left + rect.width / 2 + 'px';
                tooltipEl.style.top = rect.bottom + 8 + 'px';
                tooltipEl.style.transform = 'translate(-50%, 0)';
                break;
            case 'left':
                tooltipEl.style.left = rect.left - 8 + 'px';
                tooltipEl.style.top = rect.top + rect.height / 2 + 'px';
                tooltipEl.style.transform = 'translate(-100%, -50%)';
                break;
            case 'right':
                tooltipEl.style.left = rect.right + 8 + 'px';
                tooltipEl.style.top = rect.top + rect.height / 2 + 'px';
                tooltipEl.style.transform = 'translate(0, -50%)';
                break;
        }

        tooltipEl.style.opacity = '1';
    };

    const hideTooltip = () => {
        tooltipEl.style.opacity = '0';
    };

    el.addEventListener('mouseenter', showTooltip);
    el.addEventListener('mouseleave', hideTooltip);

    el._showTooltip = showTooltip;
    el._hideTooltip = hideTooltip;
};

const destroyTooltip = (el) => {
    if (el._showTooltip) {
        el.removeEventListener('mouseenter', el._showTooltip);
        el.removeEventListener('mouseleave', el._hideTooltip);
    }
    if (el._tooltip) {
        el._tooltip.remove();
        el._tooltip = null;
    }
};

export const vTooltip = {
    mounted(el, binding) {
        createTooltip(el, binding);
    },

    updated(el, binding) {
        const config = typeof binding.value === 'string'
            ? { text: binding.value, show: true }
            : binding.value;

        // Si le tooltip n'existe pas et qu'on doit l'afficher, le créer
        if (!el._tooltip && config.show) {
            createTooltip(el, binding);
            return;
        }

        // Si le tooltip existe et qu'on doit le cacher, le supprimer
        if (el._tooltip && !config.show) {
            destroyTooltip(el);
            return;
        }

        // Sinon mettre à jour le texte
        if (el._tooltip) {
            el._tooltip.textContent = config.text;
        }
    },

    unmounted(el) {
        destroyTooltip(el);
    }
};