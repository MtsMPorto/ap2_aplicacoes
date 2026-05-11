import { Navbar } from "@/components/navbar"
import { BookList } from "@/components/book-list"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Minha Biblioteca</h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie sua colecao de livros
          </p>
        </div>
        <BookList />
      </main>
    </div>
  )
}
