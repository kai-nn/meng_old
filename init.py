from app import *

db.create_all()

from models import *

# user = User(username='Александр', lastname='Корпусов', email='admin@example.com')
# db.session.add(user)
# db.session.commit()


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

try:
    exist = User.query.all()
    print('\nТест подключения к БД - успешно\n')
except Exception as ex:
    db.create_all()
    print('\nСоздана структура базы данных\n')

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

    shtat = Shtat(division='330',
                  subdivision='Администрация',
                  position='Начальник отдела',
                  user=user,
                  role_in_shtat=admin)

    db.session.add(user)
    db.session.add(shtat)
    db.session.commit()
