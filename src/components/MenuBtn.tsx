import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {
  IconButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Cloud from '@mui/icons-material/Cloud'
import RefreshIcon from '@mui/icons-material/Refresh'
import pkgJson from '../../package.json'
import { cleanReload } from '../serviceWorkerRegistration'

export default function MenuBtn () {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton onClick={handleClick} size='large'>
        <MoreVertIcon />
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
        PaperProps={{ sx: { width: 220, maxWidth: '100%' } }}
      >
        <MenuItem onClick={() => cleanReload()}>
          <ListItemIcon>
            <RefreshIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Refresh</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemIcon>
            <Cloud fontSize='small' />
          </ListItemIcon>
          <ListItemText>Version</ListItemText>
          <Typography variant='body2' color='text.secondary'>
            {pkgJson.version}
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  )
}
