import './stylesheets/App.css';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import ModificarReceta from './componentes/ModificarReceta';
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
        <Route path="/" element={<Home recetas={recetas} isLogged={isLogged} />} />
        <Route path="/login" element={<LoginForm setIsLogged={setIsLogged} />} />
        <Route path="/registro" element={<Registro/>} />
        <Route path="/recetas" element={<Recetas/>} />
        <Route path="/receta/:id" element={<RecetaUnica/>} />
        <Route path="/paises" element={<Paises/>}/>

        {/* Si no ha iniciado sesion no puede acceder a estas rutas y se le redirige al login */}
        <Route path="/mi-cuenta" element={isLogged ? <MiCuenta /> : <Navigate to="/login" />} />
        <Route path="/nueva-receta" element={isLogged ? <NuevaReceta /> : <Navigate to="/login" />} />
        <Route path="/recetas-guardadas" element={isLogged ? <RecetasGuardadas /> : <Navigate to="/login" />} />
        <Route path="/modificar-receta/:id" element={isLogged ? <ModificarReceta /> : <Navigate to="/login" />}>
            {props => <ModificarReceta id={props.params.id} />}
        </Route>

        {/* Si se intenta acceder a cualquier otra ruta que no este definida aqui, se redirige al home */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

      <Footer />
      {/* <ToastContainer /> */}
    </Router>
  );
}

export default App;

