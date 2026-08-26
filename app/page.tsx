import Link from "next/link"

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">

            {/* Título principal */}
            <h1 className="text-5xl font-bold text-white text-center mb-4">
                Bienvenido a{" "}
                <span className="text-blue-400">
                    TripNova
                </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-lg text-slate-400 max-w-md text-center mb-8">
                Una plataforma que te permitirá descubrir destinos,
                planificar viajes y vivir nuevas experiencias.
            </p>

            {/* Botones principales */}
            <div className="flex flex-col sm:flex-row gap-4">

                <Link
                    href="/destinos"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-center"
                >
                    Explorar destinos
                </Link>

                <Link
                    href="/mis-viajes"
                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-center"
                >
                    Planificar mi viaje
                </Link>

            </div>

        </main>
    )
}