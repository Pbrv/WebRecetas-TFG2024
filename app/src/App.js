import './stylesheets/App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Receta from '../src/componentes/Receta';
import { useEffect, useState } from 'react';
import Navbar from './componentes/Navbar';
import Home from './componentes/Home';
import LoginForm from './componentes/LoginForm';

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
      <Home />
      <Routes>
        <Route path="/login" component={LoginForm} />
      </Routes>
    </Router>
    // <div className="App">
    //   <Navbar />
    //   <h1>RECETAS</h1>
    //   <div className="contenedor-recetas">
    //     {recetas.map((receta) => (
    //       <Receta 
    //       nombre={receta.nombre_receta}
    //       dificultad={receta.valoracion_receta}
    //       valoracion={receta.dificultad_receta}/>
    //     ))}
    //   </div>
    // </div>
  );
}

export default App;
