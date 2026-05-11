import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /livros - Retorna todos os livros (similar ao json-server)
export async function GET() {
  const supabase = await createClient()
  
  const { data: livros, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(livros)
}

// POST /livros - Cria um novo livro
export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("books")
    .insert(body)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
