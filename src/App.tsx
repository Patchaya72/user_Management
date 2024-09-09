import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import  HomePage  from "./pages/home";
import  UserDetails from "./pages/userDetails";
function App() {

  const routers = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/UserDetail", element: <UserDetails /> },
  ]);

  return (
    <>
        <RouterProvider router={routers} />
    </>
  )
}

export default App
