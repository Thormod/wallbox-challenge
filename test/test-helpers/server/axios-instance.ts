import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Returns an Axios instance, Here we can set default configuration (like auth)
 * @return {AxiosInstance}
 */
export function getAxiosInstance(appURL: string): AxiosInstance {
  const config: AxiosRequestConfig = {
    baseURL: appURL,
    responseType: 'json',
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    timeout: 1000,
    validateStatus: () => true,
  };

  return axios.create(config);
}
