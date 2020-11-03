import React, {useCallback, useRef} from 'react'
import {FiArrowLeft, FiMail, FiUser, FiLock} from 'react-icons/fi'
import {Form} from '@unform/web'
import {FormHandles} from '@unform/core'
import * as Yup from 'yup'

import logoImg from '../../assets/logo.png'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { Container, Content, Background, AnimationContainer } from './styles'
import getValidationErrors from '../../utils/getValidationErrors';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const {addToast} = useToast()
  const history = useHistory()

  const handleSubmit = useCallback(async (data: object) => {
    try {
      formRef.current?.setErrors([])

      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email('Digite um email válido'),
        password: Yup.string().min(6, 'Your password must contain at least 6 characters'),
      })

      await schema.validate(data, {
        abortEarly: false,
      })

      await api.post('/users', data)

      history.push('/')

      addToast({
        type: 'success',
        title: 'Account created!',
        description: 'You can do yout logon on Otrelab!'
      })
    } catch (err) {

      if (err instanceof Yup.ValidationError) {

        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error creating your user, please try again'
      })

    }

  }, [addToast, history])

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" width="355px" height="247px" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Sign up</h1>


            <Input name="name" icon={FiUser} placeholder="Name"></Input>
            <Input name="email" icon={FiMail} placeholder="Email"></Input>
            <Input name="password" icon={FiLock} type="password" placeholder="Password"></Input>

            <Button type="submit">Register</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft/>
            Login
          </Link>
        </AnimationContainer>
      </Content>

      <Background/>
    </Container>
  )
}
export default SignUp
