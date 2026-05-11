import { Navbar } from "@/components/navbar"
import { BookForm } from "@/components/book-form"

interface EditBookPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BookForm bookId={id} />
      </main>
    </div>
  )
}
