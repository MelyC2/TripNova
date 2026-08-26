"use server"

import { createClient } from "@/lib/supabase-server"

/* =========================
   CREAR EXPERIENCIA
========================= */

export async function crearExperiencia(formData: FormData) {
    const supabase = await createClient()

    // Obtener usuario autenticado
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return {
            error: "Debes iniciar sesión para crear una experiencia.",
        }
    }

    // Obtener datos del formulario
    const titulo = String(
        formData.get("titulo") || ""
    ).trim()

    const descripcion = String(
        formData.get("descripcion") || ""
    ).trim()

    const destino = String(
        formData.get("destino") || ""
    ).trim()

    const fecha = String(
        formData.get("fecha") || ""
    ).trim()

    // Validación
    if (!titulo) {
        return {
            error: "El título de la experiencia es obligatorio.",
        }
    }

    // Insertar experiencia
    const { error } = await supabase
        .from("experiencias")
        .insert({
            user_id: user.id,
            titulo,
            descripcion: descripcion || null,
            destino: destino || null,
            fecha: fecha || null,
        })

    if (error) {
        console.error(
            "Error creando experiencia:",
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
   ACTUALIZAR EXPERIENCIA
========================= */

export async function actualizarExperiencia(
    experienciaId: string,
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
            error: "Debes iniciar sesión para editar una experiencia.",
        }
    }

    // Validar ID
    if (!experienciaId) {
        return {
            error: "No se encontró la experiencia que deseas editar.",
        }
    }

    // Obtener datos del formulario
    const titulo = String(
        formData.get("titulo") || ""
    ).trim()

    const descripcion = String(
        formData.get("descripcion") || ""
    ).trim()

    const destino = String(
        formData.get("destino") || ""
    ).trim()

    const fecha = String(
        formData.get("fecha") || ""
    ).trim()

    // Validación
    if (!titulo) {
        return {
            error: "El título de la experiencia es obligatorio.",
        }
    }

    // Actualizar solamente la experiencia del usuario autenticado
    const { data, error } = await supabase
        .from("experiencias")
        .update({
            titulo,
            descripcion: descripcion || null,
            destino: destino || null,
            fecha: fecha || null,
        })
        .eq("id", experienciaId)
        .eq("user_id", user.id)
        .select()

    if (error) {
        console.error(
            "Error actualizando experiencia:",
            error
        )

        return {
            error: error.message,
        }
    }

    // Verificar que realmente se haya actualizado
    if (!data || data.length === 0) {
        return {
            error: "No puedes editar esta experiencia o la experiencia no existe.",
        }
    }

    return {
        success: true,
    }
}


/* =========================
   ELIMINAR EXPERIENCIA
========================= */

export async function eliminarExperiencia(
    experienciaId: string
) {
    const supabase = await createClient()

    // Obtener usuario autenticado
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return {
            error: "Debes iniciar sesión para eliminar una experiencia.",
        }
    }

    // Validar ID
    if (!experienciaId) {
        return {
            error: "No se encontró la experiencia que deseas eliminar.",
        }
    }

    // Eliminar solamente la experiencia del usuario autenticado
    const { data, error } = await supabase
        .from("experiencias")
        .delete()
        .eq("id", experienciaId)
        .eq("user_id", user.id)
        .select()

    if (error) {
        console.error(
            "Error eliminando experiencia:",
            error
        )

        return {
            error: error.message,
        }
    }

    // Verificar que realmente se haya eliminado
    if (!data || data.length === 0) {
        return {
            error: "No puedes eliminar esta experiencia o la experiencia no existe.",
        }
    }

    return {
        success: true,
    }
}