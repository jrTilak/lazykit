import { cn } from "@/helpers/cn"
import { Loader2Icon } from "lucide-react"

type Props = {
  className?: string
}
const Loading = ({ className }: Props) => {
  return (
    <div className={cn("flex items-center justify-center w-full h-full", className)}>
      <Loader2Icon className="size-5 animate-spin duration-300" />
    </div>
  )
}
export default Loading