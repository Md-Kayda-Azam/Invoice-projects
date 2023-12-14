import { Navigate, Outlet } from 'react-router-dom';
import { useGetLoggedUserQuery } from '../redux/features/auth/authSlice.ts';

const PrivateGard = () => {
  const { data: user, isLoading } = useGetLoggedUserQuery('ok');
  if (isLoading) {
    // Use Ant Design Spin component for loading indicator
    return <div className="full-screen-overlay"></div>;
  }
  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateGard;
