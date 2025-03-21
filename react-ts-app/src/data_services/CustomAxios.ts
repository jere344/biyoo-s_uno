import axios from "axios"
import IAuthResponse from "../data_interfaces/IAuthResponse"

const baseURL: string = import.meta.env.VITE_API_URL
const headerToken = "Bearer "

// Les clés pour stocker dans le localStorage du navigateur
export const storageAccessTokenKey = "access_token"
const storageRefreshTokenKey = "refresh_token"
export const storageUsernameKey = "user_name"

const CustomAxios = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds
  headers: {
    'Authorization': localStorage.getItem(storageAccessTokenKey)
      ? headerToken + localStorage.getItem(storageAccessTokenKey)
      : null,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

export const setLocalToken = (authData: IAuthResponse): void => {
  localStorage.setItem(storageAccessTokenKey, authData.access);
  localStorage.setItem(storageRefreshTokenKey, authData.refresh);
  localStorage.setItem(storageUsernameKey, authData.user.username);
  CustomAxios.defaults.headers.Authorization = headerToken + authData.access;
}

export const unsetLocalToken = (): void => {
  localStorage.removeItem(storageAccessTokenKey);
  localStorage.removeItem(storageRefreshTokenKey);
  localStorage.removeItem(storageUsernameKey);
  CustomAxios.defaults.headers.Authorization = null;
}

export const forceRefreshtoken = async (): Promise<void | undefined> => {
  const refreshToken = localStorage.getItem(storageRefreshTokenKey)

  if (refreshToken) {
    const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))

    // exp date in token is expressed in seconds, while now() returns milliseconds:
    const now = Math.ceil(Date.now() / 1000)
    
    if (tokenParts.exp > now) {
      try {
        const response = await CustomAxios
          .post('auth/token-refresh/', { refresh: refreshToken })
        console.log('Axios - force refresh token')
        localStorage.setItem(storageAccessTokenKey, response.data.access)
        if (response.data.refresh) {
          localStorage.setItem(storageRefreshTokenKey, response.data.refresh)
        }

        CustomAxios.defaults.headers.Authorization = headerToken + response.data.access
        return Promise.resolve()
      } catch (err) {
        console.log('Axios error handler - auth/token-refresh/', err);
        unsetLocalToken(); // Clear tokens if refresh fails
        return Promise.reject(err);
      }
    }
    unsetLocalToken()
  }
  return Promise.reject()
}

CustomAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {      
          if (error.response.data.code === 'token_not_valid') {
            // Si le token d'accès est expiré,
            // on va en chercher un autre avec le token d'actualisation.

            const refreshToken = localStorage.getItem(storageRefreshTokenKey)

            if (refreshToken) {
              const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))

              // exp date in token is expressed in seconds, while now() returns milliseconds:
              const now = Math.ceil(Date.now() / 1000)
              
              if (tokenParts.exp > now) {
                return CustomAxios
                  .post('auth/token-refresh/', { refresh: refreshToken })
                  .then((response) => {
                    console.log('Axios - Access token refreshed')
                    localStorage.setItem(storageAccessTokenKey, response.data.access)
                    if (response.data.refresh) {
                      localStorage.setItem(storageRefreshTokenKey, response.data.refresh)
                    }

                    CustomAxios.defaults.headers.Authorization = headerToken + response.data.access
                    if (error.config) {
                      error.config.headers.Authorization = headerToken + response.data.access
                      return CustomAxios(error.config)
                    } else {
                      console.log('Axios error.config is null - auth/token-refresh/')
                    }
                  })
                  .catch((err) => {
                    console.log('Axios error handler - auth/token-refresh/', err, err.response)
                  })
              }
              unsetLocalToken()
            }
          }
          if (error.config?.url !== 'auth/token/') {
            window.location.href = '/login/'
          }
        }
      }
    }

    return Promise.reject(error)
  },
)

export default CustomAxios
