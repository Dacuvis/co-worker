export interface RecommendationHistory {
    id?: string;
    message: string;
    response: string;
    owner?: string;
    taskContext?: string;
    model: string;
    createdAt: Date;
    archived?: boolean;
    userId?: string;
}
