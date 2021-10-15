import { Api } from "services";
import { AxiosPromise } from "axios";

export const SAVE_HOLIDAY = "/employee/saveHoliday";
export const DELETE_HOLIDAY = "/employee/deleteHoliday";
export const GET_HOLIDAY_TYPES = "/settings/getHolidayTypes";

export const deleteHoliday = ({ id }): AxiosPromise => {
    console.log(id, "id");
    const query = "?id=" + id;
    return Api.get(`${DELETE_HOLIDAY}${query}`);
};

export const saveHoliday = ({
    id,
    name,
    start,
    end,
    employeeId,
    typeId
}): AxiosPromise =>
    Api.post(SAVE_HOLIDAY, {
        id,
        name,
        start,
        end,
        employee: { id: employeeId },
        typeId
    });

export const getHolidayTypes = (): AxiosPromise =>
    Api.get(`${GET_HOLIDAY_TYPES}`);
