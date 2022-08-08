from app import app
from secret_data import *
from datetime import datetime, timedelta, timezone


# Подключение к БД
SQLALCHEMY_DATABASE_URI = "mysql+pymysql://{username}:{password}@{hostname}/{databasename}".format(
    username="kainn",
    password=MYSQL_DB_PASSWORD,
    hostname="localhost",
    databasename="microERP",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False



# настройки JWT
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)



# настройка загружаемых изображений
app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.JPG', '.png', '.PNG']
app.config['MAX_CONTENT_LENGTH'] = 10*3602*5398



