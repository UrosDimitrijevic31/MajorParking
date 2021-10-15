import { Api } from "services";
import { AxiosPromise } from "axios";

export const GET_EXIBITIONS = "/settings/getExibitions";

export const getExibitions = (): AxiosPromise => Api.get(GET_EXIBITIONS);
