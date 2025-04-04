import { NewTask } from "./tasks/types"

export const COLORS = ['#F7BFA8', '#E8E274', '#97E874', '#74E8E8', '#96B8EB', '#B498F5', '#F7A8E0', '#FFFFFF']

export const getNewTask = (): NewTask => {
    return {
        id: null,
        created_at: null,
        title: '',
        description: '',
        deadline: null,
        completed: false,
        color_code: COLORS[Math.floor(Math.random() * COLORS.length)]
    }
}

type DeadlineFormat = 'long' | 'short'

export function formatDeadline(deadline: Date | null, format: DeadlineFormat = 'long'): string {
    if (!deadline) return 'No Deadline'

    const now = new Date()
    deadline = new Date(deadline)

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const target = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate())

    const diffInDays = (target.getTime() - today.getTime()) / (1000 * 3600 * 24)
    const diffInMonths = Math.floor((target.getTime() - today.getTime()) / (1000 * 3600 * 24 * 30))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Tomorrow'
    if (diffInDays === -1) return 'Yesterday'

    if (format === 'short') {
        if (diffInMonths < 6) {
            return deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }

        if (diffInMonths >= 6 && diffInMonths < 12) {
            return `In ${diffInMonths} months`
        }
        
        if (deadline.getFullYear() === now.getFullYear() + 1 && diffInMonths < 18) {
            return 'Next Year'
        }
    
        if (diffInMonths < 24) {
            return 'More than a year away'
        }
    
        return `In ${Math.floor(diffInMonths / 12)} years`
    }

    return deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const getDarkModeColor = (hexColor: string) => {
    if (!hexColor) return "#000000"

    let r = parseInt(hexColor.slice(1, 3), 16)
    let g = parseInt(hexColor.slice(3, 5), 16)
    let b = parseInt(hexColor.slice(5, 7), 16)

    let hsl = rgbToHsl(r, g, b)
    
    hsl[2] = Math.max(10, hsl[2] * 0.4)

    return hslToHex(hsl[0], hsl[1], hsl[2])
}

const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255, g /= 255, b /= 255
    let max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
        let d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0)
            break

            case g: h = (b - r) / d + 2 
            break

            case b: h = (r - g) / d + 4 
            break
        }
        h /= 6
    }

    return [h * 360, s * 100, l * 100]
}

const hslToHex = (h: number, s: number, l: number) => {
    s /= 100
    l /= 100

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0, g = 0, b = 0

    if (h < 60) { r = c, g = x, b = 0 }
    else if (h < 120) { r = x, g = c, b = 0 }
    else if (h < 180) { r = 0, g = c, b = x }
    else if (h < 240) { r = 0, g = x, b = c }
    else if (h < 300) { r = x, g = 0, b = c }
    else { r = c, g = 0, b = x }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}