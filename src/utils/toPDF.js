import { API_URL } from '@config/urls'

export async function exportToPDF() {

    let slug = window.location.href.split("/").pop();

    const localStorageData = localStorage.getItem(slug)

    const response = await fetch(`${API_URL}/api/cv/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            url: window.location.href,
            localStorage: localStorageData
        })
    })

    if (!response.ok) throw new Error('Export failed')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cv.pdf'
    a.click()
    window.URL.revokeObjectURL(url)
}