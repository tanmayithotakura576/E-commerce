import { Link, useNavigate } from "react-router-dom"

export default function Navigation() {
  const navigate = useNavigate()
  const userId = localStorage.getItem("userId")
  const userRole = localStorage.getItem("role")

  function handleLogout() {
    localStorage.removeItem("userId")
    localStorage.removeItem("role")
    navigate("/login")
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">MyApp</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto gap-3">

          {/* Always visible */}
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>

          {userId ? (
            userRole === "admin" ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-product">Add Product</Link>
                </li>

                <li className="nav-item">
                  <button className="btn btn-outline-warning btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">Cart</Link>
                </li>

                <li className="nav-item">
                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  )
}
