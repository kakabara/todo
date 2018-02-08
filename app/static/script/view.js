import { createElement } from './tools';

class View {
    constructor(){
        this.todoList = document.getElementById('queue-tasks');

    }

    render_all(tasks) {
        tasks.forEach((task) => {
            let task = createElement(task);
            this.todoList.appendChild(task);
        })
    }
}