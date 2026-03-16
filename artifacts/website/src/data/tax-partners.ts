export interface TaxPartner {
  id: string;
  firmName: string;
  contactName: string;
  credentials: string[];
  statesCovered: string[];
  nationwide: boolean;
  specialties: string[];
  region: string;
  website?: string;
  email: string;
  phone: string;
}

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

export const SPECIALTIES = [
  "Individual Tax",
  "Small Business Tax",
  "Multi-Entity Structures",
  "Crypto & Digital Assets",
  "Agriculture & Farming",
  "Timber & Forestry",
  "Real Estate",
  "E-Commerce",
  "Cannabis Industry",
  "Nonprofit Organizations",
  "International Tax",
  "Estate & Trust",
  "IRS Representation",
  "State & Local Tax (SALT)",
];

export const REGIONS = [
  "Northeast",
  "Southeast",
  "Midwest",
  "Southwest",
  "West Coast",
  "Pacific Northwest",
  "Nationwide",
];

export const taxPartners: TaxPartner[] = [];
