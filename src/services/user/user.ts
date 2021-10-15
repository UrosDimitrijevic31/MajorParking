import { Api } from "services";
import { AxiosPromise } from "axios";

export const GET_USERS = "/user/getUsers";
export const DELETE_USER = "/user/deleteUser";
export const SAVE_USER = "/user/saveUser";

export const getUsers = (): AxiosPromise => Api.get(GET_USERS);

export const deleteUser = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_USER}${query}`);
};

// export const saveUser = ({ name, id }): AxiosPromise =>
//     Api.post(SAVE_USER, {
//         name,
//         id
//     });
