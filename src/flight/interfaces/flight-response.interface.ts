export interface FlightResponse {
  itineraries: ItineraryData;
}

export interface ItineraryData {
  buckets: ItineraryBucket[];
  context: {
    sessionId: string;
    status: string;
    totalResults: number;
  };
}

export interface ItineraryBucket {
  id: string;
  name: string;
  items: ItineraryItem[];
}

export interface ItineraryItem {
  id: string;
  price: {
    formatted: string;
    raw: number;
  };
  legs: ItineraryLeg[];
  tags?: string[];
}

export interface ItineraryLeg {
  id: string;
  departure: string;
  arrival: string;
  durationInMinutes: number;
  origin: Airport;
  destination: Airport;
  carriers: {
    marketing: Carrier[];
    operationType: string;
  };
  stopCount: number;
  segments: ItinerarySegment[];
}

export interface Airport {
  id: string;
  name: string;
  displayCode: string;
  city: string;
  country: string;
  parent?: Airport;
}

export interface Carrier {
  id: number;
  name: string;
  logoUrl: string;
}

export interface ItinerarySegment {
  id: string;
  departure: string;
  arrival: string;
  durationInMinutes: number;
  flightNumber: string;
  origin: Airport;
  destination: Airport;
  marketingCarrier: Carrier;
  operatingCarrier: Carrier;
}
