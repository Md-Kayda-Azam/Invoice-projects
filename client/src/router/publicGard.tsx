import { Navigate, Outlet } from 'react-router-dom';
import { useGetLoggedUserQuery } from '../redux/features/auth/authSlice.ts';

const PublicGard = () => {
  const { data: user, isLoading } = useGetLoggedUserQuery('ok');

  if (localStorage.getItem('user')) {
    return user ? <Navigate to="/" /> : <Outlet />;
  }

  if (isLoading) {
    // Use Ant Design Spin component for loading indicator
    return <div className="full-screen-overlay"></div>;
  }
  return <Outlet />;
};

export default PublicGard;
