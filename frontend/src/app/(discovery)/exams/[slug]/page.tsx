import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ExamPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { slug } = await params

  if (!slug) {
    return notFound()
  }

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-4xl font-bold mb-2 uppercase tracking-tight">{slug.replace(/-/g, ' ')}</h1>
        <p className="text-xl text-muted-foreground">Comprehensive exam details, syllabus, and pattern.</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="pattern">Pattern</TabsTrigger>
          <TabsTrigger value="cutoffs">Cutoffs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Exam Overview</CardTitle>
              <CardDescription>Key details about the exam.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>The {slug.replace(/-/g, ' ')} is a highly competitive examination...</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="border p-4 rounded-md">
                    <h4 className="font-semibold text-sm text-muted-foreground">Conducting Body</h4>
                    <p>National Testing Agency</p>
                </div>
                <div className="border p-4 rounded-md">
                    <h4 className="font-semibold text-sm text-muted-foreground">Mode of Exam</h4>
                    <p>Computer Based Test (CBT)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="syllabus">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Syllabus</CardTitle>
              <CardDescription>Subject-wise breakdown of topics.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Syllabus content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pattern">
          <Card>
            <CardHeader>
              <CardTitle>Exam Pattern</CardTitle>
              <CardDescription>Marking scheme and structure.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Pattern content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cutoffs">
          <Card>
            <CardHeader>
              <CardTitle>Previous Year Cutoffs</CardTitle>
              <CardDescription>Historical trends and category-wise cutoffs.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Cutoff data goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
