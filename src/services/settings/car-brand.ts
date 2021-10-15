import { Api } from "services";
import { AxiosPromise } from "axios";

export const GET_CAR_BRANDS = "/settings/getCarBrands";
export const SAVE_CAR_BRAND = "/settings/saveCarBrand";
export const DELETE_CAR_BRAND = "/settings/deleteCarBrand";

export const getCarBrands = (): AxiosPromise => Api.get(GET_CAR_BRANDS);

export const deleteCarBrand = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_CAR_BRAND}${query}`);
};

export const saveCarBrand = ({ name, id }): AxiosPromise =>
    Api.post(SAVE_CAR_BRAND, {
        name,
        id
    });
