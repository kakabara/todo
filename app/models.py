from app import db
import enum
from datetime import datetime
import json


class PriorityType(enum.Enum):
    Critical = 'critical'
    Usual = 'usual'
    Important = 'important'


class TaskType(enum.Enum):
    Done = 'done'
    InWork = 'inwork'


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(), index=True, unique=True)
    description = db.Column(db.String())
    priority = db.Column(db.Enum(PriorityType))
    status = db.Column(db.Enum(TaskType))
    created_at = db.Column(db.DateTime, default=datetime.now())
    end_at = db.Column(db.DateTime)

    def toJSON(self):
        return json.dumps(self.__dict__)
