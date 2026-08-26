"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

import {
    crearDestino,
    actualizarDestino as actualizarDestinoAction,
    eliminarDestino as eliminarDestinoAction
} from "@/actions/destinos"

type Destino = {
    id: string
    nombre: string
    descripcion: string | null
    pais: string | null
    ciudad: string | null
    user_id: string | null
    created_at: string
}

export default function DestinosPage() {

    const [destinos, setDestinos] = useState<Destino[]>([])
    const [busqueda, setBusqueda] = useState("")
    const [favoritos, setFavoritos] = useState<string[]>([])

    const [rol, setRol] = useState("")
    const [userId, setUserId] = useState("")

    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [pais, setPais] = useState("")
    const [ciudad, setCiudad] = useState("")

    const [destinoEditando, setDestinoEditando] =
        useState<Destino | null>(null)

    const router = useRouter()

    useEffect(() => {
        cargarDatos()
    }, [])

    /* =========================
       CARGAR DATOS
    ========================= */

    const cargarDatos = async () => {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
            await cargarDestinos()
            return
        }

        setUserId(user.id)

        const {
            data: perfil,
            error: errorPerfil
        } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

        if (errorPerfil) {
            console.error(
                "Error obteniendo perfil:",
                errorPerfil
            )
        }

        if (perfil) {
            setRol(perfil.role)
        }

        await cargarDestinos()
        await cargarFavoritos()
    }

    /* =========================
       CARGAR DESTINOS
    ========================= */

    const cargarDestinos = async () => {

        const {
            data,
            error
        } = await supabase
            .from("destinos")
            .select("*")
            .order("nombre", {
                ascending: true
            })

        if (error) {
            console.error(
                "Error cargando destinos:",
                error
            )

            alert(error.message)
            return
        }

        setDestinos(data || [])
    }

    /* =========================
       FAVORITOS
    ========================= */

    const cargarFavoritos = async () => {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
            return
        }

        const {
            data,
            error
        } = await supabase
            .from("favoritos")
            .select("destino_id")
            .eq("user_id", user.id)

        if (error) {
            console.error(
                "Error cargando favoritos:",
                error
            )

            return
        }

        setFavoritos(
            data?.map(
                (favorito) => favorito.destino_id
            ) || []
        )
    }

    const agregarFavorito = async (
        destinoId: string
    ) => {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
            alert("Debes iniciar sesión")
            router.push("/login")
            return
        }

        const {
            error
        } = await supabase
            .from("favoritos")
            .insert({
                user_id: user.id,
                destino_id: destinoId
            })

        if (error) {
            alert(error.message)
            return
        }

        setFavoritos(
            (favoritosActuales) => [
                ...favoritosActuales,
                destinoId
            ]
        )
    }

    const eliminarFavorito = async (
        destinoId: string
    ) => {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
            return
        }

        const {
            error
        } = await supabase
            .from("favoritos")
            .delete()
            .eq("user_id", user.id)
            .eq("destino_id", destinoId)

        if (error) {
            alert(error.message)
            return
        }

        setFavoritos(
            (favoritosActuales) =>
                favoritosActuales.filter(
                    (id) => id !== destinoId
                )
        )
    }

    const cambiarFavorito = async (
        destinoId: string
    ) => {

        if (
            favoritos.includes(destinoId)
        ) {

            await eliminarFavorito(
                destinoId
            )

        } else {

            await agregarFavorito(
                destinoId
            )

        }
    }

    /* =========================
       CREAR DESTINO
       SERVER ACTION
    ========================= */

    const handleCrearDestino = async () => {

        if (!nombre.trim()) {
            alert(
                "Escribe el nombre del destino"
            )
            return
        }

        const formData = new FormData()

        formData.append(
            "nombre",
            nombre
        )

        formData.append(
            "descripcion",
            descripcion
        )

        formData.append(
            "pais",
            pais
        )

        formData.append(
            "ciudad",
            ciudad
        )

        const resultado =
            await crearDestino(formData)

        if (resultado.error) {
            alert(resultado.error)
            return
        }

        alert(
            "Destino creado correctamente"
        )

        limpiarFormulario()

        await cargarDestinos()
    }

    /* =========================
       EDITAR DESTINO
    ========================= */

    const prepararEdicion = (
        destino: Destino
    ) => {

        if (
            destino.user_id !== userId
        ) {

            alert(
                "No puedes editar este destino"
            )

            return
        }

        setDestinoEditando(destino)

        setNombre(
            destino.nombre
        )

        setDescripcion(
            destino.descripcion || ""
        )

        setPais(
            destino.pais || ""
        )

        setCiudad(
            destino.ciudad || ""
        )
    }

    /* =========================
       ACTUALIZAR DESTINO
       SERVER ACTION
    ========================= */

    const actualizarDestino = async () => {

        if (!destinoEditando) {
            return
        }

        const formData = new FormData()

        formData.append(
            "nombre",
            nombre
        )

        formData.append(
            "descripcion",
            descripcion
        )

        formData.append(
            "pais",
            pais
        )

        formData.append(
            "ciudad",
            ciudad
        )

        const resultado =
            await actualizarDestinoAction(
                destinoEditando.id,
                formData
            )

        if (resultado.error) {
            alert(resultado.error)
            return
        }

        alert(
            "Destino actualizado correctamente"
        )

        limpiarFormulario()

        await cargarDestinos()
    }

    /* =========================
       ELIMINAR DESTINO
       SERVER ACTION
    ========================= */

    const eliminarDestino = async (
        id: string
    ) => {

        const confirmar = confirm(
            "¿Seguro que deseas eliminar este destino?"
        )

        if (!confirmar) {
            return
        }

        const resultado =
            await eliminarDestinoAction(id)

        if (resultado.error) {
            alert(resultado.error)
            return
        }

        alert(
            "Destino eliminado correctamente"
        )

        await cargarDestinos()
    }

    /* =========================
       LIMPIAR FORMULARIO
    ========================= */

    const limpiarFormulario = () => {

        setNombre("")
        setDescripcion("")
        setPais("")
        setCiudad("")

        setDestinoEditando(null)
    }

    /* =========================
       BUSCADOR
    ========================= */

    const destinosFiltrados =
        destinos.filter((destino) => {

            const texto =
                busqueda.toLowerCase()

            return (
                destino.nombre
                    .toLowerCase()
                    .includes(texto)

                ||

                destino.ciudad
                    ?.toLowerCase()
                    .includes(texto)

                ||

                destino.pais
                    ?.toLowerCase()
                    .includes(texto)
            )
        })

    return (

        <section className="min-h-screen px-4 py-12">

            <div className="w-full max-w-4xl mx-auto">

                {/* ENCABEZADO */}

                <div className="mb-10">

                    <h1 className="text-3xl font-bold text-white mb-2">

                        Explora{" "}

                        <span className="text-blue-400">
                            Destinos
                        </span>

                    </h1>

                    <p className="text-slate-400">
                        Descubre lugares increíbles para tu próxima aventura.
                    </p>

                </div>

                {/* BUSCADOR */}

                <div className="bg-slate-800 rounded-xl p-6 mb-8">

                    <h2 className="text-xl font-bold text-white mb-4">
                        Buscar destino
                    </h2>

                    <input
                        type="text"
                        placeholder="Escribe un destino..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(
                                e.target.value
                            )
                        }
                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />

                </div>

                {/* FORMULARIO ORGANIZADOR */}

                {rol === "organizador" && (

                    <div className="bg-slate-800 rounded-xl p-6 mb-10">

                        <h2 className="text-xl font-bold text-white mb-6">

                            {destinoEditando
                                ? "Editar destino"
                                : "Crear nuevo destino"}

                        </h2>

                        <div className="flex flex-col gap-4">

                            <input
                                type="text"
                                placeholder="Nombre del destino"
                                value={nombre}
                                onChange={(e) =>
                                    setNombre(
                                        e.target.value
                                    )
                                }
                                className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                            />

                            <input
                                type="text"
                                placeholder="País"
                                value={pais}
                                onChange={(e) =>
                                    setPais(
                                        e.target.value
                                    )
                                }
                                className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                            />

                            <input
                                type="text"
                                placeholder="Ciudad"
                                value={ciudad}
                                onChange={(e) =>
                                    setCiudad(
                                        e.target.value
                                    )
                                }
                                className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                            />

                            <textarea
                                placeholder="Descripción del destino"
                                value={descripcion}
                                onChange={(e) =>
                                    setDescripcion(
                                        e.target.value
                                    )
                                }
                                className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                            />

                            <button
                                onClick={
                                    destinoEditando
                                        ? actualizarDestino
                                        : handleCrearDestino
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
                            >

                                {destinoEditando
                                    ? "Guardar cambios"
                                    : "Crear destino"}

                            </button>

                            {destinoEditando && (

                                <button
                                    onClick={
                                        limpiarFormulario
                                    }
                                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>

                            )}

                        </div>

                    </div>

                )}

                {/* LISTA DESTINOS */}

                <div>

                    <h2 className="text-xl font-bold text-white mb-6">
                        Destinos disponibles
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {destinosFiltrados.map(
                            (destino) => (

                                <div
                                    key={destino.id}
                                    className="bg-slate-800 rounded-xl p-6"
                                >

                                    <h3 className="text-xl font-bold text-white mb-2">

                                        {destino.nombre}

                                    </h3>

                                    {destino.ciudad &&
                                        destino.pais && (

                                            <p className="text-blue-400 mb-3">

                                                📍 {destino.ciudad},{" "}
                                                {destino.pais}

                                            </p>

                                        )}

                                    {destino.descripcion && (

                                        <p className="text-slate-400 mb-5">

                                            {destino.descripcion}

                                        </p>

                                    )}

                                    <div className="flex gap-3 flex-wrap">

                                        <button
                                            onClick={() =>
                                                cambiarFavorito(
                                                    destino.id
                                                )
                                            }
                                            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                        >

                                            {favoritos.includes(
                                                destino.id
                                            )
                                                ? "★ Favorito"
                                                : "☆ Guardar favorito"}

                                        </button>

                                        <Link
                                            href={`/destinos/${destino.id}`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Ver detalle
                                        </Link>

                                    </div>

                                    {rol === "organizador" &&
                                        destino.user_id === userId && (

                                            <div className="flex gap-3 mt-4">

                                                <button
                                                    onClick={() =>
                                                        prepararEdicion(
                                                            destino
                                                        )
                                                    }
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        eliminarDestino(
                                                            destino.id
                                                        )
                                                    }
                                                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                                >
                                                    Eliminar
                                                </button>

                                            </div>

                                        )}

                                </div>

                            )
                        )}

                        {destinosFiltrados.length === 0 && (

                            <div className="bg-slate-800 rounded-xl p-6">

                                <p className="text-slate-400">
                                    No se encontraron destinos.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </section>
    )
}