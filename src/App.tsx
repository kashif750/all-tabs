import { Route, Routes } from "react-router"
import { Toaster } from 'react-hot-toast';
import ContactUs from "./pages/ContactUs"
import Main from "./pages/Main"
import ForgotPassword from "./pages/ForgotPassword"
import SignUp from "./pages/SignUp"
import AdminLayout from "./layouts/AdminLayout"

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Main />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  )
}

export default App
