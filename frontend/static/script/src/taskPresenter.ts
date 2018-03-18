import { TaskView } from './taskView';
import { TaskModel } from './taskModel';
import { TaskHandlers } from './handlers';

class TaskPresenter {
    view: TaskView;
    model: TaskModel;
    handlers: TaskHandlers;
    constructor(view: TaskView){
        this.view = view;
        this.handlers = new TaskHandlers(this.view);
    }
}