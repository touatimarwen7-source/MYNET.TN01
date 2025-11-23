import { Box, Link } from '@mui/material';

export default function SkipLink() {
  return (
    <Link
      href="#main-content"
      sx={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        backgroundColor: '#0056B3',
        color: '#fff',
        padding: '8px 16px',
        zIndex: 1000,
        '&:focus': {
          top: 0
        }
      }}
    >
      Aller au contenu principal
    </Link>
  );
}
