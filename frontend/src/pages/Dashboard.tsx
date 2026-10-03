import { useEffect, useState, type FormEvent } from 'react'
import axios from 'axios'
import DeckCard from '../components/DeckCard'
import { createDeck, deleteDeck, getDecks, type Deck } from '../api/decks'

export default function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [name, setName] = useState(''); const [creating, setCreating] = useState(false)
  const load = async () => { setLoading(true); try { setDecks(await getDecks()) } catch { setError('Could not load your decks.') } finally { setLoading(false) } }
  useEffect(() => { void load() }, [])
  const addDeck = async (event: FormEvent) => { event.preventDefault(); if (!name.trim()) return; setCreating(true); try { const deck = await createDeck({ name: name.trim() }); setDecks((items) => [...items, deck]); setName('') } catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.detail ?? 'Could not create deck.' : 'Could not create deck.') } finally { setCreating(false) } }
  const removeDeck = async (deck: Deck) => { if (!window.confirm(`Delete “${deck.name}”? This cannot be undone.`)) return; try { await deleteDeck(deck.id); setDecks((items) => items.filter((item) => item.id !== deck.id)) } catch { setError('Could not delete deck.') } }
  return <main className="page-container"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-bold">Your decks</h1><p className="mt-1 text-slate-500">Pick up where your memory left off.</p></div><form onSubmit={addDeck} className="flex gap-2"><input className="field mt-0" placeholder="New deck name" value={name} onChange={(e) => setName(e.target.value)} aria-label="New deck name" /><button className="button-primary" disabled={creating}>{creating ? 'Creating…' : 'Create deck'}</button></form></div>
    {error && <p className="mb-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {loading ? <p className="text-slate-500">Loading decks…</p> : decks.length ? <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{decks.map((deck) => <DeckCard key={deck.id} deck={deck} onDelete={removeDeck} />)}</section> : <section className="panel text-center"><h2 className="font-semibold">No decks yet</h2><p className="mt-1 text-sm text-slate-500">Create your first deck above to get started.</p></section>}
  </main>
}
