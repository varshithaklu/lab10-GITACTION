import { useEffect, useState } from "react";
import OrderService from "../api/OrderService";
import "./Form.css";
import "./OrderTable.css";

export default function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // always an array
  const [search, setSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    orderDate: "",
    deliveryDate: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await OrderService.getAllOrders();
      const data = Array.isArray(res.data) ? res.data : [];
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("❌ Failed to load orders.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate delivery date
    if (form.orderDate && form.deliveryDate) {
      const start = new Date(form.orderDate);
      const end = new Date(form.deliveryDate);
      if (end < start) {
        setError("❌ Delivery date cannot be before order date.");
        return;
      }
    }

    try {
      if (editingOrder) {
        await OrderService.updateOrder(editingOrder.id, form);
        setSuccess("✅ Order updated successfully!");
        setEditingOrder(null);
      } else {
        await OrderService.createOrder(form);
        setSuccess("✅ Order added successfully!");
      }

      // Reset form
      setForm({
        title: "",
        description: "",
        orderDate: "",
        deliveryDate: "",
        quantity: "",
        price: "",
      });

      loadOrders();
    } catch (err) {
      console.error("Error saving order:", err);
      setError("❌ Something went wrong while saving the order.");
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setForm(order);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await OrderService.deleteOrder(id);
        setSuccess("🗑️ Order deleted successfully!");
        loadOrders();
      } catch (err) {
        console.error("Error deleting order:", err);
        setError("❌ Failed to delete order.");
      }
    }
  };

  const cancelEdit = () => {
    setEditingOrder(null);
    setForm({
      title: "",
      description: "",
      orderDate: "",
      deliveryDate: "",
      quantity: "",
      price: "",
    });
    setError("");
    setSuccess("");
  };

  // Handle search filter
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    if (Array.isArray(orders)) {
      const filtered = orders.filter((order) =>
        Object.values(order)
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  };

  return (
    <div className="container">
      <h2>{editingOrder ? "✏️ Edit Order" : "➕ Add Order"}</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="title">Order Title:</label>
          <input
            id="title"
            name="title"
            placeholder="Enter order title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            name="description"
            placeholder="Enter order description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="orderDate">Order Date:</label>
          <input
            id="orderDate"
            type="date"
            name="orderDate"
            value={form.orderDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deliveryDate">Delivery Date:</label>
          <input
            id="deliveryDate"
            type="date"
            name="deliveryDate"
            value={form.deliveryDate}
            min={form.orderDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            placeholder="Enter quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="Enter price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit">
            {editingOrder ? "Update Order" : "Add Order"}
          </button>
          {editingOrder && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{ backgroundColor: "#6c757d" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Feedback Messages */}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search by any field (id, title, description, quantity, status)"
          value={search}
          onChange={handleSearchChange}
        />
        <button
          onClick={() => {
            setSearch("");
            setFilteredOrders(orders || []);
          }}
        >
          Clear
        </button>
      </div>

      {/* Orders Table */}
      <h2 style={{ marginTop: "30px" }}>📋 All Orders</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Order Date</th>
            <th>Delivery Date</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
            filteredOrders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.title}</td>
                <td>{o.description}</td>
                <td>{o.orderDate}</td>
                <td>{o.deliveryDate}</td>
                <td>{o.quantity}</td>
                <td>{o.price}</td>
                <td>{o.status}</td>
                <td>
                  <button onClick={() => handleEdit(o)}>Edit</button>&nbsp;&nbsp;
                  <button onClick={() => handleDelete(o.id)} className="danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No matching orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
