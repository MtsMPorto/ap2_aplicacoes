"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Book, BookFormData } from "@/lib/types/book"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

interface BookFormProps {
  bookId?: string
}

const GENRES = [
  "Ficcao",
  "Nao-Ficcao",
  "Romance",
  "Misterio",
  "Fantasia",
  "Ficcao Cientifica",
  "Terror",
  "Biografia",
  "Historia",
  "Autoajuda",
  "Negocios",
  "Infantil",
  "Poesia",
  "Drama",
  "Aventura",
]

export function BookForm({ bookId }: BookFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = Boolean(bookId)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    description: "",
    publication_year: null,
    genre: "",
  })

  useEffect(() => {
    if (bookId) {
      fetchBook(bookId)
    }
  }, [bookId])

  async function fetchBook(id: string) {
    setFetching(true)
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Erro ao buscar livro:", error)
      router.push("/")
    } else if (data) {
      setFormData({
        title: data.title,
        author: data.author,
        description: data.description || "",
        publication_year: data.publication_year,
        genre: data.genre || "",
      })
    }
    setFetching(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const bookData = {
      ...formData,
      description: formData.description || null,
      genre: formData.genre || null,
      updated_at: new Date().toISOString(),
    }

    let error

    if (isEditing && bookId) {
      const result = await supabase
        .from("books")
        .update(bookData)
        .eq("id", bookId)
      error = result.error
    } else {
      const result = await supabase.from("books").insert([bookData])
      error = result.error
    }

    if (error) {
      console.error("Erro ao salvar livro:", error)
      setLoading(false)
    } else {
      router.push("/")
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <CardTitle>{isEditing ? "Editar Livro" : "Novo Livro"}</CardTitle>
            <CardDescription>
              {isEditing
                ? "Atualize as informacoes do livro"
                : "Preencha as informacoes para cadastrar um novo livro"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titulo *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Digite o titulo do livro"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Autor *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              placeholder="Digite o nome do autor"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descricao</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Digite uma descricao do livro"
              rows={4}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="publication_year">Ano de Publicacao</Label>
              <Input
                id="publication_year"
                type="number"
                value={formData.publication_year || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publication_year: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                placeholder="Ex: 2023"
                min={1000}
                max={new Date().getFullYear()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genero</Label>
              <select
                id="genre"
                value={formData.genre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Selecione um genero</option>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Atualizar" : "Cadastrar"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
