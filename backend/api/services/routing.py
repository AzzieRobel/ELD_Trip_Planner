import requests
from django.conf import settings

ORS_BASE_URL = "https://api.openrouteservice.org"


def geocode_location(address: str):
    if not settings.ORS_API_KEY:
        raise RuntimeError("ORS_API_KEY is not configured")

    url = f"{ORS_BASE_URL}/geocode/search"
    headers = {"Authorization": settings.ORS_API_KEY}
    params = {"text": address, "size": 1}

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()

    data = response.json()

    if "features" not in data or not data["features"]:
        raise RuntimeError(f"Geocoding failed for address: {address}")

    coords = data["features"][0]["geometry"]["coordinates"]

    # ORS returns [lng, lat]
    return {"lat": coords[1], "lng": coords[0]}


def get_route(start, pickup, dropoff):
    if not settings.ORS_API_KEY:
        raise RuntimeError("ORS_API_KEY is not configured")

    url = f"{ORS_BASE_URL}/v2/directions/driving-car"
    headers = {
        "Authorization": settings.ORS_API_KEY,
        "Content-Type": "application/json",
    }

    body = {
        "coordinates": [
            [start["lng"], start["lat"]],
            [pickup["lng"], pickup["lat"]],
            [dropoff["lng"], dropoff["lat"]],
        ]
    }

    response = requests.post(url, headers=headers, json=body)
    response.raise_for_status()

    data = response.json()

    # 🔒 DEFENSIVE CHECK (this fixes your crash)
    if "features" not in data or not data["features"]:
        raise RuntimeError(f"OpenRouteService routing error: {data}")

    feature = data["features"][0]
    summary = feature["properties"]["summary"]
    geometry = feature["geometry"]

    return {
        "distance_miles": round(summary["distance"] / 1609.34, 2),
        "duration_hours": round(summary["duration"] / 3600, 2),
        "geometry": geometry,
    }
