import { Api } from "services";
import { AxiosPromise } from "axios";

/* Vehicle enpoints */

export const GET_VEHICLES = "/vehicle/getVehicles";
export const SAVE_VEHICLES = "/vehicle/saveVehicle";
export const DELETE_VEHICLES = "/vehicle/deleteVehicle";

export const getVehicles = (): AxiosPromise => Api.get(GET_VEHICLES);
export const saveVehicle = ({ id, model, plates, carBrandId }): AxiosPromise =>
    Api.post(SAVE_VEHICLES, {
        id,
        model,
        plates,
        carBrand: { id: carBrandId }
    });
export const deleteVehicle = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_VEHICLES}${query}`);
};
