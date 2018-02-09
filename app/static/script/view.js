import { createElement } from './tools';

class View {
    constructor(){
        this.todoList = document.getElementById('queue-tasks');
        const taskLabel
        const todoDictElement = {}
    }

    getTaskHTML(task) {

    }


    render_all_tasks(tasks) {
        tasks.forEach((task) => {
            let task = createElement(task);
            this.todoList.appendChild(task);
        })
    }
}