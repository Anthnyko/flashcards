import { Link, useNavigate } from 'react-router-dom'
import type { Deck } from '../api/decks'

export default function DeckCard({ deck, onDelete }: { deck: Deck; onDelete?: (deck: Deck) => void }) {
  const navigate = useNavigate()
  const due = deck.due_cards ?? deck.due_cards_count ?? 0
  return <article className="panel flex flex-col gap-4">
    <div className="min-w-0">
      <h2 className="truncate text-lg font-semibold">{deck.name}</h2>
      {deck.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{deck.description}</p>}
    </div>
    <p className="text-sm text-slate-600"><span className="font-semibold text-indigo-700">{due}</span> cards due</p>
    <div className="mt-auto flex flex-wrap gap-2">
      <button className="button-primary" onClick={() => navigate(`/study/${deck.id}`)}>Study</button>
      <Link className="button-secondary" to={`/deck/${deck.id}`}>View</Link>
      {onDelete && <button className="button-danger ml-auto" onClick={() => onDelete(deck)}>Delete</button>}
    </div>
  </article>
}
