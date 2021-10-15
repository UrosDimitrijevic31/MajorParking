import { Api } from "services";
import { AxiosPromise } from "axios";

export const GET_PAYMENT_STATUSES = "/settings/getPaymentStatuses";
export const GET_CANCEL_STATUSES = "/settings/getCancelStatuses";

export const getPaymentStatuses = (): AxiosPromise =>
    Api.get(GET_PAYMENT_STATUSES);

export const getCancelStatuses = (): AxiosPromise =>
    Api.get(GET_CANCEL_STATUSES);
