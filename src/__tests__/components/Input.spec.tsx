import React from 'react';
import { render, fireEvent, wait, getByPlaceholderText } from '@testing-library/react'
import "@testing-library/jest-dom/extend-expect";
import Input from '../../components/Input'

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      }
    }
  }
})

describe('Input Component', () => {
  it('should be able to render input component', () => {
    const {getByPlaceholderText} = render(
      <Input name="email" placeholder="Email"/>
    )

    expect(getByPlaceholderText('Email')).toBeTruthy()
  })

  it('should highlight on input focus', async () => {
    const {getByPlaceholderText, getByTestId} = render(
      <Input name="email" placeholder="Email"/>
    )

    const inputElement = getByPlaceholderText('Email')
    const containerElement = getByTestId("input-container")

    fireEvent.focus(inputElement)

    await wait(() =>{
      expect(containerElement).toHaveStyle('border-color: #a1ced4')
      expect(containerElement).toHaveStyle('color: #a1ced4')
    })

    fireEvent.blur(inputElement)

    await wait(() =>{
      expect(containerElement).not.toHaveStyle('border-color: #a1ced4')
      expect(containerElement).not.toHaveStyle('color: #a1ced4')
    })
  })

  it('should keep input highlighted when filled', async () => {
    const {getByPlaceholderText, getByTestId} = render(
      <Input name="email" placeholder="Email"/>
    )

    const inputElement = getByPlaceholderText('Email')
    const containerElement = getByTestId("input-container")

    fireEvent.change(inputElement, {
      target: { value: 'lucca@test.com'}
    })
    fireEvent.blur(inputElement)

    await wait(() =>{
      expect(containerElement).toHaveStyle('color: #a1ced4')
    })
  })


})
