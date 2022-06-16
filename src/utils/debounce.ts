export const debounce = (callback: (...args: any[]) => void, delay = 250) => {
    let timeoutId: NodeJS.Timeout | null
    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            timeoutId = null
            callback(...args)
        }, delay)
    }
}
