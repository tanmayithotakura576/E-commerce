import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Register.css"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [address, setAddress] = useState("")
  const [mobile, setMobile] = useState("")

  const navigate = useNavigate()

  function handleRegister(e) {
    e.preventDefault()

    const newUser = {
      name,
      email,
      password,
      mobile: Number(mobile),
      address,
    }

    axios
      .post("http://localhost:4000/api/create-user", newUser)
      .then((res) => {
        alert("Register successful")
        navigate("/login")
      })
      .catch(() => {
        alert("Error while registering")
      })
  }

  return (
    <div className="register-bg">
      <div className="register-card">
        <h2 className="title">Event Registration</h2>
        <p className="subtitle">Register with us to get more details.</p>

        <form onSubmit={handleRegister}>
          <div className="field">
            <label>Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Phone</label>
            <input
              type="text"
              placeholder="Mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Address</label>
            <input
              type="text"
              placeholder="Your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <button className="register-btn">Register</button>
        </form>
      </div>
    </div>
  )
}
