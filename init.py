from app import *

db.create_all()

from models import *


# Тест подключения к БД
try:
    exist = User.query.all()
    print('\nТест подключения к БД - успешно\n')
except Exception as ex:
    print('\nОшибка подключения к БД!\n')



# Закрепление п.п. меню для разных ролей
menu = {

    'Гость': {
        'Главная',
        'Регистрация',
        'Вход'
    },

    'Администратор': {
        'Главная',
        'Тесты',
        'Регистрация',
        'Штат',
        'Оборудование',
        'Закрепление',
        'Деталь',
        'Оснастка',
        'Маршрут',
        'Разработка УП',
        'Тех. менеджмент',
        'Вход',
        'Выход'
    },

    'Технолог': {
        'Главная',
        'Оборудование',
        'Деталь',
        'Маршрут',
        'Выход'
    },

    'Конструктор оснастки': {
        'Главная',
        'Оснастка',
        'Выход'
    },

    'Программист': {
        'Главная',
        'Оборудование',
        'Разработка УП',
        'Выход'
    },

    'Начальник ТБ': {
        'Главная',
        'Оборудование',
        'Деталь',
        'Маршрут',
        'Тех. менеджмент',
        'Выход'
    },

    'Оператор': {
        'Главная',
        'Обработка',
        'Выход'
    },

    'Контролер': {
        'Главная',
        'Выход'
    },

    'Кадры': {
        'Главная',
        'Выход'
    },

    'Рабочий': {
        'Главная',
        'Выход'
    },

    'Сервисный работник': {
        'Главная',
        'Выход'
    },

    'ОТИЗ': {
        'Главная',
        'Закрепление',
        'Выход'
    },

    'ПДБ': {
        'Главная',
        'Оборудование',
        'Выход'
    },

}

url = {
    'Главная': '/',
    'Тесты': '/test',
    'Регистрация': '/reg',
    'Штат': '/shtat',
    'Оборудование': '/mashine',
    'Закрепление': '/fixing',
    'Обработка': '/processing',
    'Деталь': '/detail',
    'Оснастка': '/tools',
    'Ред. детали': '/detail_edit',
    'Маршрут': '/tech',
    'Разработка УП': '/cnc',
    'Тех. менеджмент': '/tech_manage',
    'Выход': '/exit',
    'Вход': '/authorization',
}

if len(User.query.all()) <= 0:

    # настройка статусов пользователя
    status = {None, 'Работает', 'Уволен', 'В отпуске', 'На больничном'}
    for s in status:
        set_status = Status(status=s)
        db.session.add(set_status)

    # настройка штата
    for m in menu:
        if m != '':
            set_role = Role(role=m)
            db.session.add(set_role)

    # настройка администратора
    admin = Role.query.filter_by(role='Администратор').first()
    user = User(first_name='Александр',
                 last_name='Корпусов',
                otchestvo='Иванович',

                 login='',
                 psw='',

                 email='kai.nn@mail.ru',
                 phone='9601698300',

                 birthday='10.03.1979',
                 reg_date=datetime.date.today())

    user.status = Status.query.filter_by(status='Работает').first()

    shtat = Shtat(division='300',
                  subdivision='Администрация',
                  position='Главный инженер',
                  user=user,
                  role_in_shtat=admin)

    db.session.add(user)
    db.session.add(shtat)
    db.session.commit()
    print('\nСозданы default\'ные записи User, Shtat.\n')




# Настройки базы Equipment (оснащение)
equipment_bd = [
    {
        'name': 'Приспособление',
        'is_group': True,
        'description': None,
        'code': None,
        'main_characteristic': None,
        'firm': None,
        'path': 'equipment/default_prisp.png',
        'relevance': True,
        'data_added': None,
        'user': None,
        'position': {
            'num_position': 0,
            'num_str': None
        }
    },
    {
        'name': 'Планшайба токарная',
        'is_group': False,
        'description': 'Планшайба для обработки цапф',
        'code': '63015-100',
        'main_characteristic': '#detail=11.4201.3080.00',
        'firm': 'цех 50',
        'path': 'equipment/prisp_1.jpg',
        'relevance': True,
        'data_added': '10.03.79',
        'user': None,
        'position': {
            'num_position': 1,
            'num_str': None
        }
    },
    {
        'name': 'Средство контроля',
        'is_group': True,
        'description': None,
        'code': None,
        'main_characteristic': None,
        'firm': None,
        'path': 'equipment/default_control.png',
        'relevance': True,
        'data_added': '10.03.90',
        'user': None,
        'position': {
            'num_position': 0,
            'num_str': None
        }
    },
    {
        'name': 'Скоба',
        'is_group': False,
        'description': 'Для контроля наружных гладких поверхностей',
        'code': '63030-300',
        'main_characteristic': '#diametr=50h8',
        'firm': 'цех 50',
        'path': 'equipment/control_1.jpg',
        'relevance': True,
        'data_added': '10.03.10',
        'user': None,
        'position': {
            'num_position': 1,
            'num_str': None
        }
    },
    {
        'name': 'Инструмент',
        'is_group': True,
        'description': None,
        'code': None,
        'main_characteristic': None,
        'firm': None,
        'path': 'equipment/default_tool.png',
        'relevance': True,
        'data_added': '10.03.90',
        'user': None,
        'position': {
            'num_position': 0,
            'num_str': None
        }
    },
]

if len(Equipment.query.all()) <= 0:
    len = len(equipment_bd)
    index = 0
    user = User.query.first()
    while index <= len - 1:
        position = Equipment_position(
            num_position=equipment_bd[index]['position']['num_position'],
            num_str=index
        )
        # print(equipment_bd[index]['type'])
        equipment = Equipment(
            name=equipment_bd[index]['name'],
            is_group=equipment_bd[index]['is_group'],
            description=equipment_bd[index]['description'],
            code=equipment_bd[index]['code'],
            main_characteristic=equipment_bd[index]['main_characteristic'],
            path=equipment_bd[index]['path'],
            relevance=equipment_bd[index]['relevance'],
            data_added=equipment_bd[index]['data_added'],
            user=user,
            position=position,
        )
        index += 1

    db.session.add(equipment)
    db.session.add(position)
    db.session.commit()
    print('\nСозданы default\'ные записи Equipment.\n')





