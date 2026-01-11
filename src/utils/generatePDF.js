import { API_URL } from '@config/urls'
import { usePdfGeneration } from '@composables/usePdfGeneration'

export async function generatePDF(action = 'download') {
    const { setGeneratingPdf } = usePdfGeneration()

    if (action === 'download') {
        setGeneratingPdf(true)
    }

    try {
        const slug = window.location.href.split("/").pop()
        const localStorageData = localStorage.getItem(slug)
        const json = JSON.parse(localStorageData)

        const fullNameItem = json.data.cv.personal?.find(item => item.key === 'fullName')
        const fullName = fullNameItem?.value?.replace(/\s+/g, '-') || 'CV'

        const response = await fetch(`${API_URL}/api/pdf/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                slug: slug,
                url: window.location.href,
                localStorage: localStorageData,
                fullName: fullName,
                action: action
            })
        })

        if (!response.ok) throw new Error('Export failed')

        if (action === 'store') {
            const data = await response.json()
            return data.url
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `CV-${fullName}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
    } finally {
        if (action === 'download') {
            setGeneratingPdf(false)
        }
    }
}