import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import type { ComplianceCheckResult } from '@/mocks/complianceData';
import ComplianceBadge from './ComplianceBadge';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ComplianceResultsTableProps {
  results: ComplianceCheckResult[];
  onFilter?: (category: string, status: string) => void;
}

type SortField = 'rule_code' | 'rule_name' | 'category' | 'status' | 'message';
type SortDirection = 'asc' | 'desc';

const categoryColors: Record<string, string> = {
  urbanisme: 'bg-blue-50 text-blue-700 border-blue-200',
  dtu: 'bg-purple-50 text-purple-700 border-purple-200',
  re2020: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pmr: 'bg-orange-50 text-orange-700 border-orange-200',
  incendie: 'bg-red-50 text-red-700 border-red-200',
};

const categoryLabels: Record<string, string> = {
  urbanisme: 'Urbanisme',
  dtu: 'DTU',
  re2020: 'RE2020',
  pmr: 'PMR',
  incendie: 'Incendie',
};

const severityConfig: Record<string, { color: string; label: string }> = {
  blocking: { color: 'text-red-600 bg-red-50', label: 'Bloquant' },
  major: { color: 'text-orange-600 bg-orange-50', label: 'Majeur' },
  minor: { color: 'text-amber-600 bg-amber-50', label: 'Mineur' },
  info: { color: 'text-slate-500 bg-slate-50', label: 'Info' },
};

export default function ComplianceResultsTable({ results }: ComplianceResultsTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('rule_code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const pageSize = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-slate-300 ml-1">↕</span>;
    return sortDirection === 'asc'
      ? <ChevronUp size={14} className="inline ml-1 text-slate-600" />
      : <ChevronDown size={14} className="inline ml-1 text-slate-600" />;
  };

  const filteredAndSorted = useMemo(() => {
    let filtered = [...results];

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(r => r.category === categoryFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.rule_code.toLowerCase().includes(q) ||
          r.rule_name.toLowerCase().includes(q) ||
          r.message.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [results, categoryFilter, statusFilter, searchQuery, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  const paginated = filteredAndSorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher une règle, un code, un message..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-9 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="h-9 pl-8 pr-8 text-sm rounded-md border border-input bg-white hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Toutes catégories</option>
              <option value="urbanisme">Urbanisme</option>
              <option value="dtu">DTU</option>
              <option value="re2020">RE2020</option>
              <option value="pmr">PMR</option>
              <option value="incendie">Incendie</option>
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="h-9 px-3 text-sm rounded-md border border-input bg-white hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Tous statuts</option>
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
            <option value="warning">Warning</option>
            <option value="not_applicable">N/A</option>
          </select>
        </div>
      </div>

      {/* Compteur */}
      <div className="text-sm text-slate-500 px-1">
        {filteredAndSorted.length} résultat{filteredAndSorted.length > 1 ? 's' : ''} sur {results.length} règles
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-10"></TableHead>
              <TableHead
                className="cursor-pointer select-none font-semibold text-slate-700"
                onClick={() => handleSort('rule_code')}
              >
                Code <SortIcon field="rule_code" />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none font-semibold text-slate-700"
                onClick={() => handleSort('rule_name')}
              >
                Règle <SortIcon field="rule_name" />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none font-semibold text-slate-700"
                onClick={() => handleSort('category')}
              >
                Catégorie <SortIcon field="category" />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none font-semibold text-slate-700"
                onClick={() => handleSort('status')}
              >
                Statut <SortIcon field="status" />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none font-semibold text-slate-700 max-w-sm"
                onClick={() => handleSort('message')}
              >
                Message <SortIcon field="message" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  Aucun résultat ne correspond aux filtres sélectionnés.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((result) => (
                <React.Fragment key={result.rule_code}>
                  <TableRow
                    className="cursor-pointer transition-colors hover:bg-slate-50/80"
                    onClick={() =>
                      setExpandedRow(expandedRow === result.rule_code ? null : result.rule_code)
                    }
                  >
                    <TableCell>
                      {expandedRow === result.rule_code ? (
                        <ChevronUp size={16} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={16} className="text-slate-400" />
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-medium text-slate-700">
                      {result.rule_code}
                    </TableCell>
                    <TableCell className="font-medium text-sm text-slate-800">
                      {result.rule_name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={categoryColors[result.category] || ''}
                      >
                        {categoryLabels[result.category] || result.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ComplianceBadge status={result.status} />
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 max-w-sm truncate">
                      {result.message}
                    </TableCell>
                  </TableRow>
                  {expandedRow === result.rule_code && (
                    <TableRow className="bg-slate-50/50">
                      <TableCell colSpan={6} className="p-0">
                        <div className="px-4 py-4 border-t border-slate-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Valeurs évaluées
                              </h4>
                              <pre className="bg-white rounded-lg border border-slate-200 p-3 text-xs font-mono text-slate-700 overflow-auto max-h-48">
                                {JSON.stringify(result.evaluated_values, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Détails
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-500">Sévérité</span>
                                  {result.severity ? (
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityConfig[result.severity]?.color || ''}`}>
                                      {severityConfig[result.severity]?.label || result.severity}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">—</span>
                                  )}
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-500">Message complet</span>
                                </div>
                                <p className="text-sm text-slate-600 bg-white rounded-lg border border-slate-200 p-3">
                                  {result.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Page {currentPage} sur {totalPages}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 text-sm rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ‹‹
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 text-sm rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ‹
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 text-sm rounded-md border transition-colors ${
                  currentPage === pageNum
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1.5 text-sm rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1.5 text-sm rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ››
          </button>
        </div>
      </div>
    </div>
  );
}
