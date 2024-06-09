import { useRouteLoaderData } from 'react-router-dom';
import '../stylesheets/CambioSuscripcion.css';
import Boton from './Boton';

function Suscripcion() {       

    async function cambiarSuscripcion(e) {
        document.querySelector('.contenedor-suscripcion').style.display = 'none'
        document.body.classList.toggle('no-scroll');
            try {
                const datosUsuario = await fetch("http://localhost:8000/mi_cuenta", {
                    method: 'GET',    
                    headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("token")
                        }
                    });
                if (!datosUsuario.ok) {
                    throw new Error("No se obtuvieron los datos del usuario");
                }
                let DatosUsuario = await datosUsuario.json();
            
                const cambioSuscripcion = await fetch(`/modificar_suscripcion_usuario/${DatosUsuario?.nombre_usuario}?suscripcion=${e.target.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    },
                });
            } catch (error) {
                console.error(error);
            }
            window.location.reload();
            window.scrollTo(0, 0);
    }

    return (
        <div className="opciones-suscripcion">
            <div className='opcion-suscripcion'>
                <h3>Gratuito</h3>
                <div className='precio'>
                    0€/mes
                </div>
                <div>
                    <p>Subir recetas</p>
                    <p>Guardar recetas</p>
                    <p style={{color:'gray'}}><span style={{fontWeight:'bold', color:'red', margin:'7px'}}>X</span>Acceso al menu semanal</p>
                    <p style={{color:'gray'}}><span style={{fontWeight:'bold', color:'red', margin:'7px'}}>X</span>Descuentos en restaurantes</p>
                </div>
                <Boton 
                    id='1'
                    key={1}
                    onClick={(e) => 
                    cambiarSuscripcion(e)} value={'Elegir plan'} />
            </div>
            <div className='opcion-suscripcion'>
                <h3>Normal</h3>
                <div className='precio'>
                    9,99€/mes
                </div>
                <div>
                    <p>Subir recetas</p>
                    <p>Guardar recetas</p>
                    <p>Acceso al menu semanal</p>
                    <p style={{color:'gray'}}><span style={{fontWeight:'bold', color:'red', margin:'7px'}}>X</span>Descuentos en restaurantes</p>
                </div>
                <Boton 
                    id="2"
                    key={2}
                    onClick={(e) => 
                    cambiarSuscripcion(e)} value={'Elegir plan'}/>
            </div>
            <div className='opcion-suscripcion'>
                <h3>Premium</h3>
                <div className='precio'>
                    14,99€/mes
                </div>
                <div>
                    <p>Subir recetas</p>
                    <p>Guardar recetas</p>
                    <p>Acceso al menu semanal</p>
                    <p>Descuentos en restaurantes</p>
                </div>
                <Boton 
                    id="3"
                    key={3}
                    onClick={(e) => 
                    cambiarSuscripcion(e)} value={'Elegir plan'} />
            </div>
        </div>
    );
}

export default Suscripcion;