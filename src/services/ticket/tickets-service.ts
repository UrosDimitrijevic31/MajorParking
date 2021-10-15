/* Ticket endpoints */

import { Api } from "services";
import { AxiosPromise } from "axios";
import { formatDateAndTime } from "helpers";

export const GET_TICKETS = "/ticket/getTickets";
export const GET_DELETED_TICKETS = "/ticket/getDeletedTickets";
export const GET_PAID_CANC = "/ticket/getPaidCancellations";
export const GET_CLIENT_TICKETS = "/ticket/getClientTickets";
export const GET_YELLOW_CARDS = "/ticket/getYellowCards";
export const GET_RED_CARDS = "/ticket/getRedCards";
export const DELETE_TICKET = "/ticket/deleteTicket";
export const CANCEL_TICKET = "/ticket/cancelTicket";
export const UPDATE_TICKETS = "/ticket/updateTicket";
export const DELETE_IMAGE = "/ticket/deleteImage";
export const DELETE_YELLOWCARD = "/ticket/deleteYellowCard";

interface IGetTickets {
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
    parkingTypeId?: string;
    costCenter?: string;
}

interface IGetClientTickets {
    plates: string;
    ticketNumber: string;
    parkingId: string;
}

interface IGetPaymentCancellations {
    parkingId: string;
}

interface ISaveTicketRequest {
    id: string;
    plates: string;
    paymentStatusId: string;
    parkingInspectionItemId: string;
    countryMark: string;
    comment: string;
    price: number;
}

export const deleteTicket = (ticketId, comment): AxiosPromise => {
    let query = "";
    if (ticketId) query += `&id=${ticketId}`;
    if (comment) query += `&comment=${comment}`;
    return Api.get(`${DELETE_TICKET}${query ? `?${encodeURI(query)}` : ""}`);
};

export const deleteYellowCard = (ticketId): AxiosPromise => {
    let query = "";
    if (ticketId) query += `&id=${ticketId}`;
    return Api.get(
        `${DELETE_YELLOWCARD}${query ? `?${encodeURI(query)}` : ""}`
    );
};

export const deleteImage = (imageId): AxiosPromise => {
    let query = "";
    if (imageId) query += `&id=${imageId}`;
    return Api.get(`${DELETE_IMAGE}${query ? `?${encodeURI(query)}` : ""}`);
};

export const cancelTicket = (
    ticketId,
    paymentStatusId,
    comment
): AxiosPromise => {
    let query = "";
    if (ticketId) query += `&id=${ticketId}`;
    if (paymentStatusId) query += `&paymentStatusId=${paymentStatusId}`;
    if (comment) query += `&comment=${comment}`;
    return Api.get(`${CANCEL_TICKET}${query ? `?${encodeURI(query)}` : ""}`);
};

export const getTickets = ({
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
    parkingTypeId,
    costCenter
}: IGetTickets): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (plates) query += `&plates=${plates}`;
    if (costCenter) query += `&costCenter=${costCenter}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (parkingTypeId) query += `&parkingTypeId=${parkingTypeId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;
    if (carBrandId) query += `&carBrandId=${carBrandId}`;
    if (carColorId) query += `&carColorId=${carColorId}`;
    if (countryMark) query += `&countryMark=${countryMark}`;
    if (paymentStatusId) query += `&paymentStatusId=${paymentStatusId}`;
    if (priceMin) query += `&priceMin=${priceMin}`;
    if (priceMax) query += `&priceMax=${priceMax}`;
    if (ticketNumber) query += `&ticketNumber=${ticketNumber}`;
    if (inspectionItemId) query += `&inspectionItemId=${inspectionItemId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(`${GET_TICKETS}${query ? `?${encodeURI(query)}` : ""}`);
};
export const getDeletedTickets = ({
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
    parkingTypeId,
    costCenter
}: IGetTickets): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (plates) query += `&plates=${plates}`;
    if (costCenter) query += `&costCenter=${costCenter}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (parkingTypeId) query += `&parkingTypeId=${parkingTypeId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;
    if (carBrandId) query += `&carBrandId=${carBrandId}`;
    if (carColorId) query += `&carColorId=${carColorId}`;
    if (countryMark) query += `&countryMark=${countryMark}`;
    if (paymentStatusId) query += `&paymentStatusId=${paymentStatusId}`;
    if (priceMin) query += `&priceMin=${priceMin}`;
    if (priceMax) query += `&priceMax=${priceMax}`;
    if (ticketNumber) query += `&ticketNumber=${ticketNumber}`;
    if (inspectionItemId) query += `&inspectionItemId=${inspectionItemId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(
        `${GET_DELETED_TICKETS}${query ? `?${encodeURI(query)}` : ""}`
    );
};

export const getClientTickets = ({
    plates,
    ticketNumber,
    parkingId
}: IGetClientTickets): AxiosPromise => {
    let query = "";

    if (plates) query += `&plates=${plates}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (ticketNumber) query += `&ticketNumber=${ticketNumber}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(
        `${GET_CLIENT_TICKETS}${query ? `?${encodeURI(query)}` : ""}`
    );
};

export const getPaidCancellations = ({
    parkingId
}: IGetPaymentCancellations): AxiosPromise => {
    let query = "";

    if (parkingId) query += `&parkingId=${parkingId}`;
    query = query.substring(1); // removing first unnecessery &

    return Api.get(`${GET_PAID_CANC}${query ? `?${encodeURI(query)}` : ""}`);
};

export const getYellowCards = ({
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
    parkingTypeId,
    costCenter
}: IGetTickets): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (plates) query += `&plates=${plates}`;
    if (costCenter) query += `&costCenter=${costCenter}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (parkingTypeId) query += `&parkingTypeId=${parkingTypeId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;
    if (carBrandId) query += `&carBrandId=${carBrandId}`;
    if (carColorId) query += `&carColorId=${carColorId}`;
    if (countryMark) query += `&countryMark=${countryMark}`;
    if (paymentStatusId) query += `&paymentStatusId=${paymentStatusId}`;
    if (priceMin) query += `&priceMin=${priceMin}`;
    if (priceMax) query += `&priceMax=${priceMax}`;
    if (ticketNumber) query += `&ticketNumber=${ticketNumber}`;
    if (inspectionItemId) query += `&inspectionItemId=${inspectionItemId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(`${GET_YELLOW_CARDS}${query ? `?${encodeURI(query)}` : ""}`);
};

export const getRedCards = ({
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
    parkingTypeId,
    costCenter
}: IGetTickets): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (plates) query += `&plates=${plates}`;
    if (costCenter) query += `&costCenter=${costCenter}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (parkingTypeId) query += `&parkingTypeId=${parkingTypeId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;
    if (carBrandId) query += `&carBrandId=${carBrandId}`;
    if (carColorId) query += `&carColorId=${carColorId}`;
    if (countryMark) query += `&countryMark=${countryMark}`;
    if (paymentStatusId) query += `&paymentStatusId=${paymentStatusId}`;
    if (priceMin) query += `&priceMin=${priceMin}`;
    if (priceMax) query += `&priceMax=${priceMax}`;
    if (ticketNumber) query += `&ticketNumber=${ticketNumber}`;
    if (inspectionItemId) query += `&inspectionItemId=${inspectionItemId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(`${GET_RED_CARDS}${query ? `?${encodeURI(query)}` : ""}`);
};

export const saveTicket = ({
    id,
    plates,
    paymentStatusId,
    parkingInspectionItemId,
    countryMark,
    comment,
    price
}: ISaveTicketRequest): AxiosPromise =>
    Api.post(UPDATE_TICKETS, {
        id,
        plates,
        paymentStatus: { id: paymentStatusId },
        parkingInspectionItem: { id: parkingInspectionItemId },
        countryMark,
        comment,
        price: price
    });
