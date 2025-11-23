# Accessibility (A11Y) Guidelines - MyNet.tn

## Overview
This document provides accessibility best practices for the MyNet.tn platform to ensure WCAG 2.1 compliance and inclusive user experience.

## Core Principles

### 1. Semantic HTML
- Use semantic elements: `<button>`, `<nav>`, `<header>`, `<main>`, `<footer>`, `<form>`
- Avoid generic `<div>` wrappers for interactive elements
- Use proper heading hierarchy: h1 → h2 → h3 (no skipping levels)

### 2. ARIA Attributes

#### Common ARIA Labels
```jsx
// Form inputs
<TextField inputProps={{ 'aria-label': 'Rechercher appels d\'offres' }} />

// Buttons with icons only
<IconButton aria-label="Fermer le dialogue" />

// Live regions
<Box aria-live="polite" aria-atomic="true">
  {statusMessage}
</Box>
```

#### Descriptions
```jsx
<TextField
  id="budget"
  aria-describedby="budget-help"
/>
<Typography id="budget-help" variant="caption">
  Budget en TND
</Typography>
```

### 3. Keyboard Navigation
- All interactive elements must be keyboard accessible
- Use Tab to navigate, Enter/Space to activate
- Provide skip links for main content
- Support Escape key for dialogs/modals
- Never trap focus in components

### 4. Color & Contrast
- Maintain 4.5:1 contrast ratio for normal text
- #0056B3 (primary) and #212121 (text) = sufficient contrast
- Don't rely on color alone - use icons, text, patterns
- Test with WCAG Contrast Checker

### 5. Images & Icons
- Add `alt` text to all images
- Icons must have aria-labels or be inside labeled elements
- Decorative icons can use `aria-hidden="true"`

```jsx
<img src="tender.jpg" alt="Appel d'offres #123 - Fournitures informatiques" />
<IconButton aria-label="Supprimer cette offre">
  <DeleteIcon />
</IconButton>
```

### 6. Forms
- Label every input with `<label>` or aria-label
- Group related inputs with `<fieldset>` and `<legend>`
- Provide clear error messages
- Indicate required fields

```jsx
<TextField
  label="Email"
  type="email"
  required
  inputProps={{ 'aria-required': 'true' }}
/>
```

### 7. Data Tables
- Add table headers (`<th>` scope="col"|"row")
- Caption for table purpose
- Use `aria-sort` for sortable columns

```jsx
<Table>
  <TableHead>
    <TableRow>
      <TableCell scope="col">Titre</TableCell>
      <TableCell scope="col">Budget</TableCell>
    </TableRow>
  </TableHead>
</Table>
```

### 8. Links
- Link text must be descriptive
- Avoid "Cliquez ici", use "Voir les détails de l'offre"
- Links should open in same tab unless specified

```jsx
<Button component="a" href="/tender/123">
  Voir les détails de l'appel d'offres #123
</Button>
```

### 9. Modals & Dialogs
- Use proper `<Dialog>` component with role="dialog"
- Focus management: move to dialog, return on close
- Escape key closes dialog
- Modal shouldn't scroll main content

### 10. Loading States
- Use skeleton loaders instead of spinners only
- Announce loading with aria-live region
- Show progress percentage if possible

## Checklist

- [ ] All images have alt text
- [ ] All buttons have labels
- [ ] Heading hierarchy is correct
- [ ] Color contrast is sufficient
- [ ] Keyboard navigation works
- [ ] Form labels are present
- [ ] Error messages are clear
- [ ] No focus traps
- [ ] Modals are trapped focus
- [ ] Skip links present

## Testing Tools

1. **axe DevTools** - Browser extension for accessibility checks
2. **WAVE** - WebAIM accessibility checker
3. **Lighthouse** - Built into Chrome DevTools
4. **Keyboard Only** - Test without mouse
5. **Screen Reader** - NVDA (free), JAWS, VoiceOver

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material-UI A11Y](https://mui.com/material-ui/guides/accessibility/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
