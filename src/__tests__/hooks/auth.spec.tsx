import { renderHook,act } from "@testing-library/react-hooks";
import { useAuth, AuthProvider } from "../../hooks/auth";
import MockAdapter from "axios-mock-adapter"
import api from '../../services/api'

const apiMock = new MockAdapter(api)

describe('AuthHook', () => {

  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        email: 'lucca@test.com',
        name: 'lucca'
      },
      token: 'token123'
    }
    apiMock.onPost('sessions').reply(200, apiResponse)

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result, waitForNextUpdate } = renderHook(()=> useAuth(), {
      wrapper: AuthProvider,
    })

    result.current.signIn({
      email: 'lucca@test.com',
      password: '123456'
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith('@otrelab:token', apiResponse.token)
    expect(setItemSpy).toHaveBeenCalledWith('@otrelab:user', JSON.stringify(apiResponse.user))

    expect(result.current.user.email).toEqual('lucca@test.com')
  })

  it('should restore saved data from storage when it auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@otrelab:token':
          return 'token-123'
        case '@otrelab:user':
          return JSON.stringify({
            id: 'user123',
            email: 'lucca@test.com',
            name: 'lucca'
          })
        default:
          return null
      }
    })

    const { result } = renderHook(()=> useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.user.email).toEqual('lucca@test.com')

  })

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@otrelab:token':
          return 'token-123'
        case '@otrelab:user':
          return JSON.stringify({
            id: 'user123',
            email: 'lucca@test.com',
            name: 'lucca'
          })
        default:
          return null
      }
    })

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    const { result } = renderHook(()=> useAuth(), {
      wrapper: AuthProvider,
    })

    act(()=>{
      result.current.signOut()
    })

    expect(removeItemSpy).toHaveBeenCalledTimes(2)
    expect(result.current.user).toBeUndefined()

  })

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(()=> useAuth(), {
      wrapper: AuthProvider,
    })

    const user = {
      id: 'user123',
      email: 'lucca@test.com',
      name: 'lucca',
      image_url: 'avatar.jpg'
    }

    act(()=>{
      result.current.updateUser(user)
    })

    expect(setItemSpy).toHaveBeenCalledWith(
      '@otrelab:user',
      JSON.stringify(user)
    )

    expect(result.current.user).toEqual(user)


  })

})
