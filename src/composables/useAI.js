import { ref } from 'vue'
import { API_URL } from '@config/urls'


export function useAI() {
    const isLoading = ref(false);
    const error = ref(null);

    async function enhanceText(text, context, targetRole, tone) {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/api/enhance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
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