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

    useEffect(() => {
        fetch("/mostrar_continentes")
            .then(response => response.json())
            .then(data => setContinentes(data));
    }, []);

    const handleChange = (e) => {
        setReceta({...receta, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        <div className="contenedor">
            <h2 className="titulo-form">Nueva Receta</h2>
            <form className="form-nueva-receta" onSubmit={handleSubmit}>
                <div className="contenedor-form-nueva-receta">
                    <div className="columna">
                        <label className="label-nueva-receta">Nombre: </label>
                            <input
                                className="input-nueva-receta"
                                type="text" 
                                name="nombre_receta" 
                                onChange={handleChange} required
                            />
                        
                        <label className="label-nueva-receta">Selecciona la dificultad:</label>
                            <select name="dificultad_receta" onChange={handleChange} required>
                                <option value="1">Dificultad 1</option>
                                <option value="2">Dificultad 2</option>
                                <option value="3">Dificultad 3</option>
                                <option value="4">Dificultad 4</option>
                            </select>
                        
                        <label className="label-nueva-receta">Continente:</label>
                            <select name="Continente" onChange={handleChange} required>
                                {continentes.map(continente => (
                                    <option key={continente.id} value={continente.id}>
                                        {continente.nombre}
                                    </option>
                                ))}
                            </select>
                        
                        <label className="label-nueva-receta">Tipo de receta:</label>
                            <select name="tipo" onChange={handleChange} required>
                                {continentes.map(continente => (
                                    <option key={continente.id} value={continente.id}>
                                        {continente.nombre}
                                    </option>
                                ))}
                            </select>
                        
                        <label className="label-nueva-receta">Ingredientes:</label>
                            <input
                                type="text" 
                                name="nombre_receta" 
                                onChange={handleChange} required
                            />
                        
                    </div>
                    <div className="columna">
                        <label className="label-nueva-receta">
                            Elaboración:
                            <textarea  rows={5} cols={30}>

                            </textarea>
                        </label>
                        <label className="label-nueva-receta">
                            Imagen:
                            <input
                                type="file" 
                                name="imagen_receta" 
                                onChange={handleChange} 
                            />
                        </label>
                        <input type="submit" className="form-submit" value="Subir Receta" />
                    </div>
                    
                </div>
                
            </form>
        </div>
    );
}

export default NuevaReceta;