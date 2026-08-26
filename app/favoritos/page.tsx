"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Destino = {
    id: string
    nombre: string
    descripcion: string | null
    pais: string | null
    ciudad: string | null
}

type Favorito = {
    id: string
    destino_id: string
    destino: Destino
}

export default function FavoritosPage() {

    const [favoritos, setFavoritos] = useState<Favorito[]>([])

    const router = useRouter()

    useEffect(() => {
        cargarFavoritos()
    }, [])

    const cargarFavoritos = async () => {

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            router.push("/login")
            return
        }

        const { data: favoritosData, error: favoritosError } =
            await supabase
                .from("favoritos")
                .select("id, destino_id")
                .eq("user_id", user.id)

        if (favoritosError) {
            console.error(
                "Error cargando favoritos:",
                favoritosError
            )
            return
        }

        if (!favoritosData || favoritosData.length === 0) {
            setFavoritos([])
            return
        }

        const destinoIds = favoritosData.map(
            (favorito) => favorito.destino_id
        )

        const { data: destinosData, error: destinosError } =
            await supabase
                .from("destinos")
                .select("id, nombre, descripcion, pais, ciudad")
                .in("id", destinoIds)

        if (destinosError) {
            console.error(
                "Error cargando destinos:",
                destinosError
            )
            return
        }

        const favoritosCompletos: Favorito[] = []

        favoritosData.forEach((favorito) => {

            const destino = destinosData?.find(
                (destino) =>
                    destino.id === favorito.destino_id
            )

            if (destino) {
                favoritosCompletos.push({
                    id: favorito.id,
                    destino_id: favorito.destino_id,
                    destino: destino,
                })
            }
        })

        setFavoritos(favoritosCompletos)
    }

    const eliminarFavorito = async (id: string) => {

        const confirmar = confirm(
            "¿Seguro que deseas eliminar este destino de favoritos?"
        )

        if (!confirmar) {
            return
        }

        const { error } = await supabase
            .from("favoritos")
            .delete()
            .eq("id", id)

        if (error) {
            alert(error.message)
            return
        }

        alert("Destino eliminado de favoritos")

        cargarFavoritos()
    }

    return (
        <section className="min-h-screen px-4 py-12">

            <div className="w-full max-w-4xl mx-auto">

                {/* Encabezado */}

                <div className="mb-10">

                    <h1 className="text-3xl font-bold text-white mb-2">
                        Mis{" "}
                        <span className="text-blue-400">
                            Favoritos
                        </span>
                    </h1>

                    <p className="text-slate-400">
                        Guarda los destinos que más te interesan.
                    </p>

                </div>


                {/* Favoritos */}

                <div>

                    <h2 className="text-xl font-bold text-white mb-6">
                        Destinos guardados
                    </h2>

                    {favoritos.length === 0 && (

                        <div className="bg-slate-800 rounded-xl p-6">

                            <p className="text-slate-400">
                                Aún no tienes destinos favoritos.
                            </p>

                        </div>

                    )}


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {favoritos.map((favorito) => (

                            <div
                                key={favorito.id}
                                className="bg-slate-800 rounded-xl p-6"
                            >

                                <h3 className="text-xl font-bold text-white mb-2">
                                    {favorito.destino.nombre}
                                </h3>


                                {favorito.destino.ciudad &&
                                    favorito.destino.pais && (

                                        <p className="text-blue-400 mb-3">
                                            📍 {favorito.destino.ciudad},{" "}
                                            {favorito.destino.pais}
                                        </p>

                                    )}


                                {favorito.destino.descripcion && (

                                    <p className="text-slate-400 mb-5">
                                        {favorito.destino.descripcion}
                                    </p>

                                )}


                                <button
                                    onClick={() =>
                                        eliminarFavorito(favorito.id)
                                    }
                                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                >
                                    Eliminar de favoritos
                                </button>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </section>
    )
}