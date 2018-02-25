from app import app
from flask import render_template, request, jsonify
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


@app.route('/action', methods=['POST'])
def request_action():

    data = request.data.decode("utf-8")
    print(data)
    result = {'request': 'done'}
    return jsonify(result)
