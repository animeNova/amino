"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationButtonsProps {
  currentPage: number
  totalPages: number
}

export default function PaginationButtons({ currentPage = 1, totalPages = 10}: PaginationButtonsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    // Create a new URLSearchParams object with the current params
    const params = new URLSearchParams(searchParams.toString())
    
    // Update the page parameter
    params.set("page", page.toString())
    
    // Update the URL with the new search params
    router.push(`?${params.toString()}`)
    
  
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>
        <PaginationItem>
          <span className="flex h-9 items-center justify-center px-4 text-sm">
            Page {currentPage} of {totalPages}
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
