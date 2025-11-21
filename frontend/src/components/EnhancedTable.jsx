import { useState, useMemo } from 'react';
import Tooltip from './Tooltip';
import '../styles/tables.css';

export default function EnhancedTable({
  data = [],
  columns = [],
  sortable = true,
  groupBy = null,
  onRowClick = null,
  striped = true
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedGroups, setExpandedGroups] = useState({});

  // Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  // Grouping Logic
  const groupedData = useMemo(() => {
    if (!groupBy) return { default: sortedData };

    return sortedData.reduce((groups, row) => {
      const key = row[groupBy] || 'غير محدد';
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
      return groups;
    }, {});
  }, [sortedData, groupBy]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  return (
    <div className="enhanced-table-wrapper">
      <table className={`enhanced-table ${striped ? 'striped' : ''}`}>
        <thead className="table-header-sticky">
          <tr>
            {groupBy && <th className="group-toggle-col">📂</th>}
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => sortable && handleSort(col.key)}
                className={`table-header ${sortable ? 'sortable' : ''}`}
              >
                <div className="header-content">
                  <span>{col.label}</span>
                  {sortable && sortConfig.key === col.key && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↓' : '↑'}
                    </span>
                  )}
                </div>
                {col.tooltip && (
                  <Tooltip content={col.tooltip} position="top">
                    <span className="info-icon">?</span>
                  </Tooltip>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupBy ? (
            Object.entries(groupedData).map(([groupName, groupRows]) => (
              <div key={groupName}>
                <tr
                  className="group-header"
                  onClick={() => toggleGroup(groupName)}
                >
                  <td colSpan={columns.length + 1} className="group-title">
                    <span className="group-toggle">
                      {expandedGroups[groupName] ? '▼' : '▶'}
                    </span>
                    <strong>{groupName}</strong>
                    <span className="group-count">({groupRows.length})</span>
                  </td>
                </tr>
                {expandedGroups[groupName] &&
                  groupRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="data-row"
                      onClick={() => onRowClick?.(row)}
                    >
                      <td className="group-toggle-col"></td>
                      {columns.map(col => (
                        <td key={col.key} className={`cell-${col.key}`}>
                          {col.render
                            ? col.render(row[col.key], row)
                            : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
              </div>
            ))
          ) : (
            sortedData.map((row, idx) => (
              <tr
                key={idx}
                className="data-row"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <td key={col.key} className={`cell-${col.key}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
