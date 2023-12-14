// authApiSlice.js

import apiSlice from '../../api/apiSlice';

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoggedUser: builder.query({
      query: () => ({
        url: `/api/v1/auth/me`,
      }),
    }),
    signupUser: builder.mutation({
      query: (userData) => ({
        url: 'api/v1/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    signinUser: builder.mutation({
      query: (userData) => (
        localStorage.setItem('user', userData),
        {
          url: 'api/v1/auth/signin',
          method: 'POST',
          body: userData,
        }
      ),
    }),
    signoutUser: builder.mutation({
      query: () => {
        localStorage.removeItem('user');
        return {
          url: 'api/v1/auth/signout',
          method: 'POST',
        };
      },
    }),
  }),
});

export const {
  useGetLoggedUserQuery,
  useSignupUserMutation,
  useSigninUserMutation,
  useSignoutUserMutation,
} = authApiSlice;
export default authApiSlice;
