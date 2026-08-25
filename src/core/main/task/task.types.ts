import type { ObjectId } from "mongodb";

export interface Task {
    _id?: ObjectId;
    title: string;
    description: string;
    completed: boolean;
    archived?: boolean;
}