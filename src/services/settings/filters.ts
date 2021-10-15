import { Api } from "services";
import { AxiosPromise } from "axios";

export const GET_FILTERS = "/settings/getFilters";
export const SAVE_FILTER = "/settings/saveFilter";

interface IGetFilters {
    type: string;
}

export const getFilters = ({ type }: IGetFilters): AxiosPromise => {
    let query = "";

    if (type) query += `&type=${type}`;
    query = query.substring(1); // removing first unnecessery &

    return Api.get(`${GET_FILTERS}${query ? `?${encodeURI(query)}` : ""}`);
};

interface ISaveEmployeeRequest {
    id?: string;
    name: string;
    type: string;
    data: string;
}

export const saveFilter = ({
    id,
    name,
    type,
    data
}: ISaveEmployeeRequest): AxiosPromise =>
    Api.post(SAVE_FILTER, {
        id,
        name: name,
        type,
        data
    });
