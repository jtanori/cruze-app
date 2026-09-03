"use client";

import { X, Clock, User, Truck, MapPin, FileText, Shield, AlertTriangle, CheckCircle2, XCircle, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CrossingRecommendation } from "@/types";
import type { CBPLane } from "@/lib/cbp-api";

interface CrossingDetailsModalProps {
  recommendation: CrossingRecommendation;
  onClose: () => void;
}

export function CrossingDetailsModal({ recommendation, onClose }: CrossingDetailsModalProps) {
  const t = useTranslations();

  const handleShare = async () => {
    const shareData = {
      title: recommendation.crossingName,
      text: `${recommendation.crossingName}\n${recommendation.mexicanCity}, ${recommendation.mexicanState} ↔ ${recommendation.usCity}, ${recommendation.usState}\n\nHours: ${recommendation.facts.hours}\nPedestrian: ${recommendation.facts.pedestrianAccess ? "Yes" : "No"}\nCommercial: ${recommendation.facts.commercialAccess ? "Yes" : "No"}\n\nWait times:\n${recommendation.lanes.map((l) => `${l.name}: ${l.isOpen ? `${l.waitTime} min` : "Closed"}`).join("\n")}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert("Copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h1 className="text-ink text-lg font-semibold">{recommendation.crossingName}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-surface-subtle transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5 text-ink" />
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-surface-subtle transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-ink" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Location */}
        <section className="space-y-3">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider">
            {t("crossing.details.location")}
          </h2>
          <div className="bg-surface-raised rounded-[var(--radius-lg)] p-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-faint shrink-0 mt-0.5" />
              <div>
                <p className="text-ink text-sm font-medium">{recommendation.mexicanCity}, {recommendation.mexicanState}</p>
                <p className="text-faint text-xs">{recommendation.mexicanAddress}</p>
              </div>
            </div>
            <div className="border-t border-border" />
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-faint shrink-0 mt-0.5" />
              <div>
                <p className="text-ink text-sm font-medium">{recommendation.usCity}, {recommendation.usState}</p>
                <p className="text-faint text-xs">{recommendation.usAddress}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Operating Hours */}
        <section className="space-y-3">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider">
            {t("crossing.details.hours")}
          </h2>
          <div className="bg-surface-raised rounded-[var(--radius-lg)] p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-faint" />
              <div>
                <p className="text-ink text-sm font-medium">{recommendation.facts.hours}</p>
                <p className="text-faint text-xs">{t("crossing.details.hoursNote")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Current Status */}
        <section className="space-y-3">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider">
            {t("crossing.details.status")}
          </h2>
          <div className="bg-surface-raised rounded-[var(--radius-lg)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-improving" />
                <span className="text-ink text-sm font-medium">{t("crossing.details.open")}</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-improving" />
            </div>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between">
              <span className="text-faint text-sm">{t("crossing.details.lastUpdated")}</span>
              <span className="text-ink text-sm">{new Date(recommendation.generatedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </section>

        {/* Access Types */}
        <section className="space-y-3">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider">
            {t("crossing.details.accessTypes")}
          </h2>
          <div className="bg-surface-raised rounded-[var(--radius-lg)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-faint" />
                <span className="text-ink text-sm">{t("crossing.details.passengerVehicles")}</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-improving" />
            </div>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-faint" />
                <span className="text-ink text-sm">{t("crossing.details.pedestrians")}</span>
              </div>
              {recommendation.facts.pedestrianAccess ? (
                <CheckCircle2 className="w-5 h-5 text-improving" />
              ) : (
                <XCircle className="w-5 h-5 text-critical" />
              )}
            </div>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-faint" />
                <span className="text-ink text-sm">{t("crossing.details.commercialVehicles")}</span>
              </div>
              {recommendation.facts.commercialAccess ? (
                <CheckCircle2 className="w-5 h-5 text-improving" />
              ) : (
                <XCircle className="w-5 h-5 text-critical" />
              )}
            </div>
          </div>
        </section>

        {/* Available Lanes */}
        <section className="space-y-3">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider">
            {t("crossing.details.lanes")}
          </h2>
          <div className="bg-surface-raised rounded-[var(--radius-lg)] overflow-hidden">
            {recommendation.lanes.map((lane, index) => (
              <div
                key={lane.name}
                className={`flex items-center justify-between px-4 py-3 ${
                  index < recommendation.lanes.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-ink text-sm font-medium">{lane.name}</span>
                  {lane.isOpen ? (
                    <span className="px-2 py-0.5 bg-improving/10 text-improving text-[10px] font-medium rounded-full">
                      {t("crossing.details.open")}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-critical/10 text-critical text-[10px] font-medium rounded-full">
                      {t("crossing.details.closed")}
                    </span>
                  )}
                </div>
                <span className="text-ink text-sm font-medium tabular">
                  {lane.isOpen ? `${lane.waitTime} min` : "—"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Documents Required */}
        <section className="space-y-3">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider">
            {t("crossing.details.documents")}
          </h2>
          <div className="bg-surface-raised rounded-[var(--radius-lg)] p-4 space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-faint shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-ink text-sm font-medium">{t("crossing.details.requiredDocuments")}</p>
                <ul className="space-y-1">
                  <li className="text-faint text-xs">• {t("crossing.details.validPassport")}</li>
                  <li className="text-faint text-xs">• {t("crossing.details.visaIfRequired")}</li>
                  <li className="text-faint text-xs">• {t("crossing.details.vehicleRegistration")}</li>
                  <li className="text-faint text-xs">• {t("crossing.details.insurance")}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Rules & Restrictions */}
        <section className="space-y-3">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider">
            {t("crossing.details.rules")}
          </h2>
          <div className="bg-surface-raised rounded-[var(--radius-lg)] p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-faint shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-ink text-sm font-medium">{t("crossing.details.customsRegulations")}</p>
                <ul className="space-y-1">
                  <li className="text-faint text-xs">• {t("crossing.details.declarationRequired")}</li>
                  <li className="text-faint text-xs">• {t("crossing.details.dutyFreeLimit")}</li>
                  <li className="text-faint text-xs">• {t("crossing.details.prohibitedItems")}</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border" />
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-caution shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-ink text-sm font-medium">{t("crossing.details.importantNotes")}</p>
                <ul className="space-y-1">
                  <li className="text-faint text-xs">• {t("crossing.details.waitTimesVary")}</li>
                  <li className="text-faint text-xs">• {t("crossing.details.arriveEarly")}</li>
                  <li className="text-faint text-xs">• {t("crossing.details.checkStatus")}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom padding for safe area */}
        <div className="h-8" />
      </div>
    </div>
  );
}
