import React from 'react';
import Typography from '@mui/material/Typography';
import {Button, TextField} from '@mui/material';
import {Controller, SubmitHandler, useForm, useFormState} from 'react-hook-form'
import {loginValidation, passwordValidation} from "./validation";
import './AuthForm.css'

interface ISignInForm {
    login: string;
    password: string;
}

const AuthForm = () => {
    const {handleSubmit, control} = useForm<ISignInForm>()
    const {errors} = useFormState(
        {control}
        )

    const onSubmit: SubmitHandler<ISignInForm> = data => console.log(data)

    return (
        <div className='auth_form'>
            <Typography variant="h4" component="div">
                Войдите
            </Typography>
            <Typography variant="subtitle1" component="div" gutterBottom={true} className='auth_form__subtitle1'>
                чтобы получить доступ
            </Typography>


            <form className='auth_form__form' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    // из react-hook-form
                  control={control}
                  name="login"
                  // правила валидации
                  rules={ loginValidation }
                  defaultValue=''
                  render={({field}) => (
                      <TextField
                          label="Логин"
                          size='small'
                          margin='normal'
                          className='auth_form__input'
                          fullWidth={true}
                          onChange={e => field.onChange(e)}
                          value={field.value}
                          // триггер подсветки ошибки
                          error={!!errors.login?.message}
                          helperText={errors.login?.message}
                        />
                  )}
                />
                <Controller
                  control={control}
                  name="password"
                  rules={ passwordValidation }
                  defaultValue=''
                  render={({field}) => (
                      <TextField
                          label="Пароль"
                          type='password'
                          size='small'
                          margin='normal'
                          className='auth_form__input'
                          fullWidth={true}
                          onChange={e => field.onChange(e)}
                          value={field.value}
                          error={!!errors.password?.message}
                          helperText={errors.password?.message}
                        />
                  )}
                />


                <Button
                    type='submit'
                    variant="contained"
                    fullWidth={true}
                    disableElevation={true}
                    sx={{
                        marginTop: 2
                    }}
                >
                    Войти
                </Button>
            </form>
        </div>
    )
}

export default AuthForm