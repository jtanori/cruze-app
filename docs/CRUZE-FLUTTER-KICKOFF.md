> **Companion:** Implementation source of truth: `design/components/README.md` (84) + `design/workflows/W*.md` + `design/INTEGRATION_PLAN.md` Addendum. Testing: `docs/TESTING_TOOLS.md` → `design/TESTING_INTEGRATION_PLAN.md`. This doc is **strategy/brief only** — not an implementation spec.

```
I already have a complete tech + component specification for a Next.js web application (I will paste / attach it below or in the next message).

I want to:

1. Create a proper monorepo structure that will contain:
   - The existing Next.js web app
   - A new Flutter mobile app (iOS + Android)

2. Generate a detailed Flutter development plan based on the existing tech/component spec.

### Required Monorepo Structure

Please propose and scaffold (or describe precisely) this structure:

```
project-root/
├── apps/
│   ├── web/          # existing Next.js app (I will move the current code here later)
│   └── mobile/       # new Flutter app
├── packages/         # shared packages (start with the most useful ones)
│   ├── api-client/   # or types / contracts
│   └── ...
├── package.json      # root workspace
├── pnpm-workspace.yaml (or yarn/npm equivalent)
├── turbo.json        # optional but preferred
├── melos.yaml        # for Flutter side (recommended)
└── README.md
```

Use modern best practices (Turborepo style for the JS side + Melos or Dart workspaces for Flutter).

### Flutter Stack (locked in)

- **State management**: Riverpod 3.x (with riverpod_annotation + riverpod_generator)
- **Navigation**: go_router (preferably with go_router_builder for typed routes)
- **Architecture**: Feature-first + Clean Architecture / MVVM style
- Prefer modern, reliable, and AI-friendly patterns

### Flutter Development Plan Requirements

Based on the tech + component specification I will provide, generate a complete Flutter development plan that includes:

- Exact recommended folder structure inside `apps/mobile`
- How Riverpod should be organized (providers, notifiers, etc.)
- GoRouter setup (including auth redirects, nested navigation, deep linking)
- Networking / API layer plan (how it should consume the same backend as the Next.js app)
- Theming & design system mapping from the web components
- Auth flow mapping
- Recommended packages list with current stable versions/ranges
- Screen-by-screen / feature-by-feature implementation order (phased roadmap)
- Shared code strategy between Next.js and Flutter
- Platform-specific considerations (permissions, deep linking, push notifications, etc.)
- Testing strategy
- Suggested AI-assisted development workflow (how I should prompt for each feature)

### Important Constraints
- Pure Flutter only (no React Native)
- Keep the Flutter app fully independent in its tooling (pubspec, Melos, etc.)
- Prioritize maintainability, clear separation, and AI-agent friendliness
- Make the plan highly actionable so features can be implemented one by one later

First output:
1. The recommended final monorepo folder structure (with explanations)
2. The full Flutter development plan using Riverpod + GoRouter

Then wait for me to paste the tech + component specification before generating any code.
```

---
