"use client"

import * as React from "react"
import {
  User,
  Rocket,
  LayoutDashboard,
  Building,
  BookOpen,
  Briefcase,
  Loader2
} from "lucide-react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { useRouter } from "next/navigation"

import { useUIStore } from "@/store/useUIStore"
import { useApi } from "@/hooks/useApi"
import { useDebounce } from "@/hooks/useDebounce"

interface SearchResult {
  id: string;
  title: string;
  type: 'university' | 'scholarship' | 'job';
  href: string;
}

export function GlobalSearch() {
  const { isSearchOpen, setSearchOpen } = useUIStore()
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const { get } = useApi()

  React.useEffect(() => {
    let isMounted = true;

    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const data = await get<SearchResult[]>(`/system/search?q=${encodeURIComponent(debouncedQuery)}`)
        if (isMounted) {
          setResults(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        if (isMounted) {
          console.error("Search failed:", error)
          setResults([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchResults()

    return () => {
      isMounted = false
    }
  }, [debouncedQuery, get])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(!isSearchOpen)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [isSearchOpen, setSearchOpen])

  const runCommand = React.useCallback((command: () => unknown) => {
    setSearchOpen(false)
    setQuery("")
    command()
  }, [setSearchOpen])

  return (
    <CommandDialog open={isSearchOpen} onOpenChange={setSearchOpen}>
      <CommandInput 
        placeholder="Search for scholarships, jobs, universities..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Searching...</span>
          </div>
        )}
        
        {!isLoading && query.length >= 2 && results.length === 0 && (
          <CommandEmpty>No results found for {"\""}{query}{"\""}.</CommandEmpty>
        )}

        {results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map((result) => (
              <CommandItem 
                key={`${result.type}-${result.id}`} 
                onSelect={() => runCommand(() => router.push(result.href))}
              >
                {result.type === 'university' && <Building className="mr-2 h-4 w-4" />}
                {result.type === 'scholarship' && <Rocket className="mr-2 h-4 w-4" />}
                {result.type === 'job' && <Briefcase className="mr-2 h-4 w-4" />}
                <span>{result.title}</span>
                <span className="ml-auto text-xs text-muted-foreground capitalize">{result.type}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Platform">
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/profile'))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Discovery">
          <CommandItem onSelect={() => runCommand(() => router.push('/universities'))}>
            <Building className="mr-2 h-4 w-4" />
            <span>Universities</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/scholarships'))}>
            <Rocket className="mr-2 h-4 w-4" />
            <span>Scholarships</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/jobs'))}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Jobs</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/courses'))}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Courses</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
