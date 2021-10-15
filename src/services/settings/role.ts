import { Api } from "services";
import { AxiosPromise } from "axios";

export const GET_ROLES = "/settings/getRoles";
export const SAVE_ROLE = "/settings/saveRole";
export const DELETE_ROLE = "/settings/deleteRole";

export const getRoles = (): AxiosPromise => Api.get(GET_ROLES);

export const deleteRole = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_ROLE}${query}`);
};

export const saveRole = ({ name, id }): AxiosPromise =>
    Api.post(SAVE_ROLE, { name, id });
