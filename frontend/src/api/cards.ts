import api from './axios'

export interface Tag { id: number; name: string }
export interface Card { id: number; deck_id: number; front: string; back: string; tags?: Tag[] }
export interface CardInput { deck_id: number; front: string; back: string }

export const getCards = async (deckId: number) => (await api.get<Card[]>(`/cards/${deckId}`)).data
export const createCard = async (card: CardInput) => (await api.post<Card>('/cards/', card)).data
export const updateCard = async (id: number, card: CardInput) => (await api.put<Card>(`/cards/${id}`, card)).data
export const deleteCard = async (id: number) => api.delete(`/cards/${id}`)
export const createTag = async (name: string) => (await api.post<Tag>('/tags/', { name })).data
export const assignTag = async (cardId: number, tagId: number) => api.post('/tags/assign', null, { params: { card_id: cardId, tag_id: tagId } })
export const removeTag = async (cardId: number, tagId: number) => api.post('/tags/remove', null, { params: { card_id: cardId, tag_id: tagId } })
