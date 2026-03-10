import axios from "axios"
import { API_BASE_URL } from "./apis"

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000,
});

export const apiConnector = (method, url, bodyData, headers, params) => {
    const requestUrl = /^https?:\/\//i.test(url) ? url : `${API_BASE_URL}${url}`

    return axiosInstance({
        method:`${method}`,
        url: requestUrl,
        data: bodyData ? bodyData : null,
        headers: headers ? headers: null,
        params: params ? params : null,
    });
}
