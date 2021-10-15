import { Api } from "services";
import { AxiosPromise } from "axios";

export const GET_REGIONS = "/settings/getRegions";
export const SAVE_REGION = "/settings/saveRegion";
export const DELETE_REGIONS = "/settings/deleteRegion";

export const deleteRegion = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_REGIONS}${query}`);
};

export const getRegions = (): AxiosPromise => Api.get(GET_REGIONS);

export const saveRegion = ({ name, id }): AxiosPromise =>
    Api.post(SAVE_REGION, {
        name,
        id
    });
