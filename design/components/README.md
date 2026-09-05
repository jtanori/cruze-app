# Component Catalog — Index

**Version:** 1.1 — 2026-09-04 — radii 4/8/12/16/20, nav 56/80+safe, LOC-ACQ-DOTS-01 added. If version differs from `design/workflows/W*.md` or `apps/web/src/app/globals.css:94`, revisit testing per `design/TESTING_INTEGRATION_PLAN.md:11`.

> **Source of truth for implementation:** `design/components/<ID>-<Name>.md` — this directory is canonical per component (84). Tokens: `design/workflows/W5_component_level_design_spec.md` §1-2. Workflows: `design/workflows/W*.md` (W1-W10). Matrix: `docs/PAGES_WORKFLOWS_REPORT.md`. Testing: `docs/TESTING_TOOLS.md` P0-P5 → `design/TESTING_INTEGRATION_PLAN.md`. Integration order: `design/INTEGRATION_PLAN.md` Addendum.
> Original catalogs `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` §5-10 are rationale only.

## How to use

1. **Find component** in table below → open its spec doc.
2. **Implement** using tokens in W5 §1-2; compose primitives per Design Foundation → hierarchy (Foundations → Primitives → Domain Components → Screen Compositions → Workflow).
3. **Verify** via workflow doc ASCII + `docs/CRUZE — Product, UX & Design System Specification.v1.md` §36-38 (operational vs freshness), and `PAGES_WORKFLOWS_REPORT.md` matrix.

## Inventory (83 IDs)

### APP — Application Shell (7)
| ID | Name | Spec Doc |
|----|------|----------|
| APP-HEAD-01 | CruzeAppHeader | [APP-HEAD-01-CruzeAppHeader.md](APP-HEAD-01-CruzeAppHeader.md) |
| APP-AV-01 | CruzeNotificationButton | [APP-AV-01-CruzeNotificationButton.md](APP-AV-01-CruzeNotificationButton.md) |
| APP-SET-01 | CruzeSettingsButton | [APP-SET-01-CruzeSettingsButton.md](APP-SET-01-CruzeSettingsButton.md) |
| APP-NAV-01 | CruzeBottomNav | [APP-NAV-01-CruzeBottomNav.md](APP-NAV-01-CruzeBottomNav.md) |
| APP-BACK-01 | CruzeBackHeader | [APP-BACK-01-CruzeBackHeader.md](APP-BACK-01-CruzeBackHeader.md) |
| APP-LIVE-01 | CruzeLiveIndicator | [APP-LIVE-01-CruzeLiveIndicator.md](APP-LIVE-01-CruzeLiveIndicator.md) |
| APP-PAGE-01 | CruzePageHeader | [APP-PAGE-01-CruzePageHeader.md](APP-PAGE-01-CruzePageHeader.md) |

### LOC — Location (10)
| ID | Name | Spec Doc |
|----|------|----------|
| LOC-GATE-01 | LocationPermissionGate | [LOC-GATE-01-LocationPermissionGate.md](LOC-GATE-01-LocationPermissionGate.md) |
| LOC-PROMPT-01 | LocationPermissionPrompt | [LOC-PROMPT-01-LocationPermissionPrompt.md](LOC-PROMPT-01-LocationPermissionPrompt.md) |
| LOC-ACQ-01 | LocationAcquisitionState | [LOC-ACQ-01-LocationAcquisitionState.md](LOC-ACQ-01-LocationAcquisitionState.md) |
| LOC-ACQ-DOTS-01 | LocationAcquisitionDots | [LOC-ACQ-DOTS-01-LocationAcquisitionDots.md](LOC-ACQ-DOTS-01-LocationAcquisitionDots.md) |
| LOC-REC-01 | LocationRecoveryPanel | [LOC-REC-01-LocationRecoveryPanel.md](LOC-REC-01-LocationRecoveryPanel.md) |
| LOC-SEARCH-01 | LocationSearchInput | [LOC-SEARCH-01-LocationSearchInput.md](LOC-SEARCH-01-LocationSearchInput.md) |
| LOC-SUGGEST-01 | LocationSearchSuggestions | [LOC-SUGGEST-01-LocationSearchSuggestions.md](LOC-SUGGEST-01-LocationSearchSuggestions.md) |
| LOC-CONF-01 | LocationConfidenceIndicator | [LOC-CONF-01-LocationConfidenceIndicator.md](LOC-CONF-01-LocationConfidenceIndicator.md) |
| LOC-STATUS-01 | LocationStatusBanner | [LOC-STATUS-01-LocationStatusBanner.md](LOC-STATUS-01-LocationStatusBanner.md) |
| LOC-NET-01 | LocationNetworkStatus | [LOC-NET-01-LocationNetworkStatus.md](LOC-NET-01-LocationNetworkStatus.md) |

### TR — Trip (17)
| ID | Name | Spec Doc |
|----|------|----------|
| TR-EMPTY-01 | TripDestinationSearch | [TR-EMPTY-01-TripDestinationSearch.md](TR-EMPTY-01-TripDestinationSearch.md) |
| TR-NEAR-01 | TripNearbyCrossingsSection | [TR-NEAR-01-TripNearbyCrossingsSection.md](TR-NEAR-01-TripNearbyCrossingsSection.md) |
| TR-NEAR-02 | TripNearbyCrossingRow | [TR-NEAR-02-TripNearbyCrossingRow.md](TR-NEAR-02-TripNearbyCrossingRow.md) |
| TR-SETUP-01 | TripSetupProgress | [TR-SETUP-01-TripSetupProgress.md](TR-SETUP-01-TripSetupProgress.md) |
| TR-SETUP-02 | TripSetupDestinationStep | [TR-SETUP-02-TripSetupDestinationStep.md](TR-SETUP-02-TripSetupDestinationStep.md) |
| TR-SETUP-03 | TripSetupOriginStep | [TR-SETUP-03-TripSetupOriginStep.md](TR-SETUP-03-TripSetupOriginStep.md) |
| TR-SETUP-04 | TripSetupTravelModeStep | [TR-SETUP-04-TripSetupTravelModeStep.md](TR-SETUP-04-TripSetupTravelModeStep.md) |
| TR-SETUP-05 | TripSetupVehicleAccessStep | [TR-SETUP-05-TripSetupVehicleAccessStep.md](TR-SETUP-05-TripSetupVehicleAccessStep.md) |
| TR-SETUP-06 | TripSetupDocumentProfileStep | [TR-SETUP-06-TripSetupDocumentProfileStep.md](TR-SETUP-06-TripSetupDocumentProfileStep.md) |
| TR-REC-01 | TripRecommendationPrimaryCard | [TR-REC-01-TripRecommendationPrimaryCard.md](TR-REC-01-TripRecommendationPrimaryCard.md) |
| TR-REC-02 | TripRecommendationReasonList | [TR-REC-02-TripRecommendationReasonList.md](TR-REC-02-TripRecommendationReasonList.md) |
| TR-REC-03 | TripAlternativeListSection | [TR-REC-03-TripAlternativeListSection.md](TR-REC-03-TripAlternativeListSection.md) |
| TR-REC-04 | TripAlternativeListRow | [TR-REC-04-TripAlternativeListRow.md](TR-REC-04-TripAlternativeListRow.md) |
| TR-ACT-01 | TripStatusHeader | [TR-ACT-01-TripStatusHeader.md](TR-ACT-01-TripStatusHeader.md) |
| TR-ACT-02 | TripRouteSummary | [TR-ACT-02-TripRouteSummary.md](TR-ACT-02-TripRouteSummary.md) |
| TR-ACT-03 | TripActionBar | [TR-ACT-03-TripActionBar.md](TR-ACT-03-TripActionBar.md) |
| TR-ACT-04 | TripChecklistSection | [TR-ACT-04-TripChecklistSection.md](TR-ACT-04-TripChecklistSection.md) |
| TR-COMP-01 | TripCompletionPrompt | [TR-COMP-01-TripCompletionPrompt.md](TR-COMP-01-TripCompletionPrompt.md) |

### CR — Crossings (21)
| ID | Name | Spec Doc |
|----|------|----------|
| CR-DIR-01 | CrossingsDirectoryList | [CR-DIR-01-CrossingsDirectoryList.md](CR-DIR-01-CrossingsDirectoryList.md) |
| CR-DIR-02 | CrossingsDirectoryRow | [CR-DIR-02-CrossingsDirectoryRow.md](CR-DIR-02-CrossingsDirectoryRow.md) |
| CR-DIR-03 | CrossingsDirectoryExpandedRow | [CR-DIR-03-CrossingsDirectoryExpandedRow.md](CR-DIR-03-CrossingsDirectoryExpandedRow.md) |
| CR-DIR-04 | CrossingsDirectorySearchInput | [CR-DIR-04-CrossingsDirectorySearchInput.md](CR-DIR-04-CrossingsDirectorySearchInput.md) |
| CR-DIR-05 | CrossingsDirectoryFilterBar | [CR-DIR-05-CrossingsDirectoryFilterBar.md](CR-DIR-05-CrossingsDirectoryFilterBar.md) |
| CR-STATUS-01 | CrossingStatusBadge | [CR-STATUS-01-CrossingStatusBadge.md](CR-STATUS-01-CrossingStatusBadge.md) |
| CR-STATUS-02 | CrossingDirectionTimes | [CR-STATUS-02-CrossingDirectionTimes.md](CR-STATUS-02-CrossingDirectionTimes.md) |
| CR-STATUS-03 | CrossingWaitTime | [CR-STATUS-03-CrossingWaitTime.md](CR-STATUS-03-CrossingWaitTime.md) |
| CR-STATUS-04 | CrossingWaitDelta | [CR-STATUS-04-CrossingWaitDelta.md](CR-STATUS-04-CrossingWaitDelta.md) |
| CR-STATUS-05 | CrossingFreshness | [CR-STATUS-05-CrossingFreshness.md](CR-STATUS-05-CrossingFreshness.md) |
| CR-DET-01 | CrossingDetailHero | [CR-DET-01-CrossingDetailHero.md](CR-DET-01-CrossingDetailHero.md) |
| CR-DET-02 | CrossingDetailMap | [CR-DET-02-CrossingDetailMap.md](CR-DET-02-CrossingDetailMap.md) |
| CR-DET-03 | CrossingDetailLaneSection | [CR-DET-03-CrossingDetailLaneSection.md](CR-DET-03-CrossingDetailLaneSection.md) |
| CR-DET-04 | CrossingDetailAccessSection | [CR-DET-04-CrossingDetailAccessSection.md](CR-DET-04-CrossingDetailAccessSection.md) |
| CR-DET-05 | CrossingDetailHoursSection | [CR-DET-05-CrossingDetailHoursSection.md](CR-DET-05-CrossingDetailHoursSection.md) |
| CR-DET-06 | CrossingDetailRequirementsSection | [CR-DET-06-CrossingDetailRequirementsSection.md](CR-DET-06-CrossingDetailRequirementsSection.md) |
| CR-DET-07 | CrossingDetailRestrictionsSection | [CR-DET-07-CrossingDetailRestrictionsSection.md](CR-DET-07-CrossingDetailRestrictionsSection.md) |
| CR-DET-08 | CrossingDetailServicesSection | [CR-DET-08-CrossingDetailServicesSection.md](CR-DET-08-CrossingDetailServicesSection.md) |
| CR-DET-09 | CrossingFavoriteButton | [CR-DET-09-CrossingFavoriteButton.md](CR-DET-09-CrossingFavoriteButton.md) |
| CR-DET-10 | CrossingDetailActionBar | [CR-DET-10-CrossingDetailActionBar.md](CR-DET-10-CrossingDetailActionBar.md) |
| CR-CMP-01 | CrossingsCompareTable | [CR-CMP-01-CrossingsCompareTable.md](CR-CMP-01-CrossingsCompareTable.md) |

### AG — Agent (11)
| ID | Name | Spec Doc |
|----|------|----------|
| AG-HEAD-01 | AgentHeader | [AG-HEAD-01-AgentHeader.md](AG-HEAD-01-AgentHeader.md) |
| AG-WEL-01 | AgentWelcome | [AG-WEL-01-AgentWelcome.md](AG-WEL-01-AgentWelcome.md) |
| AG-PROMPT-01 | AgentPromptList | [AG-PROMPT-01-AgentPromptList.md](AG-PROMPT-01-AgentPromptList.md) |
| AG-PROMPT-02 | AgentPromptChip | [AG-PROMPT-02-AgentPromptChip.md](AG-PROMPT-02-AgentPromptChip.md) |
| AG-MSG-01 | AgentMessageList | [AG-MSG-01-AgentMessageList.md](AG-MSG-01-AgentMessageList.md) |
| AG-MSG-02 | AgentMessage | [AG-MSG-02-AgentMessage.md](AG-MSG-02-AgentMessage.md) |
| AG-COMP-01 | AgentComposer | [AG-COMP-01-AgentComposer.md](AG-COMP-01-AgentComposer.md) |
| AG-RESULT-01 | AgentCrossingResult | [AG-RESULT-01-AgentCrossingResult.md](AG-RESULT-01-AgentCrossingResult.md) |
| AG-RESULT-02 | AgentRecommendationResult | [AG-RESULT-02-AgentRecommendationResult.md](AG-RESULT-02-AgentRecommendationResult.md) |
| AG-RESULT-03 | AgentTripAction | [AG-RESULT-03-AgentTripAction.md](AG-RESULT-03-AgentTripAction.md) |
| AG-RESULT-04 | AgentChecklistResult | [AG-RESULT-04-AgentChecklistResult.md](AG-RESULT-04-AgentChecklistResult.md) |

### AV — Avisos (9)
| ID | Name | Spec Doc |
|----|------|----------|
| AV-HEAD-01 | AvisosSheet | [AV-HEAD-01-AvisosSheet.md](AV-HEAD-01-AvisosSheet.md) |
| AV-BADGE-01 | AvisosBadge | [AV-BADGE-01-AvisosBadge.md](AV-BADGE-01-AvisosBadge.md) |
| AV-ROW-01 | AvisoRow | [AV-ROW-01-AvisoRow.md](AV-ROW-01-AvisoRow.md) |
| AV-CROSS-01 | AvisoCrossingChange | [AV-CROSS-01-AvisoCrossingChange.md](AV-CROSS-01-AvisoCrossingChange.md) |
| AV-REC-01 | AvisoRecommendationChange | [AV-REC-01-AvisoRecommendationChange.md](AV-REC-01-AvisoRecommendationChange.md) |
| AV-TRIP-01 | AvisoTripReminder | [AV-TRIP-01-AvisoTripReminder.md](AV-TRIP-01-AvisoTripReminder.md) |
| AV-CHECK-01 | AvisoChecklistReminder | [AV-CHECK-01-AvisoChecklistReminder.md](AV-CHECK-01-AvisoChecklistReminder.md) |
| AV-DATA-01 | AvisoDataWarning | [AV-DATA-01-AvisoDataWarning.md](AV-DATA-01-AvisoDataWarning.md) |
| AV-EMPTY-01 | AvisosEmptyState | [AV-EMPTY-01-AvisosEmptyState.md](AV-EMPTY-01-AvisosEmptyState.md) |

### SET — Settings (7)
| ID | Name | Spec Doc |
|----|------|----------|
| SET-ROOT-01 | SettingsList | [SET-ROOT-01-SettingsList.md](SET-ROOT-01-SettingsList.md) |
| SET-SEC-01 | SettingsSection | [SET-SEC-01-SettingsSection.md](SET-SEC-01-SettingsSection.md) |
| SET-PROFILE-01 | ProfileSettings | [SET-PROFILE-01-ProfileSettings.md](SET-PROFILE-01-ProfileSettings.md) |
| SET-FAV-01 | FavoriteCrossingsList | [SET-FAV-01-FavoriteCrossingsList.md](SET-FAV-01-FavoriteCrossingsList.md) |
| SET-TRIP-01 | SavedTripsList | [SET-TRIP-01-SavedTripsList.md](SET-TRIP-01-SavedTripsList.md) |
| SET-DATA-01 | DataSharingPlaceholder | [SET-DATA-01-DataSharingPlaceholder.md](SET-DATA-01-DataSharingPlaceholder.md) |
| SET-ABOUT-01 | AboutLinksList | [SET-ABOUT-01-AboutLinksList.md](SET-ABOUT-01-AboutLinksList.md) |

---
*Total: 83 component specs. All files in this directory are source of truth for implementation. See `design/workflows/W*.md` for workflow bindings + `docs/TESTING_TOOLS.md` P0-P5 for testing.*
