"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function RegistroPage() {
    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("viajero")

    const handleRegistro = async () => {

        if (!nombre || !email || !password) {
            alert("Completa todos los campos")
            return
        }

        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: nombre,
                    role: role,
                },
            },
        })

        if (error) {
            alert(error.message)
            return
        }

        alert("Cuenta creada correctamente. Revisa tu correo.")
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl">

                {/* Título */}
                <h1 className="text-2xl font-bold text-white mb-2">
                    Crear cuenta
                </h1>

                <p className="text-slate-400 mb-8">
                    Únete a TripNova y disfruta tus viajes
                </p>

                {/* Campos del formulario */}
                <div className="flex flex-col gap-4">

                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />

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

                    {/* Rol */}
                    <div className="bg-slate-700 rounded-lg px-4 py-3 border border-slate-600">

                        <p className="text-slate-400 text-sm mb-3">
                            Tipo de usuario
                        </p>

                        <div className="flex flex-col gap-3">

                            <label className="flex items-center gap-3 text-white cursor-pointer">

                                <input
                                    type="radio"
                                    name="role"
                                    value="viajero"
                                    checked={role === "viajero"}
                                    onChange={(e) => setRole(e.target.value)}
                                />

                                Viajero
                            </label>

                            <label className="flex items-center gap-3 text-white cursor-pointer">

                                <input
                                    type="radio"
                                    name="role"
                                    value="organizador"
                                    checked={role === "organizador"}
                                    onChange={(e) => setRole(e.target.value)}
                                />

                                Organizador
                            </label>

                        </div>

                    </div>

                    <button
                        onClick={handleRegistro}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Crear cuenta
                    </button>

                    <p className="text-slate-400 text-center">
                        ¿Ya tienes una cuenta?{" "}

                        <Link
                            href="/login"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Inicia sesión
                        </Link>
                    </p>

                </div>
            </div>
        </section>
    )
}