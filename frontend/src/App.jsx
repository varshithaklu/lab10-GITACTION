import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import OrderDashboard from "./components/OrderDashboard";
import OrderBoard from './components/OrderBoard';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<OrderDashboard />} />
          <Route path="/board" element={<OrderBoard/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
