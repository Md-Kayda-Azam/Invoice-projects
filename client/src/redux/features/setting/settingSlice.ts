// authApiSlice.js

import apiSlice from '../../api/apiSlice';
interface SettingProps {
  logo: string;
  favicon: string;
  title: string;
  trash: boolean;
}

const settingApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['Setting'], // Add your tag types here
  endpoints: (builder) => ({
    getAllSettings: builder.query<SettingProps[], void>({
      query: () => ({
        url: `/api/v1/setting`,
      }),
      providesTags: ['Setting'],
    }),

    updateSetting: builder.mutation<SettingProps[], void>({
      query: ({ data, id }) => ({
        url: `api/v1/setting/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Setting'],
    }),
  }),
  baseQuery: apiSlice.baseQuery,
});

export const { useGetAllSettingsQuery, useUpdateSettingMutation } =
  settingApiSlice;
export default settingApiSlice;
