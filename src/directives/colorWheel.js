export default {
    mounted(el, binding) {
        const cursor = document.createElement('img');
        cursor.src = binding.value;
        cursor.className = 'color-wheel-cursor';
        document.body.appendChild(cursor);

        function updateCursor(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            if (e.target === el) {
                cursor.style.opacity = '1';
                el.style.cursor = 'none';

            } else {
                cursor.style.opacity = '0';
                el.style.cursor = '';

            }
        }

        function hideCursor() {
            cursor.style.opacity = '0';
            el.style.cursor = '';

        }

        el.__colorWheelHandlers = { updateCursor, hideCursor };
        el.__colorWheelCursor = cursor;

        el.addEventListener('mousemove', updateCursor);
        el.addEventListener('mouseleave', hideCursor);
    },

    unmounted(el) {
        if (el.__colorWheelHandlers) {
            const { updateCursor, hideCursor } = el.__colorWheelHandlers;
            el.removeEventListener('mousemove', updateCursor);
            el.removeEventListener('mouseleave', hideCursor);
            delete el.__colorWheelHandlers;
        }

        if (el.__colorWheelCursor) {
            el.__colorWheelCursor.remove();
            delete el.__colorWheelCursor;
        }
    }
};