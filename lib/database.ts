import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore'
import { db, auth } from './firebase'
import type { Despesa, Receita, Funcionario, Senha } from './types'

// Despesas
export async function obterDespesas(): Promise<Despesa[]> {
  try {
    const q = query(collection(db, 'despesas'), orderBy('data', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data.toDate()
    })) as Despesa[]
  } catch (error) {
    console.error('Erro ao obter despesas:', error)
    throw error
  }
}

export async function adicionarDespesa(despesa: Omit<Despesa, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'despesas'), {
      ...despesa,
      data: Timestamp.fromDate(new Date(despesa.data)),
      registradoPor: auth.currentUser?.email || 'Usuário desconhecido'
    })
    return docRef.id
  } catch (error) {
    console.error('Erro ao adicionar despesa:', error)
    throw error
  }
}

export async function atualizarDespesa(id: string, despesa: Partial<Despesa>): Promise<void> {
  try {
    const docRef = doc(db, 'despesas', id)
    const updateData = { ...despesa }
    if (despesa.data) {
      updateData.data = Timestamp.fromDate(new Date(despesa.data))
    }
    await updateDoc(docRef, updateData)
  } catch (error) {
    console.error('Erro ao atualizar despesa:', error)
    throw error
  }
}

export async function excluirDespesa(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'despesas', id))
  } catch (error) {
    console.error('Erro ao excluir despesa:', error)
    throw error
  }
}

// Receitas
export async function obterReceitas(): Promise<Receita[]> {
  try {
    const q = query(collection(db, 'receitas'), orderBy('data', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data.toDate()
    })) as Receita[]
  } catch (error) {
    console.error('Erro ao obter receitas:', error)
    throw error
  }
}

export async function adicionarReceita(receita: Omit<Receita, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'receitas'), {
      ...receita,
      data: Timestamp.fromDate(new Date(receita.data)),
      registradoPor: auth.currentUser?.email || 'Usuário desconhecido'
    })
    return docRef.id
  } catch (error) {
    console.error('Erro ao adicionar receita:', error)
    throw error
  }
}

export async function atualizarReceita(id: string, receita: Partial<Receita>): Promise<void> {
  try {
    const docRef = doc(db, 'receitas', id)
    const updateData = { ...receita }
    if (receita.data) {
      updateData.data = Timestamp.fromDate(new Date(receita.data))
    }
    await updateDoc(docRef, updateData)
  } catch (error) {
    console.error('Erro ao atualizar receita:', error)
    throw error
  }
}

export async function excluirReceita(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'receitas', id))
  } catch (error) {
    console.error('Erro ao excluir receita:', error)
    throw error
  }
}

// Funcionários
export async function obterFuncionarios(): Promise<Funcionario[]> {
  try {
    const q = query(collection(db, 'funcionarios'), orderBy('nome'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Funcionario[]
  } catch (error) {
    console.error('Erro ao obter funcionários:', error)
    throw error
  }
}

export async function adicionarFuncionario(funcionario: Omit<Funcionario, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'funcionarios'), {
      ...funcionario,
      registradoPor: auth.currentUser?.email || 'Usuário desconhecido'
    })
    return docRef.id
  } catch (error) {
    console.error('Erro ao adicionar funcionário:', error)
    throw error
  }
}

export async function atualizarFuncionario(id: string, funcionario: Partial<Funcionario>): Promise<void> {
  try {
    const docRef = doc(db, 'funcionarios', id)
    await updateDoc(docRef, funcionario)
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error)
    throw error
  }
}

export async function excluirFuncionario(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'funcionarios', id))
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error)
    throw error
  }
}

// Senhas
export async function obterSenhas(): Promise<Senha[]> {
  try {
    const q = query(collection(db, 'senhas'), orderBy('servico'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Senha[]
  } catch (error) {
    console.error('Erro ao obter senhas:', error)
    throw error
  }
}

export async function adicionarSenha(senha: Omit<Senha, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'senhas'), {
      ...senha,
      registradoPor: auth.currentUser?.email || 'Usuário desconhecido'
    })
    return docRef.id
  } catch (error) {
    console.error('Erro ao adicionar senha:', error)
    throw error
  }
}

export async function atualizarSenha(id: string, senha: Partial<Senha>): Promise<void> {
  try {
    const docRef = doc(db, 'senhas', id)
    await updateDoc(docRef, senha)
  } catch (error) {
    console.error('Erro ao atualizar senha:', error)
    throw error
  }
}

export async function excluirSenha(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'senhas', id))
  } catch (error) {
    console.error('Erro ao excluir senha:', error)
    throw error
  }
}