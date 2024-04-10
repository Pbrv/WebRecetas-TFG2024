import Receta from '../../src/componentes/Receta';
import "../stylesheets/Home.css"
function Home({ recetas }) {
    const recetasDestacadas = recetas.slice(0, 4); // por ahora sólo coge las 4 primeras 
    
    return (
        <div>
            <div className="contenedor-home">
                <h1>¿Qué comemos hoy?</h1>
                <input className="busqueda"></input>
            </div>
            <div className="destacados">
                <h2>Destacados</h2>
                <div className="recetas-destacadas">
                    {recetasDestacadas.map((receta) => (
                        <Receta key={receta.id} {...receta} />
                    ))}
                </div>
            </div>
            <div className="menu-semana">
                <h2>Menú de la semana</h2>
                <div className="recetas-menu">
                    {recetasDestacadas.map((receta) => (
                        <Receta key={receta.id} {...receta} />
                    ))}
                </div>
                <button>Desbloquéalo / Accede a tu menú</button>
            </div>
        </div>
    );
}

export default Home;