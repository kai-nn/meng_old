from flask import Flask, request, jsonify
from datetime import datetime, timedelta, timezone
from flask_marshmallow import pprint
import os, base64, math




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


# сервис обратной геолокации
# https://dadata.ru/api/geolocate/
from dadata import Dadata


# функции
import defs




########################################
#########  М А Р Ш Р У Т Ы   ###########
########################################



@app.route('/', methods=["GET", "POST"])
def index():
    return app.send_static_file('index.html')


@app.route("/test_jwt", methods=["POST"])
@jwt_required()
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




@app.route('/list_tech', methods=['POST'])
@jwt_required()
def list_tech():

    value = request.get_json()
    print('value', '\n', value)
    page = value['page']
    page_len = value['page_len']
    # value = {'url': 'list_tech', 'filter': 'Мои'}


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
    output = {
        'tech': tech,
        'detail': detail,
        'page_count': page_count,
        'tech_count': tech_count,
        'message': {'type': 'info', 'message': 'Ок'}
    }

    # pprint(output)
    return jsonify(output)




@app.route('/location', methods=['POST'])
def location():
    value = request.get_json()
    print(value)

    if len(value) == 0:
        print('Геоданные отсутствуют')
        return jsonify({})

    lat = value['latitude']
    lon = value['longitude']
    print(lat, lon)

    dadata = Dadata(DADATA_TOKEN)
    try:
        result = dadata.geolocate(name="address", radius_meters=55.601983, lat=lat, lon=lon)
    except:
        result = []
    # result = [{'value': 'Клоака'}]
    # print(result)

    return jsonify(result)






if __name__ == '__main__':
    app.run()
