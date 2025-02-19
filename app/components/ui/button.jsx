import { cn } from "@/lib/utils";

export function Button({ children, variant = "default", ...props }) {
  const variants = {
    default: "bg-blue-500 text-white px-4 py-2 rounded",
    destructive: "bg-red-500 text-white px-4 py-2 rounded"
  };

  return <button className={cn(variants[variant])} {...props}>{children}</button>;
}
