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

## Security policy (S2 audit)
- Secrets/tokens (Mapbox, backend keys): `flutter_secure_storage` (Keychain/Keystore) only.
  Never `--dart-define` secrets into release builds, never in query params or logs.
- `shared_preferences`: UI state only — no PII, no tokens, no trip/location data.
- Network: HTTPS base URL only, short timeouts, no `badCertificateCallback` overrides.
- Location: least-privilege manifest/plist review required before any location code ships
  (no `ACCESS_BACKGROUND_LOCATION` / `Always` without explicit trip-tracking justification).
- `pubspec.lock` is tracked for reproducible builds.

## Commands (via Melos from repo root)
- `melos gen` — build_runner
- `melos run analyze` — flutter analyze
- `melos run test` — flutter test
