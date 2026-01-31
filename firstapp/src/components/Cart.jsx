import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCartItems();
  }, []);

  async function fetchCartItems() {
    try {
      const res = await axios.get("https://e-commerce-5sqx.onrender.com/api/cart", {
        params: { userId },
      });
      setCartItems(res.data.items);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(productId) {
    try {
      const res = await axios.post(
        "https://e-commerce-5sqx.onrender.com/api/cart/remove",
        { productId },
        { params: { userId } }
      );
      setCartItems(res.data.items);
    } catch (err) {
      console.log(err);
    }
  }

  async function updateQuantity(productId, increment) {
    try {
      const res = await axios.post(
        "https://e-commerce-5sqx.onrender.com/api/cart/update-quantity",
        { productId, increment },
        { params: { userId } }
      );
      setCartItems(res.data.items);
    } catch (err) {
      console.log(err);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (cartItems.length === 0) return <p>Your cart is empty</p>;

  return (
    <div className="container mt-4">
      <h2>Cart List</h2>

      <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
        {cartItems.map((i) => (
          <div className="col" key={i.product._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <b>Name:</b> {i.product.name}
                </h5>

                <p><b>Price:</b> ₹{i.product.price}</p>
                <p><b>Category:</b> {i.product.category}</p>
                <p><b>Description:</b> {i.product.description}</p>
                <p><b>Available Stock:</b> {i.product.stock}</p>

                {/* Quantity Controls */}
                <div className="d-flex align-items-center mb-2">
                  <button
                    className="btn btn-sm btn-secondary me-2"
                    disabled={i.quantity === 1}
                    onClick={() => updateQuantity(i.product._id, false)}
                  >
                    -
                  </button>

                  <span>{i.quantity}</span>

                  <button
                    className="btn btn-sm btn-secondary ms-2"
                    disabled={i.product.stock === 0}
                    onClick={() => updateQuantity(i.product._id, true)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-danger"
                  onClick={() => removeItem(i.product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
