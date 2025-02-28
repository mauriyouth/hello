import React from 'react';
import { useDocumentStore } from './store/documentStore';
import { SectionEditor } from './components/SectionEditor';
import { RightPanel } from './components/RightPanel';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronRight, 
  PanelRightClose, 
  PanelRightOpen,
  FileSpreadsheet,
  FileText as FileTextIcon,
  MoreVertical
} from 'lucide-react';

function App() {
  const { activeTemplate, updateSection, addComment, approveSection, rejectSection } = useDocumentStore();
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set());
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = React.useState(true);
  const [hoveredSection, setHoveredSection] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!activeTemplate) {
      const mockTemplate = {
        id: '1',
        name: 'Credit Workspace',
        sections: [
          {
            id: '1',
            title: 'Executive Summary',
            content: 'This document outlines the technical specifications and implementation details of our system.',
            originalContent: 'This document outlines the technical specifications and implementation details of our system.',
            status: 'pending',
            sources: [
              {
                url: 'https://example.com/source1',
                title: 'Technical Overview',
                citation: 'System Architecture Guide, 2024'
              }
            ],
            comments: [],
            lastModified: new Date(),
            modifiedBy: 'John Doe',
            version: 1,
            versionHistory: [
              {
                version: 1,
                content: 'Initial version',
                timestamp: new Date(),
                author: 'John Doe'
              }
            ],
            parentId: null,
            reviews: [
              {
                id: '1',
                rating: 4,
                comment: 'Well-structured overview of the system',
                author: 'Jane Smith',
                timestamp: new Date()
              }
            ]
          },
          {
            id: '2',
            title: 'System Architecture',
            content: 'The system follows a microservices architecture with containerized deployments.',
            originalContent: 'The system follows a microservices architecture with containerized deployments.',
            status: 'pending',
            sources: [],
            comments: [],
            lastModified: new Date(),
            modifiedBy: 'John Doe',
            version: 1,
            versionHistory: [],
            parentId: null
          },
          {
            id: '2.1',
            title: 'Frontend Components',
            content: 'React-based frontend with TypeScript and modern state management.',
            originalContent: 'React-based frontend with TypeScript and modern state management.',
            status: 'pending',
            sources: [],
            comments: [],
            lastModified: new Date(),
            modifiedBy: 'John Doe',
            version: 1,
            versionHistory: [],
            parentId: '2'
          },
          {
            id: '2.2',
            title: 'Backend Services',
            content: 'Node.js microservices with Express and PostgreSQL.',
            originalContent: 'Node.js microservices with Express and PostgreSQL.',
            status: 'pending',
            sources: [],
            comments: [],
            lastModified: new Date(),
            modifiedBy: 'John Doe',
            version: 1,
            versionHistory: [],
            parentId: '2'
          },
          {
            id: '3',
            title: 'Data Flow',
            content: 'Description of how data moves through the system.',
            originalContent: 'Description of how data moves through the system.',
            status: 'pending',
            sources: [],
            comments: [],
            lastModified: new Date(),
            modifiedBy: 'John Doe',
            version: 1,
            versionHistory: [],
            parentId: null
          },
          {
            id: '3.1',
            title: 'User Data Processing',
            content: 'Details of user data handling and processing workflows.',
            originalContent: 'Details of user data handling and processing workflows.',
            status: 'pending',
            sources: [],
            comments: [],
            lastModified: new Date(),
            modifiedBy: 'John Doe',
            version: 1,
            versionHistory: [],
            parentId: '3'
          },
          {
            id: '4',
            title: 'Security Measures',
            content: 'Overview of system security implementations.',
            originalContent: 'Overview of system security implementations.',
            status: 'pending',
            sources: [],
            comments: [],
            lastModified: new Date(),
            modifiedBy: 'John Doe',
            version: 1,
            versionHistory: [],
            parentId: null
          },
          {
            id: '4.1',
            title: 'Authentication',
            content: 'Details of the authentication system and user management.',
            originalContent: 'Details of the authentication system and user management.',
            status: 'pending',
            sources: [],
            comments: [],
            lastModified: new Date(),
            modifiedBy: 'John Doe',
            version: 1,
            versionHistory: [],
            parentId: '4'
          },
          {
            id: '5',
            title: 'Deployment Strategy',
            content: 'Details of the deployment and scaling approach.',
            originalContent: 'Details of the deployment and scaling approach.',
            status: 'pending',
            sources: [],
            comments: [],
            lastModified: new Date(),
            modifiedBy: 'John Doe',
            version: 1,
            versionHistory: [],
            parentId: null
          }
        ],
        createdAt: new Date(),
        modifiedAt: new Date()
      };
      useDocumentStore.setState({ activeTemplate: mockTemplate });
    }
  }, [activeTemplate]);

  if (!activeTemplate) {
    return <div>Loading...</div>;
  }

  const mainSections = activeTemplate.sections.filter(section => !section.parentId);
  const getSubsections = (parentId: string) => 
    activeTemplate.sections.filter(section => section.parentId === parentId);

  const selectedSection = selectedCard 
    ? activeTemplate.sections.find(s => s.id === selectedCard)
    : null;

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const renderSection = (section: typeof activeTemplate.sections[0], level: number = 0, index: number) => {
    const subsections = getSubsections(section.id);
    const isExpanded = expandedSections.has(section.id);
    const isHovered = hoveredSection === section.id;
    const isSelected = selectedCard === section.id;
    
    return (
      <div 
        key={section.id} 
        className="relative"
        onMouseEnter={() => setHoveredSection(section.id)}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <div
          onClick={() => toggleSection(section.id)}
          className={`
            w-full text-left px-4 py-3 rounded-lg 
            flex items-center gap-3
            transition-all duration-300 cursor-pointer
            ${isSelected ? 'bg-primary-100/30' : 'hover:bg-primary-100/20'}
            ${level === 0 ? 'mb-2' : 'mb-1'}
          `}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleSection(section.id);
            }
          }}
          aria-expanded={isExpanded}
        >
          <div className={`
            flex items-center gap-2 flex-1
            ${level > 0 ? 'ml-6' : ''}
          `}>
            <div className="flex items-center gap-2 min-w-[32px]">
              {level === 0 ? (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100/30 text-primary-500 font-semibold">
                  {index + 1}
                </div>
              ) : (
                <div className="flex items-center text-sm text-primary-400 font-medium ml-2">
                  {`${Math.floor(index / 10 + 1)}.${(index % 10) + 1}`}
                </div>
              )}
            </div>
            {level === 0 ? (
              <FileSpreadsheet 
                size={20} 
                className={`
                  transition-colors
                  ${isSelected || isHovered ? 'text-primary-400' : 'text-primary-300'}
                `}
              />
            ) : (
              <FileTextIcon 
                size={18} 
                className={`
                  transition-colors
                  ${isSelected || isHovered ? 'text-primary-400' : 'text-gray-400'}
                `}
              />
            )}
            <span className={`
              font-medium transition-colors
              ${isSelected || isHovered ? 'text-primary-500' : 'text-gray-700'}
              ${level === 0 ? 'text-lg' : 'text-base'}
            `}>
              {section.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {section.status === 'approved' && (
              <CheckCircle size={18} className="text-green-500" />
            )}
            {section.status === 'rejected' && (
              <XCircle size={18} className="text-red-500" />
            )}
            {section.status === 'pending' && (
              <Clock size={18} className="text-yellow-500" />
            )}
            
            {subsections.length > 0 && (
              <ChevronRight
                size={18}
                className={`
                  transform transition-transform
                  ${isExpanded ? 'rotate-90' : ''}
                  ${isSelected || isHovered ? 'text-primary-400' : 'text-gray-400'}
                `}
              />
            )}
          </div>

          {(isHovered || isSelected) && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  approveSection(section.id);
                }}
                className="p-2 rounded-full hover:bg-primary-100/50 text-primary-300 transition-colors"
                title="Approve"
              >
                <CheckCircle size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  rejectSection(section.id);
                }}
                className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                title="Reject"
              >
                <XCircle size={18} />
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                title="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div 
            className={`
              pl-4 space-y-1
              ${level === 0 ? 'mt-2' : 'mt-1'}
            `}
            role="group"
          >
            {subsections.map((subsection, subIndex) => 
              renderSection(subsection, level + 1, subIndex)
            )}
          </div>
        )}

        {isExpanded && (
          <div 
            className="cursor-pointer mt-2"
            onClick={() => setSelectedCard(section.id)}
          >
            <SectionEditor
              section={section}
              onUpdate={(updates) => updateSection(section.id, updates)}
              onApprove={() => approveSection(section.id)}
              onReject={() => rejectSection(section.id)}
              onComment={(comment) => addComment(section.id, comment)}
              isSelected={selectedCard === section.id}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-300 shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-white mr-2" />
              <h1 className="text-2xl font-bold text-white">
                {activeTemplate.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-white/90">
                <CheckCircle className="h-5 w-5 text-primary-100 mr-1" />
                <span>Approved: {activeTemplate.sections.filter(s => s.status === 'approved').length}</span>
              </div>
              <div className="flex items-center text-sm text-white/90">
                <XCircle className="h-5 w-5 text-red-300 mr-1" />
                <span>Rejected: {activeTemplate.sections.filter(s => s.status === 'rejected').length}</span>
              </div>
              <div className="flex items-center text-sm text-white/90">
                <Clock className="h-5 w-5 text-primary-100 mr-1" />
                <span>Pending: {activeTemplate.sections.filter(s => s.status === 'pending').length}</span>
              </div>
              <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="ml-4 p-2 rounded-full hover:bg-primary-400 text-white transition-colors"
                title={isPanelOpen ? "Close panel" : "Open panel"}
              >
                {isPanelOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        <main 
          className={`
            transition-all duration-300
            ${isPanelOpen ? 'w-2/3 lg:w-3/4' : 'w-full'}
            min-h-screen px-4 py-6 sm:px-6 lg:px-8
          `}
          role="tree"
        >
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {mainSections.map((section, index) => renderSection(section, 0, index))}
            </div>
          </div>
        </main>

        <aside 
          className={`
            fixed right-0 top-20 h-[calc(100vh-5rem)] 
            w-1/3 lg:w-1/4 bg-white shadow-lg 
            transition-transform duration-300 transform
            ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}
            overflow-y-auto
          `}
          role="complementary"
        >
          {selectedSection ? (
            <RightPanel section={selectedSection} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a card to view details</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;