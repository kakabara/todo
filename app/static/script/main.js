const sendRequest = (url, method, body) => {
    return fetch(url, {method,
        body: body ? JSON.stringify(body) : null
     })
    .then( (response) => response.json())
    .catch( (err) => {console.warn(err);} )
};

class ApiServer{
    static getTasks(path) { return sendRequest(path, 'GET', null); }
    static delTask(path, body)  { return sendRequest(path, 'POST', body);}
    static editTask(path, body)  { return sendRequest(path, 'POST', body);}
    static doneTask(path, body)  { return sendRequest(path, 'POST', body);}
}




class Task{
    constructor(task){
       Object.keys(task).forEach((key) => {
            this[key] = task[key];
        })
    }
}


class Handlers {
    static clickOnActionButton(event) {
        let taskDiv = event.path.find( (elem) => elem.className === 'task' );
        let button = event.path.find( (elem) => elem.className === 'menu-icon' );
        let action = button.dataset.action;


        event.stopPropagation();
    }

    static clickOnQueueTasks(event){
        let is_menu = event.path.find( (elem) => elem.className === 'slide-menu' );
        if (is_menu) {
            Handlers.clickOnActionButton(event);
        } else if ( event.path.find( (elem) => elem.className === 'task-info' ) ) {

        } else {
            Handlers.clickOnTask(event);
        }
    }

    static clickOnTask(event) {

        let taskDiv = event.path.find( (elem) => elem.className === 'task');

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
    }
    // Блок кода отвечающий за создание и отображение данных
   createMenu() {
        let iconsMenu = [];
        const butMenu= {'delete':'close_red', 'edit': 'edit_orange', 'done':'done_green'};
        Object.keys(butMenu).forEach( (key)=> {
            let img = createElement('img', {className: 'menu-icon', src: "static/images/" + butMenu[key] + ".png"});
            img.dataset.action = key;
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
       let menu = this.createMenu();
       let divTaskLabel = this.getTaskLabel(task);
       return createElement('div', {id: task.id, className: 'task'},menu, divTaskLabel);
   }

   render_all_tasks(tasks) {

       console.log(tasks);
       tasks.forEach((task) => {
       let tmp_task = {...task};
           let taskElem = this.getTaskHTML(tmp_task);

           this.todoList.appendChild(taskElem);
       })
   }

   // Разлчиные события

}


let tasks = {};
let app = {}
let view = new View();


function startApp(data){
    app.data = data;
    for (let i = 0; i < app.data.count; i++)
        tasks[app.data.data[i].id] = new Task(app.data.data[i]);

    view.render_all_tasks(Object.values(tasks));
}

ApiServer.getTasks('http://127.0.0.1:5000/tasks').then( (data) => {startApp(data);} );

