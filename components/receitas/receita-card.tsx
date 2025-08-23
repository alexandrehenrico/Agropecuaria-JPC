import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Tag, UserCheck } from "lucide-react"
import type { Receita } from "@/lib/types"

interface ReceitaCardProps {
  receita: Receita
  onClick?: () => void
  className?: string
}

export function ReceitaCard({ receita, onClick, className }: ReceitaCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj)
  }

  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      Vendas: "bg-green-100 text-green-800 border-green-200",
      Serviços: "bg-emerald-100 text-emerald-800 border-emerald-200",
      Consultoria: "bg-green-50 text-green-700 border-green-200",
      Freelance: "bg-green-100 text-green-900 border-green-200",
      Dividendos: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Aluguel: "bg-green-50 text-green-800 border-green-200",
      Outros: "bg-green-50 text-green-700 border-green-200",
    }
    return colors[categoria] || "bg-green-50 text-green-700 border-green-200"
  }

  return (
    <Card
      className={`relative overflow-hidden bg-green-50 rounded-xl border border-green-100 shadow-sm transition-all duration-200 ${
        onClick ? "cursor-pointer hover:scale-[1.02] hover:shadow-md" : ""
      } ${className || ""}`}
      onClick={onClick}
    >
      {/* Decorações de fundo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full opacity-10 -translate-y-12 translate-x-12" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100 rounded-full opacity-20 translate-y-10 -translate-x-10" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight text-green-900 truncate">
              {receita.descricao}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-green-600">
              +{formatCurrency(receita.valor)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Calendar className="h-4 w-4 text-green-700" />
          <span>{formatDate(receita.data)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Tag className="h-4 w-4 text-green-700" />
          <Badge variant="outline" className={`${getCategoriaColor(receita.categoria)} font-medium`}>
            {receita.categoria}
          </Badge>
        </div>

        {receita.registradoPor && (
          <div className="pt-2 border-t border-green-100">
            <div className="flex items-center gap-2">
              <UserCheck className="h-3 w-3 text-green-700" />
              <span className="text-xs text-green-600">
                Registrado por {receita.registradoPor}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
