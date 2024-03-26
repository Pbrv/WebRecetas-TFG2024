import logo from './logo.svg';
import './App.css';
import Receta from '../src/componentes/Receta';
import { useEffect, useState } from 'react';

function App() {
  // HOOKS

  const [recetas, setRecetas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/mostrar_recetas")
      .then(response => response.json())
      .then((recetas) => setRecetas(recetas));
  }, []);

  return (
    <div className="App">
      <h1>RECETAS</h1>
      <div className="contenedor-recetas">
        {/* {recetas.map((receta) => (
          <Receta 
          nombre={receta.nombre_receta} />
        ))} */}
        {recetas?.map((receta) => (<li key={receta.id_receta}>{receta.nombre_receta}</li>))}
      </div>
    </div>
  );
}

export default App;
