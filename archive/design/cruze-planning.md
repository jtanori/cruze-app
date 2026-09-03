# CRUZE — MASTER PAGE SPECIFICATION & BUILDING PLAN

You are acting as a **Principal Product Designer, UX Architect, Information Architect, and Product Systems Designer**.

Your task is **NOT to build the CRUZE application**.

Your task is to take everything already established in the CRUZE project — the product definition, design system, tokens, navigation, page archetypes, components, border-crossing data model, and previous design decisions — and transform it into a **complete, structured building plan for the CRUZE product UI**.

The output of this exercise will become the source material from which the actual application will later be built.

---

# 1. DO NOT BUILD THE APP

This distinction is critical.

Do **not**:
* write React components
* write HTML
* write CSS
* write Tailwind
* implement routes
* implement APIs
* create production code
* generate a working application
* invent implementation details prematurely

Instead, produce the **product/page specification** that a senior frontend engineer could later use to build the application.

Think:
> **Architecture → Page inventory → Page archetypes → Page specifications → Component requirements → Data requirements → States → Interactions**

Not:
> Design → Code.

---

# 2. YOUR SOURCE OF TRUTH

Before creating the plan, thoroughly inspect and synthesize all existing CRUZE material available in the project.

Use everything we have already established, including:
* CRUZE product definition
* brand direction
* visual identity
* design system
* design tokens
* typography
* color system
* component catalog
* global navigation
* header specifications
* bottom navigation specifications
* page archetypes
* previous page discussions
* crossing intelligence requirements
* crossing data model
* vehicle/lane/pass requirements
* Mexico ↔ US directions
* status and wait-time concepts
* alerts/intelligence concepts
* responsive principles
* existing design decisions

---

# 3. PRIMARY OBJECTIVE

Create a **CRUZE Product UI Building Plan**.

The plan must establish:
1. How many pages CRUZE actually needs.
2. What each page is responsible for.
3. Which pages are primary vs secondary.
4. Which pages share the same archetype.
5. Which pages require unique layouts.
6. Which global components are required.
7. Which domain components are required.
8. Which data each page consumes.
9. Which interactions each page supports.
10. Which states each page must support.
11. How pages connect to one another.
12. Which pages are mobile-first.
13. Which pages require distinct desktop behavior.
14. Which pages can reuse existing patterns.
15. Which pages should NOT exist because their functionality belongs elsewhere.

The goal is to arrive at a **finite, intentional page inventory**.

---

# 23. FINAL DELIVERABLE STRUCTURE

The final document set must contain these sections:

# CRUZE — Product UI Building Plan
## 01. Product & Design Context
## 02. Existing Decisions Audit
## 03. Information Architecture
## 04. Page Inventory
## 05. Page Map
## 06. Page Archetype Matrix
## 07. Global Components
## 08. Domain Components
## 09. Data Model Requirements
## 10. Page Specification Matrix
## 11. Detailed Page Specification Outlines
## 12. User Flows
## 13. Component Dependency Map
## 14. Recommended Build Order
## 15. Coverage / Completeness Audit
## 16. Open Questions & Decisions Required
