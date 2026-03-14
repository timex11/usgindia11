import { notFound } from "next/navigation"

interface CareerPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CareerPage({ params }: CareerPageProps) {
  const { slug } = await params

  if (!slug) {
    return notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Career: {slug}</h1>
      <p className="text-muted-foreground">Career details coming soon.</p>
    </div>
  )
}
