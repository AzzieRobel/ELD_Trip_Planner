"""
HOS SIMULATION RULES (Assessment Scope)

- Property-carrying driver
- 70 hours / 8 day cycle
- Max 11 hours driving per day
- 30 minute break required after 8 hours driving
- No adverse conditions
- Fuel stop every 1,000 miles
- Pickup: 1 hour on-duty
- Dropoff: 1 hour on-duty

Simplifications:
- Driver rests fully overnight
- No sleeper berth modeling
- Logs are generated deterministically
"""

MAX_DRIVING_PER_DAY = 11  # hours
BREAK_AFTER_HOURS = 8  # hours
BREAK_DURATION = 0.5  # hours (30 min)
FUEL_INTERVAL_MILES = 1000
FUEL_STOP_DURATION = 0.5  # hours
PICKUP_DURATION = 1  # hours
DROPOFF_DURATION = 1  # hours
CYCLE_LIMIT = 70  # hours
AVG_SPEED_MPH = 60  # simplification


def simulate_trip(route_miles, cycle_used_hours):
    """
    Returns a timeline of trip events grouped by day.
    """

    remaining_cycle = CYCLE_LIMIT - cycle_used_hours
    timeline = []

    current_day = 1
    miles_remaining = route_miles
    total_miles_driven = 0

    # --------------------
    # PICKUP (Day 1)
    # --------------------
    timeline.append(
        {"type": "on_duty", "duration": PICKUP_DURATION, "day": current_day}
    )
    remaining_cycle -= PICKUP_DURATION

    # --------------------
    # MAIN DRIVING LOOP
    # --------------------
    while miles_remaining > 0 and remaining_cycle > 0:
        driving_today = 0
        on_duty_today = 0  # includes breaks & fuel

        while driving_today < MAX_DRIVING_PER_DAY and miles_remaining > 0:
            # Mandatory 30-min break after 8 driving hours
            if driving_today == BREAK_AFTER_HOURS:
                timeline.append(
                    {"type": "break", "duration": BREAK_DURATION, "day": current_day}
                )
                on_duty_today += BREAK_DURATION
                remaining_cycle -= BREAK_DURATION

            # Drive 1 hour
            timeline.append({"type": "driving", "duration": 1, "day": current_day})

            driving_today += 1
            total_miles_driven += AVG_SPEED_MPH
            miles_remaining -= AVG_SPEED_MPH
            remaining_cycle -= 1

            # Fuel stop every 1,000 miles
            if (
                total_miles_driven >= FUEL_INTERVAL_MILES
                and total_miles_driven % FUEL_INTERVAL_MILES < AVG_SPEED_MPH
            ):
                timeline.append(
                    {"type": "fuel", "duration": FUEL_STOP_DURATION, "day": current_day}
                )
                on_duty_today += FUEL_STOP_DURATION
                remaining_cycle -= FUEL_STOP_DURATION

            if remaining_cycle <= 0:
                break

        # --------------------
        # END OF DAY REST
        # --------------------
        hours_used_today = driving_today + on_duty_today
        off_duty_hours = max(0, 24 - hours_used_today)

        timeline.append(
            {"type": "off_duty", "duration": off_duty_hours, "day": current_day}
        )

        current_day += 1

    # --------------------
    # DROPOFF
    # --------------------
    timeline.append(
        {"type": "on_duty", "duration": DROPOFF_DURATION, "day": current_day}
    )

    return timeline
