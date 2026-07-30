import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type CallEndpointArguments = {
  url: string;
};

export const endpointCallApi = createApi({
  reducerPath: 'endpointCallApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    callEndpoint: builder.mutation<string, CallEndpointArguments>({
      query: ({ url }) => ({
        url,
        method: 'POST',
        responseHandler: (response) => response.text(),
      }),
    }),
  }),
});

export const { useCallEndpointMutation } = endpointCallApi;
