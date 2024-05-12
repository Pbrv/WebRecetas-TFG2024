import React, { useState, useEffect } from 'react';
import "../stylesheets/NuevaReceta.css";

const NuevaReceta = () => {
    const [receta, setReceta] = useState({
        nombre_receta: "",
        ingredientes_receta: "",
        elaboracion_receta: "",
        dificultad_receta: 0,
        pais_receta: 0,
        tipo_receta: "",
        imagen_receta: null
    });

    const [continentes, setContinentes] = useState([]);
    const [continenteSeleccionado, setContinenteSeleccionado] = useState('');
    const [paises, setPaises] = useState([]);
    const [pasos, setPasos] = useState(['', '']);
    const [ingredientes, setIngredientes] = useState(['']);

    useEffect(() => {
        fetch("/mostrar_continentes")
            .then(response => response.json())
            .then(data => setContinentes(data));
    }, []);

    useEffect(() => {
        //Si se pone este condicional hay que poner por defecto un continente si no no se muestra ningun pais cuando carga por primera vez y no seleccionan otro continente
        if (continenteSeleccionado) {
            fetch(`/mostrar_paises/${continenteSeleccionado}`)
                .then(response => response.json())
                .then(data => setPaises(data));
        }
    }, [continenteSeleccionado]);

    const handleContinenteChange = (event) => {
        setContinenteSeleccionado(event.target.value);
    };

    const handleChange = (e) => {
        console.log(e.target.value)
        setReceta({...receta, [e.target.name]: e.target.value});
    }

    const handleIngredienteChange = (index, event) => {
        const values = [...ingredientes];
        values[index] = event.target.value;
        setIngredientes(values);
        setReceta({...receta, ingredientes_receta: values});
    };

    const handleAddIngredient = () => {
        setIngredientes([...ingredientes, '']);
    };    

    const handlePasoChange = (index, event) => {
        const values = [...pasos];
        values[index] = event.target.value;
        setPasos(values);
    };

    const handleAddPaso = () => {
        setPasos([...pasos, '']);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        //Descomentar, esta comentado porque solo funciona la primera vez que le das a subir receta
        // let ingredientesString = receta.ingredientes_receta.join(';')
        // setReceta({...receta, ingredientes_receta:ingredientesString})
        console.log(receta)
        try {
            const response = await fetch("/insertar_receta", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(receta)
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="contenedor-nueva-receta">
            <h2 className="titulo-nueva-receta">Nueva Receta</h2>
            <form className="form-nueva-receta" onSubmit={handleSubmit}>
                <div className="contenedor-form-nueva-receta">
                    {/* 1ª COLUMNA */}
                    <div className="columna">
                        <label className="label-nueva-receta">Nombre: </label>
                            <input
                                className="input-nueva-receta"
                                type="text" 
                                name="nombre_receta" 
                                onChange={handleChange} required
                            />
                        
                        <label className="label-nueva-receta">Selecciona la dificultad:</label>
                            <select name="dificultad_receta" onChange={handleChange} className="input-nueva-receta" required>
                                <option value="1">Dificultad 1</option>
                                <option value="2">Dificultad 2</option>
                                <option value="3">Dificultad 3</option>
                                <option value="4">Dificultad 4</option>
                            </select>
                        
                        <label className="label-nueva-receta">Continente:</label>
                        {/* onChange={handleChange} */}
                            <select name="continente" onChange={handleContinenteChange} className="input-nueva-receta" required>
                                {continentes.map(continente => (
                                    <option key={continente.id} value={continente.id}>
                                        {continente.nombre_continente}
                                    </option>
                                ))}
                            </select>

                        <label className="label-nueva-receta">País:</label>
                        <select onChange={handleChange} name="pais_receta" className="input-nueva-receta" required>
                        {paises.map((pais, index) => 
                            <option key={pais.id_pais} value={pais.id_pais}>
                                {pais.nombre_pais}
                            </option>
                        )} 
                        </select>
                        
                        <label className="label-nueva-receta">Tipo de receta:</label>
                            <select name="tipo_receta" onChange={handleChange} className="input-nueva-receta" required>
                                <option value="Comida">Comida</option>
                                <option value="Cena">Cena</option>
                                <option value="Postre">Postre</option>
                                <option value="Desayuno">Desayuno</option>
                                <option value="Bebida">Bebida</option>
                            </select>

                        <label className="label-nueva-receta">Ingredientes:</label>
                        {ingredientes.map((ingrediente, index) => (
                            <div key={index} className="div-añadir">
                                <input
                                    type="text" 
                                    value={ingrediente}
                                    className="input-ingredientes"
                                    onChange={event => handleIngredienteChange(index, event)}
                                    required
                                />
                                {index === ingredientes.length - 1 && (
                                    <a href="#" onClick={(event) => {event.preventDefault(); handleAddIngredient();}}>
                                        <img src="mas.png" alt="Añadir ingrediente" className="icono-añadir"/>
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
                                <input
                                    type="text" 
                                    value={paso}
                                    className="input-elaboracion"
                                    onChange={event => handlePasoChange(index, event)}
                                    required
                                />
                                {index === pasos.length - 1 && (
                                    <a href="#" onClick={(event) => {event.preventDefault(); handleAddPaso();}}>
                                        <img src="mas.png" alt="Añadir paso" className="icono-añadir"/>
                                    </a>
                                )}
                            </div>
                        ))}
                        
                        <label className="label-nueva-receta">Imagen:</label>
                            <input
                                type="file" 
                                name="imagen_receta" 
                                className="input_imagen"
                                onChange={handleChange}
                            />
                        
                        <div className="prueba">
                            <input type="submit" className="boton-nueva-receta" value="Subir Receta" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default NuevaReceta;