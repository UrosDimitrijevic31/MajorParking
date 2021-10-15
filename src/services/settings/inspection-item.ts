import { Api } from "services";
import { AxiosPromise } from "axios";

export const GET_INSPECTION_ITEMS = "/settings/getInspectionItems";
export const SAVE_INSPECTION_ITEM = "/settings/saveInspectionItem";
export const DELETE_INSPECTION_ITEM = "/settings/deleteInspectionItem";

export const getInspectionItems = (): AxiosPromise =>
    Api.get(GET_INSPECTION_ITEMS);

export const deleteInspectionItem = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_INSPECTION_ITEM}${query}`);
};

export const saveInspectionItem = ({
    name,
    id,
    freeMinutes,
    doubleScan
}): AxiosPromise =>
    Api.post(SAVE_INSPECTION_ITEM, {
        name,
        id,
        freeMinutes,
        doubleScan
    });
