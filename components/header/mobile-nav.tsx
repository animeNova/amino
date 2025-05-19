import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, MountainIcon } from "lucide-react"

export default function Component() {
  return (
    <header className="flex h-20 w-full shrink-0 items-center ">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <div className="grid gap-2 py-6">
            <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              Home
            </Link>
            <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              About
            </Link>
            <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              Services
            </Link>
            <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              Contact
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

