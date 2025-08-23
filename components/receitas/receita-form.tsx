"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adicionarReceita } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { DollarSign } from "lucide-react"

interface ReceitaFormProps {
  onReceitaAdicionada: () => void
}

const categorias = [
  "Venda de Leite",
  "Venda de Gado",
  "Aluguel de Pasto",
  "Outros Produtos",
]

export function ReceitaForm({ onReceitaAdicionada }: ReceitaFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    categoria: "Venda de Leite",
    data: new Date().toISOString().split("T")[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const receitaData = {
        descricao: formData.descricao,
        valor: Number.parseFloat(formData.valor),
        categoria: formData.categoria,
        data: new Date(formData.data),
      }

      await adicionarReceita(receitaData)

      toast({
        title: "Receita adicionada",
        description: "Receita foi adicionada com sucesso!",
      })

      setFormData({
        descricao: "",
        valor: "",
        categoria: "Venda de Leite",
        data: new Date().toISOString().split("T")[0],
      })

      onReceitaAdicionada()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar receita. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Card className="relative overflow-hidden bg-green-50 rounded-xl border border-green-100 shadow-sm">
      {/* Decorações de fundo */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-200 rounded-full opacity-10 -translate-y-20 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-green-100 rounded-full opacity-20 translate-y-14 -translate-x-14" />

      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-700" />
          <CardTitle className="text-xl font-bold text-green-900">
            Adicionar Nova Receita
          </CardTitle>
        </div>
        <p className="text-sm text-green-600 mt-1">
          Preencha os campos abaixo para registrar uma nova receita no sistema.
        </p>
      </CardHeader>

      <CardContent className="relative">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-green-900">Descrição *</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              placeholder="Descreva a receita (ex: Desenvolvimento do site institucional)"
              rows={2}
              className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="valor" className="text-green-900">Valor (R$) *</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={handleChange}
                required
                placeholder="0,00"
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-green-900">Categoria *</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              >
                <SelectTrigger className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data" className="text-green-900">Data *</Label>
              <Input
                id="data"
                name="data"
                type="date"
                value={formData.data}
                onChange={handleChange}
                required
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
          >
            {loading ? "Adicionando..." : "Adicionar Receita"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
