# ELD Trip Planner – Programming Assessment

## Purpose
Build a full-stack web application that accepts trip details
and generates:
- A routed map with required stops
- Daily ELD (Electronic Logging Device) log sheets

This project is built strictly according to the assessment instructions.


## Inputs (Frozen)

The application accepts the following inputs:

1. Current Location (string, city or address)
2. Pickup Location (string, city or address)
3. Dropoff Location (string, city or address)
4. Current Cycle Used Hours (number, 0–70)

No additional inputs will be added.


## Outputs (Frozen)

The application produces the following outputs:

1. Route Map
   - Visual map displaying the route
   - Markers for rest stops and fuel stops

2. Stop Information
   - Rest breaks
   - Fuel stops

3. Daily ELD Log Sheets
   - One or more log sheets depending on trip length
   - Each log sheet represents a 24-hour day


## Assumptions (Provided by Assessment)

- Property-carrying driver
- 70 hours / 8 days cycle
- No adverse driving conditions
- Fueling at least once every 1,000 miles
- 1 hour for pickup
- 1 hour for drop-off


## Explicit Non-Goals

The following are intentionally out of scope:

- Authentication or user accounts
- Editing logs manually
- Real-time GPS tracking
- Full FMCSA edge-case compliance
- Persistent storage of trips

This project focuses on logic clarity, visualization, and UX.
