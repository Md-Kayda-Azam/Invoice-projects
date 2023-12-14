// authApiSlice.js

// Import the apiSlice from the api directory
import apiSlice from '../../api/apiSlice';

// Create a new clientApiSlice by injecting endpoints into the apiSlice
const clientApiSlice = apiSlice.injectEndpoints({
  // Define tag types for caching purposes
  tagTypes: ['Clients'], // Add your tag types here
  endpoints: (builder) => ({
    // Define a query endpoint to get all clients
    getAllClients: builder.query({
      query: () => ({
        url: `/api/v1/client`,
      }),
      providesTags: ['Clients'], // Specify the tag for caching
    }),

    // Define a mutation endpoint to create a new client
    createClient: builder.mutation({
      query: (userData) => ({
        url: 'api/v1/client',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Clients'], // Specify the tag to invalidate after mutation
    }),

    // Define a query endpoint to get a single client by ID
    singleClient: builder.query({
      query: (id) => ({
        url: `api/v1/client/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Clients', id }],
    }),

    // Define a mutation endpoint to update a client by ID
    updateClient: builder.mutation({
      query: ({ data, id }) => ({
        url: `api/v1/client/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Clients'], // Specify the tag to invalidate after mutation
    }),

    // Define a mutation endpoint to delete a client by ID
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `api/v1/client/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Clients'], // Specify the tag to invalidate after mutation
    }),
  }),

  // Use the baseQuery from the apiSlice
  baseQuery: apiSlice.baseQuery,
});

// Export an empty object (you might add more exports in the future)
export const {
  useGetAllClientsQuery,
  useCreateClientMutation,
  useSingleClientQuery,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApiSlice;

// Export the clientApiSlice as the default export
export default clientApiSlice;
