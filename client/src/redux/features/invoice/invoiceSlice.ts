// authApiSlice.js

import apiSlice from '../../api/apiSlice';

const invoiceApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['Invoice'],
  endpoints: (builder) => ({
    getAllInvoices: builder.query({
      query: () => ({
        url: `/api/v1/invoice`,
      }),
      providesTags: ['Invoice'],
    }),
    createInvoice: builder.mutation({
      query: (userData) => ({
        url: 'api/v1/invoice',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Invoice'],
    }),

    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `api/v1/invoice/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invoice'],
    }),
  }),
});

export const {
  useGetAllInvoicesQuery,
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoiceApiSlice;
export default invoiceApiSlice;
