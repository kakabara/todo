const sendRequest = (url, method, body) => {
    return fetch(url, {method,
        body: body ? JSON.stringify(body) : null
     })
    .then( (response) => response.json())
    .catch( (err) => {console.warn(err);} )
};

class ApiServer{
    static getTasks(path) { return sendRequest(path, 'GET', null); }
    static deleteTask(body)  { return sendRequest('http://127.0.0.1:5000/action', 'POST', body);}
    static editTask(body)  { return sendRequest('http://127.0.0.1:5000/action', 'POST', body);}
    static doneTask(body)  { return sendRequest('http://127.0.0.1:5000/action', 'POST', body);}
    static createTask(body) { return sendRequest('http://127.0.0.1:5000/action', 'POST', body);}
}




class Task{
    constructor(task){
       Object.keys(task).forEach((key) => {
            this[key] = task[key];
        })
    }
}


class Handlers {
    static clickOnCancel(event) {
        let modal = function(elem) {
                while (elem.className!='modal-window') {
                    elem=elem.parentElement;
                }
            return elem;
            }(event.target);
        view.hideModal(modal);
    }

    static clickOnSubmit(event) {

        bufferTask.subject = document.getElementById('subject-input').value;
        bufferTask.description = document.getElementById('description').value;
        bufferTask.description = 'Priority.' + document.getElementById('priority').value;

    }

    static inputSearch(event){
        let filteredTask = Object.values(tasks).filter( task =>
            { if (task.subject.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 ) {
                return true;
            } else {
                return false;
            }

            });
        if (filteredTask) {
            while (view.todoList.firstChild) view.todoList.removeChild(view.todoList.firstChild);
            view.render_all_tasks(filteredTask);
        }
    }

    static clickOnActionButton(event) {
        let button = event.target;
        let action = button.dataset.action;
        let buttonToAction = action + "Task";
        let task = tasks[button.dataset.task_id];
        if (action === 'edit'){
            let modalEdit = document.getElementById('task-modal');
            view.showModal(modalEdit, task);
        } else if (action === 'create') {
            let modalCreate = document.getElementById("task-modal");
            view.showModal(modalCreate);
        } else if (action === 'delete') {

        } else if (action === 'done') {

        }

        event.stopPropagation();
    }

    static clickOnQueueTasks(event){
        let target = event.target;

        if ([...target.classList].indexOf('task-label') >= 0) {
            Handlers.clickOnTask(event);
            event.stopPropagation();
        } else if ([...target.classList].indexOf('menu-icon') >= 0) {
            Handlers.clickOnActionButton(event);
            event.stopPropagation();
        }
    }

    static clickOnTask(event) {

        let taskDiv = event.target.parentElement;

        let menu = taskDiv.getElementsByClassName('slide-menu')[0];

        if (!menu.style.display) {

            let task = tasks[taskDiv.id];
            taskDiv.getElementsByClassName('task-label')[0].style.transform = "translateX(90px)";
            menu.style.display = 'block';

            let subject = createElement('div', {className: 'subject'}, task.subject);
            let time = createElement('div', {className: 'time'}, task.created_at);
            let description = createElement('div', {className: 'description'}, task.description);
            let taskInfo = createElement('div', {className: 'task-info'}, subject, time, description);

            taskDiv.appendChild(taskInfo);

        } else {
            taskDiv.getElementsByClassName('task-label')[0].style.transform = "translateX(0)";
            taskDiv.removeChild(taskDiv.lastChild);
            menu.style.display = '';
        }
        event.stopPropagation();

    }
}


function createElement(tag, props, ...children) {
    const newElement = document.createElement(tag);

    Object.keys(props).forEach((key) => {
            newElement[key] = props[key];
    })

    children.forEach((child) =>{
        if (typeof child == 'string'){
            child = document.createTextNode(child);
        }
        newElement.appendChild(child);
    })
    return newElement;
}


class View {
    constructor(){
        this.todoList = document.getElementById('queue-tasks');
        this.todoList.addEventListener('click', Handlers.clickOnQueueTasks);
        this.btnCreateTask = document.getElementById('icon-create-task');
        this.btnCreateTask.addEventListener('click', Handlers.clickOnActionButton);
        this.inputSearch = document.getElementById('search-bar');
        this.inputSearch.addEventListener('input', Handlers.inputSearch);
        this.buttonsCancel = document.getElementsByClassName('cancel');
        Object.values(this.buttonsCancel).forEach((elem) => {elem.addEventListener('click', Handlers.clickOnCancel)});

    }

    showModal(modal, task=null){
        if (task){
            document.getElementById('subject-input').value = task.subject;
            document.getElementById('description').value = task.description;
            document.getElementById('priority').value = task.priority.replace("PriorityType.", "");
            bufferTask = task;
        } else {
            bufferTask = {};
        }
        modal.style.display = 'block';
    }

    hideModal(modal){
        modal.style.display = 'none';
        document.getElementById('subject-input').value = '';
        document.getElementById('description').value = '';
        document.getElementById('priority').value = '';
    }

    // Блок кода отвечающий за создание и отображение данных
   createMenu(task) {
        let iconsMenu = [];
        const butMenu= {'delete':'close_red', 'edit': 'edit_orange', 'done':'done_green'};
        Object.keys(butMenu).forEach( (key)=> {
            let img = createElement('img', {className: 'menu-icon', src: "static/images/" + butMenu[key] + ".png"});
            img.dataset.action = key;
            img.dataset.task_id = task.id;
            iconsMenu.push(img);
            });

        let menu = createElement('div', {className: 'slide-menu'}, ...iconsMenu);
        return menu;
    }

   getTaskLabel(task){
       let status = task.status.split('.')[1].toLowerCase();
       let priority = task.priority.split('.')[1].toLowerCase();
       return createElement('div', {className: ['inline','task-label', priority, status].join(' ')}, task.subject);
   }

   getTaskHTML(task) {
       let menu = this.createMenu(task);
       let divTaskLabel = this.getTaskLabel(task);
       return createElement('div', {id: task.id, className: 'task'},menu, divTaskLabel);
   }

   render_all_tasks(tasks) {
       tasks.forEach((task) => {
       let tmp_task = {...task};
           let taskElem = this.getTaskHTML(tmp_task);

           this.todoList.appendChild(taskElem);
       })
   }

   // Разлчиные события

}

var tasks = {};
var app = {}
var view = new View();
var bufferTask = null;
function startApp(data){
    app.data = data;
    for (let i = 0; i < app.data.count; i++)
        tasks[app.data.data[i].id] = new Task(app.data.data[i]);

    view.render_all_tasks(Object.values(tasks));
    console.log(tasks);
}

ApiServer.getTasks('http://127.0.0.1:5000/tasks').then( (data) => {console.log(data);startApp(data);} );

