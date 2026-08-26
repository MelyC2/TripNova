"use server"

import { createClient } from "@/lib/supabase-server"

/* =========================
   AGREGAR FAVORITO
========================= */

export async function agregarFavorito(
    destinoId: string
) {
    const supabase = await createClient()

    // Obtener usuario autenticado
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return {
            error: "Debes iniciar sesión para guardar un favorito.",
        }
    }

    // Validar destino
    if (!destinoId) {
        return {
            error: "No se encontró el destino.",
        }
    }

    // Verificar que el destino exista
    const {
        data: destino,
        error: destinoError,
    } = await supabase
        .from("destinos")
        .select("id")
        .eq("id", destinoId)
        .single()

    if (destinoError || !destino) {
        return {
            error: "El destino no existe.",
        }
    }

    // Verificar si ya está guardado
    const {
        data: favoritoExistente,
    } = await supabase
        .from("favoritos")
        .select("id")
        .eq("user_id", user.id)
        .eq("destino_id", destinoId)
        .maybeSingle()

    if (favoritoExistente) {
        return {
            error: "Este destino ya está en tus favoritos.",
        }
    }

    // Crear favorito
    const { error } = await supabase
        .from("favoritos")
        .insert({
            user_id: user.id,
            destino_id: destinoId,
        })

    if (error) {
        console.error(
            "Error agregando favorito:",
            error
        )

        return {
            error: error.message,
        }
    }

    return {
        success: true,
    }
}


/* =========================
   ELIMINAR FAVORITO
========================= */

export async function eliminarFavorito(
    destinoId: string
) {
    const supabase = await createClient()

    // Obtener usuario autenticado
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return {
            error: "Debes iniciar sesión.",
        }
    }

    // Validar destino
    if (!destinoId) {
        return {
            error: "No se encontró el destino.",
        }
    }

    // Eliminar solamente el favorito
    // perteneciente al usuario actual
    const {
        data,
        error,
    } = await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user.id)
        .eq("destino_id", destinoId)
        .select()

    if (error) {
        console.error(
            "Error eliminando favorito:",
            error
        )

        return {
            error: error.message,
        }
    }

    if (!data || data.length === 0) {
        return {
            error: "Este destino no está en tus favoritos.",
        }
    }

    return {
        success: true,
    }
}