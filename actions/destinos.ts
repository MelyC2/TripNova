"use server"

import { createClient } from "@/lib/supabase-server"

/* =========================
   CREAR DESTINO
========================= */

export async function crearDestino(formData: FormData) {
    const supabase = await createClient()

    // Obtener usuario autenticado
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return {
            error: "Debes iniciar sesión para crear un destino.",
        }
    }

    // Obtener el rol del usuario
    const {
        data: perfil,
        error: perfilError,
    } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    if (perfilError || !perfil) {
        return {
            error: "No se pudo verificar el perfil del usuario.",
        }
    }

    // Solo organizadores pueden crear destinos
    if (perfil.role !== "organizador") {
        return {
            error: "No tienes permisos para crear destinos.",
        }
    }

    // Obtener datos del formulario
    const nombre = String(
        formData.get("nombre") || ""
    ).trim()

    const descripcion = String(
        formData.get("descripcion") || ""
    ).trim()

    const pais = String(
        formData.get("pais") || ""
    ).trim()

    const ciudad = String(
        formData.get("ciudad") || ""
    ).trim()

    // Validación
    if (!nombre) {
        return {
            error: "El nombre del destino es obligatorio.",
        }
    }

    // Insertar destino
    const { error } = await supabase
        .from("destinos")
        .insert({
            user_id: user.id,
            nombre,
            descripcion: descripcion || null,
            pais: pais || null,
            ciudad: ciudad || null,
        })

    if (error) {
        console.error(
            "Error creando destino:",
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
   ACTUALIZAR DESTINO
========================= */

export async function actualizarDestino(
    destinoId: string,
    formData: FormData
) {
    const supabase = await createClient()

    // Obtener usuario autenticado
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return {
            error: "Debes iniciar sesión para editar un destino.",
        }
    }

    // Obtener el rol del usuario
    const {
        data: perfil,
        error: perfilError,
    } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    if (perfilError || !perfil) {
        return {
            error: "No se pudo verificar el perfil del usuario.",
        }
    }

    // Solo organizadores pueden editar destinos
    if (perfil.role !== "organizador") {
        return {
            error: "No tienes permisos para editar destinos.",
        }
    }

    // Obtener datos del formulario
    const nombre = String(
        formData.get("nombre") || ""
    ).trim()

    const descripcion = String(
        formData.get("descripcion") || ""
    ).trim()

    const pais = String(
        formData.get("pais") || ""
    ).trim()

    const ciudad = String(
        formData.get("ciudad") || ""
    ).trim()

    // Validación
    if (!destinoId) {
        return {
            error: "No se encontró el destino que deseas editar.",
        }
    }

    if (!nombre) {
        return {
            error: "El nombre del destino es obligatorio.",
        }
    }

    // Actualizar solamente el destino que pertenece al usuario
    const { data, error } = await supabase
        .from("destinos")
        .update({
            nombre,
            descripcion: descripcion || null,
            pais: pais || null,
            ciudad: ciudad || null,
        })
        .eq("id", destinoId)
        .eq("user_id", user.id)
        .select()

    if (error) {
        console.error(
            "Error actualizando destino:",
            error
        )

        return {
            error: error.message,
        }
    }

    // Verificar que realmente se haya actualizado
    if (!data || data.length === 0) {
        return {
            error: "No puedes editar este destino o el destino no existe.",
        }
    }

    return {
        success: true,
    }
}


/* =========================
   ELIMINAR DESTINO
========================= */

export async function eliminarDestino(
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
            error: "Debes iniciar sesión para eliminar un destino.",
        }
    }

    // Obtener el rol del usuario
    const {
        data: perfil,
        error: perfilError,
    } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    if (perfilError || !perfil) {
        return {
            error: "No se pudo verificar el perfil del usuario.",
        }
    }

    // Solo organizadores pueden eliminar destinos
    if (perfil.role !== "organizador") {
        return {
            error: "No tienes permisos para eliminar destinos.",
        }
    }

    // Validación
    if (!destinoId) {
        return {
            error: "No se encontró el destino que deseas eliminar.",
        }
    }

    // Eliminar solamente el destino que pertenece al usuario
    const { data, error } = await supabase
        .from("destinos")
        .delete()
        .eq("id", destinoId)
        .eq("user_id", user.id)
        .select()

    if (error) {
        console.error(
            "Error eliminando destino:",
            error
        )

        return {
            error: error.message,
        }
    }

    // Verificar que realmente se haya eliminado
    if (!data || data.length === 0) {
        return {
            error: "No puedes eliminar este destino o el destino no existe.",
        }
    }

    return {
        success: true,
    }
}