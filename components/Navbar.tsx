import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex justify-between items-center">

            <Link
                href="/"
                className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
            >
                ✈️ TripNova
            </Link>

            <div className="flex items-center gap-6">

                <Link
                    href="/"
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    Inicio
                </Link>

                <Link
                    href="/destinos"
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    Destinos
                </Link>

                <Link
                    href="/experiencias"
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    Experiencias
                </Link>

                <Link
                    href="/mis-viajes"
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    Mis viajes
                </Link>

                <Link
                    href="/favoritos"
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    Mis favoritos
                </Link>

                <Link
                    href="/dashboard"
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    Dashboard
                </Link>

                <Link
                    href="/login"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                    Login
                </Link>

            </div>
        </nav>
    )
}