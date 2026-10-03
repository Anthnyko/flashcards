from datetime import datetime, timedelta

def schedule_next_review(was_correct: bool, interval: int, ease_factor: int):
    """
    interval: current interval in days
    ease_factor: difficulty multiplier (baseline 250 = 2.5)
    """

    if was_correct:
        ease_factor = max(130, ease_factor + 10)

        new_interval = int(interval * (ease_factor / 100))
    else:
        new_interval = 1

        ease_factor = max(130, ease_factor - 20)

    next_review_date = datetime.utcnow() + timedelta(days=new_interval)

    return new_interval, ease_factor, next_review_date