export interface Source {
  url: string;
  title: string;
  citation: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  timestamp: Date;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  originalContent: string;
  status: 'pending' | 'approved' | 'rejected';
  sources: Source[];
  comments: Comment[];
  lastModified: Date;
  modifiedBy: string;
  version: number;
  versionHistory: VersionEntry[];
  parentId: string | null;
  reviews?: Review[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
}

export interface VersionEntry {
  version: number;
  content: string;
  timestamp: Date;
  author: string;
}

export interface Template {
  id: string;
  name: string;
  sections: Section[];
  createdAt: Date;
  modifiedAt: Date;
}

export interface User {
  id: string;
  name: string;
  role: 'editor' | 'reviewer' | 'admin';
}