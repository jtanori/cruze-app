Yes. And I actually think your instinct is right: **we should not default to Expo merely because it is the familiar AI-assisted path.** For CRUCE, I would explicitly evaluate the native/cross-platform landscape before committing.

The interesting part is that the decision has changed quite a bit by 2026.

## My short answer

For **CRUCE MVP**, my ranking would currently be:

| Option                             | My take for CRUCE                                                |
| ---------------------------------- | ---------------------------------------------------------------- |
| **Flutter**                        | 🥇 **Best overall candidate**                                    |
| **Kotlin Multiplatform + Compose** | 🥈 Most interesting alternative                                  |
| **SwiftUI + native Android**       | 🥉 Best technical architecture, but too much duplication for MVP |
| **React Native + Expo**            | Excellent fallback, but I wouldn't choose it automatically       |
| React Native without Expo          | Not compelling for this project                                  |

And there's an important distinction:

> **I would seriously prototype CRUCE in Flutter before deciding.**

Not because Flutter is inherently "better" than React Native, but because **the particular product we're building is unusually well suited to Flutter**.

---

# 1. Why CRUCE is a good Flutter candidate

Look at what we've designed.

CRUCE is:

* highly visual
* highly custom
* information-dense
* animation-light but interaction-rich
* essentially a collection of sophisticated data interfaces
* not dependent on platform-specific UI conventions
* not a social app
* not a camera-heavy app
* not an audio/video app
* not a heavily native-widget-driven app

That's almost a textbook Flutter use case.

Flutter gives us a single rendering system across iOS and Android, while still compiling to native binaries. Flutter currently supports iOS 15+ and Android 24+ in its supported deployment matrix. ([Documentación de Flutter][1])

And more importantly for **our design**, Flutter doesn't force us into the visual vocabulary of either iOS or Android.

That's a feature here.

---

# 2. CRUCE actually wants a custom rendering language

This is something I would take seriously.

We've deliberately been moving CRUCE away from:

> "generic SaaS/mobile UI"

toward:

> **a recognizable editorial intelligence product.**

We want things like:

```text
CRUCE
────────────────────────────

SAN YSIDRO

24 min

CURRENT WAIT

──────────────

TRAFFIC       MODERATE
LANES         12
STATUS        OPEN
```

We don't particularly care whether that looks like a stock iOS screen.

We care that it looks like **CRUCE**.

Flutter's model is excellent for that because we're effectively constructing our own visual system from primitives.

That makes:

* typography
* spacing
* custom charts
* crossing status
* recommendation cards
* editorial layouts
* animations
* navigation
* data visualization

all part of one coherent rendering system.

---

# 3. And AI-assisted Flutter development is the interesting experiment

This is the part I'd actually test rather than theorize about.

We've spent a lot of time creating an extremely precise CRUCE specification.

That changes the equation.

An AI coding agent doesn't need to invent:

> "What should this screen look like?"

We already give it:

```text
Screen
↓
Anatomy
↓
Layout
↓
Tokens
↓
Components
↓
States
↓
Interaction
↓
Data model
```

That is exactly the kind of environment where an AI agent can potentially perform very well in Flutter.

For example, instead of telling an agent:

> Build a border crossing app.

we can give it:

> Implement `CrossingDetailScreen` according to this exact specification, using these design tokens, these components, these state transitions and this domain model.

That's a very different AI-development problem.

---

# 4. Flutter vs SwiftUI

This is where I would **not** dismiss Swift.

If you said:

> "I only care about making the best iOS app possible."

I'd probably say:

**Swift + SwiftUI.**

Apple itself positions SwiftUI as its declarative framework for building interfaces across Apple platforms. ([Apple Developer][2])

And SwiftUI is excellent.

For example:

```swift
VStack(alignment: .leading) {
    Text("SAN YSIDRO")
    WaitTime(value: 24)
    CrossingStatus(status: .open)
}
```

That's beautiful.

And AI agents are increasingly good at Swift/SwiftUI because:

* the APIs are relatively coherent
* Xcode gives strong feedback
* Swift has excellent typing
* SwiftUI previews are useful
* Apple's documentation is exceptionally structured

But the problem is obvious:

### We need Android too.

So we'd be building:

```text
SwiftUI
     +
Kotlin / Jetpack Compose
```

And now our beautiful AI-assisted development experiment has become two applications.

For an MVP, I don't think that's the right trade.

---

# 5. But there's another option we should investigate seriously

## Kotlin Multiplatform + Compose Multiplatform

This is the one I think deserves more attention than it normally gets.

Kotlin Multiplatform has matured substantially.

Google now officially supports Kotlin Multiplatform for sharing business logic between Android and iOS, and describes it as stable and production-ready. Compose Multiplatform can additionally share UI. ([Android Developers][3])

The architecture can look like:

```text
                    CRUCE
                      │
              Kotlin Multiplatform
                      │
          ┌───────────┴───────────┐
          │                       │
       Android                  iOS
          │                       │
    Compose UI              Compose UI
```

Or, more interestingly:

```text
              SHARED DOMAIN
                    │
        ┌───────────┼───────────┐
        │           │           │
      Data        Logic       Models
        │           │           │
        └───────────┼───────────┘
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
     Native Android       Native iOS
       Compose             SwiftUI
```

That second architecture is particularly compelling.

KMP explicitly supports sharing only the pieces you want, including data, networking and business logic while leaving the UI native. ([Kotlin][4])

---

# 6. But I wouldn't choose KMP blindly either

The question isn't:

> "Is KMP technically good?"

It is.

The question is:

> **"Can an AI coding agent build CRUCE faster and more reliably in KMP than Flutter?"**

That's the experiment we need to run.

Flutter has an enormous advantage here:

```text
One language
One UI framework
One renderer
One project
One mental model
```

KMP potentially gives us:

```text
Kotlin
Gradle
Android
iOS
Compose
Xcode
Swift interoperability
platform-specific APIs
```

That's powerful, but it's also more surface area.

---

# 7. React Native has also changed

This is another reason I don't think we should evaluate React Native based on old assumptions.

The New Architecture is now the foundation of modern React Native. React Native 0.82 made it always enabled, and Expo SDK 55+ runs entirely on it. The old architecture is frozen. ([Expo Documentation][5])

So the old:

> "React Native = JavaScript bridge = compromises"

argument isn't really the right argument anymore.

Modern RN is much more sophisticated.

And Expo is genuinely excellent.

But here's my hesitation for **this particular project**:

We've already decided that CRUCE should have a highly controlled visual language.

I'd rather have:

```text
CRUCE
   ↓
Flutter rendering system
   ↓
CRUCE Design System
```

than:

```text
CRUCE
   ↓
React Native
   ↓
React ecosystem
   ↓
Expo
   ↓
Native modules
   ↓
platform differences
```

Not because the second one can't work.

It absolutely can.

It's just more abstraction than I think we need.

---

# 8. One thing Flutter has that is especially valuable for us

The design board we've been creating can become almost directly translatable into Flutter.

For example:

```text
CRUCE Design Token
        ↓
Flutter Theme
        ↓
Components
        ↓
Screens
```

We could establish:

```dart
class CruzeTheme {
  static const background = ...
  static const surface = ...
  static const accent = ...
  static const textPrimary = ...
  static const textSecondary = ...
}
```

Then:

```text
CruzeTheme
   ↓
CruzeTypography
CruzeSpacing
CruzeRadius
CruzeElevation
CruzeStatus
CruzeMotion
```

And then:

```text
CruzeScaffold
CruzeHeader
CruzeBottomNav
CruzeSection
CruzeMetric
CruzeCrossingCard
CruzeStatus
CruzeWaitTime
CruzeAlert
```

That is extremely compatible with the system we've already designed.

---

# 9. There's another major consideration: maps

This is one area where we should not make a framework decision before testing.

CRUCE doesn't want to become another Google Maps.

That's good.

Our map requirement is relatively limited:

```text
Current location
        ↓
Destination
        ↓
Recommended crossing
        ↓
Route handoff
```

We therefore don't need to build a sophisticated map application.

The native integration question is much more manageable.

Flutter has platform integration mechanisms and can use native functionality/plugins when required. ([Documentación de Flutter][6])

So I don't consider maps a reason to choose React Native.

---

# 10. Notifications are another test

CRUCE eventually needs:

```text
"San Ysidro wait time increased to 41 min."

"Your favorite crossing just reopened."

"Your recommended crossing is now 18 min faster."
```

That's native territory.

But again, all the candidates can handle this.

The real question is **how painful the native escape hatch is when we need it.**

That's one of the things I'd deliberately test in our spike.

---

# 11. What I would NOT do

I would not start with:

```text
Flutter
+
React Native
+
Swift
+
Kotlin
```

and try to compare entire applications.

That's wasteful.

Instead, I'd build a **CRUCE technology spike**.

One small vertical slice.

---

# 12. The experiment I'd propose

Build exactly **three screens**.

### Screen A

**Crossings**

The screen we've just specified.

```text
Crossings

[All] [Mexico → US] [Open]

SAN YSIDRO
24 min
● Open

OTAY MESA
31 min
● Open

TECATE
47 min
● Open
```

### Screen B

**Crossing Detail**

Including:

* hero
* wait time
* status
* trend
* lanes
* vehicle eligibility
* actions

### Screen C

**Active Trip**

Including:

* origin
* destination
* recommendation
* total estimated time
* alternatives
* navigation handoff

Then implement those **three screens in parallel**.

---

# 13. The candidates I'd test

I'd actually reduce it to three.

### Experiment A — Flutter

```text
Flutter
Dart
Material disabled/minimal
Custom CRUCE design system
```

### Experiment B — SwiftUI + native Android

This is our "maximum native quality" benchmark.

```text
iOS
Swift
SwiftUI

Android
Kotlin
Jetpack Compose
```

Shared backend/domain contracts, but independent UI.

### Experiment C — Expo

```text
React Native
Expo
TypeScript
New Architecture
```

And I would **not** build the entire application in any of them yet.

---

# 14. The scoring system matters more than preference

We should score them against CRUCE-specific criteria.

I'd use:

| Criterion                        |  Weight |
| -------------------------------- | ------: |
| AI coding effectiveness          | **20%** |
| UI fidelity to our design        | **20%** |
| Development velocity             | **15%** |
| Native capability                | **15%** |
| Debugging / maintainability      | **10%** |
| Performance                      | **10%** |
| App-store build/release workflow |  **5%** |
| Ecosystem/library availability   |  **5%** |

Then we actually measure it.

For example:

```text
                    Flutter   Native   Expo
─────────────────────────────────────────────
AI implementation      9        7       9
Visual fidelity        10       10      8
Velocity                9        6       10
Native APIs             8        10      8
Maintenance             9        7       8
Performance             9        10      8
Release                 9        7       10
Ecosystem               9        8       10
```

Those numbers are **not my final assessment**.

They're the framework for the experiment.

---

# 15. And I'd add one unusual criterion

## "How much does the AI fight the framework?"

This is incredibly important now.

Suppose we give the exact same prompt to three agents:

> Implement the CRUCE Crossing Detail screen from this specification.

Then measure:

```text
iterations required
compile errors
visual corrections
architecture corrections
hallucinated APIs
dependency problems
native integration problems
```

That tells us much more than conventional framework comparisons.

Because **we are building CRUCE with AI assistance**, not with a 20-person engineering team following conventional development methodology.

---

# 16. My current hypothesis

If I had to bet **today**, before running the experiment:

### 🥇 Flutter

I think it will be the sweet spot.

```text
                    CRUCE
                      │
                 Flutter
                      │
          ┌───────────┴───────────┐
          ↓                       ↓
        iOS                    Android
```

One design system.

One implementation.

One rendering model.

Excellent custom UI.

Strong AI development potential.

Native compiled applications.

And it doesn't prevent us from dropping into native APIs when necessary. ([Documentación de Flutter][6])

---

### 🥈 KMP / Compose

This is the **wildcard**.

I wouldn't dismiss it at all.

In fact, if the AI experiment demonstrates that agents handle Kotlin/Compose extremely well, I could see it becoming the architecture I'd prefer long-term.

The ability to share business logic selectively—or even share UI through Compose Multiplatform—is compelling. ([Kotlin][4])

---

### 🥉 Native Swift + Kotlin

Technically beautiful.

Probably the best long-term option if CRUCE becomes a serious platform and we eventually have dedicated mobile engineers.

But for an MVP:

**too much duplicated work.**

---

### 4️⃣ Expo

Still an excellent option.

I wouldn't be surprised if the experiment proves it is actually the fastest.

And importantly, modern Expo is not the old "toy React Native" story: SDK 55+ uses React Native's New Architecture exclusively. ([Expo Documentation][5])

But I don't think we should choose it simply because:

> "That's what AI coding agents usually use."

That's precisely the assumption worth testing.

---

# 17. My recommendation for CRUCE specifically

I would change our process slightly.

**Do not start implementation yet.**

We've already done the hard product/design work.

Instead:

```text
                 CRUCE SPEC
                     │
                     ↓
              TECHNOLOGY SPIKE
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
     Flutter      KMP/CMP       Expo
        │            │            │
        └────────────┼────────────┘
                     ↓
             3-screen benchmark
                     ↓
              AI productivity
                     ↓
              technical review
                     ↓
             FRAMEWORK DECISION
                     ↓
             Full implementation
```

And I would make the benchmark **real**, not a toy.

Same:

* design system
* typography
* crossing data
* navigation
* loading
* offline state
* API client
* one chart
* one native integration
* one notification
* one deep link
* one app-store build

That gives us a genuinely meaningful answer.

**My instinct is Flutter. But I would want the AI-assisted spike to earn that decision rather than assuming it.**

And honestly, this is one of those situations where **Flutter vs Compose Multiplatform vs Expo is a much more interesting question in 2026 than it would have been a few years ago.** KMP/CMP is now mature enough to be a legitimate contender, Flutter is very strong for custom UI, and modern React Native has closed a lot of its historical architectural gaps. ([Documentación de Flutter][1])

[1]: https://docs.flutter.dev/reference/supported-platforms?utm_source=chatgpt.com "Supported deployment platforms"
[2]: https://developer.apple.com/swiftui/?utm_source=chatgpt.com "SwiftUI - Apple Developer"
[3]: https://developer.android.com/kotlin/multiplatform?hl=en&utm_source=chatgpt.com "Kotlin Multiplatform  |  Android Developers"
[4]: https://kotlinlang.org/multiplatform/?utm_source=chatgpt.com "Kotlin Multiplatform – Build Cross-Platform Apps"
[5]: https://docs.expo.dev/guides/new-architecture/?utm_source=chatgpt.com "React Native's New Architecture - Expo Documentation"
[6]: https://docs.flutter.dev/platform-integration?utm_source=chatgpt.com "Build for and integrate with multiple platforms"

