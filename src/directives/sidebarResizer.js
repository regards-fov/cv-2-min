export default {
    mounted(el, binding) {
        const minWidth = binding.value?.minWidth
        const maxWidth = binding.value?.maxWidth
        const actual = binding.value.userWidth

        if (actual) {
            document.documentElement.style.setProperty('--sidebar-width', (actual) + 'px');
        }

        const handle = document.createElement('div')
        handle.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 6px;
            height: 100%;
            cursor: ew-resize;
            background: transparent;
            z-index: 3;
            border-radius: 5px;
            `
        handle.style.transition = 'background 0.2s'

        handle.addEventListener('mouseenter', () => {
            handle.style.background = 'rgba(59, 130, 246, 0.5)'
        })
        handle.addEventListener('mouseleave', () => {
            if (!el._isResizing) {
                handle.style.background = 'transparent'
            }
        })

        el.style.position = 'relative'
        el.appendChild(handle)

        const startResize = (e) => {
            el._isResizing = true
            el._startX = e.clientX
            el._startWidth = el.offsetWidth

            document.body.style.cursor = 'ew-resize'
            document.body.style.userSelect = 'none'

            document.addEventListener('mousemove', resize)
            document.addEventListener('mouseup', stopResize)
        }

        const resize = (e) => {
            const diff = e.clientX - el._startX
            let newWidth = el._startWidth + (diff * 0.35)

            newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))

            document.documentElement.style.setProperty('--sidebar-width', newWidth + 'px');

            el.style.width = newWidth + 'px'
        }

        const stopResize = () => {
            el._isResizing = false
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
            handle.style.background = 'transparent'

            document.removeEventListener('mousemove', resize)
            document.removeEventListener('mouseup', stopResize)

            const computedWidth = parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--sidebar-width'))

            el.dispatchEvent(new CustomEvent('sidebar-resized', {
                detail: { sidebarWidth: computedWidth },
                bubbles: true
            }))
        }

        handle.addEventListener('mousedown', startResize)

        el._resizeHandle = handle
    },

    unmounted(el) {
        if (el._resizeHandle) {
            el._resizeHandle.remove()
        }
    }
}