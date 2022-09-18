from flask import Flask, request, jsonify
from flask_marshmallow import pprint
from app import app
import os, base64, math
from secret_data import *


# работа с токенами
from flask_jwt_extended import \
    create_access_token, \
    get_jwt, \
    get_jwt_identity,\
    unset_jwt_cookies, \
    jwt_required, \
    JWTManager

jwt = JWTManager(app)


# отправка почты
import smtplib
from email.mime.multipart import MIMEMultipart  # Многокомпонентный объект
from email.mime.text import MIMEText  # Текст/HTML
from email.mime.image import MIMEImage  # Изображения


# работа с изображениями
from PIL import Image, ImageEnhance


def getAccess(login, user, shtat):

    """ Считывание прав доступа """

    # права доступа в меню: просмотр * редактирование * архивирование
    additional_claims = {
        'shtat': shtat,
        'user': user,
        'menu': [
            {'url': '', 'code': 111},
            {'url': 'review', 'code': 100},
            {'url': 'equipment', 'code': 111},
            {'url': 'logout', 'code': 101},
        ]
    }
    access_token = create_access_token(identity=login, additional_claims=additional_claims)

    return access_token


def save_immage(file, type, s=3500, mini='on'):

    """ сохранение изображений на сервере с использованием PILLOW """

    # base64
    # # декомпозиция данных, отправляемых пользователем
    # data = base64.b64encode(file.read())
    # print(data)
    # file_ext = os.path.splitext(data.filename)[1]
    # print(file_ext)

    # # создание уникального имени файла
    # filename = type + '-' + get_access()[0].user.login + '_' + datetime.datetime.today().strftime(
    #     "%Y-%m-%d_%H-%M-%S") + file_ext
    #
    # data.save(os.path.join('static/images/', filename))

    # with open('static/images/' + filename,"w+") as f:
    #         f.write(data.decode("utf-8"))

    # Pillow
    filename = file.filename

    if not filename:
        return None

    file_ext = os.path.splitext(filename)[1]
    data = Image.open(request.files["image"].stream)



    # контроль вхождения расширения файла в список разрешенных
    if file_ext not in app.config['UPLOAD_EXTENSIONS']:
        abort(400)
    # создание уникального имени файла
    filename = type + '-' + get_access()[0].user.login + '_' + datetime.datetime.today().strftime(
        "%Y-%m-%d_%H-%M-%S") + file_ext

    (width, height) = data.size

    ratio = s / width

    if ratio < 1:
        width = s
        height = round(height * ratio)

        data = data.resize((width, height))
        # data.show()

    # сохранение картинки в полном формате
    data.save(os.path.join(os.path.dirname(__file__), 'static', 'images', filename), quality=85)

    # создание миниатюры (по-требованию)
    if mini == 'on':

        data = data.convert('RGB')

        # повышаем четкость
        enhancer = ImageEnhance.Sharpness(data)
        data = enhancer.enhance(4)

        size = (100, 100)
        data.thumbnail(size)
        data.save(os.path.join(os.path.dirname(__file__), 'static', 'images', 'mini-' + filename), quality=85)
        # data.show()

    print('image.save OK')
    return filename



def mail_send(addr_to, message):

    """ Отправка письма """

    msg = MIMEMultipart()
    msg['From'] = E_MAIL
    msg['To'] = addr_to
    msg['Subject'] = 'Сообщение от microERP'

    msg.attach(MIMEText(message, 'html', 'utf-8'))

    server = smtplib.SMTP_SSL('smtp.mail.ru', 465)  # для MAIL.RU
    # server = smtplib.SMTP('smtp.gmail.com', 587)  # Создаем объект SMTP для GOOGLE.COM server.set_debuglevel(True)
    # Включаем режим отладки - если отчет не нужен, строку можно закомментировать server.starttls()
    # Начинаем шифрованный обмен по TLS (для mail.ru закомментировать)
    server.login(E_MAIL, E_MAIL_PASSWORD)
    server.send_message(msg)
    server.quit()


