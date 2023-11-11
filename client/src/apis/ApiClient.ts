import _ from 'lodash';
import axios from 'axios';
import { appConfig } from '@/configs/apis';
import { getToken, setToken } from '@/utils';
import { accountApi } from '.';

const ApiClient = () => {
  const axiosClient = axios.create({
    baseURL: appConfig.api_gateway_url,
  });

  axiosClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  axiosClient.interceptors.response.use(
    (response) => response && response.data,
    async (error) => {
      const originalRequest = error.config;
      // Access Token was expired or Unauthorized
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark to try again only once
        const token = getToken();
        // Unauthorized
        if (_.isNil(token)) {
          console.log('Unauthorized...!');
          return Promise.reject(error);
        }
        // Generate new token if the authentication is successful
        const newAccessToken = await accountApi.refreshToken();
        setToken(newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      }

      // Forbidden
      if (error.response.status === 403) {
        console.log('Forbidden...!');
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );
  return axiosClient;
};

export default ApiClient();
