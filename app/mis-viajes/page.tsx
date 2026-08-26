"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function MisViajesPage() {
    const [destino, setDestino] = useState("")
    const [fechaInicio, setFechaInicio] = useState("")
    const [fechaFin, setFechaFin] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [viajes, setViajes] = useState<any[]>([])
    const [viajeEditando, setViajeEditando] = useState<any>(null)

    const router = useRouter()

    useEffect(() => {
        cargarViajes()
    }, [])

    const cargarViajes = async () => {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push("/login")
            return
        }

        const { data, error } = await supabase
            .from("viajes")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            alert(error.message)
            return
        }

        setViajes(data || [])
    }

    const crearViaje = async () => {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push("/login")
            return
        }

        const { error } = await supabase
            .from("viajes")
            .insert({
                user_id: user.id,
                destino: destino,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                descripcion: descripcion,
            })

        if (error) {
            alert(error.message)
            return
        }

        alert("Viaje creado correctamente")

        limpiarFormulario()
        cargarViajes()
    }

    const eliminarViaje = async (id: number) => {
        const confirmar = confirm("¿Seguro que deseas eliminar este viaje?")

        if (!confirmar) {
            return
        }

        const { error } = await supabase
            .from("viajes")
            .delete()
            .eq("id", id)

        if (error) {
            alert(error.message)
            return
        }

        alert("Viaje eliminado correctamente")

        cargarViajes()
    }

    const prepararEdicion = (viaje: any) => {
        setViajeEditando(viaje)
        setDestino(viaje.destino)
        setFechaInicio(viaje.fecha_inicio)
        setFechaFin(viaje.fecha_fin)
        setDescripcion(viaje.descripcion || "")
    }

    const actualizarViaje = async () => {
        if (!viajeEditando) {
            return
        }

        const { error } = await supabase
            .from("viajes")
            .update({
                destino: destino,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                descripcion: descripcion,
            })
            .eq("id", viajeEditando.id)

        if (error) {
            alert(error.message)
            return
        }

        alert("Viaje actualizado correctamente")

        limpiarFormulario()
        cargarViajes()
    }

    const limpiarFormulario = () => {
        setDestino("")
        setFechaInicio("")
        setFechaFin("")
        setDescripcion("")
        setViajeEditando(null)
    }

    return (
        <section className="max-w-4xl mx-auto px-6 py-12">

            {/* Encabezado */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Mis viajes
                </h1>

                <p className="text-slate-400">
                    Gestiona y organiza tus viajes.
                </p>
            </div>

            {/* Formulario */}
            <div className="bg-slate-800 rounded-xl p-6">

                <h2 className="text-xl font-bold text-white mb-6">
                    {viajeEditando ? "Editar viaje" : "Crear nuevo viaje"}
                </h2>

                <div className="flex flex-col gap-4">

                    <input
                        type="text"
                        placeholder="Destino"
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />

                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />

                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />

                    <textarea
                        placeholder="Descripción del viaje"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />

                    <button
                        onClick={viajeEditando ? actualizarViaje : crearViaje}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        {viajeEditando ? "Guardar cambios" : "Crear viaje"}
                    </button>

                    {viajeEditando && (
                        <button
                            onClick={limpiarFormulario}
                            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                    )}

                </div>
            </div>

            {/* Viajes registrados */}
            <div className="mt-10">

                <h2 className="text-xl font-bold text-white mb-6">
                    Mis viajes registrados
                </h2>

                <div className="flex flex-col gap-4">

                    {viajes.map((viaje) => (
                        <div
                            key={viaje.id}
                            className="bg-slate-800 rounded-xl p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">
                                {viaje.destino}
                            </h3>

                            <p className="text-slate-400 mb-2">
                                {viaje.fecha_inicio} → {viaje.fecha_fin}
                            </p>

                            <p className="text-slate-400 mb-4">
                                {viaje.descripcion}
                            </p>

                            <div className="flex gap-3">

                                <button
                                    onClick={() => prepararEdicion(viaje)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => eliminarViaje(viaje.id)}
                                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                >
                                    Eliminar
                                </button>

                            </div>
                        </div>
                    ))}

                    {viajes.length === 0 && (
                        <div className="bg-slate-800 rounded-xl p-6">
                            <p className="text-slate-400">
                                Aún no tienes viajes registrados.
                            </p>
                        </div>
                    )}

                </div>
            </div>

        </section>
    )
}