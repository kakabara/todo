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

class Task{
    constructor(task){
       Object.keys(task).forEach((key) => {
            this[key] = task[key];
        })
    }
}

class View {
    constructor(){
        this.todoList = document.getElementById('queue-tasks');
    }
    // Блок кода отвечающий за создание и отображение данных
   createIcons() {
        let iconsMenu = [];
        const butMenu= {'but-delete':'close_red', 'but-edit': 'edit_orange', 'but-done':'done_green'};
        Object.keys(butMenu).forEach( (key)=> {
            let img = createElement('img', {className: 'menu-icon', src: "static/images/" + butMenu[key] + ".png"});
            iconsMenu.push(img);
            });
        return iconsMenu;
    }

   getTaskLabel(task){
       let status = task.status.split('.')[1].toLowerCase();
       let priority = task.priority.split('.')[1].toLowerCase();
       return createElement('div', {className: ['inline','task-label', priority, status].join(' ')}, task.subject);
   }

   getTaskHTML(task) {
       let icons = this.createIcons();
       let divTaskLabel = this.getTaskLabel(task);
       return createElement('div', {id: task.id, className: 'task'},...icons, divTaskLabel);
   }

   render_all_tasks(tasks) {
   console.log(tasks);
       tasks.forEach((task) => {
       let tmp_task = {...task};
           let taskElem = this.getTaskHTML(tmp_task);
           taskElem.addEventListener('click', this.clickOnLabel);
           this.todoList.appendChild(taskElem);
       })
   }

   // Разлчиные события

    clickOnLabel(event) {
        let task = event.currentTarget;
        // slideMenu.style.transform = "translateX(-3em)";
        task.getElementsByClassName('task-label')[0].style.transform = "translateX(3em)";
        event.stopPropagation();
    }

}


let tasks = [];
let app = {}
let view = new View();
function pr(data){
    app.data = data;
    for (let i = 0; i < app.data.count; i++)
        tasks.push(new Task(app.data.data[i]));

    view.render_all_tasks(tasks);

}

function sendRequest(url, method, callback) {
    fetch(url, {method})
    .then( (response) => {return response.json();})
    .then( (data) => {callback(data);} )
    .catch( (err) => {console.warn(err);} )
}

sendRequest('http://127.0.0.1:5000/tasks', 'GET', pr);

