// draggable-improved.js - Directive Vue.js avec placeholder fixe et indicateurs

const dragState = new WeakMap();
let currentDraggedElement = null;
let currentPlaceholder = null;

export const draggable = {
    mounted(el, binding) {
        const options = binding.value || {};
        const handle = options.handle || null;
        const onReorder = options.onReorder || (() => { });
        const disabled = options.disabled || false;
        const modelValue = options.modelValue || null; // ← Array à réorganiser

        if (disabled) return;

        const listeners = {};
        const dragHandle = handle ? el.querySelector(handle) : el;

        if (!dragHandle) {
            console.warn('[draggable] Drag handle not found:', handle);
            return;
        }

        el.setAttribute('draggable', 'true');
        dragHandle.style.cursor = 'grab';

        // === DRAG START ===
        listeners.dragstart = (e) => {
            if (handle && !e.target.closest(handle)) {
                e.preventDefault();
                return;
            }

            currentDraggedElement = el;

            setTimeout(() => {
                el.classList.add('dragging');

                // Créer le placeholder FIXE à la position d'origine
                const placeholder = document.createElement('div');
                placeholder.classList.add('drag-placeholder');
                placeholder.style.height = el.offsetHeight + 'px';
                placeholder.style.width = el.offsetWidth + 'px';
                placeholder.dataset.placeholder = 'true';

                el.parentNode.insertBefore(placeholder, el);
                currentPlaceholder = placeholder;
            }, 0);

            dragHandle.style.cursor = 'grabbing';

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', el.dataset.id || '');

            if (options.dragImage !== false) {
                const ghost = el.cloneNode(true);
                ghost.style.opacity = '0.7';
                ghost.style.transform = 'rotate(2deg)';
                document.body.appendChild(ghost);
                e.dataTransfer.setDragImage(ghost, e.offsetX, e.offsetY);
                setTimeout(() => ghost.remove(), 0);
            }
        };

        // === DRAG END ===
        listeners.dragend = () => {
            el.classList.remove('dragging');
            dragHandle.style.cursor = 'grab';

            // Supprimer le placeholder
            if (currentPlaceholder && currentPlaceholder.parentNode) {
                currentPlaceholder.remove();
            }

            // Nettoyer tous les indicateurs
            document.querySelectorAll('.drag-hover-zone, .drop-indicator-top, .drop-indicator-bottom').forEach(item => {
                item.classList.remove('drag-hover-zone', 'drop-indicator-top', 'drop-indicator-bottom');
            });

            currentDraggedElement = null;
            currentPlaceholder = null;
        };

        // === DRAG OVER ===
        listeners.dragover = (e) => {
            e.preventDefault();

            if (!currentDraggedElement || el === currentDraggedElement) {
                return;
            }

            // Ignorer le placeholder
            if (el.dataset.placeholder === 'true') {
                return;
            }

            e.dataTransfer.dropEffect = 'move';

            // Ajouter un effet subtil au survol
            if (!el.classList.contains('drag-hover-zone')) {
                el.classList.add('drag-hover-zone');
            }

            // Calculer la position de l'indicateur
            const rect = el.getBoundingClientRect();
            const isVertical = options.direction !== 'horizontal';

            // Nettoyer les anciens indicateurs sur cet élément
            el.classList.remove('drop-indicator-top', 'drop-indicator-bottom');

            let insertBefore;
            if (isVertical) {
                const middle = rect.top + rect.height / 2;
                insertBefore = e.clientY < middle;
            } else {
                const middle = rect.left + rect.width / 2;
                insertBefore = e.clientX < middle;
            }

            // Ajouter l'indicateur de position
            if (insertBefore) {
                el.classList.add('drop-indicator-top');
            } else {
                el.classList.add('drop-indicator-bottom');
            }
        };

        // === DRAG ENTER ===
        listeners.dragenter = (e) => {
            e.preventDefault();
            if (currentDraggedElement && el !== currentDraggedElement && el.dataset.placeholder !== 'true') {
                el.classList.add('drag-hover-zone');
            }
        };

        // === DRAG LEAVE ===
        listeners.dragleave = (e) => {
            if (!el.contains(e.relatedTarget)) {
                el.classList.remove('drag-hover-zone', 'drop-indicator-top', 'drop-indicator-bottom');
            }
        };

        // === DROP ===
        listeners.drop = (e) => {
            e.preventDefault();
            e.stopPropagation();

            el.classList.remove('drag-hover-zone', 'drop-indicator-top', 'drop-indicator-bottom');

            if (!currentDraggedElement || el === currentDraggedElement || el.dataset.placeholder === 'true') {
                return;
            }

            const parent = el.parentNode;

            // Récupérer les indices en excluant le placeholder
            const allItems = Array.from(parent.children).filter(child =>
                child.hasAttribute('draggable') && child.dataset.placeholder !== 'true'
            );

            const draggedIndex = allItems.indexOf(currentDraggedElement);

            const targetIndex = allItems.indexOf(el);

            if (draggedIndex === -1 || targetIndex === -1) {
                console.warn('[draggable] Invalid drag operation');
                return;
            }

            // Supprimer le placeholder AVANT l'insertion
            if (currentPlaceholder && currentPlaceholder.parentNode) {
                currentPlaceholder.remove();
                currentPlaceholder = null;
            }

            // Déterminer la position d'insertion
            const rect = el.getBoundingClientRect();
            const isVertical = options.direction !== 'horizontal';

            let insertBefore;
            if (isVertical) {
                const middle = rect.top + rect.height / 2;
                insertBefore = e.clientY < middle;
            } else {
                const middle = rect.left + rect.width / 2;
                insertBefore = e.clientX < middle;
            }

            // Insérer l'élément
            if (insertBefore) {
                parent.insertBefore(currentDraggedElement, el);
            } else {
                parent.insertBefore(currentDraggedElement, el.nextSibling);
            }

            // Calculer le nouvel index APRÈS l'insertion
            const newItems = Array.from(parent.children).filter(child =>
                child.hasAttribute('draggable')
            );
            const newIndex = newItems.indexOf(currentDraggedElement);

            // Réorganiser le modelValue si fourni
            let reorderedArray = null;
            if (modelValue && Array.isArray(modelValue)) {
                const item = modelValue[draggedIndex];
                const newArray = [...modelValue];
                newArray.splice(draggedIndex, 1);
                newArray.splice(newIndex, 0, item);
                reorderedArray = newArray;
            }

            // Callback
            onReorder({
                oldIndex: draggedIndex,
                newIndex: newIndex,
                element: currentDraggedElement,
                items: newItems,
                modelValue: reorderedArray
            });
        };

        // Attacher tous les listeners
        Object.entries(listeners).forEach(([event, handler]) => {
            el.addEventListener(event, handler);
        });

        dragState.set(el, { listeners, dragHandle });
    },

    updated(el, binding) {
        const options = binding.value || {};
        const disabled = options.disabled || false;

        if (disabled) {
            el.setAttribute('draggable', 'false');
            const state = dragState.get(el);
            if (state?.dragHandle) {
                state.dragHandle.style.cursor = 'not-allowed';
            }
        } else {
            el.setAttribute('draggable', 'true');
            const state = dragState.get(el);
            if (state?.dragHandle) {
                state.dragHandle.style.cursor = 'grab';
            }
        }
    },

    unmounted(el) {
        const state = dragState.get(el);

        if (state) {
            Object.entries(state.listeners).forEach(([event, handler]) => {
                el.removeEventListener(event, handler);
            });

            el.removeAttribute('draggable');
            if (state.dragHandle) {
                state.dragHandle.style.cursor = '';
            }

            dragState.delete(el);
        }

        if (currentDraggedElement === el) {
            currentDraggedElement = null;
        }

        if (currentPlaceholder && currentPlaceholder.dataset) {
            currentPlaceholder = null;
        }
    }
};

export default draggable;