import { Link, Outlet } from "react-router-dom"

function AdminLayout() {
    return (
        <div className="container" style={{ display: "flex" }}>
            <div style={{ width: "20%", backgroundColor: "green", color: "white" }}>
                <div><Link to="/memberList">회원관리</Link></div>
                <div>재고관리</div>
            </div>
            <div style={{ width: "80%", backgroundColor: "#ddd" }}>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout