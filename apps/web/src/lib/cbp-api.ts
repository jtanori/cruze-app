/**
 * CBP Border Wait Times API Service
 * https://bwt.cbp.gov/api/waittimes
 *
 * Free, no API key required.
 * Updated every ~10 minutes.
 * Covers 55+ US-Mexico and US-Canada crossings.
 */

const CBP_API_URL = "https://bwt.cbp.gov/api/waittimes";

interface CBPLaneData {
  update_time: string;
  operational_status: string;
  delay_minutes: string;
  lanes_open: string;
}

interface CBPPortData {
  port_number: string;
  border: string;
  port_name: string;
  crossing_name: string;
  hours: string;
  date: string;
  time: string;
  port_status: string;
  commercial_vehicle_lanes: {
    maximum_lanes: string;
    standard_lanes: CBPLaneData;
    FAST_lanes: CBPLaneData;
  };
  passenger_vehicle_lanes: {
    maximum_lanes: string;
    standard_lanes: CBPLaneData;
    NEXUS_SENTRI_lanes: CBPLaneData;
    ready_lanes: CBPLaneData;
  };
  pedestrian_lanes: {
    maximum_lanes: string;
    standard_lanes: CBPLaneData;
    ready_lanes: CBPLaneData;
  };
  construction_notice: string;
}

export interface CBPLane {
  name: string;
  category: "passenger" | "commercial" | "pedestrian";
  waitTime: number;
  isOpen: boolean;
  lanesOpen: number;
  updateTime: string;
}

export interface NormalizedCrossingWait {
  portId: string;
  portNumber: string;
  portName: string;
  crossingName: string;
  hours: string;
  status: "OPEN" | "CLOSED" | "LIMITED";
  lastUpdated: string;
  constructionNotice: string;
  lanes: CBPLane[];
  primaryWaitTime: number;
}

/** Cache for CBP data */
let cbpCache: { data: NormalizedCrossingWait[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Parse delay_minutes string to number */
function parseDelay(delay: string): number {
  if (!delay || delay === "N/A" || delay === "Update Pending") return 0;
  const num = parseInt(delay, 10);
  return isNaN(num) ? 0 : num;
}

/** Parse lanes_open string to number */
function parseLanesOpen(lanes: string): number {
  if (!lanes || lanes === "N/A" || lanes === "Update Pending") return 0;
  const num = parseInt(lanes, 10);
  return isNaN(num) ? 0 : num;
}

/** Map CBP port name to our internal crossing ID — dynamic, no hardcoded table to maintain */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const LEGACY_ALIASES: Record<string, string> = {
  // CBP naming quirks → canonical id (kept minimal, everything else slugifies directly)
  "nogales-deconcini": "nogales-deconcini",
  "nogales-de-concini": "nogales-deconcini",
  "san-luis-rio-colorado": "san-luis",
  ysleta: "el-paso-ysleta",
  "stanton-dcl": "el-paso-stanton",
  "bridge-of-the-americas": "el-paso-bridge-of-americas",
  laredo: "laredo-juarez-lincoln",
  hidalgo: "hidalgo",
  brownsville: "brownsville-veterans",
};

function mapPortToCrossingId(portName: string, crossingName: string): string | null {
  const raw = crossingName?.trim() ? `${portName} ${crossingName}` : portName;
  const slug = slugify(raw);

  // 1) Direct slug — if we add a new port to border-data.ts with matching slug, it auto-resolves
  //    e.g. "San Ysidro" → "san-ysidro", "Andrade" → "andrade", "Presidio" → "presidio"
  //    No table update needed on add/remove/edit.

  // 2) Legacy aliases for CBP quirks where slug != canonical id
  if (LEGACY_ALIASES[slug]) return LEGACY_ALIASES[slug];

  // 3) Substring fallback: check if slug contains a known alias key (covers "Nogales Mariposa" etc.)
  for (const [key, value] of Object.entries(LEGACY_ALIASES)) {
    if (slug.includes(key)) return value;
  }

  // 4) Return slug directly — border-data.ts should use same slug convention, so new ports auto-pass
  //    Caller filters by existence in BORDER_CROSSINGS; if not found, it will be ignored (not dropped silently)
  return slug || null;
}

/** Fetch wait times from CBP API */
export async function fetchCBPWaitTimes(): Promise<NormalizedCrossingWait[]> {
  // Check cache
  if (cbpCache && Date.now() - cbpCache.timestamp < CACHE_TTL_MS) {
    return cbpCache.data;
  }

  try {
    const response = await fetch(CBP_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 }, // Cache for 5 minutes on server
    });

    if (!response.ok) {
      throw new Error(`CBP API error: ${response.status}`);
    }

    const data: CBPPortData[] = await response.json();

    // Filter Mexican border crossings only
    const mexicanBorderPorts = data.filter(
      (port) => port.border === "Mexican Border"
    );

    // Normalize data
    const normalized: NormalizedCrossingWait[] = mexicanBorderPorts
      .map((port) => {
        const crossingId = mapPortToCrossingId(port.port_name, port.crossing_name);
        if (!crossingId) return null;

        const lanes: CBPLane[] = [];

        // Passenger Vehicle Lanes
        const passengerLanes = port.passenger_vehicle_lanes;
        if (passengerLanes.standard_lanes.operational_status !== "N/A") {
          lanes.push({
            name: "Standard",
            category: "passenger",
            waitTime: parseDelay(passengerLanes.standard_lanes.delay_minutes),
            isOpen: passengerLanes.standard_lanes.operational_status !== "Lanes Closed",
            lanesOpen: parseLanesOpen(passengerLanes.standard_lanes.lanes_open),
            updateTime: passengerLanes.standard_lanes.update_time,
          });
        }
        if (passengerLanes.NEXUS_SENTRI_lanes.operational_status !== "N/A") {
          lanes.push({
            name: "SENTRI",
            category: "passenger",
            waitTime: parseDelay(passengerLanes.NEXUS_SENTRI_lanes.delay_minutes),
            isOpen: passengerLanes.NEXUS_SENTRI_lanes.operational_status !== "Lanes Closed",
            lanesOpen: parseLanesOpen(passengerLanes.NEXUS_SENTRI_lanes.lanes_open),
            updateTime: passengerLanes.NEXUS_SENTRI_lanes.update_time,
          });
        }
        if (passengerLanes.ready_lanes.operational_status !== "N/A") {
          lanes.push({
            name: "Ready Lane",
            category: "passenger",
            waitTime: parseDelay(passengerLanes.ready_lanes.delay_minutes),
            isOpen: passengerLanes.ready_lanes.operational_status !== "Lanes Closed",
            lanesOpen: parseLanesOpen(passengerLanes.ready_lanes.lanes_open),
            updateTime: passengerLanes.ready_lanes.update_time,
          });
        }

        // Commercial Vehicle Lanes
        const commercialLanes = port.commercial_vehicle_lanes;
        if (commercialLanes.standard_lanes.operational_status !== "N/A") {
          lanes.push({
            name: "Standard",
            category: "commercial",
            waitTime: parseDelay(commercialLanes.standard_lanes.delay_minutes),
            isOpen: commercialLanes.standard_lanes.operational_status !== "Lanes Closed",
            lanesOpen: parseLanesOpen(commercialLanes.standard_lanes.lanes_open),
            updateTime: commercialLanes.standard_lanes.update_time,
          });
        }
        if (commercialLanes.FAST_lanes.operational_status !== "N/A") {
          lanes.push({
            name: "FAST",
            category: "commercial",
            waitTime: parseDelay(commercialLanes.FAST_lanes.delay_minutes),
            isOpen: commercialLanes.FAST_lanes.operational_status !== "Lanes Closed",
            lanesOpen: parseLanesOpen(commercialLanes.FAST_lanes.lanes_open),
            updateTime: commercialLanes.FAST_lanes.update_time,
          });
        }

        // Pedestrian Lanes
        const pedestrianLanes = port.pedestrian_lanes;
        if (pedestrianLanes.standard_lanes.operational_status !== "N/A") {
          lanes.push({
            name: "Pedestrian",
            category: "pedestrian",
            waitTime: parseDelay(pedestrianLanes.standard_lanes.delay_minutes),
            isOpen: pedestrianLanes.standard_lanes.operational_status !== "Lanes Closed",
            lanesOpen: parseLanesOpen(pedestrianLanes.standard_lanes.lanes_open),
            updateTime: pedestrianLanes.standard_lanes.update_time,
          });
        }
        if (pedestrianLanes.ready_lanes.operational_status !== "N/A") {
          lanes.push({
            name: "Pedestrian Ready",
            category: "pedestrian",
            waitTime: parseDelay(pedestrianLanes.ready_lanes.delay_minutes),
            isOpen: pedestrianLanes.ready_lanes.operational_status !== "Lanes Closed",
            lanesOpen: parseLanesOpen(pedestrianLanes.ready_lanes.lanes_open),
            updateTime: pedestrianLanes.ready_lanes.update_time,
          });
        }

        let status: "OPEN" | "CLOSED" | "LIMITED" = "OPEN";
        if (port.port_status === "Closed") status = "CLOSED";
        else if (lanes.every((l) => !l.isOpen)) status = "LIMITED";

        // Primary wait time is passenger standard lane
        const primaryLane = lanes.find(
          (l) => l.category === "passenger" && l.name === "Standard"
        );
        const primaryWaitTime = primaryLane?.waitTime || 0;

        return {
          portId: crossingId,
          portNumber: port.port_number,
          portName: port.port_name,
          crossingName: port.crossing_name || port.port_name,
          hours: port.hours,
          status,
          lastUpdated: `${port.date} ${port.time}`,
          constructionNotice: port.construction_notice || "",
          lanes,
          primaryWaitTime,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    // Update cache
    cbpCache = { data: normalized, timestamp: Date.now() };

    return normalized;
  } catch (error) {
    console.error("Failed to fetch CBP wait times:", error);
    return cbpCache?.data || [];
  }
}

/** Get wait time for a specific crossing */
export async function getCrossingWaitTime(
  crossingId: string
): Promise<NormalizedCrossingWait | null> {
  const allData = await fetchCBPWaitTimes();
  return allData.find((p) => p.portId === crossingId) || null;
}
