import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateListing from './pages/CreateListing';
import ProductDetail from './pages/ProductDetail';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/chat/:receiverId/:productId" element={<Chat />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
