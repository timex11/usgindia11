import { notFound } from "next/navigation"

interface CoursePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params

  if (!slug) {
    return notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Course: {slug}</h1>
      <p className="text-muted-foreground">Course details coming soon.</p>
    </div>
  )
}
