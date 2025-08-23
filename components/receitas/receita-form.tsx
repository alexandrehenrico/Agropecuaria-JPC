"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adicionarReceita, obterFuncionarios } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { DollarSign } from "lucide-react"
import type { Funcionarios } from "@/lib/types"

interface ReceitaFormProps {
  onReceitaAdicionada: () => void
}

const categorias = [
  "Desenvolvimento Web",
  "Desenvolvimento Mobile",
  "Consultoria",
  "Manutenção",
  "Design",
  "SEO/Marketing",
  "Hospedagem",
  "Outros",
]

export function ReceitaForm({ onReceitaAdicionada }: ReceitaFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [Funcionarios, setFuncionarios] = useState<Funcionarios[]>([])
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    FuncionariosId: "none",
    categoria: "Desenvolvimento Web",
    data: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const carregarFuncionarios = async () => {
      const FuncionariosData = await obterFuncionarios()
      setFuncionarios(FuncionariosData)
    }
    carregarFuncionarios()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const receitaData: any = {
        descricao: formData.descricao,
        valor: Number.parseFloat(formData.valor),
        categoria: formData.categoria,
        data: new Date(formData.data),
      }

      if (formData.FuncionariosId !== "none") {
        receitaData.FuncionariosId = formData.FuncionariosId
      }

      await adicionarReceita(receitaData)

      toast({
        title: "Receita adicionada",
        description: "Receita foi adicionada com sucesso!",
      })

      setFormData({
        descricao: "",
        valor: "",
        FuncionariosId: "none",
        categoria: "Desenvolvimento Web",
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
    <Card className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
      {/* Decorações de fundo */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gray-300 rounded-full opacity-10 -translate-y-20 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-black rounded-full opacity-5 translate-y-14 -translate-x-14" />

      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-700" />
          <CardTitle className="text-xl font-bold text-gray-900">Adicionar Nova Receita</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Preencha os campos abaixo para registrar uma nova receita no sistema.
        </p>
      </CardHeader>

      <CardContent className="relative">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              placeholder="Descreva a receita (ex: Desenvolvimento do site institucional)"
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              >
                <SelectTrigger>
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
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                name="data"
                type="date"
                value={formData.data}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="FuncionariosId">Funcionarios (Opcional)</Label>
            <Select
              value={formData.FuncionariosId}
              onValueChange={(value) => setFormData({ ...formData, FuncionariosId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um Funcionarios (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum Funcionarios</SelectItem>
                {Funcionarios.map((Funcionarios) => (
                  <SelectItem key={Funcionarios.id} value={Funcionarios.id}>
                    {Funcionarios.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
          >
            {loading ? "Adicionando..." : "Adicionar Receita"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
