import './stylesheets/App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './componentes/Navbar';
import Home from './componentes/Home';
import Recetas from '../src/componentes/Recetas';
import LoginForm from './componentes/LoginForm';
import Footer from './componentes/Footer';

function App() {
  // HOOKS

  const [recetas, setRecetas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/mostrar_recetas")
      .then(response => response.json())
      .then((recetas) => setRecetas(recetas));
  }, []);

  return (

    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home recetas={recetas} />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/recetas" element={<Recetas/>} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
