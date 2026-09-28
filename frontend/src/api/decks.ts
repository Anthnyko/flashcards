import api from './axios'

export interface Deck { id: number; name: string; description?: string | null; due_cards?: number; due_cards_count?: number }
export interface DeckInput { name: string; description?: string }

export const getDecks = async () => (await api.get<Deck[]>('/decks/')).data
export const getDeck = async (id: number) => (await api.get<Deck>(`/decks/${id}`)).data
export const createDeck = async (deck: DeckInput) => (await api.post<Deck>('/decks/', deck)).data
export const deleteDeck = async (id: number) => api.delete(`/decks/${id}`)
