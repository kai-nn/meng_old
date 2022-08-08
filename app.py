from flask import Flask, request, jsonify
from datetime import datetime, timedelta, timezone
from flask_marshmallow import pprint
import os, base64, math


# отправка почты
import smtplib
from email.mime.multipart import MIMEMultipart  # Многокомпонентный объект
from email.mime.text import MIMEText  # Текст/HTML
from email.mime.image import MIMEImage  # Изображения


# работа с изображениями
from PIL import Image, ImageEnhance


# работа с токенами
from flask_jwt_extended import \
    create_access_token, \
    get_jwt, \
    get_jwt_identity,\
    unset_jwt_cookies, \
    jwt_required, \
    JWTManager


app = Flask(__name__, static_folder="./front/build", static_url_path='/')
jwt = JWTManager(app)


# настройки подключения к базе, токены
from configuration import *


# импорт моделей и схем базы
from models import *


# настройки при первичном запуске
from init import *




########################################
#########  М А Р Ш Р У Т Ы   ###########
########################################



@app.route('/', methods=["GET", "POST"])
def index():
    return app.send_static_file('index.html')


@app.route("/test_jwt", methods=["POST"])
# @jwt_required()
def test_jwt():
    value = request.get_json()
    print('value:', value)
    message = "Защищенная конечная точка"
    return jsonify({'type': 'info', "message": message})


@app.route("/logout", methods=["POST"])
def logout():
    message = "Доступ отсутствует или сеанс работы завершен"
    unset_jwt_cookies(jsonify({"message": message}))
    return jsonify({'type': 'info',
                    "message": message})



@app.route('/authorization', methods=['POST'])
def authorization():
    value = request.get_json()
    login = value['login']
    psw = value['password']
    # print(login, psw)

    temp_login = User.query.filter_by(login=login, psw=psw).first()
    # print(temp_login)

    user_schema = UserSchema()
    user = user_schema.dump(temp_login)

    if temp_login is None:
        return jsonify({'type': 'error',
                        'message': 'Пользователь с такими Логин | Пароль не зарегистрирован'})

    access = Shtat.query.filter_by(user=temp_login).first()

    if access is None:
        return jsonify({'type': 'error',
                        'message': f'Пользователь {login} еще не назначен на должность. Ждите...'})


    access_token = create_access_token(identity=login)

    return jsonify({'type': 'success',
                    'message': 'Вход успешен',
                    'data': user,
                    'access_token': access_token})



@app.route('/reg', methods=['POST', 'GET'])
def registration():
    if request.method == 'POST':

        first_name = request.form['first_name']
        last_name = request.form['last_name']
        otchestvo = request.form['otchestvo']

        file = request.files['image']

        login = request.form['login']
        psw = request.form['psw']

        email = request.form['email']
        phone = request.form['phone']

        birthday = request.form['birthday']

        # синтаксические проверки
        if (len(first_name) < 3 or len(first_name) > 20) or (len(last_name) < 3 or len(last_name) > 20):
            flash('Недопустимая длина имени или фамилии.', 'notifRed')
            return render_template('reg.html', title='Регистрация', access=get_access()[0], menu=get_access()[1])

        if (len(login) < 3 or len(login) > 20) or (len(psw) < 3 or len(psw) > 20):
            flash('Недопустимая длина логина или пароля.', 'notifRed')
            return render_template('reg.html', title='Регистрация', access=get_access()[0], menu=get_access()[1])

        if not ('@' in email) or not ('.' in email):
            flash('Указанный email некорректен.', 'notifRed')
            # print('Ешибка email')
            return render_template('reg.html', title='Регистрация', access=get_access()[0], menu=get_access()[1])

        print(first_name, last_name, login, psw)
        path = save_immage(file, 'user_photo', 230, 'off')
        print(path)

        # поиск первого пользователя с вводимым логином
        temp_login = User.query.filter_by(login=login).first()
        # print(temp_login)

        # проверка на отсутствие логина в базе
        if temp_login is None:
            temp_user = User(first_name=first_name,
                             last_name=last_name,
                             otchestvo=otchestvo,

                             path=path,

                             login=login,
                             psw=psw,

                             email=email,
                             phone=phone,

                             birthday=birthday,
                             reg_date=datetime.date.today())

        else:
            flash(f'Пользователь с логином {login} уже существует.', 'notifYellow')
            return render_template('reg.html', title='Регистрация', access=get_access()[0], menu=get_access()[1])

        try:
            db.session.add(temp_user)
            db.session.commit()

            # сообщение пользователю
            message = f"""\
            <html>
              <head></head>
              <body>

                <h4>Уважаемый <i>{login}</i></h4>
                <p>Вы прошли регистрацию в сервисе <i>microERP</i>.</p>
                <p>После назначения на должность Вам будут доступны расширенные функции сервиса. Об этом Вы будете уведомлены сообщением на <i>{email}</i>.</p>
                <p><font size="-1" color="silver" face="Arial">Сообщение сгенерировано автоматически и не требует ответа.</font></p>

              </body>
            </html>
            """
            mail_send(email, message)

            # сообщение администратору
            message = f"""\
            <html>
              <head></head>
              <body>

                <h4>Системное уведомление</h4>
                Получена новая заявка на регистрацию:<br>
                - пользователь: {login}<br>
                - имя: {first_name}<br>
                - фамилия: {last_name}<br>
                - отчество: {otchestvo}<br>
                - email: {email}<br>
                - phone: {phone}<br>

              </body>
            </html>
            """
            mail_send('kai.nn@mail.ru', message)

            flash(f'Заявка на регистрацию пользователя {login} направлена.', 'notifGreen')
            return render_template('reg.html', title='Регистрация', name=User.query.all(), access=get_access()[0],
                                   menu=get_access()[1])

        except:
            return f'При добавлении произошла ошибка (удостоверьтесь в работоспособности email {email}!)'
    else:
        return render_template('reg.html', title='Регистрация', name=User.query.all(), access=get_access()[0],
                               menu=get_access()[1])


@app.route('/list_user', methods=['POST'])
def list_user():
    value = request.get_json()
    status = value['status']
    print("Статус:", status)
    s = Status.query.filter_by(status=status).first()
    print("Статус:", s)
    user = User.query.filter_by(status=s).all()
    print('Пользователи:', user)
    user_schema = UserSchema(many=True)
    output = user_schema.dump(user)
    pprint(output)
    # return jsonify('вывод')
    return jsonify(output)


@app.route('/shtat')
def shtat():
    # контроль неавторизованного доступа
    if not (url_for(sys._getframe().f_code.co_name) in get_access()[1].values()):
        flash('В доступе отказано!', 'notifRed')
        return render_template('index.html', title='Главная', access=get_access()[0], menu=get_access()[1])

    return render_template('shtat.html', title='Штат', role=Role.query.all(), access=get_access()[0],
                           menu=get_access()[1])


@app.route('/add_shtat', methods=['POST'])
def add_shtat():
    if request.is_json:
        # получение массива json от клиента
        value = request.get_json()

        division = value['division']
        subdivision = value['subdivision']

        position = value['position']
        role = value['role']

        if division == '' or subdivision == '' or position == '':
            return f'Что-то пошло не так'

        # print(division, subdivision, position, role)

        role = Role.query.filter_by(role=role).first()

        shtat = Shtat(division=division,
                      subdivision=subdivision,
                      position=position,
                      role_in_shtat=role)

        try:
            db.session.add(shtat)
            db.session.commit()

            # shtat = Shtat.query.order_by('division').all()
            # division = []
            # for d in shtat:
            #     if d.division not in division:
            #         division.append(d.division)
            # # print(division)

            output = ['Штатная единица создана.']
            return jsonify(output)
        except:
            return "Массив JSON не получен", 400


@app.route('/get_shtat', methods=['POST'])
def get_shtat():
    # print(request.is_json)
    # print(type(request.get_json()))
    if request.is_json:
        # получение массива json от клиента
        value = request.get_json()
        # print(value)
        shtat_id = value['id']
        # print("ID штата:", shtat_id)
        shtat = Shtat.query.filter_by(id=shtat_id).first()
        # print('Подразделение:', shtat.division)
        shtat_schema = ShtatSchema()
        output = shtat_schema.dump(shtat)
        # pprint(output)
        # res = make_response(jsonify(output), 200)
        return jsonify(output)
    else:
        return "Массив JSON не получен", 400


@app.route('/shtat_fix_user', methods=['POST'])
def shtat_fix_user():
    if request.is_json:
        value = request.get_json()
        shtat_id = value['id']
        user = value['login']

        shtat = Shtat.query.filter_by(id=shtat_id).first()

        # сброс статуса старого пользователя
        if shtat.user != None:
            shtat.user.status = None

        user = User.query.filter_by(login=user).first()
        print(shtat, user)
        shtat.user = user
        user.status = Status.query.filter_by(status='Работает').first()
        output = ['<b><i>' + user.login + '</i></b>' + ' принят.']
        try:
            db.session.commit()

            # сообщение пользователю
            message = f"""\
            <html>
              <head></head>
              <body>

                <h4>Уважаемый <i>{user.login}</i></h4>
                <p>Вы приняты на должность <i>{shtat.position}</i>, подразделения <i>{shtat.division}</i>.</p>
                <p><font size="-1" color="silver" face="Arial">Сообщение сгенерировано автоматически и не требует ответа.</font></p>

              </body>
            </html>
            """
            mail_send(user.email, message)

        except:
            return 'При добавлении произошла ошибка'

        return jsonify(output)
    else:
        return "Массив JSON не получен", 400


@app.route('/release_user', methods=['POST'])
def release_user():
    value = request.get_json()
    login = value['login']
    # print(login)
    user = User.query.filter_by(login=login).first()
    # print(user, ':', user.login)
    shtat = Shtat.query.filter_by(user=user).first()
    # print(shtat, ':', shtat.user.login)
    shtat.user_id = None
    user.status = None
    # print(shtat, ':', shtat.user_id)

    output = ['<b><i>' + user.login + '</i></b>' + ' освобожден.']
    try:
        db.session.commit()

        # сообщение пользователю
        message = f"""\
        <html>
          <head></head>
          <body>

            <h4>Уважаемый <i>{user.login}</i></h4>
            <p>Вы освобождены от должности <i>{shtat.position}</i>, подразделения <i>{shtat.division}</i>.</p>
            <p><font size="-1" color="silver" face="Arial">Сообщение сгенерировано автоматически и не требует ответа.</font></p>

          </body>
        </html>
        """
        mail_send(user.email, message)

    except:
        return 'При добавлении произошла ошибка'

    return jsonify(output)


@app.route('/list_shtat', methods=['POST'])
def list_shtat():
    if request.is_json:
        value = request.get_json()
        # print(value)
        division = value['division']
        # print(division)
        if division == 'Все':
            shtat = Shtat.query.all()
        else:
            shtat = Shtat.query.filter_by(division=division).all()

        shtat_schema = ShtatSchema(many=True)
        output = shtat_schema.dump(shtat)
        # pprint(output)

        return jsonify(output)


@app.route('/list_division', methods=['POST'])
def list_division():
    shtat = Shtat.query.order_by('division').all()
    division = []
    for d in shtat:
        if d.division not in division:
            division.append(d.division)
    return jsonify(division)


@app.route('/mashine', methods=['POST', 'GET'])
def mashine():
    # контроль неавторизованного доступа
    if not (url_for(sys._getframe().f_code.co_name) in get_access()[1].values()):
        flash('В доступе отказано!', 'notifRed')
        return render_template('index.html', title='Главная', access=get_access()[0], menu=get_access()[1])

    if request.method == 'POST':
        model = request.form['model']
        reg_num = request.form['reg_num']
        shop = request.form['shop']
        clas = request.form['clas']
        year = request.form['year']
        usl_num = request.form['usl_num']

        # проверка наличия оборудования с вводимыми данными
        temp_mashine = Mashine.query.filter_by(model=model, reg_num=reg_num, shop=shop).first()
        # print(temp_mashine)

        if temp_mashine is None:
            # print('В базе нет')
            mashine = Mashine(model=model,
                              reg_num=reg_num,
                              shop=shop,
                              clas=clas,
                              year=year,
                              usl_num=usl_num)
        else:
            return f"Оборудование {model} с инвентарным номером {reg_num} уже существует."

        try:
            db.session.add(mashine)
            db.session.commit()
            return render_template('mashine.html', title='Рег. оборуд.', mashine=Mashine.query.all(),
                                   access=get_access()[0], menu=get_access()[1])
        except:
            return 'При добавлении произошла ошибка'

    else:
        return render_template('mashine.html', title='Рег. оборуд.', mashine=Mashine.query.all(),
                               access=get_access()[0], menu=get_access()[1])




@app.route('/fixing', methods=['POST', 'GET'])
def fixing():
    # контроль неавторизованного доступа
    if not (url_for(sys._getframe().f_code.co_name) in get_access()[1].values()):
        flash('В доступе отказано!', 'notifRed')
        return render_template('index.html', title='Главная', access=get_access()[0], menu=get_access()[1])

    if request.method == 'POST':
        temp_appoint = request.form['appointment']
        temp_reg_num = request.form['reg_num']
        temp_login = request.form['login']
        # print(temp_reg_num, temp_appoint, temp_login)

        # Получение объектов по заданным критериям
        mashine = Mashine.query.filter_by(reg_num=temp_reg_num).first()
        user = User.query.filter_by(login=temp_login).first()
        shtat = Shtat.query.filter_by(user=user).first()
        # print(mashine.model, user.login)

        # проверка закрепения работника с вводимыми данными
        if shtat.user.mashine != mashine:
            # print('В базе нет')
            # print(shtat.user.mashine, mashine)
            shtat.user.mashine = mashine
            mashine.appointment = temp_appoint
        else:
            flash(f"Оборудование с инв. {temp_reg_num} за работником {temp_login} уже закреплено.", 'notifRed')
            return render_template('fixing.html', title='Закрепление работника', user=User.query.all(),
                                   mashine=Mashine.query.all(), shtat=Shtat.query.all(), access=get_access()[0],
                                   menu=get_access()[1])

        try:
            db.session.commit()
            flash(f"Оборудование с инв. {temp_reg_num} закреплено за работником {temp_login}.", 'notifGreen')
            return render_template('fixing.html', title='Закрепление работника', user=User.query.all(),
                                   mashine=Mashine.query.all(), shtat=Shtat.query.all(), access=get_access()[0],
                                   menu=get_access()[1])
        except:
            return 'При добавлении произошла ошибка'

    else:
        return render_template('fixing.html', title='Закрепление работника', user=User.query.all(),
                               mashine=Mashine.query.all(), shtat=Shtat.query.all(), access=get_access()[0],
                               menu=get_access()[1])



@app.route('/detail', methods=['POST', 'GET'])
def detail():

    # контроль неавторизованного доступа
    if not (url_for(sys._getframe().f_code.co_name) in get_access()[1].values()):
        flash('В доступе отказано!', 'notifRed')
        return render_template('index.html', title='Главная', access=get_access()[0], menu=get_access()[1])

    return render_template('detail.html', title='Деталь', detail=Detail.query.all(), access=get_access()[0], menu=get_access()[1])


# print(Detail.query.all())


@app.route('/detail_edit', methods=['POST', 'GET'])
# @app.route('/detail_edit/<int:ident>/<int:index>', methods=['POST', 'GET'])
def detail_edit():

    # # контроль неавторизованного доступа
    # if not (url_for(sys._getframe().f_code.co_name) in get_access()[1].values()):
    #     flash('В доступе отказано!', 'notifRed')
    #     return render_template('index.html', title='Главная', access=get_access()[0], menu=get_access()[1])

    if request.method == 'POST':
        # print('2')
        ident = request.form['ident']
        drawing = request.form['drawing']
        title = request.form['title']
        type = request.form['type']
        index = request.form['index']
        file = request.files['image']
        print(ident, drawing, title, index, file)

        # filename = file.filename
        # print('filename: ', filename)
        # file_ext = os.path.splitext(filename)[1]
        # data = Image.open(request.files["image"].stream)
        # print('data: ', data)

        # image_string = base64.b64encode(file)
        # print(image_string.decode('utf-8'))
        # print(image_string)


        # print(ident, drawing, title, index)
        # контроль вхождения расширения файла в список разрешенных
        # if os.path.splitext(file.filename)[1] not in app.config['UPLOAD_EXTENSIONS']:
        #     flash("Файл должен быть с расширением jpg или png", 'notifRed')
        #     return render_template('detail.html', title='Деталь', detail=Detail.query.all(), access=get_access()[0],
        #                            menu=get_access()[1])

        # поиск первого совпадения
        temp_detail = Detail.query.filter_by(ident=ident, index=index).first()
        print(temp_detail)

        # проверка на отсутствие детали в базе
        if temp_detail is None:
            print('Деталь отсутствует в базе.')
            if not file:
                # файл не вложен: новая деталь без чертежа

                path = 'default.png'
            else:
                # файл вложен: новая деталь с чертежом

                path = save_immage(file, 'drawing')

            detail = Detail(ident=ident,
                            drawing=drawing,
                            title=title,
                            type=type,
                            index=index,
                            path=path)

            try:
                print(detail.ident)
                db.session.add(detail)
                db.session.commit()
                print(Detail.query.first().ident)
                return render_template('detail.html', title='Деталь', detail=Detail.query.all(), access=get_access()[0],
                                       menu=get_access()[1])
            except:
                return 'При добавлении произошла ошибка'

        else:
            print('Деталь есть в базе.')
            # допускаем изменение только вложенного Файла, Наименования и №.Чертежа
            if file:
                # вложенный файл существует
                print(temp_detail.path)
                if temp_detail.path != 'default.png':
                    # удалем кроме картинки по-умолчанию
                    # для WEB-сервера
                    # os.remove('/static/images/' + temp_detail.path)

                    # для локального сервера
                    os.remove(os.path.join(os.path.dirname(__file__), 'static', 'images', temp_detail.path))
                    os.remove(os.path.join(os.path.dirname(__file__), 'static', 'images', 'mini-'+temp_detail.path))

                path = save_immage(file, 'drawing')
                temp_detail.path = path
            else:
                # вложенный файл не существует
                # temp_detail.path = temp_detail.path
                pass

            # temp_detail.ident = ident
            # temp_detail.index = index
            temp_detail.drawing = drawing
            temp_detail.title = title
            temp_detail.type = type

            print(file)

            db.session.commit()
            print("Характеристики детали обновлены.")

            # print(Detail.query.all())

        return render_template('detail.html', title='Деталь', detail=Detail.query.all(), access=get_access()[0],
                           menu=get_access()[1])
    else:
        ident = request.args.get('ident', None)
        index = request.args.get('index', None)
        # print(ident, index)

        detail = Detail.query.filter_by(ident=ident, index=index).first()
        # print(detail)

        if not detail:
            detail = Detail(ident='', drawing='', title='', type='Деталь', index='', path='default.png')
            # print(detail)

    return render_template('detail_edit.html', title='Ред. детали', detail=detail, access=get_access()[0],
     menu=get_access()[1])



@app.route('/list_det', methods=['POST'])
def list_det():
    value = request.get_json()
    key = value['key']
    # print("Key:", key)

    if key == 'Действующие':
        detail = Detail.query.filter_by(relevance=None).all()
    else:
        detail = Detail.query.all()

    # detail = Detail.query.all()
    detail_schema = DetailSchema(many=True)
    output = detail_schema.dump(detail)

    # pprint(output)
    return jsonify(output)



@app.route('/detail_archive', methods=['POST'])
def detail_archive():
    value = request.get_json()
    ident = value['ident']
    index = value['index']
    detail = Detail.query.filter_by(index=index, ident=ident).first()

    # output = ['Деталь Идент.№ <b><i>' + str(detail.ident) + '</i></b>' + ' удалена.']
    # print(output)

    try:
        # удаление данных о детали
        # os.remove(os.path.join(os.path.dirname(__file__), 'static', 'images', detail.path))
        # os.remove(os.path.join(os.path.dirname(__file__), 'static', 'images', 'mini-' + detail.path))
        # db.session.delete(detail)

        # архивирование
        detail.relevance = 'Аннулирован'
        db.session.commit()
    except:
        return 'При добавлении произошла ошибка'

    # return jsonify(output)
    flash('Деталь удалена.', 'notifGreen')
    return render_template('detail.html', title='Деталь', detail=Detail.query.all(), access=get_access()[0],
                           menu=get_access()[1])



@app.route('/detail_from_arhive', methods=['POST'])
def detail_from_arhive():
    value = request.get_json()
    ident = value['ident']
    index = value['index']
    detail = Detail.query.filter_by(index=index, ident=ident).first()

    try:
        # извлечь из архива
        detail.relevance = None
        db.session.commit()
    except:
        return 'При добавлении произошла ошибка'

    # return jsonify(output)
    flash('Деталь восстановлена.', 'notifGreen')
    return render_template('detail.html', title='Деталь', detail=Detail.query.all(), access=get_access()[0],
                           menu=get_access()[1])



@app.route('/tech', methods=['POST', 'GET'])
def tech():
    # контроль неавторизованного доступа
    if not (url_for(sys._getframe().f_code.co_name) in get_access()[1].values()):
        flash('В доступе отказано!', 'notifRed')
        return render_template('index.html',
                               title='Главная',
                               access=get_access()[0],
                               menu=get_access()[1])

    return render_template('tech.html',
                           title='Технология',
                           access=get_access()[0],
                           menu=get_access()[1])





@app.route('/list_tech', methods=['POST'])
# @jwt_required()
def list_tech():

    value = request.get_json()
    print('value', '\n', value)
    page = value['page']
    page_len = value['page_len']
    # value = {'url': 'list_tech', 'filter': 'Мои'}
    # creater = get_access()[0].user.login


    if value['filter'] == 'Мои':
        user = User.query.filter_by(login=creater).first()
        tech = Tech.query.filter_by(user=user).all()
        detail = db.session.query(Detail).join(Tech).filter_by(user=user).all()
    else:
        # fields = [Tech.name, Tech.description, Tech.version]
        # tech = db.session.query(*fields).paginate(page, pages, error_out=False).items
        tech = Tech.query
        tech_count = tech.count()
        page_count = math.ceil(tech_count / page_len)

        tech = tech.order_by(Tech.detail_id, Tech.version)
        tech = tech.paginate(page, page_len, error_out=False).items

        # detail = db.session.query(Detail).join(Tech, Detail.id == Tech.detail_id).all()
        arr_det_id = []
        for t in tech: arr_det_id.append(t.detail_id)
        arr_det_id = list(set(arr_det_id))
        detail = db.session.query(Detail).filter(Detail.id.in_(arr_det_id)).all()


    # print(tech)

    # технологии на неповторяющиеся детали
    # t = list({x.detail_id: x for x in tech}.values())

    tech_schema = TechSchema(many=True)
    tech = tech_schema.dump(tech)

    detail_schema = DetailSchema(many=True)
    detail = detail_schema.dump(detail)

    # объединение в пакет
    output = {'tech': tech,
              'detail': detail,
              'page_count': page_count,
              'tech_count': tech_count,
              'message': {'type': 'info', 'message': 'Все нормуль!'}
              }

    # pprint(output)
    return jsonify(output)




@app.route('/add_tech', methods=['POST'])
def add_tech():
    value = request.get_json()

    name = value['name_teech']
    description = value['description']
    version = value['version']
    detail = value['selectHTML']

    litera = value['litera']
    sortament = value['sortament']
    kod = value['kod']
    ev = value['ev']
    md = value['md']
    en = value['en']
    n_rash = value['n_rash']
    kim = value['kim']
    kod_zag = value['kod_zag']
    profil_i_razmer = value['profil_i_razmer']
    kd = value['kd']
    mz = value['mz']

    date = datetime.date.today().strftime('%d.%m.%Y')
    creater = session.get('username')

    if Tech.query.filter_by(name=name, version=version).first():
        return jsonify({'failed': f'Технология {name} версии {version} существует'})

    user = User.query.filter_by(login=creater).first()

    creater = user.last_name + \
              (' ' + user.first_name[0] + '.' if user.first_name else '') + \
              (user.otchestvo[0] + '.' if user.otchestvo else '')

    detail = Detail.query.filter_by(drawing=detail).first()

    tech = Tech(name=name,
                title=detail.title,
                description=description,
                version=version,
                date=date,
                detail=detail,

                litera=litera,
                sortament=sortament,
                kod=kod,
                ev=ev,
                md=md,
                en=en,
                n_rash=n_rash,
                kim=kim,
                kod_zag=kod_zag,
                profil_i_razmer=profil_i_razmer,
                kd=kd,
                mz=mz,

                creater=creater,
                user=user)

    try:
        db.session.add(tech)
        db.session.commit()
        return jsonify({'success': 'Добавление прошло успешно'})

    except:
        return jsonify({'failed': 'При Добавлении произошла ошибка'})



@app.route('/copy_tech', methods=['POST'])
def copy_tech():
    value = request.get_json()

    basic_tech = value['basic_tech']
    # print('basic_tech: ', basic_tech)

    new_tech = value['new_tech']
    # print('\nnew_tech: ', new_tech)

    creater = session.get('username')

    if Tech.query.filter_by(name=new_tech['name_teech'], version=new_tech['version']).first():
        return jsonify({'failed': f'Технология существует'})

    user = User.query.filter_by(login=creater).first()
    detail = Detail.query.filter_by(drawing=new_tech['drawing']).first()

    # print('detail: ', detail.drawing)
    # print('title: ', detail.title)

    creater = user.last_name + \
              (' ' + user.first_name[0] + '.' if user.first_name else '') + \
              (user.otchestvo[0] + '.' if user.otchestvo else '')

    tech = Tech(name=new_tech['name_teech'],
                title=new_tech['name_det'],
                description=new_tech['description'],
                version=new_tech['version'],

                en=new_tech['en'],
                ev=new_tech['ev'],
                kd=new_tech['kd'],
                kim=new_tech['kim'],
                kod=new_tech['kod'],
                kod_zag=new_tech['kod_zag'],
                litera=new_tech['litera'],
                md=new_tech['md'],
                mz=new_tech['mz'],
                n_rash=new_tech['n_rash'],
                profil_i_razmer=new_tech['profil_i_razmer'],
                sortament=new_tech['sortament'],

                date=datetime.date.today(),
                detail=detail,
                status_tech='edit',
                creater=creater,
                user=user
                )

    old_tech = Tech.query.filter_by(name=basic_tech['name_teech'], version=basic_tech['version']).first()
    old_oper = Oper.query.filter_by(tech=old_tech).all()

    if len(old_oper) != 0:
        for o in old_oper:
            new_oper = Oper(

                tech=tech,

                num=o.num,
                shop=o.shop,
                name=o.name,
                iot=o.iot,

                cool_name=o.cool_name,
                cnc_num=o.cnc_num,
                t_mash=o.t_mash,
                t_vsp=o.t_vsp,

                mashine_display=o.mashine_display,
                mashine=o.mashine,

                perech_display=o.perech_display,
                perech=o.perech,

                prisp_display=o.prisp_display,
                prisp=o.prisp,

                control_check=o.control_check,
                control_carte=o.control_carte,
                control_display=o.control_display,
                control=o.control,

                sketch_display=o.sketch_display,
                sketch=o.sketch,

                date_creation=o.date_creation,
                tools_creater=o.tools_creater,
                tools_check=o.tools_check,
                name_cnc_file=o.name_cnc_file,
                int_cool=o.int_cool,
                ext_cool=o.ext_cool,
                tools_carte=o.tools_carte,
                tools_display=o.tools_display,
                tools=o.tools,
            )
        db.session.add(new_oper)

    try:
        db.session.add(tech)
        db.session.commit()
        return jsonify({'success': 'Добавление прошло успешно'})

    except Exception as ex:
        print(ex)
        return jsonify({'failed': 'При добавлении произошла ошибка'})


@app.route('/change_tech', methods=['POST'])
def change_tech():
    """ Внесение изменений в технологию """
    value = request.get_json()

    name = value['name_teech']
    version = value['version']
    tech = Tech.query.filter_by(name=name, version=version).first()

    print('Изменение технологии...')
    tech.name = value['name_teech']
    tech.version = value['version']
    tech.description = value['description']
    tech.litera = value['litera']
    tech.sortament = value['sortament']
    tech.kod = value['kod']
    tech.ev = value['ev']
    tech.md = value['md']
    tech.en = value['en']
    tech.n_rash = value['n_rash']
    tech.kim = value['kim']
    tech.kod_zag = value['kod_zag']
    tech.profil_i_razmer = value['profil_i_razmer']
    tech.kd = value['kd']
    tech.mz = value['mz']

    try:
        db.session.commit()
        return jsonify({'success': 'Изменение прошло успешно'})

    except:
        return jsonify({'failed': 'При изменении произошла ошибка'})



@app.route('/tech_archive', methods=['POST'])
def tech_archive():
    """ Архивирование/Разархивирование технологии """
    value = request.get_json()

    action = value['action']
    name = value['name_teech']
    version = value['version']

    tech = Tech.query.filter_by(name=name, version=version).first()
    print('tech: ', tech.name)

    if action == 'В архив':

        print('Архивируем технологии...')
        tech.status_tech = 'archive'

    if action == 'Из архива':

        tech.status_tech = 'approve'

    try:
        # db.session.add(tech)
        db.session.commit()
        return jsonify({'success': 'Успешно'})

    except:
        return jsonify({'failed': 'Что-то пошло не так...'})


@app.route('/tech_approve', methods=['POST'])
def tech_approve():
    """ Утвердить технологию """

    # контроль неавторизованного доступа
    usr = get_access()[0].user.login
    # print('Пользователь: ', usr)
    if usr == 'Nemo':
        return jsonify({'style': 'failed', 'message': 'В доступе отказано'})

    value = request.get_json()

    action = value['action']
    name = value['name_teech']
    version = value['version']

    tech = Tech.query.filter_by(name=name, version=version).first()

    if action == 'Утвердить':
        tech.status_tech = 'approve'

    if action == 'Отмена утверждения':
        tech.status_tech = 'edit'

    try:
        db.session.commit()
        return jsonify({'success': 'Технология утверждена'})
    except:
        return jsonify({'failed': 'Что-то пошло не так...'})


@app.route('/tech_del', methods=['POST'])
def tech_del():
    """ Удалить технологию """

    # контроль неавторизованного доступа
    usr = get_access()[0].user.login
    # print('Пользователь: ', usr)
    if usr == 'Nemo':
        return jsonify({'style': 'failed', 'message': 'В доступе отказано'})

    value = request.get_json()

    name = value['name_teech']
    version = value['version']

    tech = Tech.query.filter_by(name=name, version=version).first()
    oper = Oper.query.filter_by(tech=tech).all()
    print(oper)
    db.session.delete(tech)
    # db.session.delete(oper)
    # oper.delete()
    try:
        db.session.commit()
        return jsonify({'success': 'Технология удалена'})
    except:
        return jsonify({'failed': 'Что-то пошло не так...'})


@app.route('/tech_edit', methods=['POST', 'GET'])
def tech_edit():
    return render_template('tech_edit.html', title='Правка технологии', tech=Tech.query.all(), detail=Detail.query.all(),
                           mashine=Mashine.query.all(), access=get_access()[0], menu=get_access()[1])



@app.route('/tech_open', methods=['POST'])
def tech_open():
    # контроль неавторизованного доступа
    usr = get_access()[0].user.login
    # print('Пользователь: ', usr)
    if usr == 'Nemo':
        return jsonify({'style': 'failed', 'message': 'В доступе отказано'})

    value = request.get_json()
    # print('name: ', value['name_teech'])
    # print('version: ', value['version'])

    tech = Tech.query.filter_by(name=value['name_teech'], version=value['version']).first()
    oper_all = Oper.query.filter_by(tech=tech).all()
    det = Detail.query.filter_by(id=tech.detail_id).first()

    # сериализация прописана вручную (для лучшей управляемости)
    oper = []
    for o in oper_all:
        oper += [{
            'num': o.num,
            'shop': o.shop,
            'name': o.name,
            'iot': o.iot,

            'cool_name': o.cool_name,
            'cnc_num': o.cnc_num,
            't_mash': o.t_mash,
            't_vsp': o.t_vsp,

            'mashine_display': o.mashine_display,
            'mashine': o.mashine,

            'perech_display': o.perech_display,
            'perech': eval(o.perech),

            'prisp_display': o.prisp_display,
            'prisp': eval(o.prisp),

            'control_check': o.control_check,
            'control_carte': o.control_carte,
            'control_display': o.control_display,
            'control': eval(o.control),

            'sketch_display': o.sketch_display,
            'sketch': eval(o.sketch),

            'date_creation': o.date_creation,
            'tools_creater': o.tools_creater,
            'tools_check': o.tools_check,
            'name_cnc_file': o.name_cnc_file,
            'int_cool': o.int_cool,
            'ext_cool': o.ext_cool,
            'tools_carte': o.tools_carte,
            'tools_display': o.tools_display,
            'tools': eval(o.tools),
        }]

    tech_schema = TechSchema()
    tech = tech_schema.dump(tech)

    detail_schema = DetailSchema()
    detail = detail_schema.dump(det)

    # сложение словарей
    tech = dict({'oper': oper}, **tech)

    # объединение в пакет
    output = {'tech': tech,
              'detail': detail}
    # pprint(tech)
    # print('Размер, Кб: ', len(str(output))*3/4/1000)
    return jsonify(output)


@app.route('/tech_save', methods=['POST'])
def tech_save():

    message = 'Лог сохранения:\n'

    # контроль неавторизованного доступа
    usr = get_access()[0].user.login
    message += 'Data-Time: ' + datetime.datetime.today().strftime(
        "%Y-%m-%d_%H-%M-%S") + '\n'
    message += 'Пользователь: ' + usr + '\n'
    if usr == 'Nemo':
        return jsonify({'style': 'failed', 'message': 'В доступе отказано'})

    message += 'Получение технологии...\n'

    try:
        tech = request.get_json()['tech']
        message += '  успешно (name: ' + tech["name"] + ', ver.: ' + str(tech["version"]) + ')\n'
        # print('tech["oper"]: ', tech['oper'])
        # print('tech: ', tech)
    except:
        message += 'Технология не загружена от клиента\n'
        return jsonify({'style': 'failed', 'message': 'Технология не пришла от пользователя'})

    # pprint(tech)
    # поиск технологии и удаление ее операций (для последующей перезаписи новыми)
    tech_temp = Tech.query.filter_by(name=tech['name'], version=tech['version']).first()
    tech_temp.status_tech = 'edit'
    oper = Oper.query.filter_by(tech=tech_temp)
    # oper_backup = oper.all()
    # print('oper_backup: ', oper_backup)

    message += 'Удаляем старые операции:\n'
    oper.delete()
    db.session.commit()

    message += '  успешно\n'

    # запись свойств операции в базу
    # ряд полей сохраняются как строка (для компактного хранения в БД)
    if len(tech['oper']) != 0:
        for o in tech['oper']:
            print((o['control']))
            # print('Объем картинок в операции, Кб: ', len(str(o['sketch']))*3/4/1000)
            oper = Oper(
                tech=tech_temp,

                num=o['num'],
                shop=o['shop'],
                name=o['name'],
                iot=o['iot'],

                cool_name=o['cool_name'],
                cnc_num=o['cnc_num'],
                t_mash=o['t_mash'],
                t_vsp=o['t_vsp'],

                mashine_display=o['mashine_display'],
                mashine=o['mashine'],

                perech_display=o['perech_display'],
                perech=str(o['perech']),

                prisp_display=o['prisp_display'],
                prisp=str(o['prisp']),

                control_check=o['control_check'],
                control_carte=o['control_carte'],
                control_display=o['control_display'],
                control=str(o['control']),

                sketch_display=o['sketch_display'],
                sketch=str(o['sketch']),

                date_creation=o['date_creation'],
                tools_creater=o['tools_creater'],
                tools_check=o['tools_check'],
                name_cnc_file=o['name_cnc_file'],
                int_cool=o['int_cool'],
                ext_cool=o['ext_cool'],
                tools_carte=o['tools_carte'],
                tools_display=o['tools_display'],
                tools=str(o['tools']),
            )
    else:
        return jsonify({'style': 'success', 'message': f'Технология <b><i>{tech["name"]}</i></b> сохранена успешно.'})

    message += 'Сохраняем <' + str(len(tech['oper'])) + '> операции:\n'

    try:
        # raise Exception('Test error!')
        db.session.add(oper)
        db.session.commit()

        message += '  успешно\n'
        return jsonify({'style': 'success', 'message': f'Технология <b><i>{tech["name"]}</i></b> сохранена успешно.'})

    except Exception as ex:
        message += f'  ОШИБКА: {ex}\n'
        filename = crash_save_tech(tech)
        message += f'  резервная копия: {filename}\n'

        # print('oper_backup:', oper_backup)
        # for o in oper_backup:
        #     oper = Oper(
        #         tech=tech_temp,
        #
        #         num=o.num,
        #         shop=o.shop,
        #         name=o.name,
        #         iot=o.iot,
        #
        #         cool_name=o.cool_name,
        #         cnc_num=o.cnc_num,
        #         t_mash=o.t_mash,
        #         t_vsp=o.t_vsp,
        #
        #         mashine_display=o.mashine_display,
        #         mashine=o.mashine,
        #
        #         perech_display=o.perech_display,
        #         perech=o.perech,
        #
        #         prisp_display=o.prisp_display,
        #         prisp=o.prisp,
        #
        #         control_check=o.control_check,
        #         control_carte=o.control_carte,
        #         control_display=o.control_display,
        #         control=o.control,
        #
        #         sketch_display=o.sketch_display,
        #         sketch=o.sketch,
        #
        #         date_creation=o.date_creation,
        #         tools_creater=o.tools_creater,
        #         tools_check=o.tools_check,
        #         name_cnc_file=o.name_cnc_file,
        #         int_cool=o.int_cool,
        #         ext_cool=o.ext_cool,
        #         tools_carte=o.tools_carte,
        #         tools_display=o.tools_display,
        #         tools=o.tools,
        #     )

        mail_send('kai.nn@mail.ru', message.replace('\n', '<br>'))
        return jsonify({'style': 'failed', 'message': 'ОШИБКА! Протокол и данные направлены администратору для изучения. Сохраните технологию в файл, нажав ПКМ'})

    finally:
        print(message)









@app.route('/tools', methods=['POST', 'GET'])
def tools():
    """ Управление оснасткой """
    return render_template('tools.html', title='Оснастка',  access=get_access()[0], menu=get_access()[1])


@app.route('/cnc', methods=['POST', 'GET'])
def cnc():
    """ Разработка УП """
    return render_template('cnc.html', title='Разработка УП',  access=get_access()[0], menu=get_access()[1])


@app.route('/tech_manage', methods=['POST', 'GET'])
def tech_manage():
    """ Технологический менеджмент """
    return render_template('tech_manage.html', title='Техн. менеджмент',  access=get_access()[0], menu=get_access()[1])







# @app.route('/save_pic', methods=['POST'])
def save_pic():
    """ Сохранение картинки в base64 """
    value = request.get_json()
    type = value['type']
    data = value['pic']

    print('Размер данных, кБайт: ', len(data) * 3 / 4 / 1000)

    # image = Image.open(BytesIO(base64.b64decode(data)))
    # image.show()

    filename = type + '-' + get_access()[0].user.login + '_' + datetime.datetime.today().strftime(
        "%Y-%m-%d_%H-%M-%S") + '.txt'
    print(filename)

    file = open(os.path.join(os.path.dirname(__file__), 'static', 'pic', filename), 'w+')
    file.write(data)
    file.close()

    return jsonify({'success': f'Данные приняты успешно. Размер {len(data) * 3 / 4 / 1000} кБ.'})


# @app.route('/load_pic', methods=['POST'])
def load_pic():
    """ Загрузка картинки в base64 """
    value = request.get_json()
    filename = value['filename']

    file = open(os.path.join(os.path.dirname(__file__), 'static', 'pic', filename), 'r')
    data = file.read()
    data.show()
    file.close()

    return jsonify(data)




########################################
##########  Ф У Н К Ц И И    ###########
########################################


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
    # контроль данных, отправляемых пользователем
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
    # print(filename)

    (width, height) = data.size
    # print('Исходный размер:')
    # print('width - ', width, 'height - ', height)

    ratio = s / width

    if ratio < 1:
        width = s
        height = round(height * ratio)
        # print('data:', data)
        # print('Конвертация:')
        # print('width - ', width, 'height - ', height)

        data = data.resize((width, height))
        # data.show()

    # для локального сервера
    # сохранение картинки в полном формате
    data.save(os.path.join(os.path.dirname(__file__), 'static', 'images', filename), quality=85)

    # создание миниатюры (по-требованию)
    if mini == 'on':

        data = data.convert('RGB')
        # data = data.filter(ImageFilter.BLUR)
        # blurred_jelly.show()

        # применяем четкость
        enhancer = ImageEnhance.Sharpness(data)
        data = enhancer.enhance(4)

        size = (100, 100)
        data.thumbnail(size)
        data.save(os.path.join(os.path.dirname(__file__), 'static', 'images', 'mini-' + filename), quality=85)
        # data.show()
        # data.resize((100, 75), Image.ANTIALIAS).save(os.path.join(os.path.dirname(__file__), 'static', 'images', 'mini-' + filename), quality=85)


    print('image.save OK')
    return filename



def get_access():

    """ Получение доступа и роли """

    if 'username' in session:
        username = session.get('username')
        user = User.query.filter_by(login=username).first()
        access = Shtat.query.filter_by(user=user).first()
        # print(username)
        menu = create_menu(access.role_in_shtat.role)
        return access, menu
    else:
        user = User(login='Nemo')
        role = Role(role='Гость')
        access = Shtat(user=user, role_in_shtat=role)
        menu = create_menu(access.role_in_shtat.role)
        # print(access.user.login, access.role_in_shtat)
        return access, menu


def mail_send(addr_to, message):

    """ Отправка письма """

    # http://codius.ru/articles/Python_%D0%9A%D0%B0%D0%BA_%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D1%8C_%D0%BF%D0%B8%D1%81%D1%8C%D0%BC%D0%BE_%D0%BD%D0%B0_%D1%8D%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%BD%D1%83%D1%8E_%D0%BF%D0%BE%D1%87%D1%82%D1%83
    # addr_to   = "kai.nn@mail.ru"                        # Получатель

    # addr_from = ""  # Адресат
    # password = ""  # Пароль

    msg = MIMEMultipart()                           # Создаем сообщение
    msg['From'] = E_MAIL                            # Адресат
    msg['To'] = addr_to                             # Получатель
    msg['Subject'] = 'Сообщение от microERP'        # Тема сообщения

    # body = "Текст сообщения"
    # msg.attach(MIMEText(body, 'plain'))           # Добавляем в сообщение текст

    # message = f"""\
    # <html>
    #   <head></head>
    #   <body>
    #     <p>
    #        Текст сообщения
    #     </p>
    #   </body>
    # </html>
    # """
    msg.attach(MIMEText(message, 'html', 'utf-8'))  # Добавляем в сообщение HTML-фрагмент

    server = smtplib.SMTP_SSL('smtp.mail.ru', 465)  # для MAIL.RU
    # server = smtplib.SMTP('smtp.gmail.com', 587)  # Создаем объект SMTP для GOOGLE.COM
    # server.set_debuglevel(True)                   # Включаем режим отладки - если отчет не нужен, строку можно закомментировать
    # server.starttls()                             # Начинаем шифрованный обмен по TLS (для mail.ru закомментировать)
    server.login(E_MAIL, E_MAIL_PASSWORD)               # Получаем доступ
    server.send_message(msg)                        # Отправляем сообщение
    server.quit()                                   # Выходим


def crash_save_tech(data):

    """ Резервирование технологии при ошибке """

    filename = 'crash'  + '_' + datetime.datetime.today().strftime(
        "%Y-%m-%d_%H-%M-%S") + '.txt'
    file = open(os.path.join(os.path.dirname(__file__), 'static', 'crash', filename), 'w+')

    with file as f:
        # json.dump(data, f, indent=4, sort_keys=True)
        file.write(str(data))

    return filename




##################################
## Функции для обслуживания БД ###
##################################

# tech = List.query.all()

# for t in tech:
#     t.manufacturer = '222'
# db.session.commit()

# for t in tech:
#     t.opt = '211'
# db.session.commit()

# for t in tech:
#     t.company = 'НАО "Гидромаш" им. В.И.Лузянина'
# db.session.commit()

# for t in tech:
#     t.last_mod = '10.05.2022'
# db.session.commit()

# tech = List.query.all()
# for t in tech:
#     print('Фирма:',  t.company, 'цех:', t.manufacturer )




@app.route('/tech_set_opt', methods=['POST'])
def tech_set_opt():
    value = request.get_json()['opt']
    print(value, type(value))
    tech = Tech.query.all()[0]

    tech.opt = str(value)
    db.session.commit()

    tech = Tech.query.first()
    a = tech.opt

    try:
        return jsonify(eval(a))
    except:
        return jsonify({'failed': 'Что-то пошло не так...'})



if __name__ == '__main__':
    app.run()
