import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Rutas privadas
    const rutasPrivadas = [
        "/dashboard",
        "/mis-viajes",
        "/favoritos",
    ]

    const esRutaPrivada = rutasPrivadas.some(
        (ruta) => request.nextUrl.pathname.startsWith(ruta)
    )

    // Si no hay sesión, redirigir al login
    if (!user && esRutaPrivada) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        )
    }

    return response
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/mis-viajes/:path*",
        "/favoritos/:path*",
    ],
}