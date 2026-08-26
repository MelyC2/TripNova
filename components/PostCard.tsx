interface PostCardProps {
    id: string
    nombre: string
    descripcion: string | null
    pais: string | null
    ciudad: string | null
}

export default function PostCard({
    id,
    nombre,
    descripcion,
    pais,
    ciudad,
}: PostCardProps) {

    return (

        <article className="bg-slate-800 rounded-2xl p-6 shadow-lg hover:bg-slate-700 transition-colors border border-slate-700">

            {/* INFORMACIÓN DEL DESTINO */}

            <div className="flex justify-between items-start mb-4">

                <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                    Destino
                </span>

            </div>

            {/* NOMBRE */}

            <h2 className="text-xl font-bold text-white mb-2">
                {nombre}
            </h2>

            {/* UBICACIÓN */}

            {(ciudad || pais) && (

                <p className="text-blue-400 text-sm mb-4">
                    📍 {ciudad}

                    {ciudad && pais && ", "}

                    {pais}
                </p>

            )}

            {/* DESCRIPCIÓN */}

            <p className="text-slate-400 text-sm mb-5">
                {descripcion ||
                    "No hay una descripción disponible para este destino."}
            </p>

            {/* BOTÓN */}

            <a
                href={`/destinos/${id}`}
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm text-center"
            >
                Ver detalles →
            </a>

        </article>
    )
}
