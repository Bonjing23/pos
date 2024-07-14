import React, { useState } from 'react';
import { Search, ShoppingCart, User, Settings, BarChart, LogOut, Package } from 'lucide-react';

// Mock data (replace with real API calls in a production app)
const mockUsers = [
  { id: 1, username: 'admin', password: 'admin', role: 'admin' },
  { id: 2, username: 'cashier', password: 'cashier', role: 'cashier' },
];

const mockInventory = [
  { id: 1, name: 'Coffee', price: 3.50, stock: 100, barcode: '123456' },
  { id: 2, name: 'Sandwich', price: 5.99, stock: 50, barcode: '234567' },
  { id: 3, name: 'Salad', price: 7.99, stock: 30, barcode: '345678' },
];

const mockSales = [
  { id: 1, date: '2023-07-14', total: 125.50, items: [{ id: 1, quantity: 10 }, { id: 2, quantity: 5 }] },
  { id: 2, date: '2023-07-15', total: 89.97, items: [{ id: 2, quantity: 3 }, { id: 3, quantity: 2 }] },
];

// Login component
const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setUser(user);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          className="block w-full mb-2 p-2 border rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="block w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

// Main POS component
const POS = ({ user }) => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(0);
  const [activeChannel, setActiveChannel] = useState('in-store');

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const applyDiscount = (percentage) => {
    setDiscount(percentage);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedTotal = total * (1 - discount / 100);

  const handleCheckout = () => {
    alert(`Sale completed: $${discountedTotal.toFixed(2)}`);
    setCart([]);
    setDiscount(0);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-2/3 p-6 overflow-y-auto">
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Search products or scan barcode..."
            className="w-full p-2 rounded border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="ml-2 text-gray-500" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {mockInventory
            .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode === searchTerm)
            .map(product => (
              <div key={product.id} className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => addToCart(product)}>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="w-1/3 bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Cart ({activeChannel})</h2>
        <div className="mb-4">
          <select
            className="w-full p-2 border rounded"
            value={activeChannel}
            onChange={(e) => setActiveChannel(e.target.value)}
          >
            <option value="in-store">In-store</option>
            <option value="online">Online</option>
            <option value="phone">Phone</option>
          </select>
        </div>
        <div className="mb-4 max-h-96 overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span className="flex items-center">
                ${(item.price * item.quantity).toFixed(2)}
                <button className="ml-2 text-red-500" onClick={() => removeFromCart(item.id)}>×</button>
              </span>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Discount %"
            className="w-full p-2 border rounded"
            value={discount}
            onChange={(e) => applyDiscount(Number(e.target.value))}
          />
        </div>
        <div className="text-xl font-bold mb-4">
          Total: ${discountedTotal.toFixed(2)}
          {discount > 0 && <span className="text-sm text-gray-500 ml-2">(${total.toFixed(2)} before discount)</span>}
        </div>
        <button
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
          onClick={handleCheckout}
        >
          Complete Sale
        </button>
      </div>
    </div>
  );
};

// Inventory Management component
const Inventory = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">Price</th>
            <th className="text-left">Stock</th>
            <th className="text-left">Barcode</th>
          </tr>
        </thead>
        <tbody>
          {mockInventory.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.stock}</td>
              <td>{item.barcode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Sales Analytics component
const SalesAnalytics = () => {
  const totalSales = mockSales.reduce((sum, sale) => sum + sale.total, 0);
  const averageSale = totalSales / mockSales.length;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Total Sales</h3>
          <p className="text-2xl">${totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Average Sale</h3>
          <p className="text-2xl">${averageSale.toFixed(2)}</p>
        </div>
      </div>
      <h3 className="font-semibold mt-6 mb-2">Recent Sales</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Date</th>
            <th className="text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {mockSales.map(sale => (
            <tr key={sale.id}>
              <td>{sale.date}</td>
              <td>${sale.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main App component
const App = () => {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('pos');

  if (!user) {
    return <Login setUser={setUser} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'pos':
        return <POS user={user} />;
      case 'inventory':
        return <Inventory />;
      case 'analytics':
        return <SalesAnalytics />;
      default:
        return <POS user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">POS System</h1>
        <nav>
          <button onClick={() => setActiveView('pos')} className="block py-2 hover:text-gray-300 w-full text-left">
            <ShoppingCart className="inline mr-2" />
            POS
          </button>
          <button onClick={() => setActiveView('inventory')} className="block py-2 hover:text-gray-300 w-full text-left">
            <Package className="inline mr-2" />
            Inventory
          </button>
          <button onClick={() => setActiveView('analytics')} className="block py-2 hover:text-gray-300 w-full text-left">
            <BarChart className="inline mr-2" />
            Analytics
          </button>
          <button onClick={() => setUser(null)} className="block py-2 hover:text-gray-300 w-full text-left">
            <LogOut className="inline mr-2" />
            Logout
          </button>
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
