from collections import defaultdict


def generate_daily_logs(timeline):
    """
    Converts a timeline into drawable daily ELD logs.
    """
    days = defaultdict(list)

    # Group events by day
    for event in timeline:
        days[event["day"]].append(event)

    daily_logs = []

    for day, events in sorted(days.items()):
        current_time = 0.0
        segments = []

        for event in events:
            duration = event["duration"]
            status = map_event_type(event["type"])

            segment = {
                "start": round(current_time, 2),
                "end": round(current_time + duration, 2),
                "status": status,
            }

            segments.append(segment)
            current_time += duration

        # Ensure 24-hour coverage
        if current_time < 24:
            segments.append(
                {"start": round(current_time, 2), "end": 24, "status": "off_duty"}
            )

        daily_logs.append({"day": day, "segments": segments})

    return daily_logs


def map_event_type(event_type):
    if event_type in ["driving"]:
        return "driving"
    if event_type in ["on_duty", "fuel", "break"]:
        return "on_duty"
    return "off_duty"
