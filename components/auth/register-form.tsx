"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { criarConta } from "@/lib/auth"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nome, setNome] = useState("")
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setLoading(false)
      return
    }

    if (!nome.trim()) {
      setError("Nome é obrigatório")
      setLoading(false)
      return
    }

    try {
      const { user, error: registerError } = await criarConta(email, password, nome, foto)

      if (registerError) {
        if (registerError.includes("auth/email-already-in-use")) {
          setError("Este email já está cadastrado. Tente fazer login ou use outro email.")
        } else if (registerError.includes("auth/weak-password")) {
          setError("A senha é muito fraca. Use pelo menos 6 caracteres.")
        } else if (registerError.includes("auth/invalid-email")) {
          setError("Email inválido. Verifique o formato do email.")
        } else {
          setError("Erro ao criar conta: " + registerError)
        }
      } else if (user) {
        router.push("/")
      } else {
        setError("Erro inesperado ao criar conta")
      }
    } catch (error) {
      console.error("[v0] Erro no cadastro:", error)
      setError("Erro inesperado ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="relative w-full max-w-md rounded-xl border border-green-200 shadow-md transition-transform duration-200 hover:shadow-lg hover:scale-[1.02] overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-300 rounded-full opacity-15 -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500 rounded-full opacity-10 translate-y-12 -translate-x-12" />

        <CardHeader className="relative text-center z-10">
          <div className="flex justify-center mb-4"></div>
          <CardTitle className="text-2xl font-bold text-green-900">Cadastro</CardTitle>
          <CardDescription className="text-green-700">Crie sua conta no Sistema de Gestão Interno VisionX</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nome" className="text-green-900">Nome Completo</Label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Seu nome completo"
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foto" className="text-green-900">Foto de Perfil (opcional)</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={fotoPreview || undefined} />
                  <AvatarFallback className="text-lg bg-gradient-to-br from-green-700 to-green-800 text-white">{nome ? nome.charAt(0).toUpperCase() : "?"}</AvatarFallback>
                </Avatar>
                <Input id="foto" type="file" accept="image/*" onChange={handleFotoChange} className="flex-1 border-green-200 focus:border-emerald-500 focus:ring-emerald-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-900">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-900">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-green-900">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>

            <div className="text-center text-sm text-green-700">
              Já tem uma conta?{" "}
              <Button variant="link" className="p-0 h-auto text-green-700 hover:text-green-800" onClick={() => router.push("/login")}>
                Faça login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
