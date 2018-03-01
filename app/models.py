from app import db
import enum
from datetime import datetime
import json


class PriorityType(enum.Enum):
    critical = 'critical'
    usual = 'usual'
    important = 'important'


class TaskType(enum.Enum):
    done = 'done'
    inwork = 'inwork'


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(), index=True)
    description = db.Column(db.String())
    priority = db.Column(db.Enum(PriorityType))
    status = db.Column(db.Enum(TaskType))
    created_at = db.Column(db.DateTime, default=datetime.now())
    end_at = db.Column(db.DateTime, default=None)
    deleted_at = db.Column(db.DateTime, default=None)

