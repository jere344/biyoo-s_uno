import { AxiosResponse } from "axios"
import CustomAxios, { setLocalToken, unsetLocalToken } from "./CustomAxios"
import IUser from "../data_interfaces/IUser"

const changePassword = (password: string): Promise<AxiosResponse<IUser>> => (
  CustomAxios.put("auth/current-user-password/me/", { password })
)

const get = (): Promise<AxiosResponse<IUser>> => (
  CustomAxios.get("auth/current-user/")
)

const login = (username: string, password: string): Promise<boolean> => {
  const promise = new Promise<boolean>((resolve, reject) => {
    CustomAxios.post("auth/token/", { username, password })
      .then((response) => {
        setLocalToken(response.data);
        CustomAxios.get("auth/current-user/").then((userResponse) => {
          localStorage.setItem("profilePicture", userResponse.data.profile_picture);
          resolve(true);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
  return promise;
}

const logout = (): Promise<boolean> => {
  const promise = new Promise<boolean>((resolve) => {
    unsetLocalToken()
    resolve(true)
    localStorage.removeItem("profilePicture")
  });
  return promise;
}

const register = (user: IUser, password: string): Promise<AxiosResponse<IUser>> => (
  CustomAxios.post("auth/register/", {
    username: user.username,
    email: user.email,
    password,
  })
)

const save = (user: IUser): Promise<AxiosResponse<IUser>> => {
  const formData = new FormData();
  formData.append('email', user.email);
  formData.append('username', user.username);
  if (user.profile_picture) {
    formData.append('profile_picture', user.profile_picture);
  }
  return CustomAxios.put("auth/current-user/me/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

const deleteUser = (): Promise<AxiosResponse<IUser>> => (
  CustomAxios.delete("auth/current-user/me/").then(() => {
    unsetLocalToken()
  })
)

const UserDS = {
  changePassword,
  get,
  login,
  logout,
  register,
  save,
  deleteUser
}

export default UserDS;
