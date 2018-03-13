from server import app
from flask import render_template, request, jsonify, json, make_response, abort
from server import db
from .models import Task
from datetime import datetime


def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = str(getattr(row, column.name))

    return d


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not Found'}), 404)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/api/v1/tasks', methods=["GET"])
def get_task():
    session = db.session()
    result = {'result': 'canceled'}
    good_request = True
    try:
        tasks = session.query(Task).filter(Task.deleted_at == None).all()
        tasks_dicts = [row2dict(task) for task in tasks]
        result["count"] = len(tasks)
        result["data"] = tasks_dicts

    except Exception as e:
        print(e)
        good_request = False
    finally:
        if good_request:
            result['result'] = 'done'
            return jsonify(result), 201
        else:
            abort(400)
        session.close()


@app.route('/api/v1/tasks', methods=['POST'])
def request_create():
    data = json.loads(json.loads(request.data.decode("utf-8")))
    result = {'result': 'canceled'}
    session = db.session()
    good_request = True
    try:
        task = Task(subject=data['subject'], description=data['description'],
                    status="inwork", priority=data['priority'])
        session.add(task)
        session.commit()
        result['task'] = row2dict(task)
    except Exception as e:
        print(e)
        good_request = False

    finally:
        if good_request:
            result['result'] = 'done'
            return jsonify(result)
        else:
            abort(400)
        session.close()


@app.route('/api/v1/tasks/<task_id>', methods=['DELETE'])
def request_delete(task_id):
    result = {'result': 'canceled'}
    good_request = True
    session = db.session()
    try:
        task = session.query(Task).filter(Task.id == task_id).one_or_none()
        if task:
            task.deleted_at = datetime.now()
            session.add(task)
            session.commit()

    except Exception as e:
        print(e)
        good_request = False
    finally:
        if good_request:
            result['result'] = 'done'
            return jsonify(result), 201
        else:
            abort(400)
        session.close()


@app.route('/api/v1/tasks/<task_id>', methods=['PUT'])
def request_edit(task_id):
    data = json.loads(request.data.decode("utf-8"))
    result = {'result': 'canceled'}
    good_request = True
    session = db.session()
    try:
        task = session.query(Task).filter(Task.id == task_id).one_or_none()
        if task:
            for key in data.keys():
                if task.__getattribute__(key) != data[key]:
                    if data[key] == 'None':
                        data[key] = None
                    task.__setattr__(key, data[key])
            session.add(task)
            session.commit()
            result['task'] = row2dict(task)
    except Exception as e:
        good_request = False
        print(e)
    finally:
        if good_request:
            result['result'] = 'done'
            return jsonify(result), 201
        else:
            abort(400)
        session.close()
