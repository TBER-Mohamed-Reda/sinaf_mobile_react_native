import axios, { AxiosRequestConfig } from 'axios';
import * as React from 'react';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { API_BASE_URL, useAuth } from '../core';

export const queryClient = new QueryClient();

export const APIProvider = ({ children }: { children: React.ReactNode }) => {

  const { token } = useAuth();

  useEffect(() => {
    axios.interceptors.request.use(
      (config: AxiosRequestConfig): AxiosRequestConfig => {

        config.baseURL = API_BASE_URL;
        if (config.url !== '/oauth/token' && token?.access !== undefined) {
          config.headers = {
            authorization: `Bearer ${token.access}`
          };
        }
        // this is important to include the cookies when we are sending the requests to the backend.
        // config.withCredentials = true;
        return config;
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        return Promise.reject(error);
      }
    );

  }, [token]);

  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}