"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { crearDestino } from "@/actions/destinos"

export default function NuevoDestinoPage() {
    const router = useRouter()

    const [error, setError] = useState("")
    const [cargando, setCargando] = useState(false)

    async function handleSubmit(formData: FormData) {
        setError("")
        setCargando(true)

        const resultado = await crearDestino(formData)

        if (resultado?.error) {
            setError(resultado.error)
            setCargando(false)
            return
        }

        router.push("/destinos")
        router.refresh()
    }

    return (
        <section className="min-h-screen px-4 py-12">
            <div className="max-w-2xl mx-auto">

                <div className="bg-slate-800 rounded-2xl p-8 shadow-xl">

                    <h1 className="text-3xl font-bold text-white mb-2">
                        Crear nuevo destino
                    </h1>

                    <p className="text-slate-400 mb-8">
                        Agrega un nuevo destino turístico a TripNova.
                    </p>

                    <form action={handleSubmit} className="space-y-6">

                        {/* NOMBRE */}

                        <div>
                            <label
                                htmlFor="nombre"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Nombre del destino
                            </label>

                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                required
                                placeholder="Ej. Baños de Agua Santa"
                                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* DESCRIPCIÓN */}

                        <div>
                            <label
                                htmlFor="descripcion"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Descripción
                            </label>

                            <textarea
                                id="descripcion"
                                name="descripcion"
                                rows={5}
                                placeholder="Describe el destino turístico..."
                                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* PAÍS */}

                        <div>
                            <label
                                htmlFor="pais"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                País
                            </label>

                            <input
                                id="pais"
                                name="pais"
                                type="text"
                                placeholder="Ej. Ecuador"
                                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* CIUDAD */}

                        <div>
                            <label
                                htmlFor="ciudad"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Ciudad
                            </label>

                            <input
                                id="ciudad"
                                name="ciudad"
                                type="text"
                                placeholder="Ej. Baños"
                                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* ERROR */}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">
                                {error}
                            </div>
                        )}

                        {/* BOTÓN */}

                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            {cargando
                                ? "Creando destino..."
                                : "Crear destino"}
                        </button>

                    </form>

                </div>

            </div>
        </section>
    )
}