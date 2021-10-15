import { Api } from "services";
import { AxiosPromise } from "axios";
import { formatDateAndTime } from "helpers";

/* Whitelist endpoints */

export const GET_WHITELIST = "/whitelist/getWhitelist";
export const SAVE_WHITELIST = "/whitelist/saveWhitelist";
export const DELETE_WHITELIST = "/whitelist/deleteWhiteList";

// export const getWhitelist = (): AxiosPromise => Api.get(GET_WHITELIST);

export const deleteWhiteList = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_WHITELIST}${query}`);
};
interface IGetWhitelist {
    contractNumber?: string;
    clientId?: string;
    plates?: string;
    carBrandId?: string;
    parkingId?: string;
    customerName?: string;
}

export const getWhitelist = ({
    contractNumber,
    clientId,
    carBrandId,
    parkingId,
    plates,
    customerName
}: IGetWhitelist): AxiosPromise => {
    let query = "";

    if (contractNumber) query += `&contractNumber=${contractNumber}`;
    if (clientId) query += `&clientId=${clientId}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (carBrandId) query += `&carBrandId=${carBrandId}`;
    if (plates) query += `&plates=${plates}`;
    if (customerName) query += `&customerName=${customerName}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(`${GET_WHITELIST}${query ? `?${encodeURI(query)}` : ""}`);
};

export const saveWhitelist = ({
    id,
    name,
    contract,
    customerName,
    plates,
    fromDate,
    toDate,
    carBrandId,
    clientId,
    parkingId
}): AxiosPromise =>
    Api.post(SAVE_WHITELIST, {
        id,
        name,
        contract,
        customerName,
        plates,
        fromDate,
        toDate,
        carBrand: { id: carBrandId },
        client: { id: clientId },
        parking: { id: parkingId }
    });
