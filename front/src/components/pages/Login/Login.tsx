import React from 'react';
import {useNavigate} from "react-router-dom";
import Typography from '@mui/material/Typography';
import { Button, TextField} from '@mui/material';
import {Controller, SubmitHandler, useForm, useFormState} from 'react-hook-form'
import {loginValidation, passwordValidation} from "./validation";
import axios from "axios";
import {useDispatch} from "react-redux";
import {showMessage} from '../../../store/message/messageSlice'
import {setToken} from "../../../store/access/accessSlice";
import './Login.css'

interface ISignInForm {
    login: string;
    password: string;
}

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {handleSubmit, control} = useForm<ISignInForm>()
    const {errors} = useFormState(
        {control}
        )

    const api = async (url:string, param:any={}) => {
        const res = await axios.post(url, param)
        return res.data
    }

    const onSubmit: SubmitHandler<ISignInForm> = data => {
        api('authorization', data)
            .then(data => {
                // console.log(data)
                dispatch(setToken(data.access_token))
                dispatch(showMessage({
                    visibility: true,
                    type: data.type,
                    text: data.message,
                }))
                navigate('/')
            })
    }

    return (
        <div className='page'>
            <Typography variant="h4" component="div">
                Войдите
            </Typography>
            <Typography variant="subtitle1" component="div" gutterBottom={true} className='subtitle'>
                для получения доступа
            </Typography>

            <form className='form' onSubmit={handleSubmit(onSubmit)}>
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
                            className='input'
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
                            className='input'
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
                    sx={{ marginTop: 2 }} >
                    Войти
                </Button>
            </form>

        </div>
    )
}

export default Login