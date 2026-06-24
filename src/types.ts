export interface Source {
  sourceName: string;
  verified: boolean;
  url: string;
  lastChecked: string;
}

export interface ConflictingField {
  field: string;
  values: {
    source: string;
    value: string;
  }[];
}

export interface Verification {
  score: number;
  confidence: "High" | "Medium" | "Low";
  sources: Source[];
  conflictingFields?: ConflictingField[];
}

export interface SocialProfile {
  platform: string;
  url: string;
}

export interface Business {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  working_hours: string;
  rating: number;
  review_count: number;
  services: string[];
  specialties: string[];
  certifications: string[];
  awards: string[];
  social_profiles: SocialProfile[];
  image_urls: string[];
  source_urls: string[];
  verification: Verification;
}

export interface DuplicateRecord {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  source: string;
}

export interface SearchSession {
  id: string;
  query: string;
  category: string;
  location: string;
  timestamp: string;
  status: "searching" | "verifying" | "deduplicating" | "reporting" | "completed" | "failed";
  progress: number;
  results: Business[];
  duplicates: DuplicateRecord[];
  summary: {
    businessesFound: number;
    businessesVerified: number;
    duplicatesRemoved: number;
    sourcesSearched: string[];
    durationMs: number;
    quality: {
      websiteCoverage: number;
      phoneCoverage: number;
      hoursCoverage: number;
      verificationRate: number;
    };
    aiReport: string;
  };
}

export interface SystemStats {
  totalSearches: number;
  businessesIndexed: number;
  averageConfidence: number;
  popularQueries: {
    query: string;
    count: number;
    category: string;
  }[];
  performanceHistory: {
    name: string;
    searches: number;
    verified: number;
  }[];
}
