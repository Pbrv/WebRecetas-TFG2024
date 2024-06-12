import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../stylesheets/NuevaReceta.css";

function ModificarReceta() {
    const { id } = useParams();
    const [receta, setReceta] = useState(null);
    const [continentes, setContinentes] = useState([]);
    const [continenteSeleccionado, setContinenteSeleccionado] = useState('');
    const [paisSeleccionado, setPaisSeleccionado] = useState({});
    const [paises, setPaises] = useState([]);
    const [pasos, setPasos] = useState(['', '', '']);
    const [ingredientes, setIngredientes] = useState([]);
    const [elaboracion, setElaboracion] = useState([]);
    const navigate = useNavigate();
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [mensaje, setMensaje] = useState(null);

    const tiposReceta = ["comida", "cena", "postre", "desayuno", "salsa", "bebida"];

    useEffect(() => {
        const obtenerDatos = async () => {
            const responseReceta = await fetch(`http://localhost:8000/mostrar_receta/${id}`);
            const receta = await responseReceta.json();
            setReceta(receta);
            console.log(receta.imagen_receta)
    
            const responsePais = await fetch(`http://localhost:8000/mostrar_pais/${receta.id_receta}`);
            const paisSeleccionado = await responsePais.json();
            setPaisSeleccionado(paisSeleccionado);
            // console.log(paisSeleccionado)
    
            const responseContinente = await fetch(`http://localhost:8000/mostrar_continente/${paisSeleccionado.continente_pais}`);
            const continenteSeleccionado = await responseContinente.json();
            setContinenteSeleccionado(continenteSeleccionado);
            console.log(continenteSeleccionado)
            
            const responsePaises = await fetch(`http://localhost:8000/mostrar_paises/${continenteSeleccionado.nombre_continente}`);
            const paises = await responsePaises.json();
            setPaises(paises);

            const responseContinentes = await fetch(`http://localhost:8000/mostrar_continentes`);
            const continentes = await responseContinentes.json();
            setContinentes(continentes);


            const ingredientes = (receta.ingredientes_receta).split(';');
            setIngredientes(ingredientes);

            const elaboracion = (receta.elaboracion_receta).split(';');
            setElaboracion(elaboracion);
        };
        obtenerDatos();
    }, []);

    const primeraLetraMayuscula = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    const handleCambioContinente = async (event) => {
        const continenteModificado = event.target.value;
        setContinenteSeleccionado(continenteModificado);
    
        try {
            const response = await fetch(`http://localhost:8000/mostrar_paisess/${continenteModificado}`);
            const data = await response.json();
            setPaises(data);
            console.log(data)
            setPaisSeleccionado({});
        } catch (error) {
            console.error('Error al obtener los países:', error);
        }
    };
    const handleCambioPais = (event) => {
        console.log("semete")
        const idPaisSeleccionado = Number(event.target.value);
        const paisSeleccionado = paises.find(pais => pais.id_pais === idPaisSeleccionado);
        setPaisSeleccionado(paisSeleccionado);
        console.log(paisSeleccionado)
    };

    const handleCambioInput = (event) => {
        const { name, value } = event.target;
        setReceta({ ...receta, [name]: value });
        console.log(`Cambio en ${name}:`, value);
        console.log(receta.ingredientes_receta)
        console.log("Nuevo estado de la receta:", receta);
    };

    const handleCambioImagen= (e) => {
        setArchivoSeleccionado(e.target.files[0]);
        setReceta({...receta, [e.target.name]: e.target.files[0]});
    }

    const handleAñadirIngrediente = () => {
        setIngredientes([...ingredientes, '']);
    };   
    const handleBorrarIngrediente = (index) => {
        const newIngredientes = [...ingredientes];
        newIngredientes.splice(index, 1);
        setIngredientes(newIngredientes);
        setReceta({ ...receta, ingredientes_receta: newIngredientes.join(';') });
        console.log(receta.ingredientes_receta)
        console.log("Nuevo estado de la receta:", receta);
    };
    const handleCambioIngrediente = (index, event) => {
        const newIngredientes = [...ingredientes];
        newIngredientes[index] = event.target.value;
        setIngredientes(newIngredientes);
        // console.log(newIngredientes)
        setReceta({ ...receta, ingredientes_receta: newIngredientes.join(';') });
        // console.log(receta.ingredientes_receta)
    };

    const handleAñadirPaso = () => {
        setElaboracion([...elaboracion, '']);
    };
    const handleEliminarPaso = (index) => {
        const pasosNuevos = [...elaboracion];
        pasosNuevos.splice(index, 1);
        setElaboracion(pasosNuevos);
        setReceta({ ...receta, elaboracion_receta: pasosNuevos.join(';') });
    };
    const handleModificarPaso = (index, event) => {
        const pasosNuevos = [...elaboracion];
        pasosNuevos[index] = event.target.value;
        setElaboracion(pasosNuevos);
        setReceta({ ...receta, elaboracion_receta: pasosNuevos.join(';') });
    };

    const handleEliminar = async () => {
        try {
            const response = await fetch(`/eliminar_receta/${receta.id_receta}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.mensaje);
            }
            navigate("/mi-cuenta");
        } catch (error) {
            console.error('Hubo un problema al eliminar la receta:', error);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Crear un objeto FormData y añadir los datos de la receta y el archivo de imagen
            const formData = new FormData();
            Object.keys(receta).forEach(key => formData.append(key, receta[key]));
            // formData.append('imagen_receta', archivoSeleccionado);  // Asegúrate de tener una referencia al archivo seleccionado
            console.log(formData)
            // Enviar la receta y la IMAGEN al servidor
            const response = await fetch(`/modificar_receta/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(receta)
            });
            if (!response.ok) {
                throw new Error('Error al actualizar la receta');
            }
            if (archivoSeleccionado) {
                const formData = new FormData();
                formData.append('imagen_receta', archivoSeleccionado);
                const imageResponse = await fetch(`/modificar_imagen_receta/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    },
                    body: formData
                });
                if (!imageResponse.ok) {
                    throw new Error('Error al actualizar la imagen de la receta');
                }

                // setMensaje('Receta actualizada con éxito');
            }
            navigate("/mi-cuenta");
        } catch (error) {
            console.error(error);
        }
    };

    if (!receta || continentes.length === 0) {
        return <div className="contenedor-nueva-receta">
            <p className="cargando-datos">Cargando datos de la receta ...</p>
        </div>;
    }

    return (
        receta && (
            <div className="contenedor-nueva-receta">
                <h2 className="titulo-nueva-receta">Modificar Receta</h2>
                <form className="form-nueva-receta" onSubmit={handleSubmit}>
                    <div className="contenedor-form-nueva-receta">
                        {/* 1ª COLUMNA */}
                        <div className="columna">
                            <label className="label-nueva-receta">Nombre: </label>
                                <input
                                    className="input-nueva-receta"
                                    type="text" 
                                    name="nombre_receta" 
                                    value={receta.nombre_receta}
                                    onChange={handleCambioInput} required
                                />
                            
                            <label className="label-nueva-receta" htmlFor="dificultad_receta">Dificultad:</label>
                                <select 
                                    id='dificultad_receta'
                                    name="dificultad_receta" 
                                    value={receta.dificultad_receta} 
                                    onChange={handleCambioInput} 
                                    className="input-nueva-receta" required>
                                    <option value="1">Dificultad 1</option>
                                    <option value="2">Dificultad 2</option>
                                    <option value="3">Dificultad 3</option>
                                    <option value="4">Dificultad 4</option>
                                </select>
                            
                            <label className="label-nueva-receta" htmlFor="continente_receta">Continente:</label>
                            <select 
                                id='continente_receta'
                                name="continente_receta" 
                                value={continenteSeleccionado.id_continente} 
                                onChange={handleCambioContinente} 
                                className="input-nueva-receta" required>
                                    <option value={continenteSeleccionado}>
                                        {continenteSeleccionado.nombre_continente}
                                    </option>
                                    {continentes.filter(continente => continente.id_continente !== continenteSeleccionado.id_continente).map(continente => (
                                        <option key={continente.id_continente} value={continente.id_continente}>
                                            {continente.nombre_continente}
                                        </option>
                                    ))}
                            </select>

                            <label className="label-nueva-receta" htmlFor="pais_receta">País:</label>
                            <select 
                                id='pais_receta'
                                name="pais_receta" 
                                value={paisSeleccionado ? paisSeleccionado.id_pais : ''} 
                                onChange={handleCambioPais} 
                                className="input-nueva-receta" required>
                                    {paises.map(pais => (
                                        <option key={pais.id_pais} value={pais.id_pais}>
                                            {pais.nombre_pais}
                                        </option>
                                    ))}
                            </select>
                            
                            <label className="label-nueva-receta" htmlFor="tipo_receta">Tipo de receta:</label>
                                <select 
                                    id='tipo_receta'
                                    name="tipo_receta" 
                                    value={receta.tipo_receta} 
                                    onChange={handleCambioInput} 
                                    className="input-nueva-receta">
                                    <option value="">{primeraLetraMayuscula(receta.tipo_receta)}</option>
                                    {tiposReceta.map(tipo => (
                                        <option key={tipo} value={tipo}>
                                            {primeraLetraMayuscula(tipo)}
                                        </option>
                                    ))}
                                </select>

                            <label className="label-nueva-receta">Ingredientes:</label>
                            {ingredientes.map((ingrediente, index) => (
                                <div key={index} className="div-añadir">
                                    <input
                                        type="text" 
                                        value={ingrediente}
                                        className="input-ingredientes"
                                        onChange={event => handleCambioIngrediente(index, event)}
                                        required={index === 0} // Solo el primer input es obligatorio
                                    />
                                    {index === ingredientes.length - 1 && (
                                        <a href="#" onClick={(event) => {event.preventDefault(); handleAñadirIngrediente(); }}>
                                            <img src="/mas.png" alt="Añadir ingrediente" className="icono-añadir"/>
                                        </a>
                                    )}
                                    {index >= 0 && (
                                        <a href="#" onClick={(event) => {event.preventDefault(); handleBorrarIngrediente(index); }}>
                                            <img src="/borrar.png" alt="Eliminar ingrediente" className="icono-añadir"/>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* 2ª COLUMNA */}
                        <div className="columna">
                            <label className="label-nueva-receta">Elaboración:</label>
                            {elaboracion.map((paso, index) => (
                                <div key={index} className="div-añadir">
                                    <label className="label-pasos">Paso {index + 1}:</label>
                                    <textarea
                                        rows={7}
                                        value={paso}
                                        className="input-elaboracion"
                                        onChange={event => handleModificarPaso(index, event)}
                                        required={index === 0} // Solo el primer textarea es obligatorio
                                    />
                                    {index === elaboracion.length - 1 && (
                                        <a href="#" onClick={(event) => {event.preventDefault(); handleAñadirPaso();}}>
                                            <img src="/mas.png" alt="Añadir paso" className="icono-añadir"/>
                                        </a>
                                    )}
                                    {index >= 0 && (
                                        <a href="#" onClick={(event) => {event.preventDefault(); handleEliminarPaso(index); }}>
                                            <img src="/borrar.png" alt="Eliminar paso" className="icono-añadir"/>
                                        </a>
                                    )}
                                </div>
                            ))}
                            <label className="label-nueva-receta">Imagen:</label>
                                {!archivoSeleccionado && <img 
                                    src={"/imgs/" + receta.imagen_receta } 
                                    alt="imagen receta" 
                                    className="imagen_modificar_receta"
                                />}
                                <input
                                    type="file" 
                                    name="imagen_receta" 
                                    className="input_imagen"
                                    onChange={handleCambioImagen}
                                />
                            
                            <div className="div-boton-nueva-receta">
                                <input type="submit" className="boton-nueva-receta" value="Modificar Receta" />
                                <button type="button" className="boton-eliminar-receta" onClick={handleEliminar}>Eliminar Receta</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    );
}

export default ModificarReceta;
