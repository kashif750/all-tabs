import { Route, Routes } from "react-router"
import ContactUs from "./pages/ContactUs"
import Main from "./pages/Main"
import AdminLayout from "./layouts/AdminLayout"

function App() {
  return (
    <>
    <Routes>
      <Route element={<AdminLayout/>}>
        <Route index element={<Main/>}/>
        <Route path="/contact-us" element={<ContactUs/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App
