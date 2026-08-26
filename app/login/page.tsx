"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    if (error) {
        alert(error.message)
        return
    }

    window.location.href = "/dashboard"
}

    return (
        <section className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl">

                {/* Título */}
                <h1 className="text-2xl font-bold text-white mb-2">
                    Iniciar sesión
                </h1>

                <p className="text-slate-400 mb-8">
                    Accede a tu cuenta de TripNova
                </p>

                {/* Campos del formulario */}
                <div className="flex flex-col gap-4">

                    <input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />

                    <button
                        onClick={handleLogin}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Iniciar sesión
                    </button>

                    <p className="text-slate-400 text-center">
                        ¿No tienes una cuenta?{" "}
                        <Link
                            href="/registro"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Regístrate
                        </Link>
                    </p>

                </div>
            </div>
        </section>
    )
}