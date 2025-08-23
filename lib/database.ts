import { collection, addDoc, getDocs, query, orderBy, Timestamp, doc, updateDoc } from "firebase/firestore"
import { db, auth } from "./firebase"
import type { Funcionarios, Receita, Despesa, Senha, Projeto, AtividadeProjeto, Orcamento, Recibo } from "./types"

// Funcionarios
export const adicionarFuncionarios = async (Funcionarios: Omit<Funcionarios, "id">) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Usuário não autenticado")
    }

    const docRef = await addDoc(collection(db, "Funcionarios"), {
      ...Funcionarios,
      dataRegistro: Timestamp.fromDate(Funcionarios.dataRegistro),
      registradoPor: auth.currentUser.displayName || auth.currentUser.email || "Usuário",
    })
    return docRef.id
  } catch (error) {
    console.error("Erro ao adicionar Funcionario:", error)
    throw error
  }
}

export const obterFuncionarios = async (): Promise<Funcionarios[]> => {
  try {
    // Aguarda a inicialização do auth
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe()
        resolve(user)
      })
    })

    if (!auth.currentUser) {
      console.log("[v0] Usuário não autenticado, retornando array vazio")
      return []
    }

    const q = query(collection(db, "Funcionarios"), orderBy("dataRegistro", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      dataRegistro: doc.data().dataRegistro.toDate(),
    })) as Funcionarios[]
  } catch (error) {
    console.error("Erro ao obter Funcionarios:", error)
    return []
  }
}

// Receitas
export const adicionarReceita = async (receita: Omit<Receita, "id">) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Usuário não autenticado")
    }

    const docRef = await addDoc(collection(db, "receitas"), {
      ...receita,
      data: Timestamp.fromDate(receita.data),
      registradoPor: auth.currentUser.displayName || auth.currentUser.email || "Usuário",
    })
    return docRef.id
  } catch (error) {
    console.error("Erro ao adicionar receita:", error)
    throw error
  }
}

export const obterReceitas = async (): Promise<Receita[]> => {
  try {
    // Aguarda a inicialização do auth
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe()
        resolve(user)
      })
    })

    if (!auth.currentUser) {
      console.log("[v0] Usuário não autenticado, retornando array vazio")
      return []
    }

    const q = query(collection(db, "receitas"), orderBy("data", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data.toDate(),
    })) as Receita[]
  } catch (error) {
    console.error("Erro ao obter receitas:", error)
    return []
  }
}

// Despesas
export const adicionarDespesa = async (despesa: Omit<Despesa, "id">) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Usuário não autenticado")
    }

    const docRef = await addDoc(collection(db, "despesas"), {
      ...despesa,
      data: Timestamp.fromDate(despesa.data),
      registradoPor: auth.currentUser.displayName || auth.currentUser.email || "Usuário",
    })
    return docRef.id
  } catch (error) {
    console.error("Erro ao adicionar despesa:", error)
    throw error
  }
}

export const obterDespesas = async (): Promise<Despesa[]> => {
  try {
    // Aguarda a inicialização do auth
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe()
        resolve(user)
      })
    })

    if (!auth.currentUser) {
      console.log("[v0] Usuário não autenticado, retornando array vazio")
      return []
    }

    const q = query(collection(db, "despesas"), orderBy("data", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data.toDate(),
    })) as Despesa[]
  } catch (error) {
    console.error("Erro ao obter despesas:", error)
    return []
  }
}

// Senhas
export const adicionarSenha = async (senha: Omit<Senha, "id">) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Usuário não autenticado")
    }

    const docRef = await addDoc(collection(db, "senhas"), {
      ...senha,
      dataRegistro: Timestamp.fromDate(senha.dataRegistro),
      registradoPor: auth.currentUser.displayName || auth.currentUser.email || "Usuário",
    })
    return docRef.id
  } catch (error) {
    console.error("Erro ao adicionar senha:", error)
    throw error
  }
}

export const obterSenhas = async (): Promise<Senha[]> => {
  try {
    if (!auth.currentUser) {
      console.log("[v0] Usuário não autenticado, retornando array vazio")
      return []
    }

    const q = query(collection(db, "senhas"), orderBy("dataRegistro", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      dataRegistro: doc.data().dataRegistro.toDate(),
    })) as Senha[]
  } catch (error) {
    console.error("Erro ao obter senhas:", error)
    return []
  }
}

