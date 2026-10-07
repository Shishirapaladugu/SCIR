
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/navbar'
import Login from './pages/login'
import Register from './pages/register';
import Home from './pages/home'
import Upload from './pages/upload';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/upload' element={<Upload />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/logout' element={<Home />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
