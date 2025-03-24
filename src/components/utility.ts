import { NewTask } from "./tasks/types"

export const COLORS = ['#F7BFA8', '#E8E274', '#97E874', '#74E8E8', '#96B8EB', '#B498F5', '#F7A8E0', '#FFFFFF']

export const NEW_TASK: NewTask = {
    id: null,
    created_at: null,
    title: '',
    description: '',
    deadline: null,
    completed: false,
    color_code: COLORS[Math.floor(Math.random() * COLORS.length)]
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
