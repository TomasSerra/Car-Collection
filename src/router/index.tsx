import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { FullPageLoader } from '@/components/shared/WheelLoader'
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/pages/auth'
import { HomePage } from '@/pages/HomePage'
import { CarDetailPage } from '@/pages/CarDetailPage'
import { CreateCarPage } from '@/pages/CreateCarPage'

function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <FullPageLoader />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

function PublicRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <FullPageLoader />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/car/:id',
        element: <CarDetailPage />,
      },
      {
        path: '/create',
        element: <CreateCarPage />,
      },
    ],
  },
  // Public shared collection routes (no auth required)
  {
    path: '/shared/:userId',
    element: <HomePage publicMode />,
  },
  {
    path: '/shared/:userId/car/:id',
    element: <CarDetailPage publicMode />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
