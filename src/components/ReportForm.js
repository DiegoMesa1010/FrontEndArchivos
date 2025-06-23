"use client"

import { useState, useEffect } from "react"
import Swal from 'sweetalert2'
import "../styles.css"

const ReportForm = () => {
    // Estado para manejar el loading
    const [isLoading, setIsLoading] = useState(false)

    const convertirHora12 = (hora24) => {
        if (!hora24) return "";
        const [horas, minutos] = hora24.split(":");
        let horaNum = parseInt(horas, 10);
        const periodo = horaNum >= 12 ? "PM" : "AM";
        const hora12 = horaNum % 12 || 12; // si es 0, muestra 12
        return `${String(hora12).padStart(2, '0')}:${minutos} ${periodo}`;
    };

    const [formData, setFormData] = useState({
        maquina: "",
        fecha: "",
        turno: "Dia",
        hr_reporte: "",
        hr_inicio: "",
        hr_final: "",
        tiempo_falla: "",
        horometro: "",
        tipo_falla: "",
        falla: "",
        nombre_mecanico: "",
        diagnostico: "",
        labor_realizada: "",
    })

    // Lista de máquinas para el selector
    const maquinas = [
        "JUMBO JM01",
        "MT02",
        "MT03",
        "MT04",
        "MT05",
        "MT06",
        "MT07",
        "MT08",
        "MT09",
        "MT10",
        "MT11",
        "MT12(HX07)",
        "MT13(HX07)",
        "SD04",
        "SD05",
        "SD06",
        "SD07",
        "BOBCAT ML04"
    ]

    // Tipos de falla - 5 opciones
    const tiposFalla = [
        "MP",
        "FM",
        "FE",
        "FH",
        "DE",
        "P",
        "S"
    ]

    // Función para calcular tiempo de falla
    const calcularTiempoFalla = (inicio, final) => {
        if (!inicio || !final) return ""

        const [horaInicio, minutoInicio] = inicio.split(':').map(Number)
        const [horaFinal, minutoFinal] = final.split(':').map(Number)

        let totalMinutosInicio = horaInicio * 60 + minutoInicio
        let totalMinutosFinal = horaFinal * 60 + minutoFinal

        // Si la hora final es menor, asumimos que pasó al día siguiente
        if (totalMinutosFinal < totalMinutosInicio) {
            totalMinutosFinal += 24 * 60
        }

        const diferencia = totalMinutosFinal - totalMinutosInicio
        const horas = Math.floor(diferencia / 60)
        const minutos = diferencia % 60

        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`
    }

    // Función para formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return ""

        const [año, mes, dia] = fecha.split("-")
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
            'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

        const mesTexto = meses[parseInt(mes, 10) - 1]
        return `${dia}-${mesTexto}-${año.slice(-2)}`
    }


    const handleChange = (e) => {
        const { name, value } = e.target

        // Validación para horómetro (solo números)
        if (name === 'horometro' && value && !/^\d*\.?\d*$/.test(value)) {
            return
        }

        setFormData({
            ...formData,
            [name]: value,
        })
    }

    // UseEffect para calcular tiempo de falla automáticamente
    useEffect(() => {
        if (formData.hr_inicio && formData.hr_final) {
            const tiempoCalculado = calcularTiempoFalla(formData.hr_inicio, formData.hr_final)
            setFormData(prev => ({
                ...prev,
                tiempo_falla: tiempoCalculado
            }))
        }
    }, [formData.hr_inicio, formData.hr_final])

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Activar loading
        setIsLoading(true);

        // Convertimos las horas al formato 12 horas con AM/PM
        const hrReporte12 = convertirHora12(formData.hr_reporte);
        const hrInicio12 = convertirHora12(formData.hr_inicio);
        const hrFinal12 = convertirHora12(formData.hr_final);

        const formattedData = {
            "Maquina": formData.maquina,
            "Fecha": formatearFecha(formData.fecha),
            "Turno": formData.turno,
            "HR_reporte": hrReporte12,
            "Hr_Inicio": hrInicio12,
            "Hr_Final": hrFinal12,
            "Tiempo_Falla": formData.tiempo_falla,
            "Horómetro": parseFloat(formData.horometro) || 0,
            "Tipo_de_falla": formData.tipo_falla,
            "Falla": formData.falla,
            "Nombre_Mecanico": formData.nombre_mecanico,
            "Diagnostico": formData.diagnostico,
            "Labor_Realizada": formData.labor_realizada
        };

        console.log("Datos a enviar:", formattedData);

        try {
            const response = await fetch("https://registrodeinformacion.onrender.com/enviar-datos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formattedData)
            });

            if (!response.ok) throw new Error("Error al enviar los datos");

            // Éxito - SweetAlert2
            setIsLoading(false);
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Reporte enviado con éxito',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#28a745'
            });
            handleReset(); // Limpia el formulario

        } catch (err) {
            console.error(err);
            setIsLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al enviar el reporte. Intenta nuevamente.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545'
            });
        }
    };

    const handleReset = () => {
        setFormData({
            maquina: "",
            fecha: "",
            turno: "Dia",
            hr_reporte: "",
            hr_inicio: "",
            hr_final: "",
            tiempo_falla: "",
            horometro: "",
            tipo_falla: "",
            falla: "",
            nombre_mecanico: "",
            diagnostico: "",
            labor_realizada: "",
        })
    }

    return (
        <div className="report-form-container">
            <h2>Formulario de Reporte de Fallas - Maquinaria</h2>

            <form className="report-form machinery-form" onSubmit={handleSubmit}>

                {/* Resto del formulario igual que antes */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="maquina">Máquina:</label>
                        <select
                            id="maquina"
                            name="maquina"
                            value={formData.maquina}
                            onChange={handleChange}
                            required
                            className="machinery-select"
                            disabled={isLoading}
                        >
                            <option value="">Seleccionar máquina...</option>
                            {maquinas.map((maquina, index) => (
                                <option key={index} value={maquina}>{maquina}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fecha">Fecha:</label>
                        <input
                            type="date"
                            id="fecha"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            required
                            className="machinery-date"
                            disabled={isLoading}
                        />
                        {formData.fecha && (
                            <small className="date-preview">Vista previa: {formatearFecha(formData.fecha)}</small>
                        )}
                    </div>
                </div>

                {/* Fila 2: Turno y HR Reporte */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="turno">Turno:</label>
                        <select
                            id="turno"
                            name="turno"
                            value={formData.turno}
                            onChange={handleChange}
                            required
                            className="machinery-select"
                            disabled={isLoading}
                        >
                            <option value="Dia">Día</option>
                            <option value="Noche">Noche</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="hr_reporte">HR Reporte:</label>
                        <input
                            type="time"
                            id="hr_reporte"
                            name="hr_reporte"
                            value={formData.hr_reporte}
                            onChange={handleChange}
                            required
                            className="machinery-time"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Fila 3: HR Inicio y HR Final */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="hr_inicio">HR Inicio:</label>
                        <input
                            type="time"
                            id="hr_inicio"
                            name="hr_inicio"
                            value={formData.hr_inicio}
                            onChange={handleChange}
                            required
                            className="machinery-time"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="hr_final">HR Final:</label>
                        <input
                            type="time"
                            id="hr_final"
                            name="hr_final"
                            value={formData.hr_final}
                            onChange={handleChange}
                            required
                            className="machinery-time"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Fila 4: Tiempo Falla y Horómetro */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="tiempo_falla">Tiempo de Falla:</label>
                        <input
                            type="text"
                            id="tiempo_falla"
                            name="tiempo_falla"
                            value={formData.tiempo_falla}
                            readOnly
                            className="machinery-calculated"
                            placeholder="Se calcula automáticamente"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="horometro">Horómetro:</label>
                        <input
                            type="text"
                            id="horometro"
                            name="horometro"
                            value={formData.horometro}
                            onChange={handleChange}
                            required
                            className="machinery-number"
                            placeholder="Ej: 1250.5"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Fila 5: Tipo de Falla */}
                <div className="form-group">
                    <label htmlFor="tipo_falla">Tipo de Falla:</label>
                    <select
                        id="tipo_falla"
                        name="tipo_falla"
                        value={formData.tipo_falla}
                        onChange={handleChange}
                        required
                        className="machinery-select"
                        disabled={isLoading}
                    >
                        <option value="">Seleccionar tipo de falla...</option>
                        {tiposFalla.map((tipo, index) => (
                            <option key={index} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>

                {/* Fila 6: Falla y Nombre Mecánico */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="falla">Falla:</label>
                        <input
                            type="text"
                            id="falla"
                            name="falla"
                            value={formData.falla}
                            onChange={handleChange}
                            required
                            className="machinery-text"
                            placeholder="Descripción de la falla"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nombre_mecanico">Nombre Mecánico:</label>
                        <input
                            type="text"
                            id="nombre_mecanico"
                            name="nombre_mecanico"
                            value={formData.nombre_mecanico}
                            onChange={handleChange}
                            required
                            className="machinery-text"
                            placeholder="Nombre completo del mecánico"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Fila 7: Diagnóstico */}
                <div className="form-group">
                    <label htmlFor="diagnostico">Diagnóstico:</label>
                    <textarea
                        id="diagnostico"
                        name="diagnostico"
                        value={formData.diagnostico}
                        onChange={handleChange}
                        required
                        className="machinery-textarea"
                        rows="3"
                        placeholder="Diagnóstico detallado de la falla"
                        disabled={isLoading}
                    />
                </div>

                {/* Fila 8: Labor Realizada */}
                <div className="form-group">
                    <label htmlFor="labor_realizada">Labor Realizada:</label>
                    <textarea
                        id="labor_realizada"
                        name="labor_realizada"
                        value={formData.labor_realizada}
                        onChange={handleChange}
                        required
                        className="machinery-textarea"
                        rows="4"
                        placeholder="Descripción detallada del trabajo realizado"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-actions machinery-actions">
                    <button
                        type="submit"
                        className="btn-submit machinery-submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="loading-content">
                                <div className="spinner"></div>
                                <span>Enviando...</span>
                            </div>
                        ) : (
                            'Enviar Reporte'
                        )}
                    </button>
                    <button
                        type="button"
                        className="btn-reset machinery-reset"
                        onClick={handleReset}
                        disabled={isLoading}
                    >
                        Limpiar Formulario
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ReportForm