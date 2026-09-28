import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { searchCards, searchDecks, searchTags } from '../api/search'
import type { Card, Tag } from '../api/cards'
import type { Deck } from '../api/decks'

export default function Search() {
  const [query, setQuery] = useState(''); const [cards, setCards] = useState<Card[]>([]); const [decks, setDecks] = useState<Deck[]>([]); const [tags, setTags] = useState<Tag[]>([]); const [searched, setSearched] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const submit = async (event: FormEvent) => { event.preventDefault(); const value = query.trim(); if (!value) return; setLoading(true); setError(''); try { const [cardResults, deckResults, tagResults] = await Promise.all([searchCards(value), searchDecks(value), searchTags(value)]); setCards(cardResults); setDecks(deckResults); setTags(tagResults); setSearched(true) } catch { setError('Search could not be completed.') } finally { setLoading(false) } }
  return <main className="page-container max-w-4xl"><h1 className="text-3xl font-bold">Search</h1><p className="mt-1 text-slate-500">Find cards, decks, and tags across your collection.</p><form className="mt-6 flex gap-2" onSubmit={submit}><input className="field mt-0" placeholder="What are you looking for?" value={query} onChange={(e) => setQuery(e.target.value)} /><button className="button-primary" disabled={loading}>{loading ? 'Searching…' : 'Search'}</button></form>
    {error && <p className="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {searched && <div className="mt-8 space-y-7"><ResultGroup title="Decks" empty="No matching decks.">{decks.map((deck) => <Link key={deck.id} to={`/deck/${deck.id}`} className="block rounded-lg border border-slate-200 p-4 hover:border-indigo-300 hover:bg-indigo-50"><p className="font-semibold">{deck.name}</p>{deck.description && <p className="mt-1 text-sm text-slate-500">{deck.description}</p>}</Link>)}</ResultGroup><ResultGroup title="Cards" empty="No matching cards.">{cards.map((card) => <Link key={card.id} to={`/deck/${card.deck_id}`} className="block rounded-lg border border-slate-200 p-4 hover:border-indigo-300 hover:bg-indigo-50"><p className="font-medium">{card.front}</p><p className="mt-1 text-sm text-slate-500">{card.back}</p></Link>)}</ResultGroup><ResultGroup title="Tags" empty="No matching tags.">{tags.map((tag) => <span key={tag.id} className="inline-block rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">{tag.name}</span>)}</ResultGroup></div>}
  </main>
}

function ResultGroup({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const entries = Array.isArray(children) ? children : [children]
  return <section><h2 className="mb-3 text-lg font-semibold">{title}</h2>{entries.filter(Boolean).length ? <div className="space-y-2">{children}</div> : <p className="text-sm text-slate-500">{empty}</p>}</section>
}
