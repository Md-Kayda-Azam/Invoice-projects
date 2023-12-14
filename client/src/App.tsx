import router from './router/router.tsx';
import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { useGetLoggedUserQuery } from './redux/features/auth/authSlice.ts';
import './App.css';
import { useGetAllSettingsQuery } from './redux/features/setting/settingSlice.ts';
import { Helmet } from 'react-helmet';

function App() {
  const { data: user, error, isLoading } = useGetLoggedUserQuery('ok');
  const { data: settingData } = useGetAllSettingsQuery('');
  const firstSetting = settingData && settingData[0];
  useEffect(() => {
    if (error) {
      // Handle error
      console.error('Error fetching logged-in user:', error);
    }

    if (!isLoading && user) {
      // Use the user data
      console.log('Logged-in user:', user);
    }
  }, [user, error, isLoading]);

  return (
    <>
      <Helmet>
        <title>{firstSetting?.title || 'Default Title'}</title>
        <link
          rel="sortcut icon"
          href={
            firstSetting?.favicon ||
            'https://www.pngall.com/wp-content/uploads/5/Facebook-Messenger-Logo-PNG-High-Quality-Image.png'
          }
        />
      </Helmet>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
