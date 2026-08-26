import { supabase } from "@/lib/supabase"
import Link from "next/link"

type Destino = {
    id: string
    nombre: string
    descripcion: string | null
    pais: string | null
    ciudad: string | null
}

type PaisAPI = {
    names?: {
        common?: string
        official?: string
    }
    flag?: {
        emoji?: string
    }
    capitals?: {
        name?: string
    }[]
    region?: string
    subregion?: string
    currencies?: {
        code?: string
        name?: string
        symbol?: string
    }[]
    languages?: {
        name?: string
    }[]
    population?: number
}

type Props = {
    params: {
        id: string
    }
}

export default async function DestinoDetallePage({ params }: Props) {

    // ============================
    // BUSCAR DESTINO EN SUPABASE
    // ============================

    const { data: destino, error } = await supabase
        .from("destinos")
        .select("*")
        .eq("id", params.id)
        .single()

    if (error || !destino) {
        return (
            <section className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-2xl bg-slate-800 rounded-2xl p-8 shadow-xl">

                    <h1 className="text-2xl font-bold text-white mb-2">
                        Destino no encontrado
                    </h1>

                    <p className="text-slate-400 mb-6">
                        El destino que buscas no existe.
                    </p>

                    <Link
                        href="/destinos"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                        Volver a destinos
                    </Link>

                </div>
            </section>
        )
    }

    // ============================
    // CONSULTAR REST COUNTRIES
    // ============================

    let paisAPI: PaisAPI | null = null
    let errorAPI = false

    if (destino.pais) {

        try {

            const apiKey = process.env.REST_COUNTRIES_API_KEY

            if (!apiKey) {
                throw new Error(
                    "No existe REST_COUNTRIES_API_KEY en las variables de entorno"
                )
            }

            // Convertimos los nombres usados en TripNova a los nombres
            // que espera REST Countries.
            const nombresPais: Record<string, string> = {
                "ecuador": "Ecuador",
                "corea del sur": "South Korea",
                "perú": "Peru",
                "peru": "Peru",
                "colombia": "Colombia",
                "argentina": "Argentina",
                "chile": "Chile",
                "brasil": "Brazil",
                "méxico": "Mexico",
                "mexico": "Mexico",
                "españa": "Spain",
                "espana": "Spain",
                "francia": "France",
                "italia": "Italy",
                "japón": "Japan",
                "japon": "Japan",
                "estados unidos": "United States",
                "canadá": "Canada",
                "canada": "Canada",
            }

            const paisParaAPI =
                nombresPais[destino.pais.toLowerCase().trim()] || destino.pais

            const respuesta = await fetch(
                `https://api.restcountries.com/countries/v5/name?q=${encodeURIComponent(
                    paisParaAPI
                )}`,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        Accept: "application/json",
                    },
                    cache: "no-store",
                }
            )

            if (!respuesta.ok) {
                throw new Error(
                    `REST Countries respondió ${respuesta.status}`
                )
            }

            const resultado = await respuesta.json()

            console.log("Respuesta REST Countries:", resultado)

            // REST Countries devuelve los países dentro de data.objects
            paisAPI = resultado?.data?.objects?.[0] ?? null

            if (!paisAPI) {
                errorAPI = true
            }

        } catch (error) {

            console.error(
                "Error consultando REST Countries:",
                error
            )

            errorAPI = true
        }
    }

    // ============================
    // PROCESAR INFORMACIÓN
    // ============================

    const capital = paisAPI?.capitals?.find(
        (capital) => capital?.name
    )?.name

    const moneda = paisAPI?.currencies?.find(
        (moneda) => moneda?.name
    )

    const idiomas = paisAPI?.languages
        ?.map((idioma) => idioma?.name)
        .filter(Boolean)
        .join(", ")

    // ============================
    // INTERFAZ
    // ============================

    return (
        <section className="min-h-screen px-4 py-12">

            <div className="w-full max-w-4xl mx-auto">

                {/* INFORMACIÓN DEL DESTINO */}

                <div className="bg-slate-800 rounded-2xl p-8 shadow-xl mb-8">

                    <h1 className="text-4xl font-bold text-white mb-3">
                        {destino.nombre}
                    </h1>

                    {(destino.ciudad || destino.pais) && (
                        <p className="text-blue-400 text-lg mb-6">
                            📍 {destino.ciudad}

                            {destino.ciudad && destino.pais && ", "}

                            {destino.pais}
                        </p>
                    )}

                    <h2 className="text-xl font-bold text-white mb-3">
                        Sobre este destino
                    </h2>

                    <p className="text-slate-300 leading-relaxed">
                        {destino.descripcion ||
                            "No hay una descripción disponible para este destino."}
                    </p>

                </div>

                {/* INFORMACIÓN DEL DESTINO */}

                <div className="bg-slate-800 rounded-2xl p-8 shadow-xl mb-8">

                    <h2 className="text-2xl font-bold text-white mb-2">
                        Información del destino
                    </h2>

                    <p className="text-slate-400 mb-6">
                        Información obtenida mediante una API externa.
                    </p>

                    {paisAPI ? (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* PAÍS */}

                            <div className="bg-slate-700 rounded-xl p-5">

                                <p className="text-slate-400 text-sm mb-1">
                                    País
                                </p>

                                <p className="text-white text-xl font-semibold">
                                    {paisAPI.flag?.emoji}{" "}
                                    {paisAPI.names?.common ||
                                        "No disponible"}
                                </p>

                            </div>

                            {/* CAPITAL */}

                            <div className="bg-slate-700 rounded-xl p-5">

                                <p className="text-slate-400 text-sm mb-1">
                                    Capital
                                </p>

                                <p className="text-white font-semibold">
                                    {capital || "No disponible"}
                                </p>

                            </div>

                            {/* REGIÓN */}

                            <div className="bg-slate-700 rounded-xl p-5">

                                <p className="text-slate-400 text-sm mb-1">
                                    Región
                                </p>

                                <p className="text-white font-semibold">
                                    {paisAPI.region ||
                                        "No disponible"}
                                </p>

                            </div>

                            {/* SUBREGIÓN */}

                            <div className="bg-slate-700 rounded-xl p-5">

                                <p className="text-slate-400 text-sm mb-1">
                                    Subregión
                                </p>

                                <p className="text-white font-semibold">
                                    {paisAPI.subregion ||
                                        "No disponible"}
                                </p>

                            </div>

                            {/* MONEDA */}

                            <div className="bg-slate-700 rounded-xl p-5">

                                <p className="text-slate-400 text-sm mb-1">
                                    Moneda
                                </p>

                                <p className="text-white font-semibold">

                                    {moneda
                                        ? `${moneda.name || "No disponible"}${
                                              moneda.code
                                                  ? ` (${moneda.code})`
                                                  : ""
                                          }`
                                        : "No disponible"}

                                </p>

                            </div>

                            {/* IDIOMAS */}

                            <div className="bg-slate-700 rounded-xl p-5">

                                <p className="text-slate-400 text-sm mb-1">
                                    Idiomas
                                </p>

                                <p className="text-white font-semibold">
                                    {idiomas ||
                                        "No disponible"}
                                </p>

                            </div>

                            {/* POBLACIÓN DEL PAÍS */}

                            <div className="bg-slate-700 rounded-xl p-5">

                                <p className="text-slate-400 text-sm mb-1">
                                    Población del país
                                </p>

                                <p className="text-white font-semibold">

                                    {paisAPI.population !== undefined
                                        ? paisAPI.population.toLocaleString(
                                              "es-EC"
                                          )
                                        : "No disponible"}

                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="bg-slate-700 rounded-xl p-5">

                            <p className="text-slate-300">

                                {errorAPI
                                    ? "No se pudo obtener información adicional. Verifica que REST_COUNTRIES_API_KEY tenga una clave válida de REST Countries."
                                    : "No hay información disponible."}

                            </p>

                        </div>

                    )}

                </div>

                {/* VOLVER */}

                <Link
                    href="/destinos"
                    className="inline-block bg-slate-700 hover:bg-slate-600 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
                >
                    ← Volver a destinos
                </Link>

            </div>

        </section>
    )
}
