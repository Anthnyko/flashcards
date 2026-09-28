import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import CardItem from '../components/CardItem'
import { assignTag, createTag, deleteCard, getCards, type Card } from '../api/cards'
import { searchTags } from '../api/search'
import { getDeck, type Deck } from '../api/decks'

export default function DeckView() {
  const { id } = useParams(); const deckId = Number(id); const navigate = useNavigate()
  const [deck, setDeck] = useState<Deck | null>(null); const [cards, setCards] = useState<Card[]>([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(true)
  const load = async () => { if (!Number.isInteger(deckId)) return; setLoading(true); try { const [deckData, cardsData] = await Promise.all([getDeck(deckId), getCards(deckId)]); setDeck(deckData); setCards(cardsData) } catch { setError('Could not load this deck.') } finally { setLoading(false) } }
  useEffect(() => { void load() }, [deckId])
  const remove = async (card: Card) => { if (!window.confirm('Delete this card?')) return; try { await deleteCard(card.id); setCards((items) => items.filter((item) => item.id !== card.id)) } catch { setError('Could not delete card.') } }
  const addTag = async (card: Card) => {
    const name = window.prompt('Tag name')?.trim(); if (!name) return
    try {
      const matches = await searchTags(name); const tag = matches.find((item) => item.name.toLowerCase() === name.toLowerCase()) ?? await createTag(name)
      await assignTag(card.id, tag.id); await load()
    } catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.detail ?? 'Could not assign tag.' : 'Could not assign tag.') }
  }
  if (!Number.isInteger(deckId)) return <main className="page-container">Invalid deck.</main>
  return <main className="page-container">
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Link to="/" className="text-sm font-medium text-indigo-700 hover:underline">← All decks</Link><h1 className="mt-2 text-3xl font-bold">{deck?.name ?? 'Deck'}</h1>{deck?.description && <p className="mt-1 text-slate-500">{deck.description}</p>}</div><div className="flex flex-wrap gap-2"><Link className="button-secondary" to={`/study/${deckId}`}>Study deck</Link><Link className="button-primary" to={`/deck/${deckId}/edit`}>Add card</Link></div></div>
    {error && <p className="mb-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {loading ? <p className="text-slate-500">Loading cards…</p> : cards.length ? <section className="space-y-4">{cards.map((card) => <CardItem key={card.id} card={card} onEdit={(item) => navigate(`/deck/${deckId}/edit?card=${item.id}`, { state: { card: item } })} onDelete={remove} onAssignTag={addTag} />)}</section> : <section className="panel text-center"><h2 className="font-semibold">This deck is empty</h2><p className="mt-1 text-sm text-slate-500">Add a card to begin studying.</p></section>}
  </main>
}
