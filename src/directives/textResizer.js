export default {
    mounted(el, binding) {
        const options = {
            id: binding.value.id,
            minFontSize: binding.value.minFontSize || 8,
            default: binding.value.default || 22
        }

        const target = document.getElementById(options.id)
        const input = document.getElementById(options.id + '-input')

        if (!target || !input) return

        const resize = () => {
            const parent = document.getElementById("personal-info")
            if (!parent) return

            const parentWidth = parent.clientWidth
            const textValue = input.value || target.textContent || input.placeholder || ''

            //Copie des styles de l'input pour récupérer la taille réelle
            const computedStyle = window.getComputedStyle(input)
            const span = document.createElement('span')
            span.style.cssText = `
                position: absolute;
                visibility: hidden;
                white-space: nowrap;
                font-size: ${options.default}pt;
                font-family: ${computedStyle.fontFamily};
                font-weight: ${computedStyle.fontWeight};
                letter-spacing: ${computedStyle.letterSpacing};
                padding: ${computedStyle.padding};
            `
            span.textContent = textValue
            document.body.appendChild(span)

            const textWidth = span.offsetWidth
            document.body.removeChild(span)

            let fontSize = options.default

            if (textWidth > parentWidth) {
                // 5% de marge pour compenser les imprécisions de rendu
                const adjustedRatio = (parentWidth * 0.95) / textWidth
                fontSize = Math.max(
                    options.minFontSize,
                    Math.floor(options.default * adjustedRatio)
                )
            }

            input.style.fontSize = fontSize + 'pt'
            target.style.fontSize = fontSize + 'pt'
        }

        input.addEventListener('input', resize)
        input.addEventListener('focus', resize)
        input.addEventListener('blur', () => {
            resize()
            setTimeout(() => {
                target.style.fontSize = input.style.fontSize
            }, 0)
        })

        // On observe les changements en temps réel
        const observer = new ResizeObserver(resize)
        if (target.parentElement) observer.observe(target.parentElement)
        if (input.parentElement && input.parentElement !== target.parentElement) {
            observer.observe(input.parentElement)
        }

        el._resizeObserver = observer
        el._resizeHandler = resize

        requestAnimationFrame(resize)
    },

    unmounted(el) {
        if (el._resizeHandler) {
            const options = el._bindingValue || {}
            const input = document.getElementById(options.id + '-input')
            if (input) {
                input.removeEventListener('input', el._resizeHandler)
                input.removeEventListener('blur', el._resizeHandler)
                input.removeEventListener('focus', el._resizeHandler)
            }
        }
        if (el._resizeObserver) el._resizeObserver.disconnect()
    },
}