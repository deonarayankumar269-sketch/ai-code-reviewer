import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Spinner label="Loading session..." />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}