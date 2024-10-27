import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SortIcon from '@mui/icons-material/Sort';
import {
  Box,
  css,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { sortOptions, useSortBy } from '../libs/storage.hooks';

export const SortBtn = () => {
  const theme = useTheme();
  const [sortBy, setSortBy] = useSortBy();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick} size="large">
        <SortIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{ sx: { width: 230, maxWidth: '100%' } }}
        MenuListProps={{
          subheader: (
            <ListSubheader sx={{ bgcolor: 'inherit' }}>Sort by</ListSubheader>
          ),
        }}
      >
        {sortOptions.map(({ key, label, icon }) => {
          const isActive = sortBy.key === key;
          return (
            <MenuItem
              key={key}
              onClick={() =>
                setSortBy({
                  key,
                  order: !isActive
                    ? 'asc'
                    : sortBy.order === 'asc'
                    ? 'desc'
                    : 'asc',
                })
              }
              css={
                isActive &&
                css`
                  &,
                  .MuiSvgIcon-root {
                    color: ${theme.palette.primary.main};
                  }
                `
              }
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText>{label}</ListItemText>
              <Box
                css={css`
                  visibility: ${isActive ? 'visible' : 'hidden'};
                  display: flex;
                  align-items: center;
                `}
              >
                {sortBy.order === 'asc' ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                )}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};
