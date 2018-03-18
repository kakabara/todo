import { TaskView } from './taskView';



export class TaskHandlers{
    view: TaskView;
    constructor(view: TaskView){
        this.view = view;
        this.view.taskBlock.addEventListener('click', this.clickOnTask.bind(this));
        this.view.menu.addEventListener('click', this.clickOnMenu.bind(this));
    }

    clickOnTask(event: Event) {
        if (!this.view.menu.style.display) {
            this.view.label.style.transform = "translateX(90)";
            this.view.info.style.display = 'block';
            this.view.menu.style.display = 'block';
        } else {
            this.view.label.style.transform = "translateX(0)";
            this.view.info.style.display = '';
            this.view.menu.style.display = '';
        }
        event.stopPropagation();
    }

    // TODO: refact this shit
    clickOnMenu(event: Event){
        let button = <HTMLElement>event.target;
        let action = button.dataset.action;
        let buttonToAction = action + "Task";
        let task = listTasks.tasks[button.dataset.task_id];
        bufferTask = task;
        if (action === 'edit'){
            let modalEdit = document.getElementById('task-modal');
            view.showModal(modalEdit, task);

        } else if (action === 'create') {
            bufferTask = null;
            let modalCreate = document.getElementById("task-modal");
            view.showModal(modalCreate);
        } else if (action === 'delete') {
            ApiServer.deleteTask(bufferTask).then((data) => {
                    if (data['result'] == 'done') {
                        let taskHtml = document.getElementById(bufferTask.id);
                        taskHtml.parentNode.removeChild(taskHtml);
                    }
                });

        } else if (action === 'done') {
            bufferTask.status = 'done'
            ApiServer.editTask(bufferTask).then((data) => {
                        view.render_task(bufferTask);
                });
        }
    }
}