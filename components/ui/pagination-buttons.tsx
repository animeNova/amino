"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronFirst, ChevronLast } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { useState } from "react"

interface PaginationButtonsProps {
  currentPage: number
  totalPages: number
  siblingsCount?: number
  showFirstLast?: boolean
}

export default function PaginationButtons({
  currentPage,
  totalPages,
  siblingsCount = 1,
  showFirstLast = true
}: PaginationButtonsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useMobile()
  const [jumpPageValue, setJumpPageValue] = useState<string>("")

  // Convert currentPage to number if it's a string
  const page = typeof currentPage === 'string' ? parseInt(currentPage, 10) : currentPage || 1
  
  // Adjust siblings count based on screen size and total pages
  let effectiveSiblingsCount = isMobile ? 0 : siblingsCount
  
  // For very large page counts, reduce siblings count even on desktop
  if (totalPages > 50 && !isMobile) {
    effectiveSiblingsCount = 1
  }

  const handlePageChange = (newPage: number) => {
    // Create a new URLSearchParams object with the current params
    const params = new URLSearchParams(searchParams.toString())
    
    // Update the page parameter
    params.set("page", newPage.toString())
    
    // Update the URL with the new search params
    router.push(`?${params.toString()}`)
  }

  const handleJumpToPage = () => {
    const value = parseInt(jumpPageValue, 10)
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      handlePageChange(value)
      setJumpPageValue("")
    }
  }

  // Generate page numbers to display
  const generatePagination = () => {
    // For mobile, show fewer pages
    const maxPagesWithoutEllipsis = isMobile ? 3 : 7
    
    // For very large page counts, reduce visible pages even on desktop
    const adjustedMaxPages = totalPages > 50 ? 5 : maxPagesWithoutEllipsis
    
    // If we have fewer pages than our threshold, show all pages without ellipsis
    if (totalPages <= adjustedMaxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Calculate the range of pages to show around the current page
    const leftSiblingIndex = Math.max(page - effectiveSiblingsCount, 1)
    const rightSiblingIndex = Math.min(page + effectiveSiblingsCount, totalPages)

    // Determine whether to show ellipsis
    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1

    // Always show first and last page
    if (shouldShowLeftDots && shouldShowRightDots) {
      // Show first, last, and pages around current
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      )
      return [1, 'leftEllipsis', ...middleRange, 'rightEllipsis', totalPages]
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      // Show more pages at the beginning
      const leftRange = Array.from({ length: rightSiblingIndex + 1 }, (_, i) => i + 1)
      return [...leftRange, 'rightEllipsis', totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      // Show more pages at the end
      const rightRange = Array.from(
        { length: totalPages - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      )
      return [1, 'leftEllipsis', ...rightRange]
    }

    // Fallback - should not reach here with our conditions
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const paginationRange = generatePagination()

  if (totalPages <= 1) {
    return null
  }

  // Add a jump to page input for large page counts
  const showJumpToPage = totalPages > 10
  // For very large page counts, make the jump feature more prominent
  const isVeryLargePageCount = totalPages > 50

  return (
    <Pagination className="mt-8">
      <PaginationContent className={`flex flex-wrap justify-center gap-1 ${isVeryLargePageCount ? 'flex-col sm:flex-row' : ''}`}>
        <div className="flex flex-wrap items-center justify-center">
          {showFirstLast && page > 1 && (
            <PaginationItem className="hidden sm:inline-block">
              <PaginationLink
                onClick={() => handlePageChange(1)}
                className="cursor-pointer hover:bg-muted"
                aria-label="Go to first page"
              >
                <ChevronFirst className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          )}
          
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && handlePageChange(page - 1)}
              className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"}
              aria-disabled={page <= 1}
            />
          </PaginationItem>

          {/* Only show page numbers on larger screens */}
          <div className="hidden sm:flex">
            {paginationRange.map((pageNumber, i) => {
              if (pageNumber === 'leftEllipsis' || pageNumber === 'rightEllipsis') {
                return (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pageNumber === page}
                    onClick={() => handlePageChange(pageNumber as number)}
                    className={
                      pageNumber === page
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "cursor-pointer hover:bg-muted"
                    }
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
          </div>

          {/* On mobile, just show current page indicator */}
          <div className="sm:hidden">
            <span className="px-2 py-1 text-sm">
              {page} / {totalPages}
            </span>
          </div>

          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPages && handlePageChange(page + 1)}
              className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"}
              aria-disabled={page >= totalPages}
            />
          </PaginationItem>

          {showFirstLast && page < totalPages && (
            <PaginationItem className="hidden sm:inline-block">
              <PaginationLink
                onClick={() => handlePageChange(totalPages)}
                className="cursor-pointer hover:bg-muted"
                aria-label="Go to last page"
              >
                <ChevronLast className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          )}
        </div>

        {/* Jump to page input for large page counts */}
        {showJumpToPage && (
          <div className={`flex items-center gap-2 ${isVeryLargePageCount ? 'mt-2 justify-center sm:mt-0 sm:ml-4' : 'ml-2 sm:ml-4'}`}>
            <span className="text-xs text-muted-foreground">Jump to:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpPageValue}
              onChange={(e) => setJumpPageValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleJumpToPage()
                }
              }}
              className={`h-8 rounded-md border border-input bg-background px-2 text-xs ${isVeryLargePageCount ? 'w-16' : 'w-12'}`}
              placeholder={`1-${totalPages}`}
              aria-label="Jump to page"
            />
            {isVeryLargePageCount && (
              <button
                onClick={handleJumpToPage}
                className="h-8 rounded-md bg-primary px-2 text-xs text-primary-foreground hover:bg-primary/90"
              >
                Go
              </button>
            )}
          </div>
        )}

        {/* Page size indicator for very large page counts */}
        {isVeryLargePageCount && (
          <div className="mt-2 text-center text-xs text-muted-foreground sm:mt-0 sm:ml-2">
            Showing page {page} of {totalPages}
          </div>
        )}
      </PaginationContent>
    </Pagination>
  )
}
