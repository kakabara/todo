export class TaskModel{
    id: number | string;
    subject: string;
    description: string;
    priority: string;
    status: string;
    created_at: Date;
    end_at: Date;
    deleted_at: Date;

    constructor(task: object){
        this.id = task['id'];
        this.subject = task['subject'];
        this.description = task['description'];
        this.priority = task['priority'];
        this.status = task['status'];
        this.created_at = new Date(task['created_at']);
        this.end_at = new Date(task['end_at']);
        this.deleted_at = new Date(task['deleted_at']);
    }
}