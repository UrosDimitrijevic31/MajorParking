/* Ticket endpoints */

import { Api } from "services";
import { AxiosPromise } from "axios";
import { formatDateAndTime } from "helpers";
import { ITicket } from "types";

export const GET_INCASSO_TICKETS = "/inkasso/getTickets";
export const GET_INCASSO_PROFILES = "/inkasso/getInkassoProfiles";
export const DELETE_INKASSO = "/inkasso/deleteInkasso";
export const GET_INCASSO_PARKING_LOCATIONS = "/inkasso/getParkingLocations";
export const GET_INCASSO_USERS = "/user/getUsers";
export const SAVE_INCASSO_USERS = "/user/saveUser";
export const SAVE_INCASSO_PROFILE = "/inkasso/saveInkasso";
export const GET_WARNING_TICKETS = "/inkasso/getWarningTickets";
export const GET_TRANSACTIONS = "/ticket/getTransactions";
export const GET_ACTIONS = "/inkasso/getActions";
export const SAVE_ACTION = "/inkasso/saveAction";
export const GET_FILTER_TRANSACTIONS = "/ticket/getFilterTransactions";
export const DELETE_INKASSO_USER = "/inkasso/deleteInkassoUser";
// export const UPDATE_TICKETS = "/ticket/updateTicket";

export const getIncassoProfiles = (): AxiosPromise =>
    Api.get(GET_INCASSO_PROFILES);
export const saveIncassoProfile = ({ id, name, email }): AxiosPromise =>
    Api.post(SAVE_INCASSO_PROFILE, {
        id,
        name,
        email
    });
export const getIncassoParkingLocations = (incassoId): AxiosPromise =>
    Api.get(`${GET_INCASSO_PARKING_LOCATIONS}?inkassoId=${incassoId}`);

export const getIncassoUsers = (incassoId): AxiosPromise =>
    Api.get(`${GET_INCASSO_USERS}?inkassoId=${incassoId}`);

export const deleteInkasso = ({ id }): AxiosPromise => {
    const query = "?id=" + id;
    return Api.get(`${DELETE_INKASSO}${query}`);
};

export const deleteInkassoUser = ({ id }): AxiosPromise => {
    const query = "?id=" + id;
    return Api.get(`${DELETE_INKASSO_USER}${query}`);
};

interface IGetIncasoTickets {
    startStamp?: Date;
    endStamp?: Date;
    plates?: string;
    parkingId?: string;
    employeeId?: string;
    carBrandId?: string;
    carColorId?: string;
    countryMark?: string;
    paymentStatusId?: string;
    priceMin?: string;
    priceMax?: string;
    ticketNumber?: string;
    inspectionItemId?: string;
    withoutAction: boolean;
}

export const getIncaassoTickets = ({
    startStamp,
    endStamp,
    plates,
    parkingId,
    employeeId,
    carBrandId,
    carColorId,
    countryMark,
    paymentStatusId,
    priceMin,
    priceMax,
    ticketNumber,
    inspectionItemId,
    withoutAction
}: IGetIncasoTickets): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (plates) query += `&plates=${plates}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;
    if (carBrandId) query += `&carBrandId=${carBrandId}`;
    if (carColorId) query += `&carColorId=${carColorId}`;
    if (countryMark) query += `&countryMark=${countryMark}`;
    if (paymentStatusId) query += `&paymentStatusId=${paymentStatusId}`;
    if (priceMin) query += `&priceMin=${priceMin}`;
    if (priceMax) query += `&priceMax=${priceMax}`;
    if (ticketNumber) query += `&ticketNumber=${ticketNumber}`;
    if (inspectionItemId) query += `&inspectionItemId=${inspectionItemId}`;
    query += `&withoutAction=${withoutAction}`;
    query = query.substring(1); // removing first unnecessery &

    return Api.get(
        `${GET_INCASSO_TICKETS}${query ? `?${encodeURI(query)}` : ""}`
    );
};

interface IGetWarningTickets {
    startStamp?: Date;
    endStamp?: Date;
    plates?: string;
    parkingId?: string;
    employeeId?: string;
    carBrandId?: string;
    carColorId?: string;
    countryMark?: string;
    paymentStatusId?: string;
    priceMin?: string;
    priceMax?: string;
    ticketNumber?: string;
    inspectionItemId?: string;
    withoutAction: boolean;
}

export const getWarningTickets = ({
    startStamp,
    endStamp,
    plates,
    parkingId,
    employeeId,
    carBrandId,
    carColorId,
    countryMark,
    paymentStatusId,
    priceMin,
    priceMax,
    ticketNumber,
    inspectionItemId,
    withoutAction
}: IGetWarningTickets): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (plates) query += `&plates=${plates}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;
    if (carBrandId) query += `&carBrandId=${carBrandId}`;
    if (carColorId) query += `&carColorId=${carColorId}`;
    if (countryMark) query += `&countryMark=${countryMark}`;
    if (paymentStatusId) query += `&paymentStatusId=${paymentStatusId}`;
    if (priceMin) query += `&priceMin=${priceMin}`;
    if (priceMax) query += `&priceMax=${priceMax}`;
    if (ticketNumber) query += `&ticketNumber=${ticketNumber}`;
    if (inspectionItemId) query += `&inspectionItemId=${inspectionItemId}`;
    query += `&withoutAction=${withoutAction}`;
    query = query.substring(1); // removing first unnecessery &

    return Api.get(
        `${GET_WARNING_TICKETS}${query ? `?${encodeURI(query)}` : ""}`
    );
};

interface IGetTransactions {
    inkassoId?: string;
}

export const getTransactions = (): AxiosPromise => {
    //if (inkassoId) query += `&startStamp=${inkassoId}`;

    //query = query.substring(1); // removing first unnecessery &

    return Api.get(`${GET_TRANSACTIONS}`);
};

export const getFilterTransactions = (startStamp, endStamp): AxiosPromise => {
    let query = "";
    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    return Api.get(
        `${GET_FILTER_TRANSACTIONS}${query ? `?${encodeURI(query)}` : ""}`
    );
};

interface IGetActions {
    ticketId: string;
}

export const getActions = (ticketId: IGetActions): AxiosPromise => {
    let query = "";

    if (ticketId) query += `&ticketId=${ticketId}`;
    query = query.substring(1); // removing first unnecessery &
    console.log(
        `${GET_ACTIONS}${query ? `?${encodeURI(query)}` : ""}`,
        "ATION"
    );

    return Api.get(`${GET_ACTIONS}${query ? `?${encodeURI(query)}` : ""}`);
};

interface ISaveUser {
    id: string;
    userName: string;
    password: string;
    roleId?: string;
    inkassoId?: string;
    clientId?: string;
}

export const saveIncassoUser = ({
    id,
    userName,
    password,
    roleId,
    inkassoId,
    clientId
}: ISaveUser): AxiosPromise =>
    Api.post(SAVE_INCASSO_USERS, {
        id,
        userName,
        password,
        role: { id: roleId },
        inkasso: { id: inkassoId },
        client: { id: clientId }
    });

interface ISaveAction {
    id?: string;
    comment: string;
    type: string;
    ticketId: string;
    warningSent: boolean;
    inkassoSent: boolean;
    tickets: ITicket[];
}

export const saveAction = ({
    id,
    comment,
    type,
    ticketId,
    warningSent,
    inkassoSent,
    tickets
}: ISaveAction): AxiosPromise =>
    Api.post(SAVE_ACTION, {
        id,
        comment,
        type,
        ticket: { id: ticketId },
        warningSent,
        inkassoSent,
        tickets
    });
