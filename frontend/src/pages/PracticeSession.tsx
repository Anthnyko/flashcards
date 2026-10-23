import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

import { getPracticeCards } from '../api/study'

interface PracticeCard {
  id: number
  front: string
  back: string
}

export default function PracticeSession() {
  const { id } = useParams()

  const deckId = Number(id)

  const [cards, setCards] = useState<PracticeCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const [revealed, setRevealed] = useState(false)
  const [complete, setComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCards = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getPracticeCards(deckId)

      setCards(response)

      if (response.length === 0) {
        setComplete(true)
      }
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.detail ?? 'Could not load cards.'
          : 'Could not load cards.'
      )
    } finally {
      setLoading(false)
    }
  }, [deckId])

  useEffect(() => {
    if (Number.isInteger(deckId)) {
      void loadCards()
    }
  }, [deckId, loadCards])

  const nextCard = () => {
    setRevealed(false)

    if (currentIndex + 1 >= cards.length) {
      setComplete(true)
      return
    }

    setCurrentIndex((prev) => prev + 1)
  }

  if (!Number.isInteger(deckId)) {
    return <main className="page-container">Invalid deck.</main>
  }

  const card = cards[currentIndex]

  return (
    <main className="page-container max-w-3xl">
      <Link
        to={`/deck/${deckId}`}
        className="text-sm font-medium text-indigo-700 hover:underline"
      >
        ← Back to deck
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl font-bold">Practice Mode</h1>

        {!complete && cards.length > 0 && (
          <p className="mt-1 text-sm text-slate-500">
            Card {currentIndex + 1} of {cards.length}
          </p>
        )}
      </div>

      {error && (
        <p className="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-slate-500">
          Loading cards...
        </p>
      ) : complete ? (
        <section className="panel mt-8 text-center">
          <h2 className="text-2xl font-bold">
            Practice complete
          </h2>

          <p className="mt-2 text-slate-500">
            You've reviewed all cards in this deck.
          </p>

          <Link
            className="button-primary mt-5"
            to={`/deck/${deckId}`}
          >
            Back to deck
          </Link>
        </section>
      ) : (
        card && (
          <section className="panel mt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Question
            </p>

            <p className="mt-4 min-h-24 whitespace-pre-wrap text-xl">
              {card.front}
            </p>

            {revealed ? (
              <div className="mt-8 border-t border-slate-200 pt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Answer
                </p>

                <p className="mt-3 whitespace-pre-wrap text-lg">
                  {card.back}
                </p>

                <button
                  className="button-primary mt-7 w-full py-3"
                  onClick={nextCard}
                >
                  Next Card
                </button>
              </div>
            ) : (
              <button
                className="button-primary mt-8 w-full py-3"
                onClick={() => setRevealed(true)}
              >
                Reveal Answer
              </button>
            )}
          </section>
        )
      )}
    </main>
  )
}