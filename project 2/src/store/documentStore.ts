import { create } from 'zustand';
import { Template, Section, Comment } from '../types';

interface DocumentState {
  templates: Template[];
  activeTemplate: Template | null;
  setActiveTemplate: (template: Template) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  addComment: (sectionId: string, comment: Comment) => void;
  approveSection: (sectionId: string) => void;
  rejectSection: (sectionId: string) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  templates: [],
  activeTemplate: null,
  
  setActiveTemplate: (template) => set({ activeTemplate: template }),
  
  updateSection: (sectionId, updates) =>
    set((state) => ({
      activeTemplate: state.activeTemplate
        ? {
            ...state.activeTemplate,
            sections: state.activeTemplate.sections.map((section) =>
              section.id === sectionId
                ? { ...section, ...updates, version: section.version + 1 }
                : section
            ),
          }
        : null,
    })),
    
  addComment: (sectionId, comment) =>
    set((state) => ({
      activeTemplate: state.activeTemplate
        ? {
            ...state.activeTemplate,
            sections: state.activeTemplate.sections.map((section) =>
              section.id === sectionId
                ? { ...section, comments: [...section.comments, comment] }
                : section
            ),
          }
        : null,
    })),
    
  approveSection: (sectionId) =>
    set((state) => ({
      activeTemplate: state.activeTemplate
        ? {
            ...state.activeTemplate,
            sections: state.activeTemplate.sections.map((section) =>
              section.id === sectionId
                ? { ...section, status: 'approved' }
                : section
            ),
          }
        : null,
    })),
    
  rejectSection: (sectionId) =>
    set((state) => ({
      activeTemplate: state.activeTemplate
        ? {
            ...state.activeTemplate,
            sections: state.activeTemplate.sections.map((section) =>
              section.id === sectionId
                ? { ...section, status: 'rejected' }
                : section
            ),
          }
        : null,
    })),
}));