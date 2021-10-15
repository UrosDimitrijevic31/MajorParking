import { Api } from "services";
import { AxiosPromise } from "axios";

export const GET_PRODUCTS = "/settings/getProducts";
export const DELETE_PRODUCTS = "/settings/deleteProduct";
export const SAVE_PRODUCTS = "/settings/saveProduct";

export const getProducts = (): AxiosPromise => Api.get(GET_PRODUCTS);

export const deleteProduct = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_PRODUCTS}${query}`);
};

export const saveProduct = ({ name, id }): AxiosPromise =>
    Api.post(SAVE_PRODUCTS, {
        name,
        id
    });
