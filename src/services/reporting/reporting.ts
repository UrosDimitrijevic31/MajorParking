import { Api } from "services";
import { AxiosPromise } from "axios";
import { formatDateAndTime } from "helpers";

/* Vehicle enpoints */

export const GET_PARKING_DATA = "/reports/onParkingData";
export const GET_EMPLOYEE_CONTROLS = "/reports/getEmployeeControls";
export const GET_EMPLOYEE_CANCELLATIONS = "/reports/getEmployeeCancellations";
export const GET_GENERAL = "/reports/generalReporting";
export const GET_PARKING_CONTROLS = "/reports/getParkingControls";
export const GET_FREE_PARKING = "/reports/freeParkingData";
export const GET_FREE_EMPLOYEE_DATA = "/reports/freeEmployeeData";
export const GET_SHIFT_REPORT = "/reports/shiftReport";
export const GET_TOTAL_TIME = "/reports/totalTime";
export const GET_OUT_OF_PARKING_DATA = "/reports/outOfParkingData";
export const GET_ALL_PARKINGS2 = "/client/getAllParkingsWithoutFilter";
export const GET_CANCELLATIONS = "/reports/getCancellations";
export const GET_ALL_CANCELLATIONS = "/reports/getAllCancellations";
// export const SAVE_VEHICLES = "/vehicle/saveVehicle";
// export const DELETE_VEHICLES = "/vehicle/deleteVehicle";

export const getAllParkigns = (): AxiosPromise => Api.get(GET_ALL_PARKINGS2);
// export const saveVehicle = ({ id, model, plates, carBrandId }): AxiosPromise =>
//     Api.post(SAVE_VEHICLES, {
//         id,
//         model,
//         plates,
//         carBrand: { id: carBrandId }
//     });
// export const deleteVehicle = ({ id }): AxiosPromise => {
//     console.log(id, "id");
//     const query = "?id=" + id;
//     return Api.get(`${DELETE_VEHICLES}${query}`);
// };
interface IReportDataParking {
    startStamp?: Date;
    endStamp?: Date;
    employeeId?: string;
    parkingId?: string;
}

export const getOnParkingData = ({
    startStamp,
    endStamp,
    employeeId,
    parkingId
}: IReportDataParking): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(`${GET_PARKING_DATA}${query ? `?${encodeURI(query)}` : ""}`);
};

interface IReportCancellations {
    startStamp?: Date;
    endStamp?: Date;
    startTicketStamp?: Date;
    endTicketStamp?: Date;
    employeeId?: string;
    userId?: string;
    parkingId?: string;
    paymentStatusId?: string;
    franchiseId?: string;
    clientId?: string;
}

export const getCancellations = ({
    startStamp,
    endStamp,
    startTicketStamp,
    endTicketStamp,
    userId,
    parkingId,
    paymentStatusId,
    franchiseId,
    clientId
}: IReportCancellations): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (startTicketStamp)
        query += `&startTicketStamp=${formatDateAndTime(startTicketStamp)}`;
    if (endTicketStamp)
        query += `&endTicketStamp=${formatDateAndTime(endTicketStamp)}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (paymentStatusId) query += `&paymentStatusId=${paymentStatusId}`;
    if (userId) query += `&userId=${userId}`;
    if (franchiseId) query += `&franchiseId=${franchiseId}`;
    if (clientId) query += `&clientId=${clientId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(
        `${GET_CANCELLATIONS}${query ? `?${encodeURI(query)}` : ""}`
    );
};

interface IReportAllCancellations {
    startStamp?: Date;
    endStamp?: Date;
    startTicketStamp?: Date;
    endTicketStamp?: Date;
    employeeId?: string;
    userId?: string;
    parkingId?: string;
    paymentStatusId?: string;
}

export const getAllCancellations = ({
    startStamp,
    endStamp,
    startTicketStamp,
    endTicketStamp,
    userId,
    parkingId,
    paymentStatusId
}: IReportAllCancellations): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (startTicketStamp)
        query += `&startTicketStamp=${formatDateAndTime(startTicketStamp)}`;
    if (endTicketStamp)
        query += `&endTicketStamp=${formatDateAndTime(endTicketStamp)}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (paymentStatusId) query += `&paymentStatusId=${paymentStatusId}`;
    if (userId) query += `&userId=${userId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(
        `${GET_ALL_CANCELLATIONS}${query ? `?${encodeURI(query)}` : ""}`
    );
};

interface IReportEmployeeControls {
    startStamp?: Date;
    endStamp?: Date;
    startTicketStamp?: Date;
    endTicketStamp?: Date;
    employeeId?: string;
    parkingId?: string;
    clientId?: string;
    franchiseId?: string;
    regionId?: string;
    costCenter?: number;
    parkingTypeId: string;
}

export const getEmployeeControls = ({
    startStamp,
    endStamp,
    startTicketStamp,
    endTicketStamp,
    parkingId,
    clientId,
    franchiseId,
    regionId,
    employeeId,
    costCenter,
    parkingTypeId
}: IReportEmployeeControls): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (startTicketStamp)
        query += `&startTicketStamp=${formatDateAndTime(startTicketStamp)}`;
    if (endTicketStamp)
        query += `&endTicketStamp=${formatDateAndTime(endTicketStamp)}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (clientId) query += `&clientId=${clientId}`;
    if (franchiseId) query += `&franchiseId=${franchiseId}`;
    if (regionId) query += `&regionId=${regionId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;

    if (costCenter) query += `&costCenter=${costCenter}`;
    if (parkingTypeId) query += `&parkingTypeId=${parkingTypeId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(
        `${GET_EMPLOYEE_CONTROLS}${query ? `?${encodeURI(query)}` : ""}`
    );
};

interface IReportFreeParking {
    startStamp?: Date;
    endStamp?: Date;
    startTicketStamp?: Date;
    endTicketStamp?: Date;
    parkingId?: string;
    clientId?: string;
    franchiseId?: string;
    regionId?: string;
    costCenter?: number;
    parkingTypeId: string;
}

export const getFreeParking = ({
    startStamp,
    endStamp,
    startTicketStamp,
    endTicketStamp,
    parkingId,
    clientId,
    franchiseId,
    regionId,
    costCenter,
    parkingTypeId
}: IReportFreeParking): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (startTicketStamp)
        query += `&startTicketStamp=${formatDateAndTime(startTicketStamp)}`;
    if (endTicketStamp)
        query += `&endTicketStamp=${formatDateAndTime(endTicketStamp)}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (clientId) query += `&clientId=${clientId}`;
    if (franchiseId) query += `&franchiseId=${franchiseId}`;
    if (regionId) query += `&regionId=${regionId}`;

    if (costCenter) query += `&costCenter=${costCenter}`;
    if (parkingTypeId) query += `&parkingTypeId=${parkingTypeId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(`${GET_FREE_PARKING}${query ? `?${encodeURI(query)}` : ""}`);
};

interface IReportFreeEmployeeParking {
    startStamp?: Date;
    endStamp?: Date;
    startTicketStamp?: Date;
    endTicketStamp?: Date;
    parkingId?: string;
    clientId?: string;
    franchiseId?: string;
    regionId?: string;
    employeeId?: string;
    costCenter?: number;
    parkingTypeId: string;
}

export const getFreeEmployeeParking = ({
    startStamp,
    endStamp,
    startTicketStamp,
    endTicketStamp,
    parkingId,
    clientId,
    franchiseId,
    regionId,
    costCenter,
    parkingTypeId,
    employeeId
}: IReportFreeEmployeeParking): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (startTicketStamp)
        query += `&startTicketStamp=${formatDateAndTime(startTicketStamp)}`;
    if (endTicketStamp)
        query += `&endTicketStamp=${formatDateAndTime(endTicketStamp)}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (clientId) query += `&clientId=${clientId}`;
    if (franchiseId) query += `&franchiseId=${franchiseId}`;
    if (regionId) query += `&regionId=${regionId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;

    if (costCenter) query += `&costCenter=${costCenter}`;
    if (parkingTypeId) query += `&parkingTypeId=${parkingTypeId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(
        `${GET_FREE_EMPLOYEE_DATA}${query ? `?${encodeURI(query)}` : ""}`
    );
};

interface IReportGeneral {
    startStamp?: Date;
    endStamp?: Date;
    startTicketStamp?: Date;
    endTicketStamp?: Date;
    parkingId?: string;
    clientId?: string;
    franchiseId?: string;
    regionId?: string;
    employeeId?: string;
    costCenter?: number;
    parkingTypeId: string;
}

export const getGeneralReport = ({
    startStamp,
    endStamp,
    startTicketStamp,
    endTicketStamp,
    parkingId,
    clientId,
    franchiseId,
    regionId,
    costCenter,
    parkingTypeId,
    employeeId
}: IReportGeneral): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (startTicketStamp)
        query += `&startTicketStamp=${formatDateAndTime(startTicketStamp)}`;
    if (endTicketStamp)
        query += `&endTicketStamp=${formatDateAndTime(endTicketStamp)}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (clientId) query += `&clientId=${clientId}`;
    if (franchiseId) query += `&franchiseId=${franchiseId}`;
    if (regionId) query += `&regionId=${regionId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;

    if (costCenter) query += `&costCenter=${costCenter}`;
    if (parkingTypeId) query += `&parkingTypeId=${parkingTypeId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(`${GET_GENERAL}${query ? `?${encodeURI(query)}` : ""}`);
};

interface IReportParkingControls {
    startStamp?: Date;
    endStamp?: Date;
    startTicketStamp?: Date;
    endTicketStamp?: Date;
    parkingId?: string;
    clientId?: string;
    franchiseId?: string;
    regionId?: string;
    costCenter?: number;
    parkingTypeId: string;
}

export const getParkingControls = ({
    startStamp,
    endStamp,
    startTicketStamp,
    endTicketStamp,
    parkingId,
    clientId,
    franchiseId,
    regionId,
    costCenter,
    parkingTypeId
}: IReportParkingControls): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (startTicketStamp)
        query += `&startTicketStamp=${formatDateAndTime(startTicketStamp)}`;
    if (endTicketStamp)
        query += `&endTicketStamp=${formatDateAndTime(endTicketStamp)}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (clientId) query += `&clientId=${clientId}`;
    if (franchiseId) query += `&franchiseId=${franchiseId}`;
    if (regionId) query += `&regionId=${regionId}`;

    if (costCenter) query += `&costCenter=${costCenter}`;
    if (parkingTypeId) query += `&parkingTypeId=${parkingTypeId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(
        `${GET_PARKING_CONTROLS}${query ? `?${encodeURI(query)}` : ""}`
    );
};

interface IReportShifts {
    startStamp?: Date;
    endStamp?: Date;
    employeeId?: string;
    regionId?: string;
}

export const getShiftReport = ({
    startStamp,
    endStamp,
    regionId,
    employeeId
}: IReportShifts): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;
    if (regionId) query += `&regionId=${regionId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(`${GET_SHIFT_REPORT}${query ? `?${encodeURI(query)}` : ""}`);
};

interface IReportTotalTime {
    month1?: Date;
    month2?: Date;
    month3?: Date;
}

export const getTotalTime = ({
    month1,
    month2,
    month3
}: IReportTotalTime): AxiosPromise => {
    let query = "";

    if (month1) query += `&month1=${month1.getTime()}`;
    if (month2) query += `&month2=${month2.getTime()}`;
    if (month3) query += `&month3=${month3.getTime()}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(`${GET_TOTAL_TIME}${query ? `?${encodeURI(query)}` : ""}`);
};

export const getOutOfParkingData = ({
    startStamp,
    endStamp,
    employeeId,
    parkingId
}: IReportDataParking): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${startStamp.getTime()}`;
    if (endStamp) query += `&endStamp=${endStamp.getTime()}`;
    if (parkingId) query += `&parkingId=${parkingId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(
        `${GET_OUT_OF_PARKING_DATA}${query ? `?${encodeURI(query)}` : ""}`
    );
};

interface IReportEmployeeCancellations {
    startStamp?: Date;
    endStamp?: Date;
    employeeId?: string;
    parkingId?: string;
    franchiseId?: string;
    clientId?: string;
    costCenter?: string;
}

export const getEmployeeCancellations = ({
    startStamp,
    endStamp,
    employeeId,
    parkingId,
    costCenter,
    clientId,
    franchiseId
}: IReportEmployeeCancellations): AxiosPromise => {
    let query = "";

    if (startStamp) query += `&startStamp=${formatDateAndTime(startStamp)}`;
    if (endStamp) query += `&endStamp=${formatDateAndTime(endStamp)}`;

    if (parkingId) query += `&parkingId=${parkingId}`;
    if (employeeId) query += `&employeeId=${employeeId}`;
    if (franchiseId) query += `&franchiseId=${franchiseId}`;
    if (clientId) query += `&clientId=${clientId}`;
    if (costCenter) query += `&costCenter=${costCenter}`;

    query = query.substring(1); // removing first unnecessery &

    return Api.get(
        `${GET_EMPLOYEE_CANCELLATIONS}${query ? `?${encodeURI(query)}` : ""}`
    );
};
