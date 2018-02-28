from app import app
from flask import render_template, request, jsonify, json
from app import db
from .models import Task


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
        tasks = session.query(Task).all()
        tasks_dicts = [row2dict(task) for task in tasks]
        result = {"count": len(tasks), "data": tasks_dicts}
        return jsonify(result)
    finally:
        session.close()


@app.route('/create', methods=['POST'])
def request_create():
    data = json.loads(request.data.decode("utf-8"))
    print(data)
    result = {'request': 'done'}
    return jsonify(result)


@app.route('/delete', methods=['POST'])
def request_delete():
    data = json.loads(request.data.decode("utf-8"))
    print(data)
    result = {'request': 'done'}
    return jsonify(result)


@app.route('/edit', methods=['POST'])
def request_edit():
    data = json.loads(request.data.decode("utf-8"))
    print(data)
    result = {'request': 'done'}
    return jsonify(result)


@app.route('/done', methods=['POST'])
def request_done():
    data = json.loads(request.data.decode("utf-8"))
    print(data)
    result = {'request': 'done'}
    return jsonify(result)