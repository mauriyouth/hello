import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Section, Comment } from '../types';

interface SectionEditorProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
  onApprove: () => void;
  onReject: () => void;
  onComment: (comment: Comment) => void;
  isSelected?: boolean;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  onUpdate,
  onApprove,
  onReject,
  isSelected = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={`border rounded-lg p-4 mb-4 bg-white shadow-sm transition-all duration-300 ${
      isSelected ? 'ring-2 ring-primary-300 shadow-md' : 'hover:shadow-md'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-primary-500">{section.title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove();
            }}
            className="p-2 rounded-full hover:bg-primary-100/50 text-primary-300"
            title="Approve"
          >
            <Check size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject();
            }}
            className="p-2 rounded-full hover:bg-red-100 text-red-500"
            title="Reject"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        {isEditing ? (
          <textarea
            value={section.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-200 focus:border-primary-300 outline-none"
            rows={5}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className="prose max-w-none cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {section.content}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        Status: <span className="capitalize">{section.status}</span>
      </div>
    </div>
  );
};