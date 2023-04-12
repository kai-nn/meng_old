from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime, timedelta, timezone
from flask_marshmallow import pprint
import os, base64, math
import json


import pandas as pd
# pip install pandas openpyxl

# from openpyxl import load_workbook
# from openpyxl_image_loader import SheetImageLoader

from flask_socketio import SocketIO
# pip install flask-socketio



# работа с токенами
# from flask_jwt_extended import \
#     create_access_token, \
#     get_jwt, \
#     get_jwt_identity,\
#     unset_jwt_cookies, \
#     jwt_required, \
#     JWTManager

app = Flask(__name__, static_folder="./front/build", static_url_path='/')
# jwt = JWTManager(app)

socketIo = SocketIO(app, cors_allowed_origins='*')

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
from defs import *



# ведение журналов
# один печатает журналы (stdout), другой записывает журналы в файл:

# import logging
# import sys
#
# logger = logging.getLogger()
# logger.setLevel(logging.INFO)
# formatter = logging.Formatter('%(levelname)s | %(message)s')
#
# stdout_handler = logging.StreamHandler(sys.stdout)
# stdout_handler.setLevel(logging.DEBUG)
# stdout_handler.setFormatter(formatter)
#
# file_handler = logging.FileHandler('logs.log')
# file_handler.setLevel(logging.DEBUG)
# file_handler.setFormatter(formatter)
#
#
# logger.addHandler(file_handler)
# logger.addHandler(stdout_handler)




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

    temp_login = User.query.filter_by(login=login, psw=psw).first()

    if temp_login is None:
        return jsonify({'type': 'error',
                        'message': 'Пользователь с такими Логин | Пароль не зарегистрирован'})

    shtat = Shtat.query.filter_by(user=temp_login).first()

    if shtat is None:
        return jsonify({'type': 'error',
                        'message': f'Пользователь {login} еще не назначен на должность. Ждите...'})

    user_schema = UserSchema()
    user = user_schema.dump(temp_login)

    user.pop('psw')

    shtat_schema = ShtatSchema()
    shtat = shtat_schema.dump(shtat)

    access_token = getAccess(login, user, shtat)

    return jsonify({'type': 'success',
                    'message': 'Вход успешен',
                    'data': user,
                    'access_token': access_token})




@app.route('/list_tech', methods=['POST'])
# @jwt_required()
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

    if value is None:
        print('Геоданные отсутствуют')
        return jsonify([])

    lat = value['latitude']
    lon = value['longitude']
    # print(lat, lon)

    dadata = Dadata(DADATA_TOKEN)
    try:
        result = dadata.geolocate(name="address", radius_meters=55.601983, lat=lat, lon=lon)
    except:
        result = []
    # result = [{'value': 'Клоака'}]
    # print(result)

    return jsonify(result)



@app.route('/img_store/<path:name>', methods=['GET'])
def img_store(name):
    return send_from_directory("static/images", name)


@app.route('/equipment', methods=['GET', 'POST', 'DELETE'])
def equipment():

    if request.method == 'GET':
        eq = Equipment.query.all()
        equipment = []
        for e in eq:
            equipment += [{
                'id': e.id,
                'type': e.type,
                'name': e.name,
                'description': e.description,
                'code': e.code,
                'firm': e.firm,
                'path': e.path,
                'data_added': e.data_added,

                'nodes': eval(e.nodes),
                'parrent': e.parrent,

                'options': eval(e.options),

                'relevance': e.relevance,
                'added_id': e.added_id,
                # 'collapsed': True,
                # 'is_group': e.is_group,
            }]
        return equipment

    if request.method == 'POST':
        print('##############')
        value = request.get_json()
        # print('value: ', value)
        selected = value['selected']
        command = value['command']

        if command == 'addElem':
            # response = add_equipment_element(selected)
            # socketIo.emit('equipmentСhange', response)

            test()
            return 'addElem OK'

        if command == 'addSubElem':
            response = add_equipment_sub_element(selected)
            socketIo.emit('equipmentСhange', response)
            return 'addSubElem OK'

    if request.method == 'DELETE':
        value = request.get_json()
        print('value: ', value)
        selected = value['selected']

        response = del_elem(selected)
        print(response)

        socketIo.emit('equipmentСhange', response)
        return 'deleteElem OK'




def add_equipment_element(selected):
    # print('selected', selected)

    selected_elem = Equipment.query.get(selected)

    parrent = Equipment.query.get(selected_elem.parrent)
    print('id parrent: ', parrent.id)

    equipment_count = Equipment.query.count()

    newElem = Equipment(
        type=None,
        name='Новый ' + str(equipment_count + 1),
        description=None,
        code=None,
        firm=None,
        path=None,
        data_added=datetime.now().date().strftime("%d.%m.%Y"),

        nodes=str([]),
        parrent=parrent.id,

        options=str(None),

        relevance=1,
        added_id=None,
    )
    db.session.add(newElem)

    parrent_nodes = eval(parrent.nodes)
    # print('parrent_nodes: ', parrent_nodes)
    position_in_list = parrent_nodes.index(int(selected))
    # print('position in list: ', position_in_list)
    print(f'{newElem.name} \n--------------')
    # print('id_new_elem', newElem.id)
    parrent_nodes.insert(position_in_list + 1, equipment_count + 1)
    # print('new nodes list: ', parrent_nodes )
    parrent.nodes = str(parrent_nodes)

    db.session.commit()

    equipment_schema = EquipmentSchema()
    return {
        'parrent': {**equipment_schema.dump(parrent), 'nodes': eval(parrent.nodes), 'options': eval(parrent.options)},
        'newElem': {**equipment_schema.dump(newElem), 'nodes': eval(newElem.nodes), 'options': eval(newElem.options)},
        'command': 'addElem',
    }


def add_equipment_element_1(selected):
    print('selected', selected)
    selected_elem = Equipment.query.get(selected)

    parrent = Equipment.query.get(selected_elem.parrent)

    newElem = Equipment(
        type=None,
        name='Новый',
        description=None,
        code=None,
        firm=None,
        path=None,
        data_added=datetime.now().date().strftime("%d.%m.%Y"),

        nodes=str([]),
        parrent=parrent.id,

        options=str(None),

        relevance=1,
        added_id=None,
    )
    db.session.add(newElem)
    db.session.commit()

    parrent_nodes = eval(parrent.nodes)
    # print('parrent_nodes: ', parrent_nodes)
    position_in_list = parrent_nodes.index(int(selected))
    # print('position in list: ', position_in_list)
    newElem = Equipment.query.all()[-1]
    # newElem = db.session.query(Equipment)[-1]
    print(f'{newElem.name} {newElem.id}')
    newElem.name += f' {newElem.id}'
    # print('id_new_elem', newElem.id)
    parrent_nodes.insert(position_in_list + 1, newElem.id)
    # print('new nodes list: ', parrent_nodes )
    parrent.nodes = str(parrent_nodes)
    db.session.commit()

    equipment_schema = EquipmentSchema()
    return {
        'parrent': {**equipment_schema.dump(parrent), 'nodes': eval(parrent.nodes), 'options': eval(parrent.options)},
        'newElem': {**equipment_schema.dump(newElem), 'nodes': eval(newElem.nodes), 'options': eval(newElem.options)},
        'command': 'addElem',
    }





# add_equipment_element(8)

def test():
    num = Equipment.query.count()
    n = num
    while n < num+2:
        print('last elem: ', n)
        response = add_equipment_element(n)
        socketIo.emit('equipmentСhange', response)
        n += 1



def add_equipment_sub_element(selected):

    selected_elem = Equipment.query.get(selected)

    parrent = selected_elem

    newElem = Equipment(
        type=None,
        name='Новый',
        description=None,
        code=None,
        firm=None,
        path=None,
        data_added=datetime.now().date().strftime("%d.%m.%Y"),

        nodes=str([]),
        parrent=parrent.id,

        options=str(None),

        relevance=1,
        added_id=None,
    )
    db.session.add(newElem)
    db.session.commit()

    parrent_nodes = eval(parrent.nodes)
    print('parrent_nodes: ', parrent_nodes)
    newElem = db.session.query(Equipment)[-1]
    newElem.name += f' {newElem.id}'
    print('id_new_elem', newElem.id)
    parrent_nodes.append(newElem.id)
    print('new nodes list: ', parrent_nodes )
    parrent.nodes = str(parrent_nodes)
    db.session.commit()

    equipment_schema = EquipmentSchema()
    return {
        'parrent': {**equipment_schema.dump(parrent), 'nodes': eval(parrent.nodes), 'options': eval(parrent.options)},
        'newElem': {**equipment_schema.dump(newElem), 'nodes': eval(newElem.nodes), 'options': eval(newElem.options)},
        'command': 'addSubElem',
    }


def del_elem(selected):
    """ ID цепочки вложенных элементов """
    deleted_nodes = [selected]
    def chain(nodes):
        for nod in nodes:
            deleted_nodes.append(nod)
            chain(eval(Equipment.query.get(nod).nodes))
    chain(eval(Equipment.query.get(selected).nodes))

    selected_elem = Equipment.query.get(selected)
    parrent = Equipment.query.get(selected_elem.parrent)
    temp_parrent_nodes = eval(parrent.nodes)
    temp_parrent_nodes.remove(selected_elem.id)
    parrent.nodes = str(temp_parrent_nodes)

    # id_deleted_elem = del_elem(selected)
    eq = db.session.query(Equipment).filter(Equipment.id.in_(deleted_nodes))
    eq.delete()

    db.session.commit()

    equipment_schema = EquipmentSchema()
    return {
        'parrent': {**equipment_schema.dump(parrent), 'nodes': eval(parrent.nodes), 'options': eval(parrent.options)},
        'deleted_nodes': deleted_nodes,
        'command': 'delElem',
    }


# sel = input('selected ID: ')



# nodes = [{'id': 1, 'name': 'el 1'}, {'id': 2, 'name': 'el 2'},]
# print({**nodes[0], 'id': 2})


# @socketIo.on('equipmentСhange')
# def equipmentСhange(change):
#     print('change', change)
#
#     eq = Equipment.query.get(change)
#     equipment_schema = EquipmentSchema()
#     response = equipment_schema.dump(eq)
#
#     send(response, broadcast=True)
#     return None


@app.route('/workplaces', methods=['GET', 'POST'])
def workplaces():

    if request.method == 'GET':
        response = wp()
        return jsonify(response)




def wp():
    df = pd.read_excel(
        io='Подетальная загрузка оборудования БПЗМП 2023.xlsx',
        header=3,
    )

    # удаление строк по критериям
    df = df[df['Деталь'].str.contains('Ʃ трудоемкость|Авиация|Наземка|Коэффициент загрузки') == False]
    df.dropna()  # удаление пустых строк
    df.dropna(subset=['Кол-во'])  # удаление строк с NaN
    df = df.reset_index(drop=True)  # сброс индексов после удаления строк
    df = df.fillna('')  # замена NaN на '' во всех ячейках

    # удаление неиспользуемых столбцов
    columns = df.columns.values.tolist()
    removed_columns = []
    i = 0
    while i < len(columns):
        if not columns[i].find('Трудоемкость'):
            removed_columns.append(columns[i])
        i += 1
    df.drop(columns=removed_columns, axis=1, inplace=True)
    # print(df)

    # список рабочих мест
    columns = df.columns.values.tolist()
    workplaces = []
    i = 0
    while i < len(columns):
        if not columns[i] in ['Наименование', 'Деталь', 'Кол-во']:
            workplaces.append(columns[i])
        i += 1
    # print(workplaces)

    work = df.loc[0:3]

    # print(work)

    work = work.rename(columns={'Деталь': 'wp'})

    # work = work.drop(labels=[0], axis=0)

    # print(work)

    work = work.set_index('wp').T
    work = work.drop(labels=['Наименование', 'Кол-во'])
    work = work.rename(columns={
        # 'Деталь': 'wp',
        'Кол-во станков': 'wp_quantity',
        'Кисп': 'k_isp',
        'Сменность': 'shift',
        'Календарный фонд, ч': 'fond',
    })
    # print(work)
    work = json.loads(
        work.to_json(orient='index')
    )


    # Выборка технологий
    df = df.iloc[6:]
    # print(df)
    tech_array = dict.fromkeys(workplaces)
    for wp in workplaces:
        # print(f'\n{wp}')
        query = df[['Деталь', 'Наименование', 'Кол-во', wp]]
        query = query.loc[(
                (df[wp] != 0) &
                (df[wp] != '') &
                (df['Кол-во'] != 0)
        )]
        query = query.rename(columns={
            'Деталь': 'drawing',
            'Наименование': 'name',
            'Кол-во': 'count',
            wp: 'tm'
        })
        query = query.assign(tm_sum=query['count'] * query['tm'])
        # print(query[0:5])

        tech_array[wp] = json.loads(
            query.to_json(orient='records')
        )

    # вставка изображений из ячеек
    # wb = load_workbook('./Подетальная загрузка оборудования БПЗМП 2023.xlsx')
    # sheet = wb['Загрузка']
    # # print(sheet)
    #
    # image_loader = SheetImageLoader(sheet)
    # image = image_loader.get('D5')
    # # image.show()
    #
    # for row in sheet.iter_rows():
    #     for cell in row:
    #         if cell.value in workplaces:
    #             cellAddr = 'D' + str(cell.column+1)
    #             print(cell.value, cell.row, cell.column, cellAddr)
    #             image = image_loader.get('D5')
    #             image.show()

    return {
        'workplaces': work,
        'tech_array': tech_array
    }


wp()







# if __name__ == '__main__':
#     app.run()

if __name__ == '__main__':
    socketIo.run(app)
