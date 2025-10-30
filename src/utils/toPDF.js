export async function exportToPDF() {
    if ('print' in window) {
        const beforePrint = () => {
            document.title = 'Mon_CV';
        };

        window.addEventListener('beforeprint', beforePrint);
        window.print();
        window.removeEventListener('beforeprint', beforePrint);
    }
};