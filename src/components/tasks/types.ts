interface Task {
    title: string
    description: string | null
    deadline: Date | null
    completed: boolean
    color_code: string
}

export interface ExistingTask extends Task {
    id: string
    created_at: Date
}

export interface NewTask extends Task {
    id: null
    created_at: null
}

export type SortValues = 'asc' | 'desc' | null
export type FilterValues = 'all' | 'ongoing' | 'completed'
export type DeadlineFilterValues = 'past' | 'today' | 'tomorrow' | 'custom' | 'none'