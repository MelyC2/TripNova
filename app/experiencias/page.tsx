"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import SearchBar from "@/components/SearchBar"

import {
    crearExperiencia as crearExperienciaAction,
    actualizarExperiencia as actualizarExperienciaAction,
    eliminarExperiencia as eliminarExperienciaAction,
} from "@/actions/experiencias"

type Experiencia = {
    id: string
    titulo: string
    descripcion: string | null
    destino: string | null
    fecha: string | null
}

export default function ExperienciasPage() {

    const [experiencias, setExperiencias] = useState<Experiencia[]>([])
    const [busqueda, setBusqueda] = useState("")

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
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            router.push("/login")
            return
        }

        const { data, error } = await supabase
            .from("experiencias")
            .select("*")
            .eq("user_id", user.id)
            .order("fecha", {
                ascending: false,
            })

        if (error) {
            console.error(
                "Error cargando experiencias:",
                error
            )

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

        const formData = new FormData()

        formData.append("titulo", titulo.trim())
        formData.append("descripcion", descripcion.trim())
        formData.append("destino", destino.trim())
        formData.append("fecha", fecha)

        const resultado =
            await crearExperienciaAction(formData)

        if (resultado.error) {
            alert(resultado.error)
            return
        }

        alert("Experiencia creada correctamente")

        limpiarFormulario()
        await cargarExperiencias()
    }

    const prepararEdicion = (
        experiencia: Experiencia
    ) => {

        setExperienciaEditando(experiencia)

        setTitulo(experiencia.titulo)

        setDescripcion(
            experiencia.descripcion || ""
        )

        setDestino(
            experiencia.destino || ""
        )

        setFecha(
            experiencia.fecha || ""
        )

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }


    const actualizarExperiencia = async () => {

        if (!experienciaEditando) {
            return
        }

        if (!titulo.trim()) {
            alert("Escribe un título para la experiencia")
            return
        }

        const formData = new FormData()

        formData.append("titulo", titulo.trim())
        formData.append("descripcion", descripcion.trim())
        formData.append("destino", destino.trim())
        formData.append("fecha", fecha)

        const resultado =
            await actualizarExperienciaAction(
                experienciaEditando.id,
                formData
            )

        if (resultado.error) {
            alert(resultado.error)
            return
        }

        alert("Experiencia actualizada correctamente")

        limpiarFormulario()
        await cargarExperiencias()
    }


    const eliminarExperiencia = async (
        id: string
    ) => {

        const confirmar = confirm(
            "¿Seguro que deseas eliminar esta experiencia?"
        )

        if (!confirmar) {
            return
        }

        const resultado =
            await eliminarExperienciaAction(id)

        if (resultado.error) {
            alert(resultado.error)
            return
        }

        alert("Experiencia eliminada correctamente")

        await cargarExperiencias()
    }

    const limpiarFormulario = () => {

        setTitulo("")
        setDescripcion("")
        setDestino("")
        setFecha("")
        setExperienciaEditando(null)
    }

    const textoBusqueda =
        busqueda.toLowerCase().trim()

    const experienciasFiltradas =
        experiencias.filter((experiencia) => {

            return (
                experiencia.titulo
                    .toLowerCase()
                    .includes(textoBusqueda) ||

                (experiencia.destino || "")
                    .toLowerCase()
                    .includes(textoBusqueda) ||

                (experiencia.descripcion || "")
                    .toLowerCase()
                    .includes(textoBusqueda)
            )
        })

    return (

        <section className="min-h-screen px-4 py-12">

            <div className="w-full max-w-5xl mx-auto">

                {/* -----------ENCABEZADO------------ */}

                <div className="mb-10">

                    <p className="text-blue-400 font-semibold mb-2">
                        ✈️ TripNova
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">

                        Mis{" "}

                        <span className="text-blue-400">
                            experiencias
                        </span>

                    </h1>

                    <p className="text-slate-400 max-w-2xl">
                        Guarda y organiza los mejores recuerdos
                        de tus viajes en un solo lugar.
                    </p>

                </div>

                {/* -------------BUSCADOR----------- */}

                <SearchBar
                    query={busqueda}
                    onQueryChange={setBusqueda}
                />

                {/* -----------FORMULARIO------------*/}

                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl mb-12">

                    <div className="flex items-center justify-between mb-6">

                        <div>

                            <h2 className="text-xl font-bold text-white">

                                {experienciaEditando
                                    ? "Editar experiencia"
                                    : "Crear nueva experiencia"}

                            </h2>

                            <p className="text-slate-400 text-sm mt-1">

                                {experienciaEditando
                                    ? "Modifica la información de tu experiencia."
                                    : "Registra una nueva aventura en TripNova."}

                            </p>

                        </div>

                        <span className="hidden sm:flex bg-blue-500/20 text-blue-400 px-3 py-2 rounded-full text-sm">
                            {experienciaEditando
                                ? "Editando"
                                : "Nueva"}
                        </span>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* TÍTULO */}

                        <div className="md:col-span-2">

                            <label className="block text-sm text-slate-300 mb-2">
                                Título
                            </label>

                            <input
                                type="text"
                                placeholder="Ej. Mi experiencia por las islas Galálagos"
                                value={titulo}
                                onChange={(e) =>
                                    setTitulo(e.target.value)
                                }
                                className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500 transition"
                            />

                        </div>

                        {/* DESTINO */}

                        <div>

                            <label className="block text-sm text-slate-300 mb-2">
                                Destino
                            </label>

                            <input
                                type="text"
                                placeholder="Ej. Galápagos"
                                value={destino}
                                onChange={(e) =>
                                    setDestino(e.target.value)
                                }
                                className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500 transition"
                            />

                        </div>

                        {/* FECHA */}

                        <div>

                            <label className="block text-sm text-slate-300 mb-2">
                                Fecha
                            </label>

                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) =>
                                    setFecha(e.target.value)
                                }
                                className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            />

                        </div>

                        {/* DESCRIPCIÓN */}

                        <div className="md:col-span-2">

                            <label className="block text-sm text-slate-300 mb-2">
                                Descripción
                            </label>

                            <textarea
                                placeholder="Cuenta qué ocurrió en esta experiencia..."
                                value={descripcion}
                                onChange={(e) =>
                                    setDescripcion(e.target.value)
                                }
                                rows={4}
                                className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500 transition resize-none"
                            />

                        </div>

                    </div>

                    {/* BOTONES */}

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">

                        <button
                            onClick={
                                experienciaEditando
                                    ? actualizarExperiencia
                                    : crearExperiencia
                            }
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-[1.01]"
                        >
                            {experienciaEditando
                                ? "Guardar cambios"
                                : "Crear experiencia"}
                        </button>

                        {experienciaEditando && (

                            <button
                                onClick={limpiarFormulario}
                                className="sm:w-40 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>

                        )}

                    </div>

                </div>

                {/*-------------LISTA-----------*/}

                <div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                        <div>

                            <h2 className="text-xl font-bold text-white">
                                Mis experiencias
                            </h2>

                            <p className="text-slate-500 text-sm mt-1">
                                {experienciasFiltradas.length}{" "}
                                {experienciasFiltradas.length === 1
                                    ? "experiencia encontrada"
                                    : "experiencias encontradas"}
                            </p>

                        </div>

                    </div>

                    {/* TARJETAS */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {experienciasFiltradas.map(
                            (experiencia) => (

                                <article
                                    key={experiencia.id}
                                    className="group bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-lg hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300"
                                >

                                    {/* ENCABEZADO TARJETA */}

                                    <div className="flex justify-between items-start mb-5">

                                        <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full">
                                            Experiencia
                                        </span>

                                        {experiencia.fecha && (

                                            <span className="text-slate-500 text-xs">
                                                📅{" "}
                                                {experiencia.fecha}
                                            </span>

                                        )}

                                    </div>

                                    {/* TÍTULO */}

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">

                                        {experiencia.titulo}

                                    </h3>

                                    {/* DESTINO */}

                                    {experiencia.destino && (

                                        <p className="text-blue-400 text-sm mb-3">

                                            📍{" "}
                                            {experiencia.destino}

                                        </p>

                                    )}

                                    {/* DESCRIPCIÓN */}

                                    <p className="text-slate-400 text-sm leading-6 mb-6">

                                        {experiencia.descripcion ||
                                            "No hay una descripción disponible para esta experiencia."}

                                    </p>

                                    {/* ACCIONES */}

                                    <div className="flex gap-3 flex-wrap pt-4 border-t border-slate-700">

                                        <button
                                            onClick={() =>
                                                prepararEdicion(
                                                    experiencia
                                                )
                                            }
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                        >
                                            ✏️ Editar
                                        </button>

                                        <button
                                            onClick={() =>
                                                eliminarExperiencia(
                                                    experiencia.id
                                                )
                                            }
                                            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                        >
                                            🗑️ Eliminar
                                        </button>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                    {/* SIN RESULTADOS */}

                    {experienciasFiltradas.length === 0 && (

                        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-10 text-center">

                            <div className="text-4xl mb-4">
                                ✈️
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-2">

                                {busqueda
                                    ? "No encontramos experiencias"
                                    : "Aún no tienes experiencias"}

                            </h3>

                            <p className="text-slate-400 text-sm">

                                {busqueda
                                    ? "Prueba con otro destino, título o descripción."
                                    : "Crea tu primera experiencia para comenzar a guardar tus recuerdos."}

                            </p>

                        </div>

                    )}

                </div>

            </div>

        </section>
    )
}

