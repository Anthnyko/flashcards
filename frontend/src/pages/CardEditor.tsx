import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { assignTag, createCard, createTag, getCards, removeTag, updateCard, type Card, type Tag } from '../api/cards'
import { searchTags } from '../api/search'

export default function CardEditor() {
  const { id } = useParams(); const deckId = Number(id); const navigate = useNavigate(); const location = useLocation(); const [params] = useSearchParams()
  const requestedCardId = Number(params.get('card')); const initial = (location.state as { card?: Card } | null)?.card
  const [card, setCard] = useState<Card | null>(initial ?? null); const [front, setFront] = useState(initial?.front ?? ''); const [back, setBack] = useState(initial?.back ?? ''); const [tags, setTags] = useState<Tag[]>(initial?.tags ?? []); const [tagName, setTagName] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false)
  useEffect(() => { if (!requestedCardId || initial || !Number.isInteger(deckId)) return; getCards(deckId).then((cards) => { const found = cards.find((item) => item.id === requestedCardId); if (!found) setError('Card not found.'); else { setCard(found); setFront(found.front); setBack(found.back); setTags(found.tags ?? []) } }).catch(() => setError('Could not load card.')) }, [deckId, initial, requestedCardId])
  const save = async (event: FormEvent) => { event.preventDefault(); setError(''); setSaving(true); try { const input = { deck_id: deckId, front, back }; const saved = card ? await updateCard(card.id, input) : await createCard(input); setCard(saved); navigate(`/deck/${deckId}`, { replace: true }) } catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.detail ?? 'Could not save card.' : 'Could not save card.') } finally { setSaving(false) } }
  const addTag = async () => { const name = tagName.trim(); if (!name) return; if (!card) { setError('Save the card before adding tags.'); return } try { const matches = await searchTags(name); const tag = matches.find((item) => item.name.toLowerCase() === name.toLowerCase()) ?? await createTag(name); await assignTag(card.id, tag.id); setTags((items) => items.some((item) => item.id === tag.id) ? items : [...items, tag]); setTagName('') } catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.detail ?? 'Could not add tag.' : 'Could not add tag.') } }
  const deleteTag = async (tag: Tag) => { if (!card) return; try { await removeTag(card.id, tag.id); setTags((items) => items.filter((item) => item.id !== tag.id)) } catch { setError('Could not remove tag.') } }
  if (!Number.isInteger(deckId)) return <main className="page-container">Invalid deck.</main>
  return <main className="page-container max-w-3xl"><Link to={`/deck/${deckId}`} className="text-sm font-medium text-indigo-700 hover:underline">← Back to deck</Link><h1 className="mt-2 text-3xl font-bold">{card ? 'Edit card' : 'New card'}</h1>
    <form className="panel mt-6 space-y-5" onSubmit={save}>{error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <label className="block text-sm font-medium">Front<textarea className="field min-h-28" value={front} onChange={(e) => setFront(e.target.value)} required /></label>
      <label className="block text-sm font-medium">Back<textarea className="field min-h-28" value={back} onChange={(e) => setBack(e.target.value)} required /></label>
      <div><p className="text-sm font-medium">Tags</p><div className="mt-2 flex flex-wrap gap-2">{tags.map((tag) => <button type="button" key={tag.id} onClick={() => deleteTag(tag)} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-rose-50 hover:text-rose-700" title="Remove tag">{tag.name} ×</button>)}</div><div className="mt-3 flex gap-2"><input className="field mt-0" value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder="Add a tag" /><button type="button" className="button-secondary shrink-0" onClick={addTag}>Add tag</button></div>{!card && <p className="mt-2 text-xs text-slate-500">Save the card first, then you can add tags.</p>}</div>
      <div className="flex justify-end gap-2"><Link className="button-secondary" to={`/deck/${deckId}`}>Cancel</Link><button className="button-primary" disabled={saving}>{saving ? 'Saving…' : 'Save card'}</button></div>
    </form>
  </main>
}
