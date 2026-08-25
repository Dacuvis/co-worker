import type { ObjectId } from "mongodb";

export interface RecommendationHistory {
    _id?: ObjectId;
    message: string;
    response: string;
    owner?: string;
    taskContext?: string;
    model: string;
    createdAt: Date;
    archived?: boolean;
}