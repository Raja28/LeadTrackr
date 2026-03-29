import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Layout from "./layout"
import EnrollNowForm from "./pages/EnrollNowForm"
// import AdminAuth from "./pages/Auth"
import LoginPage from "./pages/Admin_Login"
import AdminRegister from "./pages/Admin_Register"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/ProtectedRoutes"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },

      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <AdminRegister />,
      },
      {
        path: "/enroll",
        element: <EnrollNowForm />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/admin/dashboard",
            element: <AdminDashboard />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      }
    ],
  }
])
function App() {


  return (
    <RouterProvider router={router} />
  )
}

export default App
