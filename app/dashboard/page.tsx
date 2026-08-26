"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {

    const [nombre, setNombre] = useState("")
    const [misViajes, setMisViajes] = useState(0)
    const [proximosViajes, setProximosViajes] = useState(0)
    const [experiencias, setExperiencias] = useState(0)

    const router = useRouter()

    useEffect(() => {

        const cargarDashboard = async () => {

            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push("/login")
                return
            }

            // Obtener perfil
            const { data: perfil } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("id", user.id)
                .single()

            if (perfil) {
                setNombre(perfil.full_name)
            }

            // Obtener viajes del usuario
            const { data: viajes, error: errorViajes } = await supabase
                .from("viajes")
                .select("*")
                .eq("user_id", user.id)

            if (errorViajes) {
                console.error("Error obteniendo viajes:", errorViajes)
                return
            }

            setMisViajes(viajes.length)

            // Contar próximos viajes
            const hoy = new Date()

            hoy.setHours(0, 0, 0, 0)

            const proximos = viajes.filter((viaje) => {

                if (!viaje.fecha_inicio) {
                    return false
                }

                const fecha = new Date(viaje.fecha_inicio)

                fecha.setHours(0, 0, 0, 0)

                return fecha >= hoy
            })

            setProximosViajes(proximos.length)

            // Obtener experiencias del usuario
            const { data: experienciasData, error: errorExperiencias } =
                await supabase
                    .from("experiencias")
                    .select("id")
                    .eq("user_id", user.id)

            if (errorExperiencias) {
                console.error(
                    "Error obteniendo experiencias:",
                    errorExperiencias
                )
                return
            }

            setExperiencias(experienciasData.length)
        }

        cargarDashboard()

    }, [router])

    const cerrarSesion = async () => {

        await supabase.auth.signOut()

        router.push("/login")
    }

    return (
        <section className="max-w-4xl mx-auto px-6 py-12">

            {/* Encabezado */}

            <div className="mb-10">

                <h1 className="text-3xl font-bold text-white mb-2">
                    Mi panel
                </h1>

                <p className="text-slate-400">
                    Bienvenido de vuelta
                    {nombre ? `, ${nombre}` : ""}.
                    Gestiona tus viajes.
                </p>

            </div>


            {/* Cards */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1 */}

                <div className="bg-slate-800 rounded-xl p-6">

                    <p className="text-slate-400 text-sm mb-1">
                        Mis viajes
                    </p>

                    <p className="text-3xl font-bold text-white">
                        {misViajes}
                    </p>

                </div>


                {/* Card 2 */}

                <div className="bg-slate-800 rounded-xl p-6">

                    <p className="text-slate-400 text-sm mb-1">
                        Próximos viajes
                    </p>

                    <p className="text-3xl font-bold text-white">
                        {proximosViajes}
                    </p>

                </div>


                {/* Card 3 */}

                <div className="bg-slate-800 rounded-xl p-6">

                    <p className="text-slate-400 text-sm mb-1">
                        Experiencias
                    </p>

                    <p className="text-3xl font-bold text-white">
                        {experiencias}
                    </p>

                </div>

            </div>


            {/* Cerrar sesión */}

            <div className="mt-8">

                <button
                    onClick={cerrarSesion}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                    Cerrar sesión
                </button>

            </div>

        </section>
    )
}