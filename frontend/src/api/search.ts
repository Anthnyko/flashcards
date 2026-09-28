import api from './axios'
import type { Card, Tag } from './cards'
import type { Deck } from './decks'

export const searchCards = async (q: string) => (await api.get<Card[]>('/search/cards', { params: { q } })).data
export const searchDecks = async (q: string) => (await api.get<Deck[]>('/search/decks', { params: { q } })).data
export const searchTags = async (q: string) => (await api.get<Tag[]>('/search/tags', { params: { q } })).data
