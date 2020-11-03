import React, {useRef, useCallback} from 'react'
import {FiLogIn, FiMail, FiLock} from 'react-icons/fi'
import {FormHandles} from '@unform/core'
import {Form} from '@unform/web'
import * as Yup from 'yup'

import getValidationErrors from '../../utils/getValidationErrors'

import logoImg from '../../assets/logo.png'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { Container, Content, Background, AnimationContainer } from './styles'
import {useAuth} from '../../hooks/auth';
import {useToast} from '../../hooks/toast';
import { Link, useHistory } from 'react-router-dom';

interface SignInFormData{
  email: string,
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { signIn} = useAuth()
  const {addToast} = useToast()
  const  history = useHistory()

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors([]);

      const schema = Yup.object().shape({
        email: Yup.string().required('Email is required').email('Digite um email válido'),
        password: Yup.string().required('Password is required'),
      })

      await schema.validate(data, {
        abortEarly: false,
      })

      await signIn({
        email: data.email,
        password: data.password
      })

      history.push('/dashboard')
    } catch (err) {

      if (err instanceof Yup.ValidationError) {

        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Auth Error',
        description: 'Wrong email or password'
      })
    }

  }, [signIn, addToast, history])

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" width="355px" height="247px" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Sign in</h1>

            <Input name="email" icon={FiMail} placeholder="Email"></Input>
            <Input name="password" icon={FiLock} type="password" placeholder="Password"></Input>

            <Button type="submit">Login</Button>
            <a href="">Forgot my password</a>
          </Form>

          <Link to="/signup">
            <FiLogIn/>
            Create account
          </Link>
        </AnimationContainer>
      </Content>

      <Background/>
    </Container>
  )
}
export default SignIn
