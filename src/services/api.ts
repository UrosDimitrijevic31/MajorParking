import axios, { AxiosInstance } from "axios";
import config from "../config";
import { useHistory } from "react-router-dom";

const isProduction = process.env.NODE_ENV === "production";

export const cancelToken = axios.CancelToken;

const axiosInstance = (): AxiosInstance =>
    axios.create({
        baseURL: config.serverURL
    });
export const Api = axiosInstance();

// Api.interceptors.request.use(null, err => {
//     console.log("request");
//     throw err.response;
// });

// Api.interceptors.request.use(function(config) {
//     const token = localStorage.getItem("token");
//     axios.defaults.headers.common["apiKey"] = localStorage.getItem("token");
//     console.log(token);
//     return config;
// });

Api.interceptors.response.use(
    res => {
        if (!isProduction) {
            console.info(
                "\n%cAxios response:\n%curl: %o\ndata: %o\n",
                "font-size: 14px; font-style: italic;",
                "font-size: 12px;",
                res.config.url,
                res.data
            );
        }
        if (res.data.result === "error") {
            if (res.data.reason === "Unauthorized") {
                window.open("/login", "_self");
            }
        }
        return res;
    },
    err => {
        if (err.response.status) {
            if (err.response.status === 401) {
                //place your reentry code
                window.open("/login", "_self");
            }
        }
        if (axios.isCancel(err)) {
            throw new axios.Cancel(err.message || "Request canceled");
        } else {
            throw err.response;
        }
    }
);
