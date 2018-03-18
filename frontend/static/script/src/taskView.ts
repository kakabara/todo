import { TaskModel } from './taskModel';
import { createElement } from './helper';

export class TaskView{
    info: HTMLElement;
    taskBlock: HTMLElement;
    menu: HTMLElement;
    label: HTMLElement;

    constructor(task: TaskModel){
        this.render_task(task);
    }
    // Блок кода отвечающий за создание и отображение данных
    createMenu(task: TaskModel) {
        let iconsMenu = [];
        const butMenu= {'delete':'close_red', 'edit': 'edit_orange', 'done':'done_green'};
        Object.keys(butMenu).forEach( (key)=> {
            let img = createElement('img', {className: 'menu-icon', src: "static/images/" + butMenu[key] + ".png"});
            img.dataset.action = key;
            img.dataset.task_id = task.id;
            iconsMenu.push(img);
            });

        this.menu = createElement('div', {className: 'slide-menu'}, ...iconsMenu);
    }

    createTaskLabel(task: TaskModel){
       let status: string = task['status'];
       let priority: string = task['priority'];
       this.label = createElement('div', {className: ['inline','task-label', priority, status].join(' ')}, task['subject']);
   }

    createTaskHTML(task: TaskModel) {
       this.createMenu(task);
       this.createTaskLabel(task);
       return createElement('div', {id: task.id, className: 'task'}, this.menu, this.label);
   }
    render_task(task: TaskModel) {
        let tmp_task = {...task};
        this.taskBlock = this.createTaskHTML(tmp_task);
        let subject = createElement('div', {className: 'subject'}, task.subject);
        let time = createElement('div', {className: 'time'}, task.created_at);
        let description = createElement('div', {className: 'description'}, task.description);
        this.info = createElement('div', {className: 'task-info'}, subject, time, description);
        this.taskBlock.appendChild(this.info);
        return this.taskBlock;
    }

}