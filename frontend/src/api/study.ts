import api from './axios'

export interface StudyCard { card_id: number; front: string; back: string }
export interface NextCardResponse { card?: StudyCard | null; message?: string; card_id?: number; front?: string; back?: string }
export interface Progress { total_cards: number; due_cards: number; new_cards: number; completed_cards: number }

export const startSession = async (deckId: number) => api.post(`/study/start/${deckId}`)
export const getNextCard = async (deckId: number) => (await api.get<NextCardResponse>(`/study/next-card/${deckId}`)).data
export const submitAnswer = async (cardId: number, wasCorrect: boolean) => api.post('/study/submit-answer', null, { params: { card_id: cardId, was_correct: wasCorrect } })
export const getProgress = async (deckId: number) => (await api.get<Progress>(`/study/progress/${deckId}`)).data
