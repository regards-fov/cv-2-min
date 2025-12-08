export const vZoom = {
    mounted(el, binding) {
        const options = {
            minZoom: binding.value?.minZoom ?? 1,
            maxZoom: binding.value?.maxZoom ?? 1.5,
            zoomStep: binding.value?.zoomStep ?? 0.05,
            initialZoom: binding.value?.initialZoom / 100,
            onZoomChange: binding.value?.onZoomChange ?? (() => { })
        };

        let currentZoom = options.initialZoom;

        const updateZoom = (newZoom) => {
            currentZoom = Math.max(options.minZoom, Math.min(options.maxZoom, newZoom));
            el.style.transform = `scale(${currentZoom})`;
            el.style.transformOrigin = '0 0';
            options.onZoomChange(currentZoom);
            el._zoomExternalCallback?.(currentZoom);
        };

        const handleWheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -options.zoomStep : options.zoomStep;
                updateZoom(currentZoom + delta);
            }
        };

        const handleKeydown = (e) => {
            if (!(e.ctrlKey || e.metaKey)) return;

            switch (e.key) {
                case '+':
                case '=':
                    e.preventDefault();
                    el._zoom.in();
                    break;
                case '-':
                    e.preventDefault();
                    el._zoom.out();
                    break;
                case '0':
                    e.preventDefault();
                    el._zoom.reset();
                    break;
            }
        };

        el._zoom = {
            in: () => updateZoom(currentZoom + options.zoomStep),
            out: () => updateZoom(currentZoom - options.zoomStep),
            set: (z) => updateZoom(z),
            get: () => currentZoom,
            onChange: (cb) => { el._zoomExternalCallback = cb; }
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeydown);

        el._zoomCleanup = () => {
            el.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeydown);
        };

        updateZoom(currentZoom);
    },

    unmounted(el) {
        el._zoomCleanup?.();
    }
};
