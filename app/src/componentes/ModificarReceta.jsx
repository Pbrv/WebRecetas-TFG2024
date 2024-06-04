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
    const [selectedFile, setSelectedFile] = useState(null);
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
    }, [id]);

    const primeraLetraMayuscula = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // const handleContinenteChange = (event) => {
    //     console.log(event.target.value)
    //     setContinenteSeleccionado(event.target.value);
    //     console.log(continenteSeleccionado)
    // };
    
    const handleContinenteChange = async (event) => {
        const continenteModificado = event.target.value;
        setContinenteSeleccionado(continenteModificado);
    
        try {
            const response = await fetch(`http://localhost:8000/mostrar_paises/${continenteModificado}`);
            const data = await response.json();
            setPaises(data); // Actualizar la lista de países en el estado
        } catch (error) {
            console.error('Error al obtener los países:', error);
        }
    };

    const handleChange = (e) => {
        // console.log(e.target.value)
        setReceta({...receta, [e.target.name]: e.target.value});
        console.log(e.target.value)

    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setReceta({ ...receta, [name]: value });
        console.log(`Cambio en ${name}:`, value);
        console.log(receta.dificultad_receta)
        console.log("Nuevo estado de la receta:", receta);
    };

    const handleFileChange = (e) => {
        console.log(e.target.files[0])
        setSelectedFile(e.target.files[0]);
        setReceta({...receta, [e.target.name]: e.target.files[0]});
    }

    const handleIngredienteChange = (index, event) => {
        const newIngredientes = [...receta.ingredientes];
        newIngredientes[index] = event.target.value;
        setReceta({
            ...receta,
            ingredientes: newIngredientes
        });
    };

    const handleAddIngredient = () => {
        setReceta({
            ...receta,
            ingredientes: [...receta.ingredientes, ""]
        });
    };   

    const handleRemoveIngredient = (index) => {
        const newIngredientes = [...receta.ingredientes];
        newIngredientes.splice(index, 1);
        setReceta({
            ...receta,
            ingredientes: newIngredientes
        });
    };

    const handlePasoChange = (index, event) => {
        const values = [...pasos];
        values[index] = event.target.value;
        setPasos(values);
        setReceta({...receta, elaboracion_receta: values.join(';')});
    };

    const handleAddPaso = () => {
        setPasos([...pasos, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Crear un objeto FormData y añadir los datos de la receta y el archivo de imagen
            const formData = new FormData();
            Object.keys(receta).forEach(key => formData.append(key, receta[key]));
            // formData.append('imagen_receta', selectedFile);  // Asegúrate de tener una referencia al archivo seleccionado
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
            if (response.ok) {
                setMensaje('Receta actualizada con éxito');
            } else {
                setMensaje('Error al actualizar la receta');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!receta || continentes.length === 0) {
        return <div>Cargando...</div>;
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
                                    onChange={handleInputChange} required
                                />
                            
                            <label className="label-nueva-receta">Dificultad:</label>
                                <select 
                                    name="dificultad_receta" 
                                    value={receta.dificultad_receta} 
                                    onChange={handleInputChange} 
                                    className="input-nueva-receta" required>
                                    <option value="1">Dificultad 1</option>
                                    <option value="2">Dificultad 2</option>
                                    <option value="3">Dificultad 3</option>
                                    <option value="4">Dificultad 4</option>
                                </select>
                            
                            <label className="label-nueva-receta">Continente:</label>
                                <select 
                                    name="continente_receta" 
                                    value={continenteSeleccionado} 
                                    onChange={handleContinenteChange} 
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

                            <label className="label-nueva-receta">País:</label>
                            <select 
                                onChange={handleInputChange} 
                                name="pais_receta" 
                                value={paisSeleccionado.nombre_pais} 
                                className="input-nueva-receta" required>
                                <option value="">
                                    {paisSeleccionado.nombre_pais}
                                </option>
                                {paises.filter(pais => pais.id_pais !== paisSeleccionado.id_pais).map(pais => (
                                    <option key={pais.id_pais} value={pais.id_pais}>
                                        {pais.nombre_pais}
                                    </option>
                                ))}
                            </select>
                            
                            <label className="label-nueva-receta">Tipo de receta:</label>
                                <select 
                                    name="tipo_receta" 
                                    value={receta.tipo_receta} 
                                    onChange={handleInputChange} 
                                    className="input-nueva-receta" required>
                                    <option value="">{primeraLetraMayuscula(receta.tipo_receta)}</option>
                                    {tiposReceta.filter(tipo => tipo !== receta.tipo_receta).map(tipo => (
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
                                            onChange={event => handleIngredienteChange(index, event)}
                                            required={index === 0} // Solo el primer input es obligatorio
                                        />
                                        {index === ingredientes.length - 1 && (
                                            <a href="#" onClick={(event) => {event.preventDefault(); handleAddIngredient(); }}>
                                                <img src="/mas.png" alt="Añadir ingrediente" className="icono-añadir"/>
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
                                            rows={4}
                                            value={paso}
                                            className="input-elaboracion"
                                            onChange={event => handlePasoChange(index, event)}
                                            required={index === 0} // Solo el primer textarea es obligatorio
                                        />
                                        {index === elaboracion.length - 1 && (
                                            <a href="#" onClick={(event) => {event.preventDefault(); handleAddPaso();}}>
                                                <img src="/mas.png" alt="Añadir paso" className="icono-añadir"/>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            <label className="label-nueva-receta">Imagen:</label>
                                <img 
                                    src={"/imgs/" + receta.imagen_receta } 
                                    alt="" 
                                    className="imagen_modificar_receta"
                                />
                                <input
                                    type="file" 
                                    name="imagen_receta" 
                                    className="input_imagen"
                                    onChange={handleFileChange}
                                />
                            
                            <div className="div-boton-nueva-receta">
                                <input type="submit" className="boton-nueva-receta" value="Modificar Receta" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    );
}

export default ModificarReceta;
