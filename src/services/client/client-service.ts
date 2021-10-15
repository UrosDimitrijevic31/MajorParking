import { Api } from "services";
import { AxiosPromise } from "axios";
import { IInspectionItem, IParking } from "types";

/* Client enpoints */

export const GET_CLIENTS = "/client/getClients";
export const SAVE_CLIENT = "/client/saveClient";
export const GET_FRANCHISES = "/client/getFranchise";
export const SAVE_FRANCHISE = "/client/saveFranchise";
export const DELETE_FRANCHISE = "/client/deleteFranchise";
export const GET_PARKINGS = "/client/getParkings";
export const GET_CONTRACT_TYPES = "/client/getContractTypes";
export const GET_ALL_PARKINGS = "/client/getAllParkings";
export const SAVE_PARKING = "/client/saveParking";
export const SAVE_PARKING_INSP_ITEM = "/client/saveParkingInspectionItem";
export const GET_PARKING_INSP_ITEMS = "/client/getParkingInspectionItems";
export const DELETE_CLIENTS = "/client/deleteClient";
export const DELETE_PARKING = "/client/deleteParking";
export const DELETE_PARKING_INSP_ITEM = "/client/deleteParkingInspectionItem";

export const getClients = (franchiseId?): AxiosPromise =>
    Api.get(
        `${GET_CLIENTS}${franchiseId ? `?franchiseId=${franchiseId}` : ""}`
    );

export const getParkings = (clientId): AxiosPromise =>
    Api.get(`${GET_PARKINGS}?clientId=${clientId}`);

export const getContractTypes = (): AxiosPromise =>
    Api.get(`${GET_CONTRACT_TYPES}`);

export const getAllParkings = (
    parkingTypeId,
    franchiseId,
    clientId,
    costCenter,
    activeOnly,
    inactiveOnly,
    regionId
): AxiosPromise => {
    let query = "";
    if (parkingTypeId) query += `&parkingTypeId=${parkingTypeId}`;
    if (franchiseId) query += `&franchiseId=${franchiseId}`;
    if (clientId) query += `&clientId=${clientId}`;
    if (costCenter) query += `&costCenter=${costCenter}`;
    if (activeOnly) query += `&activeOnly=${activeOnly}`;
    if (inactiveOnly) query += `&inactiveOnly=${inactiveOnly}`;
    if (regionId) query += `&regionId=${regionId}`;
    return Api.get(`${GET_ALL_PARKINGS}${query ? `?${encodeURI(query)}` : ""}`);
};

export const getFranchises = (): AxiosPromise => Api.get(GET_FRANCHISES);

export const deleteFranchise = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_FRANCHISE}${query}`);
};

export const deleteClient = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_CLIENTS}${query}`);
};

export const deleteParking = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_PARKING}${query}`);
};

export const deleteParkingInspectionItem = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_PARKING_INSP_ITEM}${query}`);
};

export const getParkingInspectionItems = (
    parkingId,
    inspectionItemId?
): AxiosPromise => {
    let query = "?parkingId=" + parkingId;
    if (inspectionItemId) {
        query += "&id=" + inspectionItemId;
    }
    return Api.get(`${GET_PARKING_INSP_ITEMS}${query}`);
};

interface ISaveFranchise {
    name: string;
    id: string;
}

export const saveFranchise = ({ name, id }: ISaveFranchise): AxiosPromise =>
    Api.post(SAVE_FRANCHISE, {
        name,
        id
    });

interface ISaveClientRequest {
    name: string;
    franchiseId?: string;
    id: string;
    whitelistLimit: number;
    whitelistUnlimited: boolean;
}

export const saveClient = ({
    name,
    franchiseId,
    id,
    whitelistLimit,
    whitelistUnlimited
}: ISaveClientRequest): AxiosPromise =>
    Api.post(SAVE_CLIENT, {
        name,
        franchise: { id: franchiseId },
        id,
        whitelistLimit,
        whitelistUnlimited
    });

interface ISaveParkingRequest {
    id?: string;
    contactPerson: string;
    name: string;
    costCenter: number;
    phone?: string;
    contractPeriod: number;
    warning?: string;
    latitude?: number;
    longitude?: number;
    workingTimeStart?: string;
    workingTimeEnd?: string;
    numberOfSigns?: number;
    psaNumber?: string;
    contractNumber?: string;
    monthlyFee?: number;
    paidCancellations?: number;
    whitelistApproved?: boolean;
    parkingTypeId?: string;
    productId?: string;
    exibitionId?: string;
    clientId?: string;
    inkassoId?: string;
    regionId?: string;
    city?: string;
    address?: string;
    comment?: string;
    zipCode?: number;
    inkassoDays?: number;
    warningDays: number;
    warningEnabled: boolean;
    yellowCardEnabled: boolean;
    deleteYellowCardDays: number;
    yellowCardPrice: number;
    active: boolean;
    cancellationFee: number;
    parkingSpacesCnt: number;
    contractStart: number;
    contractEnd: number;
    contractTypeId?: string;
}

export const saveParking = ({
    id,
    contactPerson,
    name,
    costCenter,
    phone,
    contractPeriod,
    warning,
    latitude,
    longitude,
    workingTimeStart,
    workingTimeEnd,
    numberOfSigns,
    psaNumber,
    contractNumber,
    monthlyFee,
    paidCancellations,
    whitelistApproved,
    parkingTypeId,
    productId,
    exibitionId,
    clientId,
    inkassoId,
    regionId,
    city,
    address,
    zipCode,
    comment,
    inkassoDays,
    warningDays,
    warningEnabled,
    yellowCardEnabled,
    deleteYellowCardDays,
    yellowCardPrice,
    active,
    cancellationFee,
    parkingSpacesCnt,
    contractStart,
    contractEnd,
    contractTypeId
}: ISaveParkingRequest): AxiosPromise =>
    Api.post(SAVE_PARKING, {
        id,
        contactPerson,
        name,
        costCenter,
        phone,
        contractPeriod,
        warning,
        latitude,
        longitude,
        workingTimeStart,
        workingTimeEnd,
        numberOfSigns,
        psaNumber,
        contractNumber,
        monthlyFee,
        paidCancellations,
        whitelistApproved,
        parkingType: { id: parkingTypeId },
        product: { id: productId },
        exibition: { id: exibitionId },
        client: { id: clientId },
        inkasso: { id: inkassoId },
        region: { id: regionId },
        city: city,
        address: address,
        zipCode: zipCode,
        comment: comment,
        inkassoDays,
        warningDays,
        warningEnabled,
        yellowCardEnabled,
        deleteYellowCardDays,
        yellowCardPrice,
        active,
        cancellationFee,
        parkingSpacesCnt,
        contractStart,
        contractEnd,
        contractType: { id: contractTypeId }
    });

interface IParkingInspectionItem {
    id?: string;
    inspectionItem: IInspectionItem;
    parking: IParking;
    price: number;
}

export const saveParkingInspectionItem = ({
    id,
    inspectionItem,
    parking,
    price
}: IParkingInspectionItem): AxiosPromise =>
    Api.post(SAVE_PARKING_INSP_ITEM, {
        id,
        inspectionItem: { id: inspectionItem },
        parking,
        price
    });
