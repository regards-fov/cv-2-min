// autoResize.js - Directive Vue pour input auto-dimensionnable

export const autoResize = {
    mounted(el) {

        // Créer l'élément miroir
        const mirror = document.createElement('span')
        mirror.style.cssText = `
      visibility: hidden;
      white-space: pre;
      position: absolute;
      left: -9999px;
      top: 0;
      pointer-events: none;
    `
        mirror.setAttribute('aria-hidden', 'true')
        document.body.appendChild(mirror)

        // Stocker le miroir sur l'élément
        el._autoResizeMirror = mirror

        // Fonction de calcul de largeur
        const adjustWidth = () => {
            const computedStyle = window.getComputedStyle(el)

            // Copier les styles pertinents
            mirror.style.font = computedStyle.font
            mirror.style.fontFamily = computedStyle.fontFamily
            mirror.style.fontSize = computedStyle.fontSize
            mirror.style.fontWeight = computedStyle.fontWeight
            mirror.style.letterSpacing = computedStyle.letterSpacing
            mirror.style.textTransform = computedStyle.textTransform

            // Définir le contenu
            mirror.textContent = el.value || el.placeholder || ''


            // Calculer dimensions
            const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0
            const paddingRight = parseFloat(computedStyle.paddingRight) || 0
            const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0
            const borderRight = parseFloat(computedStyle.borderRightWidth) || 0

            const textWidth = mirror.offsetWidth
            const totalWidth = textWidth + paddingLeft + paddingRight + borderLeft + borderRight

            // Largeur minimale
            const minWidth = 40
            el.style.width = Math.max(totalWidth, minWidth) + 'px'
        }

        // Stocker la fonction
        el._autoResizeAdjust = adjustWidth

        // Écouter les changements
        el.addEventListener('input', adjustWidth)

        // Ajustement initial avec délai pour s'assurer que tout est monté
        setTimeout(adjustWidth, 0)

        // Ajuster après chargement des fonts
        if (document.fonts) {
            document.fonts.ready.then(adjustWidth)
        }
    },

    updated(el) {
        // Réajuster quand le placeholder ou la valeur change
        if (el._autoResizeAdjust) {
            setTimeout(el._autoResizeAdjust, 0)
        }
    },

    unmounted(el) {
        if (el._autoResizeMirror) {
            el._autoResizeMirror.remove()
        }
        if (el._autoResizeAdjust) {
            el.removeEventListener('input', el._autoResizeAdjust)
        }
    }
}

export default autoResize