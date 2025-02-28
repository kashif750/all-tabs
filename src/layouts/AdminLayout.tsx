import { Outlet } from "react-router"

const AdminLayout = () => {
  return (
    <div className="w-full h-[100dvh] p-4">
        <Outlet/>
    </div>
  )
}

export default AdminLayout