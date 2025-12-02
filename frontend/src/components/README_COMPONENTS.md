# 🎨 Component Guidelines

## ResponsiveTable Component

### Purpose

Mobile-first responsive table that adapts to all screen sizes.

### Features

- **Desktop (md+)**: Full table view
- **Tablet (sm-md)**: Compact table with horizontal scroll
- **Mobile (xs-sm)**: Card-based stack with collapsible rows
- 100% MUI-based
- Theme-compliant styling
- Keyboard accessible

### Usage Example

```jsx
import { ResponsiveTable } from '@/components/ResponsiveTable';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function UserManagement() {
  const users = [
    { id: 1, name: 'Ahmed', email: 'ahmed@example.com', status: 'Actif' },
    { id: 2, name: 'Sara', email: 'sara@example.com', status: 'Inactif' },
  ];

  return (
    <ResponsiveTable
      columns={[
        { id: 'name', label: 'Nom', width: '200px' },
        { id: 'email', label: 'Email', width: '250px' },
        { id: 'status', label: 'Statut' },
      ]}
      rows={users}
      getRowId={(row) => row.id}
      title="Utilisateurs"
      emptyMessage="Aucun utilisateur trouvé"
      renderCell={(value, column, row) => {
        if (column.id === 'status') {
          return value === 'Actif' ? '✅ Actif' : '❌ Inactif';
        }
        return value;
      }}
      onRowClick={(row) => console.log('Clicked:', row)}
      actions={[
        {
          render: (row) => (
            <IconButton size="small" onClick={() => editUser(row)} title="Modifier">
              <Edit />
            </IconButton>
          ),
        },
        {
          render: (row) => (
            <IconButton
              size="small"
              color="error"
              onClick={() => deleteUser(row.id)}
              title="Supprimer"
            >
              <Delete />
            </IconButton>
          ),
        },
      ]}
    />
  );
}
```

### Props

| Prop           | Type     | Default           | Description                                         |
| -------------- | -------- | ----------------- | --------------------------------------------------- |
| `columns`      | Array    | Required          | Column definitions: `[{ id, label, width? }]`       |
| `rows`         | Array    | `[]`              | Data rows to display                                |
| `getRowId`     | Function | `null`            | Function to get unique row ID (recommended)         |
| `renderCell`   | Function | `null`            | Custom cell renderer: `(value, column, row) => JSX` |
| `onRowClick`   | Function | `null`            | Row click handler: `(row) => void`                  |
| `actions`      | Array    | `null`            | Action buttons: `[{ render: (row, idx) => JSX }]`   |
| `title`        | String   | `'Données'`       | Title for mobile card headers                       |
| `emptyMessage` | String   | `'Aucune donnée'` | Empty state message                                 |

### Best Practices

1. **Always use `getRowId`** for performance

```jsx
<ResponsiveTable
  getRowId={(row) => row.id}
  // ...
/>
```

2. **Use French labels** for all columns

```jsx
columns={[
  { id: 'name', label: 'Nom' },        // ✅ French
  { id: 'email', label: 'Email' },     // ✅ French
]}
```

3. **Render custom cells safely**

```jsx
renderCell={(value, column, row) => {
  if (!value) return '-';  // Safe default
  return <CustomComponent value={value} />;
}}
```

4. **Use theme colors in actions**

```jsx
<IconButton color="primary">
  {' '}
  // ✅ Use theme colors
  <Edit />
</IconButton>
```

---

## consistencyHelper Utilities

### French Labels

```jsx
import { FRENCH_LABELS, getFrenchLabel } from '@/utils/consistencyHelper';

<Button>{FRENCH_LABELS.ajouter}</Button>
<TextField label={getFrenchLabel('email')} />
```

### Theme Colors & Spacing

```jsx
import { useConsistentTheme } from '@/utils/consistencyHelper';

const { colors, spacing } = useConsistentTheme();

<Box
  sx={{
    backgroundColor: colors.primary,
    padding: spacing.md,
    color: colors.text,
  }}
>
  Content
</Box>;
```

### Pre-built Patterns

```jsx
import { CONSISTENT_SX } from '@/utils/consistencyHelper';

<Card sx={CONSISTENT_SX.card(theme)} />
<Button sx={CONSISTENT_SX.button(theme)} />
<TextField sx={CONSISTENT_SX.input(theme)} />
```

---

## Performance Optimization

### Memoization

All components use React memoization:

- `useMemo` for expensive computations
- `useCallback` for event handlers
- Key props for list rendering

### Tips

- Always pass `getRowId` to ResponsiveTable
- Avoid inline functions in props
- Use `useCallback` for action handlers

---

## Accessibility

### Keyboard Navigation

- Expandable rows: Enter/Space to toggle
- Buttons: Tab navigation
- Links: Standard keyboard access

### Screen Readers

- Semantic HTML with proper labels
- ARIA attributes where needed
- Descriptive button titles

---

## Troubleshooting

### Issue: Table shows warnings about keys

**Solution**: Always pass `getRowId` function

```jsx
<ResponsiveTable getRowId={(row) => row.id} />
```

### Issue: Cells not rendering correctly

**Solution**: Use `renderCell` with proper null checking

```jsx
renderCell={(value) => value || '-'}
```

### Issue: Actions not working on mobile

**Solution**: Use proper event handlers with `stopPropagation`

```jsx
onClick={(e) => {
  e.stopPropagation();
  handleAction();
}}
```

---
