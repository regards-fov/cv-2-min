import { ref } from 'vue';

//TODO : add bearer token
export function useAI() {
    const isLoading = ref(false);
    const error = ref(null);

    async function enhanceText(text, context, targetRole, tone) {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch('http://localhost:3000/api/enhance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, context, targetRole, tone })
            });


            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Erreur serveur');
            }

            return data.enhanced;

        } catch (err) {
            console.log(err);
            error.value = err.message;
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        isLoading,
        error,
        enhanceText,
    };
}