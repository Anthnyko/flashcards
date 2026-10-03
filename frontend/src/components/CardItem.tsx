import type { Card } from '../api/cards'

export default function CardItem({ card, onEdit, onDelete, onAssignTag }: { card: Card; onEdit: (card: Card) => void; onDelete: (card: Card) => void; onAssignTag: (card: Card) => void }) {
  return <article className="panel">
    <div className="grid gap-4 sm:grid-cols-2">
      <div><p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Front</p><p className="whitespace-pre-wrap">{card.front}</p></div>
      <div><p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Back</p><p className="whitespace-pre-wrap">{card.back}</p></div>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {(card.tags ?? []).map((tag) => <span key={tag.id} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{tag.name}</span>)}
      <button className="button-secondary ml-auto" onClick={() => onAssignTag(card)}>Assign tag</button>
      <button className="button-secondary" onClick={() => onEdit(card)}>Edit</button>
      <button className="button-danger" onClick={() => onDelete(card)}>Delete</button>
    </div>
  </article>
}
