"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { Book } from "@/lib/types/book"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, BookOpen, Calendar, User } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    setLoading(true)
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar livros:", error)
    } else {
      setBooks(data || [])
    }
    setLoading(false)
  }

  async function deleteBook(id: string) {
    setDeletingId(id)
    const { error } = await supabase.from("books").delete().eq("id", id)

    if (error) {
      console.error("Erro ao deletar livro:", error)
    } else {
      setBooks(books.filter((book) => book.id !== id))
    }
    setDeletingId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Nenhum livro cadastrado</CardTitle>
          <CardDescription>
            Comece adicionando seu primeiro livro à biblioteca.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/books/new">
            <Button>Adicionar Livro</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Card key={book.id} className="flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {book.author}
                </CardDescription>
              </div>
              {book.genre && (
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {book.genre}
                </span>
              )}
            </div>
            {book.description && (
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {book.description}
              </p>
            )}
            {book.publication_year && (
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Publicado em {book.publication_year}</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Link href={`/books/${book.id}/edit`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === book.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o livro &quot;{book.title}&quot;?
                      Esta acao nao pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteBook(book.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
