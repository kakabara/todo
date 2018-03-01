const sendRequest = (url, method, body) => {
    return fetch(url, {method,
        body: body ? JSON.stringify(body) : null
     })
    .then( (response) => response.json())
    .catch( (err) => {console.warn(err);} )
};

class ApiServer{
    static getTasks(path) { return sendRequest(path, 'GET', null); }
    static deleteTask(body)  { return sendRequest('http://127.0.0.1:5000/delete', 'POST', body);}
    static editTask(body)  { return sendRequest('http://127.0.0.1:5000/edit', 'POST', body);}
    static doneTask(body)  { return sendRequest('http://127.0.0.1:5000/done', 'POST', body);}
    static createTask(body) { return sendRequest('http://127.0.0.1:5000/create', 'POST', body);}
}




class Task{
    constructor(task){
       Object.keys(task).forEach((key) => {
            this[key] = task[key].replace('TaskType.', '').replace('PriorityType.', '');
        })
    }
}

class ListTasks{
    constructor(tasks){
        this.tasks = {};
        tasks.forEach((task) => this.tasks[task.id] = new Task(task));
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
        if (!bufferTask) {
               bufferTask = {};
               bufferTask.subject = document.getElementById('subject-input').value;
               bufferTask.description = document.getElementById('description').value;
               bufferTask.priority = document.getElementById('priority').value;
               let body = JSON.stringify(bufferTask);
               ApiServer.createTask(body).then((data) => {
                    if (data['request_status'] == 'done') {
                        let task = data['task'];
                        Object.keys(task).forEach( (key) => {bufferTask[key] = task[key].replace('TaskType.', '').replace('PriorityType.', '');});
                        view.render_task(bufferTask);
                    }
               });

        } else {
               bufferTask.subject = document.getElementById('subject-input').value;
               bufferTask.description = document.getElementById('description').value;
               bufferTask.priority = document.getElementById('priority').value;
               let body = JSON.stringify(bufferTask);
               ApiServer.editTask(body).then((data) => {
                    if (data['request_status'] == 'done') {
                        let task = data['task'];
                        Object.keys(task).forEach( (key) => {bufferTask[key] = task[key].replace('TaskType.', '').replace('PriorityType.', '');});
                        view.render_task(bufferTask);
                    }
               });

        }
        Handlers.clickOnCancel(event);
    }

    static inputSearch(event){
        let filteredTask = Object.values(listTasks.tasks).filter( (task) =>
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
        let task = listTasks.tasks[button.dataset.task_id];
        bufferTask = task;
        if (action === 'edit'){
            let modalEdit = document.getElementById('task-modal');
            view.showModal(modalEdit, task);

        } else if (action === 'create') {
            let modalCreate = document.getElementById("task-modal");
            view.showModal(modalCreate);
            bufferTask = null;
        } else if (action === 'delete') {
             ApiServer.deleteTask(JSON.stringify(bufferTask)).then((data) => {
                    if (data['request_status'] == 'done') {
                        let taskHtml = document.getElementById(bufferTask.id);
                        taskHtml.parentNode.removeChild(taskHtml);
                    }
                    });

        } else if (action === 'done') {
            bufferTask.status = 'done'
            ApiServer.editTask(JSON.stringify(bufferTask)).then((data) => {
                    if (data['request_status'] == 'done') {
                        view.render_task(bufferTask);
                    }
                });
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

            let task = listTasks.tasks[taskDiv.id];
            taskDiv.getElementsByClassName('task-label')[0].style.transform = "translateX(100px)";
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
        this.buttonCancel = document.getElementById('modal-cancel');
        this.buttonSubmit = document.getElementById('modal-ok');
        this.buttonCancel.addEventListener('click', Handlers.clickOnCancel);
        this.buttonSubmit.addEventListener('click', Handlers.clickOnSubmit);

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
       let status = task.status;
       let priority = task.priority;
       return createElement('div', {className: ['inline','task-label', priority, status].join(' ')}, task.subject);
   }

   getTaskHTML(task) {
       let menu = this.createMenu(task);
       let divTaskLabel = this.getTaskLabel(task);
       return createElement('div', {id: task.id, className: 'task'},menu, divTaskLabel);
   }


    render_task(task) {
        let htmlTask = document.getElementById(task.id);
        if (htmlTask) {
            let taskLabel = htmlTask.getElementsByClassName('task-label')[0];
            let classList = Object.values(taskLabel.classList);
            let statusesTasks = ['critical', 'important', 'usual', 'done', 'inwork'];
            statusesTasks.forEach( (status) =>
                { if (classList.indexOf(status) >= 0) taskLabel.classList.toggle(status);}
                );
            taskLabel.classList.toggle(task.status.replace('TaskType.', '').toLowerCase());
            taskLabel.classList.toggle(task.priority.replace('PriorityType.', '').toLowerCase());
            let subjectHtml = htmlTask.getElementsByClassName('subject')[0];
            subjectHtml.innerText = task.subject;
            let descriptionHtml = htmlTask.getElementsByClassName('description')[0];
            descriptionHtml.innerText = task.description;
            taskLabel.innerText = task.subject;
            // here toggle class name
        } else {
           let tmp_task = {...task};
           let taskElem = this.getTaskHTML(tmp_task);
           this.todoList.appendChild(taskElem);
        }

    }


   render_all_tasks(tasks) {
       tasks.forEach((task) => {
            this.render_task(task);
       })
   }

   // Разлчиные события

}

var listTasks;
var app = {}
var view = new View();
var bufferTask = null;
function startApp(data){
    app.data = data;
    listTasks = new ListTasks(app.data.data);

    view.render_all_tasks(Object.values(listTasks.tasks));
    console.log(listTasks);
}

ApiServer.getTasks('http://127.0.0.1:5000/tasks').then( (data) => {console.log(data);startApp(data);} );

