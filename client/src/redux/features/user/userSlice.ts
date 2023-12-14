// authApiSlice.js

import apiSlice from '../../api/apiSlice';

const UserApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['User'], // Add your tag types here
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: `/api/v1/user`,
      }),
      providesTags: ['User'],
    }),
  }),
  baseQuery: apiSlice.baseQuery,
});

export const { useGetAllUsersQuery, useUpdateUserMutation } = UserApiSlice;
export default UserApiSlice;
