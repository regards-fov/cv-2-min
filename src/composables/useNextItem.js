import { computed } from 'vue';

export function useNextItem(storedData, defaultData) {
    const requiredFields = computed(() => {
        if (!defaultData.value) return [];
        return defaultData.value.filter(item => item.required === true);
    });

    const storedKeys = computed(() => {
        return storedData.value.map(item => item.key);
    });

    const missingRequiredFields = computed(() => {
        return requiredFields.value.filter(field =>
            !storedKeys.value.includes(field.key)
        );
    });

    function getNextItem() {
        const [firstMissing] = missingRequiredFields.value;

        if (firstMissing?.key) {
            return {
                key: firstMissing.key,
                value: firstMissing.value,
            };
        }
        return {
            key: 'extraInfo',
            value: "",
        };
    }

    return {
        getNextItem
    };
}