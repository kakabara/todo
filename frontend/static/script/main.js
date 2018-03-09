var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var sendRequest = function (url, method, body) {
    return fetch(url, { method: method,
        body: body ? JSON.stringify(body) : null
    })
        .then(function (response) { return response.json(); })["catch"](function (err) { console.warn(err); });
};
var ApiServer = /** @class */ (function () {
    function ApiServer() {
    }
    ApiServer.getTasks = function (path) { return sendRequest(path, 'GET', null); };
    ApiServer.deleteTask = function (body) { return sendRequest('http://127.0.0.1:5000/delete', 'POST', body); };
    ApiServer.editTask = function (body) { return sendRequest('http://127.0.0.1:5000/edit', 'POST', body); };
    ApiServer.doneTask = function (body) { return sendRequest('http://127.0.0.1:5000/done', 'POST', body); };
    ApiServer.createTask = function (body) { return sendRequest('http://127.0.0.1:5000/create', 'POST', body); };
    return ApiServer;
}());
var Task = /** @class */ (function () {
    function Task(task) {
        var _this = this;
        Object.keys(task).forEach(function (key) {
            _this[key] = task[key].replace('TaskType.', '').replace('PriorityType.', '');
        });
    }
    return Task;
}());
var ListTasks = /** @class */ (function () {
    function ListTasks(tasks) {
        var _this = this;
        this.tasks = [];
        tasks.forEach(function (task) { return _this.tasks[Number(task['id'])] = new Task(task); });
    }
    return ListTasks;
}());
var Handlers = /** @class */ (function () {
    function Handlers() {
    }
    Handlers.clickOnCancel = function (event) {
        var modal = function (elem) {
            while (elem.className != 'modal-window') {
                elem = elem.parentElement;
            }
            return elem;
        }(event.target);
        view.hideModal(modal);
    };
    Handlers.clickOnSubmit = function (event) {
        if (!bufferTask) {
            bufferTask = {};
            bufferTask.subject = document.getElementById('subject-input').value;
            bufferTask.description = document.getElementById('description').value;
            bufferTask.priority = document.getElementById('priority').value;
            var body = JSON.stringify(bufferTask);
            ApiServer.createTask(body).then(function (data) {
                if (data['request_status'] == 'done') {
                    bufferTask = new Task(data['task']);
                    listTasks[bufferTask.id] = bufferTask;
                    view.render_task(bufferTask);
                }
            });
        }
        else {
            bufferTask.subject = document.getElementById('subject-input').value;
            bufferTask.description = document.getElementById('description').value;
            bufferTask.priority = document.getElementById('priority').value;
            var body = JSON.stringify(bufferTask);
            ApiServer.editTask(body).then(function (data) {
                if (data['request_status'] == 'done') {
                    var task_1 = data['task'];
                    Object.keys(task_1).forEach(function (key) { bufferTask[key] = task_1[key].replace('TaskType.', '').replace('PriorityType.', ''); });
                    view.render_task(bufferTask);
                }
            });
        }
        Handlers.clickOnCancel(event);
    };
    Handlers.inputSearch = function (event) {
        var filteredTask = listTasks.tasks.values().filter(function (task) {
            if (task.subject.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) {
                return true;
            }
            else {
                return false;
            }
        });
        if (filteredTask) {
            while (view.todoList.firstChild)
                view.todoList.removeChild(view.todoList.firstChild);
            view.render_all_tasks(filteredTask);
        }
    };
    Handlers.clickOnActionButton = function (event) {
        var button = event.target;
        var action = button.dataset.action;
        var buttonToAction = action + "Task";
        var task = listTasks.tasks[button.dataset.task_id];
        bufferTask = task;
        if (action === 'edit') {
            var modalEdit = document.getElementById('task-modal');
            view.showModal(modalEdit, task);
        }
        else if (action === 'create') {
            bufferTask = null;
            var modalCreate = document.getElementById("task-modal");
            view.showModal(modalCreate);
        }
        else if (action === 'delete') {
            ApiServer.deleteTask(JSON.stringify(bufferTask)).then(function (data) {
                if (data['request_status'] == 'done') {
                    var taskHtml = document.getElementById(bufferTask.id);
                    taskHtml.parentNode.removeChild(taskHtml);
                }
            });
        }
        else if (action === 'done') {
            bufferTask.status = 'done';
            ApiServer.editTask(JSON.stringify(bufferTask)).then(function (data) {
                if (data['request_status'] == 'done') {
                    view.render_task(bufferTask);
                }
            });
        }
        event.stopPropagation();
    };
    Handlers.clickOnQueueTasks = function (event) {
        var target = event.target;
        if (target.classList.slice().indexOf('task-label') >= 0) {
            Handlers.clickOnTask(event);
            event.stopPropagation();
        }
        else if (target.classList.slice().indexOf('menu-icon') >= 0) {
            Handlers.clickOnActionButton(event);
            event.stopPropagation();
        }
    };
    Handlers.clickOnTask = function (event) {
        var taskDiv = event.target.parentElement;
        var menu = taskDiv.getElementsByClassName('slide-menu')[0];
        if (!menu.style.display) {
            var task = listTasks.tasks[taskDiv.id];
            taskDiv.getElementsByClassName('task-label')[0].style.transform = "translateX(100px)";
            menu.style.display = 'block';
            var subject = createElement('div', { className: 'subject' }, task.subject);
            var time = createElement('div', { className: 'time' }, task.created_at);
            var description = createElement('div', { className: 'description' }, task.description);
            var taskInfo = createElement('div', { className: 'task-info' }, subject, time, description);
            taskDiv.appendChild(taskInfo);
        }
        else {
            taskDiv.getElementsByClassName('task-label')[0].style.transform = "translateX(0)";
            taskDiv.removeChild(taskDiv.lastChild);
            menu.style.display = '';
        }
        event.stopPropagation();
    };
    return Handlers;
}());
function createElement(tag, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var newElement = document.createElement(tag);
    Object.keys(props).forEach(function (key) {
        newElement[key] = props[key];
    });
    children.forEach(function (child) {
        if (typeof child == 'string') {
            child = document.createTextNode(child);
        }
        newElement.appendChild(child);
    });
    return newElement;
}
var View = /** @class */ (function () {
    function View() {
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
    View.prototype.showModal = function (modal, task) {
        if (task === void 0) { task = null; }
        if (task) {
            document.getElementById('subject-input').value = task.subject;
            document.getElementById('description').value = task.description;
            document.getElementById('priority').value = task.priority.replace("PriorityType.", "");
            bufferTask = task;
        }
        modal.style.display = 'block';
    };
    View.prototype.hideModal = function (modal) {
        modal.style.display = 'none';
        document.getElementById('subject-input').value = '';
        document.getElementById('description').value = '';
        document.getElementById('priority').value = '';
    };
    // Блок кода отвечающий за создание и отображение данных
    View.prototype.createMenu = function (task) {
        var iconsMenu = [];
        var butMenu = { 'delete': 'close_red', 'edit': 'edit_orange', 'done': 'done_green' };
        Object.keys(butMenu).forEach(function (key) {
            var img = createElement('img', { className: 'menu-icon', src: "static/images/" + butMenu[key] + ".png" });
            img.dataset.action = key;
            img.dataset.task_id = task.id;
            iconsMenu.push(img);
        });
        var menu = createElement.apply(void 0, ['div', { className: 'slide-menu' }].concat(iconsMenu));
        return menu;
    };
    View.prototype.getTaskLabel = function (task) {
        var status = task['status'];
        var priority = task['priority'];
        return createElement('div', { className: ['inline', 'task-label', priority, status].join(' ') }, task['subject']);
    };
    View.prototype.getTaskHTML = function (task) {
        var menu = this.createMenu(task);
        var divTaskLabel = this.getTaskLabel(task);
        return createElement('div', { id: task.id, className: 'task' }, menu, divTaskLabel);
    };
    View.prototype.render_task = function (task) {
        var htmlTask = document.getElementById(task['id'].toString());
        if (htmlTask) {
            var taskLabel_1 = htmlTask.getElementsByClassName('task-label')[0];
            var classList_1 = Object.values(taskLabel_1.classList);
            var statusesTasks = ['critical', 'important', 'usual', 'done', 'inwork'];
            statusesTasks.forEach(function (status) { if (classList_1.indexOf(status) >= 0)
                taskLabel_1.classList.toggle(status); });
            taskLabel_1.classList.toggle(task['status'].replace('TaskType.', '').toLowerCase());
            taskLabel_1.classList.toggle(task['priority'].replace('PriorityType.', '').toLowerCase());
            var subjectHtml = htmlTask.getElementsByClassName('subject')[0];
            subjectHtml['innerText'] = task['subject'];
            var descriptionHtml = htmlTask.getElementsByClassName('description')[0];
            descriptionHtml['innerText'] = task['description'];
            taskLabel_1['innerText'] = task['subject'];
            // here toggle class name
        }
        else {
            var tmp_task = __assign({}, task);
            var taskElem = this.getTaskHTML(tmp_task);
            this.todoList.appendChild(taskElem);
        }
    };
    View.prototype.render_all_tasks = function (tasks) {
        var _this = this;
        tasks.forEach(function (task) {
            _this.render_task(task);
        });
    };
    return View;
}());
var listTasks;
var app = {};
var view = new View();
var bufferTask = null;
function startApp(data) {
    app['data'] = data;
    listTasks = new ListTasks(app['data'].data);
    view.render_all_tasks(Object.values(listTasks.tasks));
    console.log(listTasks);
}

ApiServer.getTasks('http://127.0.0.1:5000/tasks').then(function (data) { console.log(data); startApp(data); });
