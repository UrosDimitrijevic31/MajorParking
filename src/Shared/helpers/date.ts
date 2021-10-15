import { format } from "date-fns";

export const DATE_FORMAT = "dd-MM-yyyy";
export const TIME_FORMAT = "HH:mm:ss";
export const DATE_AND_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

export const formatDate = (date): string => format(date, DATE_FORMAT);
export const formatTime = (date): string => format(date, TIME_FORMAT);
export const formatDateAndTime = (date): string =>
    format(date, DATE_AND_TIME_FORMAT);
