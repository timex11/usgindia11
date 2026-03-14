export default function ExplorePage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Explore USG India</h1>
      <p className="text-muted-foreground mb-8">Discover universities, courses, careers, and scholarships.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder cards */}
        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Universities</h2>
          <p className="text-sm text-muted-foreground">Find top institutions.</p>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Courses</h2>
          <p className="text-sm text-muted-foreground">Explore academic programs.</p>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Careers</h2>
          <p className="text-sm text-muted-foreground">Plan your future career.</p>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Scholarships</h2>
          <p className="text-sm text-muted-foreground">Financial aid opportunities.</p>
        </div>
      </div>
    </div>
  )
}
