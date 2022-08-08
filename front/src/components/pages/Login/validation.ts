const REQUIRED_FIELD = 'Поле обязательное для заполнения'

export const loginValidation = {
    required: REQUIRED_FIELD,
    validate: (value: string) => {

        if(value.match(/[а-яА-Я]/)) return 'Логин не может содержать русские символы'

        return true
    }
}

export const passwordValidation = {
    required: REQUIRED_FIELD,
    validate: (value: string) => {

        if(value.length < 3) return 'Пароль не может быть менее 3-х символов'

        return true
    }
}