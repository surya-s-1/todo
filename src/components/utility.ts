export const COLORS = ["#F7BFA8", "#E8E274", "#97E874", "#74E8E8", "#96B8EB", "#B498F5", "#F7A8E0", "#FFFFFF"]

type DeadlineFormat = 'long' | 'short'

export function formatDeadline(deadline: Date | null, format: DeadlineFormat = 'long'): string {
    if (!deadline) return 'No Deadline'

    const now = new Date()
    deadline = new Date(deadline)

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const target = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate())

    const diffInDays = (target.getTime() - today.getTime()) / (1000 * 3600 * 24)

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Tomorrow"
    if (diffInDays === -1) return "Yesterday"

    if (format === 'short') {
        return deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return new Date(deadline).toDateString()
}  