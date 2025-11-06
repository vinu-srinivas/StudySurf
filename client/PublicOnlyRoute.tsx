import { Navigate, Outlet } from 'react-router-dom';

const PublicOnlyRoute = () => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default PublicOnlyRoute;