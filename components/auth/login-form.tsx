"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fazerLogin } from "@/lib/auth"
import Image from "next/image"
import { Lock, Mail } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { user, error: loginError } = await fazerLogin(email, password)

    if (loginError) {
      setError("Email ou senha incorretos")
    } else if (user) {
      router.push("/")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <Card className="relative w-full max-w-md rounded-xl border border-green-200 shadow-md transition-transform duration-200 hover:shadow-lg hover:scale-[1.02] overflow-hidden">
        
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-300 rounded-full opacity-15 -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500 rounded-full opacity-10 translate-y-12 -translate-x-12" />

        <CardHeader className="relative text-center z-10">
          <div className="flex justify-center mb-4">
            <CardTitle className="text-2xl font-bold text-green-900">Fazenda Progresso - Bernardo do Mearim-MA</CardTitle>
          </div>
          <CardTitle className="text-2xl font-bold text-green-900">Bem-vindo de volta</CardTitle>
          <CardDescription className="text-green-700">
            Acesse o Sistema de Gestão Interno Fazenda Progresso
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-900">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="pl-10 border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-900">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="pl-10 border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-green-700 text-sm font-medium">
          Desenvolvido por VisionX
        </p>
      </div>
    </div>
  )
}