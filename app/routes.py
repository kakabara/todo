from app import app
from flask import render_template, request, jsonify, json
from app import db
from .models import Task
from datetime import datetime


def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = str(getattr(row, column.name))

    return d


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/tasks')
def get_task():
    session = db.session()
    try:
        tasks = session.query(Task).filter(Task.deleted_at == None).all()
        tasks_dicts = [row2dict(task) for task in tasks]
        result = {"count": len(tasks), "data": tasks_dicts}
        return jsonify(result)
    finally:
        session.close()


@app.route('/create', methods=['POST'])
def request_create():
    data = json.loads(json.loads(request.data.decode("utf-8")))
    result = {'request_status': 'cancelled'}
    session = db.session()
    try:
        task = Task(subject=data['subject'], description=data['description'],
                    status="inwork", priority=data['priority'])
        session.add(task)
        session.commit()
        result['task'] = row2dict(task)
        result['request_status'] = 'done'
    except Exception as e:
        print(e)

    finally:
        session.close()
        return jsonify(result)


@app.route('/delete', methods=['POST'])
def request_delete():
    data = json.loads(json.loads(request.data.decode("utf-8")))
    result = {'request_status': 'cancelled'}
    session = db.session()
    try:
        task = session.query(Task).filter(Task.id == data['id']).one_or_none()
        if task:
            task.deleted_at = datetime.now()
            session.add(task)
            session.commit()
            result['request_status'] = 'done'
    except Exception as e:
        print(e)
    finally:
        return jsonify(result)


@app.route('/edit', methods=['POST'])
def request_edit():
    data = json.loads(json.loads(request.data.decode("utf-8")))
    result = {'request_status': 'cancelled'}
    session = db.session()
    try:
        task = session.query(Task).filter(Task.id == data['id']).one_or_none()
        if task:
            for key in data.keys():
                if task.__getattribute__(key) != data[key]:
                    if data[key] == 'None':
                        data[key] = None
                    task.__setattr__(key, data[key])
            session.add(task)
            session.commit()
            result['task'] = row2dict(task)
            result['request_status'] = 'done'
    except Exception as e:
        print(e)
    finally:
        return jsonify(result)
