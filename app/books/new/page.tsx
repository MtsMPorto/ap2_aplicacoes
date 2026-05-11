import { Navbar } from "@/components/navbar"
import { BookForm } from "@/components/book-form"

export default function NewBookPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BookForm />
      </main>
    </div>
  )
}
