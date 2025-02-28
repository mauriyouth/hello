import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  MoreHorizontal, 
  ChevronDown,
  Users,
  FileText,
  DollarSign,
  BarChart4
} from 'lucide-react';

// Types
interface KanbanCard {
  id: string;
  title: string;
  description: string;
  status: 'ongoing' | 'done' | 'blocked' | 'review';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  assignee: string;
  industry: string;
  legalEntity: string;
  requestType: 'financial-analysis' | 'credit-memo' | 'due-diligence';
  requestName: string;
  amount: number;
  createdAt: Date;
  tags: string[];
}

interface FilterState {
  industry: string[];
  requestName: string;
  legalEntity: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  requestType: ('financial-analysis' | 'credit-memo' | 'due-diligence')[];
  status: ('ongoing' | 'done' | 'blocked' | 'review')[];
  priority: ('low' | 'medium' | 'high')[];
}

const KanbanBoard: React.FC = () => {
  // Sample data
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<KanbanCard[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState<FilterState>({
    industry: [],
    requestName: '',
    legalEntity: [],
    dateRange: {
      from: null,
      to: null
    },
    requestType: [],
    status: [],
    priority: []
  });

  // Generate sample data
  useEffect(() => {
    const industries = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Energy'];
    const legalEntities = ['ABC Corp', 'XYZ Inc', 'Global Holdings', 'Tech Innovations', 'Finance Solutions'];
    const assignees = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'];
    const statuses: ('ongoing' | 'done' | 'blocked' | 'review')[] = ['ongoing', 'done', 'blocked', 'review'];
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const requestTypes: ('financial-analysis' | 'credit-memo' | 'due-diligence')[] = ['financial-analysis', 'credit-memo', 'due-diligence'];
    
    const sampleCards: KanbanCard[] = Array.from({ length: 20 }, (_, i) => {
      const requestType = requestTypes[Math.floor(Math.random() * requestTypes.length)];
      const industry = industries[Math.floor(Math.random() * industries.length)];
      
      return {
        id: `card-${i + 1}`,
        title: `${requestType === 'financial-analysis' ? 'Financial Analysis' : 
                requestType === 'credit-memo' ? 'Credit Memo' : 'Due Diligence'} - ${industry}`,
        description: `Detailed ${requestType.replace('-', ' ')} for ${industry} sector client`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        assignee: assignees[Math.floor(Math.random() * assignees.length)],
        industry,
        legalEntity: legalEntities[Math.floor(Math.random() * legalEntities.length)],
        requestType,
        requestName: `Request #${1000 + i}`,
        amount: Math.floor(Math.random() * 1000000) + 50000,
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        tags: [industry, `Q${Math.floor(Math.random() * 4) + 1}`, Math.random() > 0.5 ? 'Urgent' : 'Standard']
      };
    });
    
    setCards(sampleCards);
    setFilteredCards(sampleCards);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...cards];
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(card => 
        card.title.toLowerCase().includes(query) || 
        card.description.toLowerCase().includes(query) ||
        card.requestName.toLowerCase().includes(query)
      );
    }
    
    // Industry filter
    if (filters.industry.length > 0) {
      result = result.filter(card => filters.industry.includes(card.industry));
    }
    
    // Legal entity filter
    if (filters.legalEntity.length > 0) {
      result = result.filter(card => filters.legalEntity.includes(card.legalEntity));
    }
    
    // Request type filter
    if (filters.requestType.length > 0) {
      result = result.filter(card => filters.requestType.includes(card.requestType));
    }
    
    // Status filter
    if (filters.status.length > 0) {
      result = result.filter(card => filters.status.includes(card.status));
    }
    
    // Priority filter
    if (filters.priority.length > 0) {
      result = result.filter(card => filters.priority.includes(card.priority));
    }
    
    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      result = result.filter(card => {
        const cardDate = new Date(card.dueDate);
        if (filters.dateRange.from && filters.dateRange.to) {
          return cardDate >= filters.dateRange.from && cardDate <= filters.dateRange.to;
        } else if (filters.dateRange.from) {
          return cardDate >= filters.dateRange.from;
        } else if (filters.dateRange.to) {
          return cardDate <= filters.dateRange.to;
        }
        return true;
      });
    }
    
    // Request name filter
    if (filters.requestName) {
      result = result.filter(card => 
        card.requestName.toLowerCase().includes(filters.requestName.toLowerCase())
      );
    }
    
    setFilteredCards(result);
  }, [cards, filters, searchQuery]);

  // Toggle filter selection
  const toggleFilter = (filterType: keyof FilterState, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (Array.isArray(newFilters[filterType])) {
        const array = newFilters[filterType] as any[];
        if (array.includes(value)) {
          newFilters[filterType] = array.filter(item => item !== value) as any;
        } else {
          newFilters[filterType] = [...array, value] as any;
        }
      } else if (typeof newFilters[filterType] === 'string') {
        newFilters[filterType] = value;
      } else if (typeof newFilters[filterType] === 'object' && !Array.isArray(newFilters[filterType])) {
        newFilters[filterType] = { ...newFilters[filterType], ...value };
      }
      
      return newFilters;
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      industry: [],
      requestName: '',
      legalEntity: [],
      dateRange: {
        from: null,
        to: null
      },
      requestType: [],
      status: [],
      priority: []
    });
    setSearchQuery('');
  };

  // Get cards by status
  const getCardsByStatus = (status: 'ongoing' | 'done' | 'blocked' | 'review') => {
    return filteredCards.filter(card => card.status === status);
  };

  // Get unique values for filter options
  const getUniqueValues = (key: keyof KanbanCard) => {
    return Array.from(new Set(cards.map(card => card[key])));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  // Get icon for request type
  const getRequestTypeIcon = (type: 'financial-analysis' | 'credit-memo' | 'due-diligence') => {
    switch (type) {
      case 'financial-analysis':
        return <BarChart4 size={16} className="text-blue-500" />;
      case 'credit-memo':
        return <FileText size={16} className="text-green-500" />;
      case 'due-diligence':
        return <Briefcase size={16} className="text-purple-500" />;
    }
  };

  // Get color for priority
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
    }
  };

  // Get icon for status
  const getStatusIcon = (status: 'ongoing' | 'done' | 'blocked' | 'review') => {
    switch (status) {
      case 'ongoing':
        return <Clock size={16} className="text-blue-500" />;
      case 'done':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'blocked':
        return <XCircle size={16} className="text-red-500" />;
      case 'review':
        return <AlertTriangle size={16} className="text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-500">Financial Analysis Kanban</h1>
            <button className="bg-primary-300 hover:bg-primary-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus size={18} />
              <span>New Request</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, description or request name..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-primary-300 focus:border-primary-300"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
                    isFilterOpen || Object.values(filters).some(val => 
                      Array.isArray(val) ? val.length > 0 : 
                      typeof val === 'string' ? val !== '' : 
                      val !== null && typeof val === 'object' ? Object.values(val).some(v => v !== null) : false
                    )
                      ? 'bg-primary-100 border-primary-300 text-primary-500'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Filter size={18} />
                  <span>Filters</span>
                  <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                {Object.values(filters).some(val => 
                  Array.isArray(val) ? val.length > 0 : 
                  typeof val === 'string' ? val !== '' : 
                  val !== null && typeof val === 'object' ? Object.values(val).some(v => v !== null) : false
                ) && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Industry Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Building2 size={16} />
                      Industry
                    </h3>
                    <div className="space-y-2">
                      {getUniqueValues('industry').map((industry) => (
                        <label key={industry as string} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.industry.includes(industry as string)}
                            onChange={() => toggleFilter('industry', industry)}
                            className="rounded text-primary-300 focus:ring-primary-200"
                          />
                          <span className="ml-2 text-sm text-gray-600">{industry as string}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Legal Entity Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Briefcase size={16} />
                      Legal Entity
                    </h3>
                    <div className="space-y-2">
                      {getUniqueValues('legalEntity').map((entity) => (
                        <label key={entity as string} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.legalEntity.includes(entity as string)}
                            onChange={() => toggleFilter('legalEntity', entity)}
                            className="rounded text-primary-300 focus:ring-primary-200"
                          />
                          <span className="ml-2 text-sm text-gray-600">{entity as string}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Request Type Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={16} />
                      Request Type
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.requestType.includes('financial-analysis')}
                          onChange={() => toggleFilter('requestType', 'financial-analysis')}
                          className="rounded text-primary-300 focus:ring-primary-200"
                        />
                        <span className="ml-2 text-sm text-gray-600">Financial Analysis</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.requestType.includes('credit-memo')}
                          onChange={() => toggleFilter('requestType', 'credit-memo')}
                          className="rounded text-primary-300 focus:ring-primary-200"
                        />
                        <span className="ml-2 text-sm text-gray-600">Credit Memo</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.requestType.includes('due-diligence')}
                          onChange={() => toggleFilter('requestType', 'due-diligence')}
                          className="rounded text-primary-300 focus:ring-primary-200"
                        />
                        <span className="ml-2 text-sm text-gray-600">Due Diligence</span>
                      </label>
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Clock size={16} />
                      Status
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status.includes('ongoing')}
                          onChange={() => toggleFilter('status', 'ongoing')}
                          className="rounded text-primary-300 focus:ring-primary-200"
                        />
                        <span className="ml-2 text-sm text-gray-600">Ongoing</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status.includes('done')}
                          onChange={() => toggleFilter('status', 'done')}
                          className="rounded text-primary-300 focus:ring-primary-200"
                        />
                        <span className="ml-2 text-sm text-gray-600">Done</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status.includes('blocked')}
                          onChange={() => toggleFilter('status', 'blocked')}
                          className="rounded text-primary-300 focus:ring-primary-200"
                        />
                        <span className="ml-2 text-sm text-gray-600">Blocked</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status.includes('review')}
                          onChange={() => toggleFilter('status', 'review')}
                          className="rounded text-primary-300 focus:ring-primary-200"
                        />
                        <span className="ml-2 text-sm text-gray-600">Review</span>
                      </label>
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <AlertTriangle size={16} />
                      Priority
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.priority.includes('low')}
                          onChange={() => toggleFilter('priority', 'low')}
                          className="rounded text-primary-300 focus:ring-primary-200"
                        />
                        <span className="ml-2 text-sm text-gray-600">Low</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.priority.includes('medium')}
                          onChange={() => toggleFilter('priority', 'medium')}
                          className="rounded text-primary-300 focus:ring-primary-200"
                        />
                        <span className="ml-2 text-sm text-gray-600">Medium</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.priority.includes('high')}
                          onChange={() => toggleFilter('priority', 'high')}
                          className="rounded text-primary-300 focus:ring-primary-200"
                        />
                        <span className="ml-2 text-sm text-gray-600">High</span>
                      </label>
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Due Date Range
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-500">From</label>
                        <input
                          type="date"
                          value={filters.dateRange.from ? filters.dateRange.from.toISOString().split('T')[0] : ''}
                          onChange={(e) => toggleFilter('dateRange', { from: e.target.value ? new Date(e.target.value) : null, to: filters.dateRange.to })}
                          className="w-full mt-1 text-sm border border-gray-200 rounded-md focus:ring-primary-300 focus:border-primary-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">To</label>
                        <input
                          type="date"
                          value={filters.dateRange.to ? filters.dateRange.to.toISOString().split('T')[0] : ''}
                          onChange={(e) => toggleFilter('dateRange', { from: filters.dateRange.from, to: e.target.value ? new Date(e.target.value) : null })}
                          className="w-full mt-1 text-sm border border-gray-200 rounded-md focus:ring-primary-300 focus:border-primary-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Request Name Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={16} />
                      Request Name
                    </h3>
                    <input
                      type="text"
                      value={filters.requestName}
                      onChange={(e) => toggleFilter('requestName', e.target.value)}
                      placeholder="Enter request name..."
                      className="w-full text-sm border border-gray-200 rounded-md focus:ring-primary-300 focus:border-primary-300"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Ongoing Column */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-50 p-4 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={20} className="text-blue-500" />
                    <h2 className="font-semibold text-blue-700">Ongoing</h2>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {getCardsByStatus('ongoing').length}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                {getCardsByStatus('ongoing').map(card => (
                  <div key={card.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getRequestTypeIcon(card.requestType)}
                        <span className="font-medium text-gray-800">{card.requestName}</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <h3 className="font-semibold text-primary-500 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(card.priority)}`}>
                        {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {formatCurrency(card.amount)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(card.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{card.assignee}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {getCardsByStatus('ongoing').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No ongoing items</p>
                  </div>
                )}
              </div>
            </div>

            {/* Review Column */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-yellow-50 p-4 border-b border-yellow-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={20} className="text-yellow-500" />
                    <h2 className="font-semibold text-yellow-700">Review</h2>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {getCardsByStatus('review').length}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                {getCardsByStatus('review').map(card => (
                  <div key={card.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getRequestTypeIcon(card.requestType)}
                        <span className="font-medium text-gray-800">{card.requestName}</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <h3 className="font-semibold text-primary-500 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(card.priority)}`}>
                        {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {formatCurrency(card.amount)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(card.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{card.assignee}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {getCardsByStatus('review').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No items in review</p>
                  </div>
                )}
              </div>
            </div>

            {/* Blocked Column */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-red-50 p-4 border-b border-red-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle size={20} className="text-red-500" />
                    <h2 className="font-semibold text-red-700">Blocked</h2>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {getCardsByStatus('blocked').length}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                {getCardsByStatus('blocked').map(card => (
                  <div key={card.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getRequestTypeIcon(card.requestType)}
                        <span className="font-medium text-gray-800">{card.requestName}</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <h3 className="font-semibold text-primary-500 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(card.priority)}`}>
                        {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {formatCurrency(card.amount)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(card.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{card.assignee}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {getCardsByStatus('blocked').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No blocked items</p>
                  </div>
                )}
              </div>
            </div>

            {/* Done Column */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-green-50 p-4 border-b border-green-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-500" />
                    <h2 className="font-semibold text-green-700">Done</h2>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {getCardsByStatus('done').length}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                {getCardsByStatus('done').map(card => (
                  <div key={card.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getRequestTypeIcon(card.requestType)}
                        <span className="font-medium text-gray-800">{card.requestName}</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <h3 className="font-semibold text-primary-500 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(card.priority)}`}>
                        {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {formatCurrency(card.amount)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(card.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{card.assignee}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {getCardsByStatus('done').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No completed items</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;