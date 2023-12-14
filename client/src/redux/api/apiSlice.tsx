import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// create api slice
const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5050',
    credentials: 'include',
  }),
  endpoints: () => ({}),
});

export default apiSlice;
