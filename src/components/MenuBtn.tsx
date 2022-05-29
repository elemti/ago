import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {
  IconButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Badge,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import Cloud from '@mui/icons-material/Cloud'
import pkgJson from '../../package.json'
import { skipWaitingAndReload } from '../libs/sw'
import { useGlobalCtx } from '../libs/globalContext'

export default function MenuBtn () {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const { hasUpdate } = useGlobalCtx()

  return (
    <div>
      <IconButton onClick={handleClick} size='large'>
        <Badge color='primary' variant='dot' invisible={!hasUpdate}>
          <MoreVertIcon />
        </Badge>
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
      >
        {hasUpdate && (
          <MenuItem onClick={() => skipWaitingAndReload()}>
            <ListItemIcon>
              <SystemUpdateAltIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>New version available</ListItemText>
          </MenuItem>
        )}
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
