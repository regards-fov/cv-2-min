export function dataToJson(cvModel) {
    console.log(cvModel);
    const jsonLocalStorage = localStorage.getItem(cvModel)
    const blob = new Blob([jsonLocalStorage], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cvData.json'
    a.click()

    URL.revokeObjectURL(url)
}