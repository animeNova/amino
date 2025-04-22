"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"

import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { useUpdateSearchParam } from "@/hooks/use-search-params"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
// Filter types
export type FilterOptions = {
    search: string
    sort: "trending" | "newest" | "oldest" | "alphabetical" | "members"
    timeRange: "today" | "week" | "month" | "year" | "all"
    genres: string[]
    sizes: ("small" | "medium" | "large" | "xlarge")[]
    activities: ("very-active" | "active" | "moderate" | "low")[]
}
// Define genre options
const genreOptions = [
  "Technology",
  "Arts & Culture",
  "Health & Wellness",
  "Gaming",
  "Education",
  "Food & Cooking",
  "Travel",
  "Sports & Fitness",
  "Music",
  "Movies & TV",
  "Books & Literature",
  "Science",
  "Fashion",
  "Photography",
  "Pets & Animals",
]

// Define size options
const sizeOptions = [
  { id: "small", label: "Small (< 1k members)" },
  { id: "medium", label: "Medium (1k-10k members)" },
  { id: "large", label: "Large (10k-100k members)" },
  { id: "xlarge", label: "X-Large (> 100k members)" },
]

// Define activity options
const activityOptions = [
  { id: "very-active", label: "Very Active" },
  { id: "active", label: "Active" },
  { id: "moderate", label: "Moderate" },
  { id: "low", label: "Low Activity" },
]

interface MobileFilterBarProps {
  initialFilters?: Partial<FilterOptions>
  className?: string
}

export function FilterBar({ initialFilters, className = "" }: MobileFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize filters from URL params or defaults
  const [filters, setFilters] = useState<FilterOptions>({
    search: searchParams.get("search") || initialFilters?.search || "",
    sort: (searchParams.get("sort") as FilterOptions["sort"]) || initialFilters?.sort || "trending",
    timeRange: (searchParams.get("timeRange") as FilterOptions["timeRange"]) || initialFilters?.timeRange || "all",
    genres: searchParams.get("genres") ? searchParams.get("genres")!.split(",") : initialFilters?.genres || [],
    sizes: searchParams.get("sizes") 
      ? (searchParams.get("sizes")!.split(",") as FilterOptions["sizes"]) 
      : initialFilters?.sizes || [],
    activities: searchParams.get("activities") 
      ? (searchParams.get("activities")!.split(",") as FilterOptions["activities"]) 
      : initialFilters?.activities || [],
  })
  
  const debouncedSearch = useDebounce(filters.search, 500)
  
  // Use the useUpdateSearchParam hook for each filter parameter
  useUpdateSearchParam({ 
    paramName: "search", 
    value: debouncedSearch 
  })
  
  useUpdateSearchParam({ 
    paramName: "sort", 
    value: filters.sort !== "trending" ? filters.sort : "" 
  })
  
  useUpdateSearchParam({ 
    paramName: "timeRange", 
    value: filters.timeRange !== "all" ? filters.timeRange : "" 
  })
  
  useUpdateSearchParam({ 
    paramName: "genres", 
    value: filters.genres.length > 0 ? filters.genres.join(",") : "" 
  })
  
  useUpdateSearchParam({ 
    paramName: "sizes", 
    value: filters.sizes.length > 0 ? filters.sizes.join(",") : "" 
  })
  
  useUpdateSearchParam({ 
    paramName: "activities", 
    value: filters.activities.length > 0 ? filters.activities.join(",") : "" 
  })

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }))
  }

  // Handle sort option changes
  const handleSortChange = (sort: string) => {
    setFilters(prev => ({ ...prev, sort: sort as any }))
  }

  // Handle time range changes
  const handleTimeRangeChange = (timeRange: string) => {
    setFilters(prev => ({ ...prev, timeRange: timeRange as any }))
  }

  // Handle genre changes
  const handleGenreChange = (genre: string, checked: boolean) => {
    const newGenres = checked 
      ? [...filters.genres, genre] 
      : filters.genres.filter((g) => g !== genre)
    setFilters(prev => ({ ...prev, genres: newGenres }))
  }

  // Handle size changes
  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked 
      ? [...filters.sizes, size as any] 
      : filters.sizes.filter((s) => s !== size)
    setFilters(prev => ({ ...prev, sizes: newSizes as any }))
  }

  // Handle activity changes
  const handleActivityChange = (activity: string, checked: boolean) => {
    const newActivities = checked 
      ? [...filters.activities, activity as any] 
      : filters.activities.filter((a) => a !== activity)
    setFilters(prev => ({ ...prev, activities: newActivities as any }))
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      search: "",
      sort: "trending",
      timeRange: "all",
      genres: [],
      sizes: [],
      activities: [],
    })
    router.push(window.location.pathname, { scroll: false })
  }

  // Count active filters
  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.sort !== "trending" ? 1 : 0) +
    (filters.timeRange !== "all" ? 1 : 0) +
    filters.genres.length +
    filters.sizes.length +
    filters.activities.length

  // Get the first 3 active genres for display
  const activeGenres = filters.genres.slice(0, 3)
  const hasMoreGenres = filters.genres.length > 3

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Filter buttons row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              {filters.sort === "trending"
                ? "Trending"
                : filters.sort === "newest"
                  ? "Newest"
                  : filters.sort === "oldest"
                    ? "Oldest"
                    : filters.sort === "alphabetical"
                      ? "A-Z"
                      : "Most Members"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={filters.sort} onValueChange={handleSortChange}>
              <DropdownMenuRadioItem value="trending">Trending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="alphabetical">A-Z</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="members">Most Members</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Time range dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              {filters.timeRange === "today"
                ? "Today"
                : filters.timeRange === "week"
                  ? "This Week"
                  : filters.timeRange === "month"
                    ? "This Month"
                    : filters.timeRange === "year"
                      ? "This Year"
                      : "All Time"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={filters.timeRange} onValueChange={handleTimeRangeChange}>
              <DropdownMenuRadioItem value="today">Today</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="week">This Week</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="month">This Month</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="year">This Year</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="all">All Time</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active genre filters */}
        {activeGenres.map((genre : any) => (
          <Badge key={genre} variant="secondary" className="h-8 gap-1 px-2">
            {genre}
            <X className="h-3 w-3 cursor-pointer" onClick={() => handleGenreChange(genre, false)} />
          </Badge>
        ))}
        {hasMoreGenres && (
          <Badge variant="secondary" className="h-8 px-2">
            +{filters.genres.length - 3}
          </Badge>
        )}

        {/* More filters button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 py-0">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your community search</SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(80vh-10rem)] pr-4">
              <div className="space-y-6 py-4">
                {/* Genres section */}
                <div className="space-y-4">
                  <h4 className="font-medium">Genres</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {genreOptions.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-genre-${genre}`}
                          checked={filters.genres.includes(genre)}
                          onCheckedChange={(checked) => handleGenreChange(genre, checked === true)}
                        />
                        <label
                          htmlFor={`mobile-genre-${genre}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Community size section */}
                <div className="space-y-4">
                  <h4 className="font-medium">Community Size</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {sizeOptions.map((size) => (
                      <div key={size.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-size-${size.id}`}
                          checked={filters.sizes.includes(size.label as any)}
                          onCheckedChange={(checked) => handleSizeChange(size.id, checked === true)}
                        />
                        <label
                          htmlFor={`mobile-size-${size.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {size.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Activity level section */}
                <div className="space-y-4">
                  <h4 className="font-medium">Activity Level</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {activityOptions.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-activity-${activity.id}`}
                          checked={filters.activities.includes(activity.label as any)}
                          onCheckedChange={(checked) => handleActivityChange(activity.id, checked === true)}
                        />
                        <label
                          htmlFor={`mobile-activity-${activity.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {activity.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
            <SheetFooter className="flex-row justify-between gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={clearAllFilters}>
                Clear All
              </Button>
              <Button className="flex-1">Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Full-width search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search communities..."
          className="pl-9"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  )
}
