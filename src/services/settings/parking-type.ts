import { Api } from "services";
import { AxiosPromise } from "axios";

export const GET_PARKING_TYPES = "/settings/getParkingTypes";
export const SAVE_PARKING_TYPE = "/settings/saveParkingType";
export const DELETE_PARKING_TYPE = "/settings/deleteParkingType";

export const getParkingTypes = (): AxiosPromise => Api.get(GET_PARKING_TYPES);

export const deleteParkingType = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_PARKING_TYPE}${query}`);
};

export const saveParkingType = ({ name, id }): AxiosPromise =>
    Api.post(SAVE_PARKING_TYPE, {
        name,
        id
    });
