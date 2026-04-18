import { Route, Routes } from "react-router"
import { Toaster } from 'react-hot-toast';
import ContactUs from "./pages/ContactUs"
import Main from "./pages/Main"
// import ForgotPassword from "./pages/ForgotPassword"
import SignUp from "./pages/SignUp"
import AdminLayout from "./layouts/AdminLayout"
import { ROUTES } from "./utils/constants";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Main />} />
          <Route path={ROUTES.CONTACT_US} element={<ContactUs />} />
        </Route>
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        <Route path={ROUTES.SIGNUP} element={<SignUp />} />
      </Routes>
    </>
  )
}

export default App
