import Receta from './Receta';
import {useState} from "react";
import { Link } from 'react-router-dom';
import "../stylesheets/Home.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Home({ recetas, isLogged }) {

    const [recetasFiltradas, setRecetasFiltradas] = useState();

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

    //Guardar recetas que contengan en el nombre lo que el usuario busca
    function mostrarFiltradas(valorBusqueda) {
        if(valorBusqueda !== ''){
            const nuevasRecetasFiltradas = recetas.filter(receta =>
                receta.nombre_receta.toLowerCase().includes(valorBusqueda.toLowerCase())
            );
            setRecetasFiltradas(nuevasRecetasFiltradas);
            document.querySelector('.recetas-filtradas').style.display = 'block';
        } else {
            setRecetasFiltradas();
            document.querySelector('.recetas-filtradas').style.display = 'none';
        }
    }

    return (
        <div>
            <div className="contenedor-home">
                <h1>¿Qué comemos hoy?</h1>
                <input className="busqueda" onChange={(e) => mostrarFiltradas(e.target.value)}></input>
                <div className='recetas-filtradas' style={{display:'none'}}>
                {recetasFiltradas && recetasFiltradas.map((receta) => (
                    <div className='receta-filtro'><Link to={`/receta/${receta.id_receta}`}>{receta.nombre_receta}</Link></div>
                ))}
                </div>
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