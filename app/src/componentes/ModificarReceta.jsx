import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../stylesheets/NuevaReceta.css";

function ModificarReceta() {
    const { id } = useParams();
    const [receta, setReceta] = useState(null);
    const [continente, setContinente] = useState([]);
    const [continenteSeleccionado, setContinenteSeleccionado] = useState('');
    const [pais, setPais] = useState([]);
    const [pasos, setPasos] = useState(['', '', '']);
    const [ingredientes, setIngredientes] = useState(['', '']);
    const [selectedFile, setSelectedFile] = useState(null);
    const [mensaje, setMensaje] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     fetch("/mostrar_continentes")
    //         .then(response => response.json())
    //         .then(data => setContinentes(data));
    // }, []);

    // useEffect(() => {
    //     if (continenteSeleccionado) {
    //         fetch(`/mostrar_paises/${continenteSeleccionado}`)
    //             .then(response => response.json())
    //             .then(data => setPaises(data));
    //     }
    // }, [continenteSeleccionado]);

    useEffect(() => {
        const obtenerDatos = async () => {
            // Obtén la receta actual del servidor
            const responseReceta = await fetch(`http://localhost:8000/mostrar_receta/${id}`);
            const receta = await responseReceta.json();
            setReceta(receta);
    
            // Obtén el país de la receta
            const responsePais = await fetch(`http://localhost:8000/mostrar_pais/${receta.pais_receta}`);
            const pais = await responsePais.json();
    
            // Obtén el continente del país
            const responseContinente = await fetch(`http://localhost:8000/mostrar_continente/${pais.continente}`);
            const continente = await responseContinente.json();
    
            // Actualiza el estado con los datos obtenidos
            setPais(pais);
            setContinente(continente);
        };
        obtenerDatos();
    }, [id]);

    const handleContinenteChange = (event) => {
        setContinenteSeleccionado(event.target.value);
    };

    const handleChange = (e) => {
        console.log(e.target.value)
        setReceta({...receta, [e.target.name]: e.target.value});
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setReceta({ ...receta, [name]: value });
    };

    const handleFileChange = (e) => {
        console.log(e.target.files[0])
        setSelectedFile(e.target.files[0]);
        setReceta({...receta, [e.target.name]: e.target.files[0]});
    }

    const handleIngredienteChange = (index, event) => {
        const values = [...ingredientes];
        values[index] = event.target.value;
        setIngredientes(values);
        setReceta({...receta, ingredientes_receta: values.join(';')});
    };

    const handleAddIngredient = () => {
        setIngredientes([...ingredientes, '']);
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
                                <select name="continente" value={receta.continente} onChange={handleContinenteChange} className="input-nueva-receta" required>
                                    <option value="">Selecciona el continente</option>
                                    {/* {continentes.map(continente => (
                                        <option key={continente.id} value={continente.id}>
                                            {continente.nombre_continente}
                                        </option>
                                    ))} */}
                                </select>

                            <label className="label-nueva-receta">País:</label>
                            <select 
                                onChange={handleInputChange} 
                                name="pais_receta" 
                                value={receta.pais_receta} 
                                className="input-nueva-receta" required>
                                <option value="">Selecciona el país</option>
                                {/* {paises.map((pais, index) => 
                                    <option key={pais.id_pais} value={pais.id_pais}>
                                        {pais.nombre_pais}
                                    </option>
                                )}  */}
                            </select>
                            
                            <label className="label-nueva-receta">Tipo de receta:</label>
                                <select name="tipo_receta" value={receta.tipo_receta} onChange={handleInputChange} className="input-nueva-receta" required>
                                    <option value="">Selecciona el tipo de receta</option>
                                    /*....*/
                                </select>

                            <label className="label-nueva-receta">Ingredientes:</label>
                            {/* {receta.ingredientes.map((ingrediente, index) => (
                                <div key={index} className="div-añadir">
                                    <input
                                        type="text" 
                                        value={ingrediente}
                                        className="input-ingredientes"
                                        onChange={event => handleIngredienteChange(index, event)}
                                        required={index === 0} // Solo el primer input es obligatorio
                                    />
                                    {index === receta.ingredientes.length - 1 && (
                                        <a href="#" onClick={(event) => {event.preventDefault(); handleAddIngredient();}}>
                                            <img src="mas.png" alt="Añadir ingrediente" className="icono-añadir"/>
                                        </a>
                                    )}
                                </div>
                            ))} */}
                        </div>
                    </div>
                    <button type="submit">Guardar cambios</button>
                </form>
            </div>
        )

        // receta && (
            
        //     <form onSubmit={handleSubmit}>
        //         <label>
        //             Nombre de la receta:
        //             <input type="text" name="nombre_receta" value={receta.nombre_receta} onChange={handleInputChange} />
        //         </label>
        //         {/* Resto del formulario... */}
        //     </form>
        // )
    );
}

export default ModificarReceta;
