import Receta from './Receta';
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
                <h2 className="titulo">Destacados</h2>
                <div className="recetas-destacadas">
                    {recetasDestacadas.map((receta) => (
                        <Receta key={receta.id_receta} {...receta} />
                    ))}
                </div>
            </div>
            {/* MENÚ SEMANAL */}
            <div className="menu-semana">
                <h2 className="titulo">Menú de la semana</h2>
                <div className="recetas-menu">
                    {recetasDestacadas.map((receta) => (
                        <Receta key={receta.id_receta} {...receta} />
                    ))}
                </div>
                <button className="boton-menu-semanal">Desbloquéalo / Accede a tu menú</button>
            </div>
        </div>
    );
}

export default Home;