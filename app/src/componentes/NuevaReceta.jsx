import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../stylesheets/NuevaReceta.css";

const NuevaReceta = () => {
    const [receta, setReceta] = useState({
        nombre_receta: "",
        ingredientes_receta: "",
        elaboracion_receta: "",
        dificultad_receta: 0,
        pais_receta: 0,
        tipo_receta: "",
        // imagen_receta: null
    });

    const [continentes, setContinentes] = useState([]);
    const [continenteSeleccionado, setContinenteSeleccionado] = useState('');
    const [paises, setPaises] = useState([]);
    const [pasos, setPasos] = useState(['', '', '']);
    const [ingredientes, setIngredientes] = useState(['', '']);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/mostrar_continentes")
            .then(response => response.json())
            .then(data => setContinentes(data));
    }, []);

    useEffect(() => {
        if (continenteSeleccionado) {
            fetch(`/mostrar_paises/${continenteSeleccionado}`)
                .then(response => response.json())
                .then(data => setPaises(data));
        }
    }, [continenteSeleccionado]);

    const handleCambioContinente = (event) => {
        setContinenteSeleccionado(event.target.value);
    };

    const handleCambio = (e) => {
        console.log(e.target.value)
        setReceta({...receta, [e.target.name]: e.target.value});
    }

    const handleCambioArchivo = (e) => {
        console.log(e.target.files[0].name)
        setArchivoSeleccionado(e.target.files[0]);
        setReceta({...receta, [e.target.name]: e.target.files[0]});
    }

    const handleCambioIngrediente = (index, event) => {
        const values = [...ingredientes];
        values[index] = event.target.value;
        setIngredientes(values);
        setReceta({...receta, ingredientes_receta: values});
    };

    const handleAñadirIngrediente = () => {
        setIngredientes([...ingredientes, '']);
    };    

    const handleCambioPaso = (index, event) => {
        const values = [...pasos];
        values[index] = event.target.value;
        setPasos(values);
    };

    const handleAñadirPaso = () => {
        setPasos([...pasos, '']);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // PROCESAR LOS INGREDIENTES Y LA ELABORACIÓN
            let ingredientesString = ingredientes
                .filter(ingrediente => ingrediente.trim() !== '') // Filtra ingredientes vacíos
                .map(ingrediente => 
                ingrediente.trim().charAt(0).toUpperCase() + ingrediente.trim().slice(1)
            ).join(';');

            let elaboracionString = pasos
                .filter(paso => paso.trim() !== '') // Filtrar los pasos de elaboración vacíos
                .map(paso =>
                    paso.trim().charAt(0).toUpperCase() + paso.trim().slice(1)
                )
                .join(';');

            // Hacer copia de Receta con los ingredientes y elaboración pasados a String
            const recetaString = {
                ...receta,
                ingredientes_receta: ingredientesString,
                elaboracion_receta: elaboracionString
            };
            
            // Crear un objeto FormData y añadir los datos de la receta y el archivo de imagen
            const formData = new FormData();
            Object.keys(recetaString).forEach(key => formData.append(key, recetaString[key]));
            
            const response = await fetch("/insertar_receta", { // Enviar la receta y la IMAGEN al servidor
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recetaString)
            });
            const data = await response.json();
            if(data){
                const formData = new FormData();
                formData.append('imagen_receta', archivoSeleccionado);
                const response = await fetch("/insertar_imagen_receta", {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    },
                    body: formData
                });

                const data = await response.json();
                
                setMensaje('¡Receta subida con éxito!');
                navigate('/'); // NO SE EJECUTA BIEN
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="contenedor-nueva-receta">
            <h2 className="titulo-nueva-receta">Nueva Receta</h2>
            <div>
                {mensaje && <p>{mensaje}</p>}
            </div>
            <form className="form-nueva-receta" onSubmit={handleSubmit}>
                <div className="contenedor-form-nueva-receta">
                    {/* 1ª COLUMNA */}
                    <div className="columna">
                        <label className="label-nueva-receta">Nombre: </label>
                        <input
                            className="input-nueva-receta"
                            type="text" 
                            name="nombre_receta" 
                            onChange={handleCambio} required
                        />
                        
                        <label className="label-nueva-receta">Dificultad:</label>
                        <select name="dificultad_receta" onChange={handleCambio} className="input-nueva-receta" required>
                            <option value="">Selecciona una dificultad</option>
                            <option value="1">Dificultad 1</option>
                            <option value="2">Dificultad 2</option>
                            <option value="3">Dificultad 3</option>
                            <option value="4">Dificultad 4</option>
                        </select>
                        
                        <label className="label-nueva-receta">Continente:</label>
                        <select name="continente" onChange={handleCambioContinente} className="input-nueva-receta" required>
                            <option value="">Selecciona el continente</option>
                            {continentes.map(continente => (
                                <option key={continente.id} value={continente.id}>
                                    {continente.nombre_continente}
                                </option>
                            ))}
                        </select>

                        <label className="label-nueva-receta">País:</label>
                        <select onChange={handleCambio} name="pais_receta" className="input-nueva-receta" required>
                            <option value="">Selecciona el país</option>
                            {paises.map((pais, index) => 
                                <option key={pais.id_pais} value={pais.id_pais}>
                                    {pais.nombre_pais}
                                </option>
                            )} 
                        </select>
                        
                        <label className="label-nueva-receta">Tipo de receta:</label>
                        <select name="tipo_receta" onChange={handleCambio} className="input-nueva-receta" required>
                            <option value="">Selecciona el tipo de receta</option>
                            <option value="Comida">Comida</option>
                            <option value="Cena">Cena</option>
                            <option value="Postre">Postre</option>
                            <option value="Desayuno">Desayuno</option>
                            <option value="Salsa">Salsa</option>
                            <option value="Bebida">Bebida</option>
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
                                    <a href="#" onClick={(event) => {event.preventDefault(); handleAñadirIngrediente();}}>
                                        <img src="/mas.png" alt="Añadir ingrediente" className="icono-añadir"/>
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* 2ª COLUMNA */}
                    <div className="columna">
                        <label className="label-nueva-receta">Elaboración:</label>
                        {pasos.map((paso, index) => (
                            <div key={index} className="div-añadir">
                                <label className="label-pasos">Paso {index + 1}:</label>
                                <textarea
                                    rows={4}
                                    value={paso}
                                    className="input-elaboracion"
                                    onChange={event => handleCambioPaso(index, event)}
                                    required={index === 0} // Solo el primer textarea es obligatorio
                                />
                                {index === pasos.length - 1 && (
                                    <a href="#" onClick={(event) => {event.preventDefault(); handleAñadirPaso();}}>
                                        <img src="/mas.png" alt="Añadir paso" className="icono-añadir"/>
                                    </a>
                                )}
                            </div>
                        ))}
                        
                        <label className="label-nueva-receta">Imagen:</label>
                        <input
                            type="file" 
                            name="imagen_receta" 
                            className="input_imagen"
                            onChange={handleCambioArchivo}
                        />
                        
                        <div className="div-boton-nueva-receta">
                            <input type="submit" className="boton-nueva-receta" value="Subir Receta" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default NuevaReceta;