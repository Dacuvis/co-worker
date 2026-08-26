export interface Task {
    id?: string;
    title: string;
    description: string;
    completed: boolean;
    archived?: boolean;
    userId?: string;
}
