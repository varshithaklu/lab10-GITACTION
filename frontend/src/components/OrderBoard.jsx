import { useEffect, useState } from "react";
import OrderService from "../api/OrderService";
import "./OrderCard.css";

export default function OrderBoard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await OrderService.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  const updateStatus = async (order, newStatus) => {
    try {
      const updatedOrder = { ...order, status: newStatus };
      await OrderService.updateOrder(order.id, updatedOrder);
      loadOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const statuses = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="board-container">
      <h2 className="board-title">Order Board</h2>
      <div className="board">
        {statuses.map((status) => (
          <div key={status} className="column">
            <h3>{status}</h3>

            {orders
              .filter((order) => order.status === status)
              .map((order) => (
                <div key={order.id} className="order-card">
                  <h4>{order.title}</h4>
                  <p>{order.description}</p>
                  <p><b>Quantity:</b> {order.quantity}</p>
                  <p><b>Price:</b> {order.price}</p>
                  <p><b>Order Date:</b> {order.orderDate}</p>
                  <p><b>Delivery Date:</b> {order.deliveryDate}</p>

                  <div className="card-actions">
                    {status === "PLACED" && (
                      <button onClick={() => updateStatus(order, "PROCESSING")}>Process</button>
                    )}

                    {status === "PROCESSING" && (
                      <>
                        <button onClick={() => updateStatus(order, "SHIPPED")}>Ship</button>
                        <button onClick={() => updateStatus(order, "CANCELLED")}>Cancel</button>
                      </>
                    )}

                    {status === "SHIPPED" && (
                      <button onClick={() => updateStatus(order, "DELIVERED")}>Deliver</button>
                    )}

                    {status === "CANCELLED" && (
                      <button onClick={() => updateStatus(order, "PLACED")}>Reorder</button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
