from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.services.routing import geocode_location, get_route
from api.services.hos import simulate_trip
from api.services.logs import generate_daily_logs


@api_view(["POST"])
def plan_trip(request):
    data = request.data

    # 1. Geocode locations
    current = geocode_location(data["current_location"])
    pickup = geocode_location(data["pickup_location"])
    dropoff = geocode_location(data["dropoff_location"])

    # 2. Get route
    route = get_route(current, pickup, dropoff)

    # 3. Simulate HOS
    timeline = simulate_trip(
        route_miles=route["distance_miles"], cycle_used_hours=data["cycle_used_hours"]
    )

    # 4. Generate ELD logs
    daily_logs = generate_daily_logs(timeline)

    # 5. Return response
    return Response({"route": route, "timeline": timeline, "daily_logs": daily_logs})
