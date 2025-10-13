import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

class OrderService {
  getAllOrders() {
    return axios.get(`${API_URL}/all`);
  }

  getOrderById(id) {
    return axios.get(`${API_URL}/get/${id}`);
  }

  createOrder(order) {
    console.log("Backend API base URL:", API_URL);
    return axios.post(`${API_URL}/add`, order);
  }

  updateOrder(id, order) {
    return axios.put(`${API_URL}/update/${id}`, order);
  }

  updateStatus(id, order) {
    return axios.put(`${API_URL}/updatestatus/${id}`, order);
  }

  deleteOrder(id) {
    return axios.delete(`${API_URL}/delete/${id}`);
  }
}

export default new OrderService();
