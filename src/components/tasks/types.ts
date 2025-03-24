interface Task {
    title: string
    description: string | null
    deadline: Date | null
    completed: boolean
    color_code: string | null
}

export interface ExistingTask extends Task {
    id: string
    created_at: Date | null
}

export interface NewTask extends Task {
    id: null
    created_at: null
}