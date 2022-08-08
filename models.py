from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from app import app

db = SQLAlchemy(app)
ma = Marshmallow(app)



class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(100))
    shtat = db.relationship('Shtat', backref='role_in_shtat')


class Status(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(100))
    user = db.relationship('User', backref='status')


class Shtat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    division = db.Column(db.String(100))
    subdivision = db.Column(db.String(100))
    position = db.Column(db.String(100))

    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # mashine_id = db.Column(db.Integer, db.ForeignKey('mashine.id'))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    otchestvo = db.Column(db.String(50))

    path = db.Column(db.String(100))

    login = db.Column(db.String(100))
    psw = db.Column(db.String(100))

    email = db.Column(db.String(100))
    phone = db.Column(db.String(100))

    birthday = db.Column(db.String(100))
    reg_date = db.Column(db.String(100))

    shtat = db.relationship('Shtat', backref='user')
    # status = db.relationship('Status', backref='user')

    mashine_id = db.Column(db.Integer, db.ForeignKey('mashine.id'))

    # shtat_id = db.Column(db.Integer, db.ForeignKey('shtat.id'))

    status_id = db.Column(db.Integer, db.ForeignKey('status.id'))

    creater = db.relationship('Tech', backref='user')



# o-to-one: https://www.youtube.com/watch?v=JI76IvF9Lwg
class Mashine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String(100))
    reg_num = db.Column(db.String(100))
    shop = db.Column(db.String(100))
    appointment = db.Column(db.String(100))
    clas = db.Column(db.String(100))
    year = db.Column(db.String(100))
    usl_num = db.Column(db.String(10))
    # shtat = db.relationship('Shtat', backref='mashine')
    user = db.relationship('User', backref='mashine')
    # tech = db.relationship('List', backref='mashine')


class Detail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ident = db.Column(db.Integer)
    index = db.Column(db.Integer)
    drawing = db.Column(db.String(100))
    title = db.Column(db.String(100))
    type = db.Column(db.String(100))
    relevance = db.Column(db.String(100))   # актуальность
    path = db.Column(db.String(100))
    tech = db.relationship('Tech', backref='detail')

    def __repr__(self):
        return "<Detail(drawing='%s', id='%s')>" % (self.drawing, self.id)


class Tech(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    title = db.Column(db.String(100))
    description = db.Column(db.String(150))
    version = db.Column(db.Integer)
    date = db.Column(db.String(100))

    manufacturer = db.Column(db.String(10))
    opt = db.Column(db.Text)
    company = db.Column(db.String(50))
    last_mod = db.Column(db.String(30))

    litera = db.Column(db.String(5))
    sortament = db.Column(db.String(100))
    kod = db.Column(db.String(50))
    ev = db.Column(db.String(30))
    md = db.Column(db.String(10))
    en = db.Column(db.String(10))
    n_rash = db.Column(db.String(10))
    kim = db.Column(db.String(10))
    kod_zag = db.Column(db.String(30))
    profil_i_razmer = db.Column(db.String(50))
    kd = db.Column(db.String(10))
    mz = db.Column(db.String(10))

    creater = db.Column(db.String(50))

    status_tech = db.Column(db.String(100))
    oper = db.relationship('Oper', backref='tech', cascade="all, delete, delete-orphan") # возможно каскадное удаление

    creater_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    detail_id = db.Column(db.Integer, db.ForeignKey('detail.id'))


class Oper(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    num = db.Column(db.String(10))
    shop = db.Column(db.String(10))
    name = db.Column(db.String(50))
    iot = db.Column(db.String(40))
    cnc_num = db.Column(db.String(10))
    cool_name = db.Column(db.String(100)) #название СОЖ

    t_mash = db.Column(db.String(10))
    t_vsp = db.Column(db.String(10))

    mashine_display = db.Column(db.String(20))
    mashine = db.Column(db.String(50))

    perech_display = db.Column(db.String(10))
    perech = db.Column(db.Text)

    prisp_display = db.Column(db.String(10))
    prisp = db.Column(db.Text)

    control_check = db.Column(db.String(20))
    control_carte = db.Column(db.String(10))
    control_display = db.Column(db.String(10))
    control = db.Column(db.Text)

    sketch_display = db.Column(db.String(10))
    sketch = db.Column(db.Text(4294000000))

    date_creation = db.Column(db.String(20))
    tools_creater = db.Column(db.String(20))
    tools_check = db.Column(db.String(20))
    name_cnc_file = db.Column(db.String(100))
    int_cool = db.Column(db.String(100))
    ext_cool = db.Column(db.String(100))
    tools_carte = db.Column(db.String(10))
    tools_display = db.Column(db.String(10))
    tools = db.Column(db.Text)

    tech_id = db.Column(db.Integer, db.ForeignKey('tech.id'))




# Shema's

class UserSchema(ma.SQLAlchemyAutoSchema):
    # ...AutoSchema - для автоматического создания полей из модели базы
    class Meta:
        model = User
        include_fk = True




class ShtatSchema(ma.SQLAlchemySchema):
    # ...AutoSchema - для автоматического создания полей из модели базы
    class Meta:
        model = Shtat
        include_fk = True

    id = ma.auto_field()
    division = ma.auto_field()
    subdivision = ma.auto_field()
    position = ma.auto_field()
    user = ma.Nested(UserSchema)


class DetailSchema(ma.SQLAlchemyAutoSchema):
# class DetailSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Detail
        include_fk = True


class MashineSchema(ma.SQLAlchemyAutoSchema):
# ...AutoSchema - для автоматического создания полей из модели базы
    class Meta:
        model = Mashine
        include_fk = True


class TechSchema(ma.SQLAlchemyAutoSchema):
# ...AutoSchema - для автоматического создания полей из модели базы
    class Meta:
        model = Tech
        include_fk = True

    # detail = ma.Nested(DetailSchema)
    # user = ma.Nested(UserSchema)


class OperSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Oper
        include_fk = True


