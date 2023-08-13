import _ from 'lodash';
import { useEffect } from 'react';
import useModal from '../hooks/useModal';
import axios from 'axios';
import { appConfig } from '@/configs/apis';
import { getToken, setToken } from '@/utils';
import { accountApi } from '.';

const axiosInstance = axios.create({
  baseURL: appConfig.api_gateway_url,
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

interface AxiosInterceptorProps {
  children: JSX.Element;
}

const AxiosInterceptor = ({ children }: AxiosInterceptorProps) => {
  const { openModal } = useModal();
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response && response.data,
      async (error) => {
        const originalRequest = error.config;

        // Access Token was expired or Unauthorized
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Mark to try again only once
          const token = getToken();
          // Unauthorized
          if (_.isNil(token)) {
            openModal({ key: 'authentication', params: { beClosed: false } });
            return Promise.reject(error);
          }
          // Generate new token if the authentication is successful
          const newAccessToken = await accountApi.refreshToken();
          setToken(newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }

        // Forbidden
        if (error.response.status === 403) {
          alert('Forbidden...!');
        }
        return Promise.reject(error);
      }
    );
    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [openModal]);
  return children;
};

export { AxiosInterceptor };
export default axiosInstance;
