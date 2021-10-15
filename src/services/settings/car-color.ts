import { Api } from "services";
import { AxiosPromise } from "axios";

export const GET_CAR_COLORS = "/settings/getCarColors";
export const SAVE_CAR_COLOR = "/settings/saveCarColor";
export const DELETE_CAR_COLOR = "/settings/deleteCarColor";

export const getCarColors = (): AxiosPromise => Api.get(GET_CAR_COLORS);

export const deleteCarColor = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_CAR_COLOR}${query}`);
};

export const saveCarColor = ({ name, code, id }): AxiosPromise =>
    Api.post(SAVE_CAR_COLOR, { name, code, id });
