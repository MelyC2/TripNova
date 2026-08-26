"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Experiencia = {
    id: string
    titulo: string
    descripcion: string | null
    destino: string | null
    fecha: string | null
}

export default function ExperienciasPage() {

    const [experiencias, setExperiencias] = useState<Experiencia[]>([])

    const [titulo, setTitulo] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [destino, setDestino] = useState("")
    const [fecha, setFecha] = useState("")

    const [experienciaEditando, setExperienciaEditando] =
        useState<Experiencia | null>(null)

    const router = useRouter()

    useEffect(() => {
        cargarExperiencias()
    }, [])

    const cargarExperiencias = async () => {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
            router.push("/login")
            return
        }

        const { data, error } = await supabase
            .from("experiencias")
            .select("*")
            .eq("user_id", user.id)
            .order("fecha", { ascending: false })

        if (error) {
            alert(error.message)
            return
        }

        setExperiencias(data || [])
    }

    const crearExperiencia = async () => {

        if (!titulo.trim()) {
            alert("Escribe un título para la experiencia")
            return
        }

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
            router.push("/login")
            return
        }

        const { error } = await supabase
            .from("experiencias")
            .insert({
                user_id: user.id,
                titulo: titulo,
                descripcion: descripcion,
                destino: destino,
                fecha: fecha || null,
            })

        if (error) {
            alert(error.message)
            return
        }

        alert("Experiencia creada correctamente")

        limpiarFormulario()
        cargarExperiencias()
    }

    const eliminarExperiencia = async (id: string) => {

        const confirmar = confirm(
            "¿Seguro que deseas eliminar esta experiencia?"
        )

        if (!confirmar) {
            return
        }

        const { error } = await supabase
            .from("experiencias")
            .delete()
            .eq("id", id)

        if (error) {
            alert(error.message)
            return
        }

        alert("Experiencia eliminada correctamente")

        cargarExperiencias()
    }

    const prepararEdicion = (experiencia: Experiencia) => {

        setExperienciaEditando(experiencia)

        setTitulo(experiencia.titulo)
        setDescripcion(experiencia.descripcion || "")
        setDestino(experiencia.destino || "")
        setFecha(experiencia.fecha || "")
    }

    const actualizarExperiencia = async () => {

        if (!experienciaEditando) {
            return
        }

        const { error } = await supabase
            .from("experiencias")
            .update({
                titulo: titulo,
                descripcion: descripcion,
                destino: destino,
                fecha: fecha || null,
            })
            .eq("id", experienciaEditando.id)

        if (error) {
            alert(error.message)
            return
        }

        alert("Experiencia actualizada correctamente")

        limpiarFormulario()
        cargarExperiencias()
    }

    const limpiarFormulario = () => {

        setTitulo("")
        setDescripcion("")
        setDestino("")
        setFecha("")

        setExperienciaEditando(null)
    }

    return (
        <section className="max-w-4xl mx-auto px-6 py-12">

            {/* Encabezado */}

            <div className="mb-10">

                <h1 className="text-3xl font-bold text-white mb-2">
                    Mis <span className="text-blue-400">experiencias</span>
                </h1>

                <p className="text-slate-400">
                    Guarda y organiza los mejores recuerdos de tus viajes.
                </p>

            </div>


            {/* Formulario */}

            <div className="bg-slate-800 rounded-xl p-6">

                <h2 className="text-xl font-bold text-white mb-6">

                    {experienciaEditando
                        ? "Editar experiencia"
                        : "Crear nueva experiencia"}

                </h2>

                <div className="flex flex-col gap-4">

                    <input
                        type="text"
                        placeholder="Título de la experiencia"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />

                    <input
                        type="text"
                        placeholder="Destino"
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />

                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />

                    <textarea
                        placeholder="Descripción de la experiencia"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />

                    <button
                        onClick={
                            experienciaEditando
                                ? actualizarExperiencia
                                : crearExperiencia
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
                    >

                        {experienciaEditando
                            ? "Guardar cambios"
                            : "Crear experiencia"}

                    </button>


                    {experienciaEditando && (

                        <button
                            onClick={limpiarFormulario}
                            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>

                    )}

                </div>

            </div>


            {/* Experiencias registradas */}

            <div className="mt-10">

                <h2 className="text-xl font-bold text-white mb-6">
                    Mis experiencias registradas
                </h2>

                <div className="flex flex-col gap-4">

                    {experiencias.map((experiencia) => (

                        <div
                            key={experiencia.id}
                            className="bg-slate-800 rounded-xl p-6"
                        >

                            <h3 className="text-xl font-bold text-white mb-2">
                                {experiencia.titulo}
                            </h3>


                            {experiencia.destino && (

                                <p className="text-blue-400 mb-2">
                                    📍 {experiencia.destino}
                                </p>

                            )}


                            {experiencia.fecha && (

                                <p className="text-slate-400 mb-2">
                                    📅 {experiencia.fecha}
                                </p>

                            )}


                            {experiencia.descripcion && (

                                <p className="text-slate-400 mb-4">
                                    {experiencia.descripcion}
                                </p>

                            )}


                            <div className="flex gap-3">

                                <button
                                    onClick={() =>
                                        prepararEdicion(experiencia)
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                >
                                    Editar
                                </button>


                                <button
                                    onClick={() =>
                                        eliminarExperiencia(experiencia.id)
                                    }
                                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                >
                                    Eliminar
                                </button>

                            </div>

                        </div>

                    ))}


                    {experiencias.length === 0 && (

                        <div className="bg-slate-800 rounded-xl p-6">

                            <p className="text-slate-400">
                                Aún no tienes experiencias registradas.
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </section>
    )
}