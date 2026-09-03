# Cruce Mobile (Flutter)

Feature-first + Clean Architecture.

```
lib/
├── core/
│   ├── theme/       # Design tokens → ThemeData (map from web globals.css)
│   ├── router/      # go_router + go_router_builder typed routes
│   ├── network/     # Dio client consuming same backend as Next.js
│   └── providers/   # Riverpod shared providers
├── features/
│   ├── trip/        # TripSetupFlow, Recommendation, Active Trip, Checklist
│   ├── crossings/   # Directory, Detail, Compare, Map
│   ├── agent/       # Chat + structured results
│   ├── avisos/      # Avisos list/detail
│   └── settings/    # Profile, Favorites, My Trips, etc.
└── main.dart
```

## Stack
- Riverpod 3.x + riverpod_generator
- go_router + go_router_builder
- Dio for networking
- freezed + json_serializable

## Commands (via Melos from repo root)
- `melos gen` — build_runner
- `melos run analyze` — flutter analyze
- `melos run test` — flutter test
