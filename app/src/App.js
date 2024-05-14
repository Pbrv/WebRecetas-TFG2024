import './stylesheets/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './componentes/Navbar';
import Home from './componentes/Home';
import Recetas from '../src/componentes/Recetas';
import LoginForm from './componentes/LoginForm';
import MiCuenta from './componentes/MiCuenta';
import Registro from './componentes/Registro';
import Paises from './componentes/Paises';
import NuevaReceta from './componentes/NuevaReceta';
import RecetaUnica from './componentes/RecetaUnica';
import RecetasGuardadas from './componentes/RecetasGuardadas';
import Footer from './componentes/Footer';

function App() {
  // HOOKS
  const [recetas, setRecetas] = useState([]);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);

    //Probar a moverlo en el propio componente
    fetch("http://localhost:8000/mostrar_recetas")
      .then(response => response.json())
      .then((recetas) => setRecetas(recetas));
  }, []);

  return (
    <Router>
      <Navbar isLogged={isLogged} setIsLogged={setIsLogged} />
      
      <Routes>
        <Route path="/" element={<Home recetas={recetas} />} />
        <Route path="/login" element={<LoginForm setIsLogged={setIsLogged} />} />
        <Route path="/registro" element={<Registro/>} />
        <Route path="/recetas" element={<Recetas/>} />
        <Route path="/receta/:id" element={<RecetaUnica/>} />
        <Route path="/paises" element={<Paises/>}/>
        <Route path="/mi-cuenta" element={<MiCuenta />} />
        <Route path="/nueva-receta" element={<NuevaReceta />} />
        <Route path="/recetas-guardadas" element={<RecetasGuardadas />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

