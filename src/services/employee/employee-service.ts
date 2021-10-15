import { Api } from "services";
import { AxiosPromise } from "axios";

/* Employee enpoints */

export const GET_EMPLOYEES = "/employee/getEmployees";
export const GET_EMPLOYEE = "/employee/getEmployee";
export const SAVE_EMPLOYEE = "/employee/saveEmployee";
export const DELETE_EMPLOYEE = "/employee/deleteEmployee";

export const getEmployees = (): AxiosPromise => Api.get(GET_EMPLOYEES);

export const getEmployee = (id, withHoliday = false): AxiosPromise =>
    Api.get(
        `${GET_EMPLOYEE}?id=${id}${withHoliday ? `&withHolidays=true` : ""}`
    );

export const deleteEmployee = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_EMPLOYEE}${query}`);
};

interface ISaveEmployeeRequest {
    id?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    serviceNumber?: string;
    deviceNumber?: string;
    printerSerial?: string;
    userName?: string;
    password?: string;
    workingHours?: number;
    roleId?: string;
    vehicleId?: string;
    regionId?: string;
    smartphone?: string;
    hourlyRate?: number;
    active: boolean;
}

export const saveEmployee = ({
    id,
    firstName,
    lastName,
    email,
    phone,
    serviceNumber,
    deviceNumber,
    printerSerial,
    userName,
    password,
    workingHours,
    roleId,
    vehicleId,
    regionId,
    smartphone,
    hourlyRate,
    active
}: ISaveEmployeeRequest): AxiosPromise =>
    Api.post(SAVE_EMPLOYEE, {
        id,
        name: firstName,
        lastName,
        email,
        phone,
        serviceNumber,
        deviceNumber,
        printerSerial,
        userName: userName,
        password,
        workingHours,
        vehicle: { id: vehicleId },
        role: { id: roleId },
        region: { id: regionId },
        smartphone: smartphone,
        hourlyRate: hourlyRate,
        active: active
    });
