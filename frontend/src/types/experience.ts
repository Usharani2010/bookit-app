export interface Experience {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  image: string; // Base64 string (backend)
  imageFormat: string; // Image format
  imageUrl: string; // Data URL for frontend display
  location: string;
  duration: string;
  category: string;
  includes: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  _id: string;
  experienceId: string;
  date: string;
  time: string;
  maxSeats: number;
  availableSeats: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceWithSlots {
  experience: Experience;
  slots: Slot[];
}