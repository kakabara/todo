from flask import Flask
from server.config import Config
import os

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

static_folder = os.path.abspath('frontend/static')
template_folder = os.path.abspath('frontend/templates')
app = Flask(__name__, static_folder=static_folder, template_folder=template_folder)

app.config.from_object(Config)

db = SQLAlchemy(app)

migrate = Migrate(app, db)


from server import routes, models