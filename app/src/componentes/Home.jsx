import Receta from './Receta';
import "../stylesheets/Home.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Home({ recetas, isLogged }) {

    //Ordenadr de mayor a menor
    recetas.sort((a, b) => b.valoracion_receta - a.valoracion_receta);

    //Coger las 4 primeras
    const recetasDestacadas = recetas.slice(0, 4);

    let DatosUsuario = {
        suscripcion_usuario: 0
    }

    if(isLogged) {
            const fetchDatosUsuario = async () => {
                try {
                    const response = await fetch("http://localhost:8000/mi_cuenta", {
                    method: 'GET',    
                    headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("token")
                        }
                    });
                    if (!response.ok) {
                        throw new Error("No se obtuvieron los datos del usuario");
                    }
                    DatosUsuario = await response.json();
                } catch (error) {
                    console.error("Error al hacer fetch", error);
                }
            }
        fetchDatosUsuario();
    }
    
    return (
        <div>
            <div className="contenedor-home">
                <h1>¿Qué comemos hoy?</h1>
                <input className="busqueda"></input>
            </div>
            {/* <div>
                <ToastContainer />
                
            </div> */}
            <div className="destacados">
                <h2 className="titulo">Destacados</h2>
                <div className="recetas-destacadas">
                    {recetasDestacadas.map((receta) => (
                        <Receta key={receta.id_receta} {...receta} />
                    ))}
                </div>
            </div>
            {/* MENÚ SEMANAL */}

            {/* Check si el usuario es mayor de nivel 1 para verlo o esta logueado */}
            {isLogged !== false && DatosUsuario.suscripcion_usuario > 1 ? (
                <div className="menu-semana">
                    <h2 className="titulo">Menú de la semana</h2>
                    <div className="recetas-menu ">
                        {recetasDestacadas.map((receta) => (
                            <Receta key={receta.id_receta} {...receta}/>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="menu-semana">
                    <h2 className="titulo">Menú de la semana</h2>
                    <img src='candado.png' alt='imagen menu semanal bloqueado' style={{width:'150px'}}></img>
                    <button className="boton-menu-semanal">Desbloquéalo</button>
                </div>
            )}
        </div>
    );
}

export default Home;