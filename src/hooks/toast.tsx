import React, {createContext, useCallback, useState, useContext} from 'react'
import api from '../services/api';
import {uuid} from 'uuidv4';

import ToastContainer from '../components/ToastContainer';

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'error';
  title: string;
  description?: string;

}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({children}) => {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const addToast = useCallback(({title, type, description}: Omit<ToastMessage, 'id'>) => {
    const id = uuid();

    const toast = {
      id,
      title,
      type,
      description
    }

    setMessages((oldMessages) => [...oldMessages, toast])

  }, [])

  const removeToast = useCallback((id: string) => {
    setMessages((oldMessages) => oldMessages.filter((message) => message.id != id))


  }, [])

  return (
    <ToastContext.Provider value={{addToast, removeToast}}>
      {children}
      <ToastContainer messages={messages}/>
    </ToastContext.Provider>
  )
}

function useToast(): ToastContextData {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast need to be used within toast provider')
  }

  return context
}

export { ToastProvider, useToast}
