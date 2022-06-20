import { ThemeProvider, createTheme } from '@mui/material/styles'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import React from 'react'
import { Container, Typography, useMediaQuery } from '@mui/material'
import { css } from '@emotion/react'
import { GlobalCtxProvider } from './libs/globalContext'
import MenuBtn from './components/MenuBtn'
import Tasks from './components/Tasks'
import DraggableList from './components/DraggableList'

dayjs.extend(relativeTime)
dayjs.extend(duration)

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  )

  return (
    <GlobalCtxProvider>
      <ThemeProvider theme={theme}>
        <Container
          component='main'
          maxWidth='sm'
          css={css`
            padding-top: 16px;
            padding-bottom: 16px;
          `}
        >
          <DraggableList />
          {/* <div
            css={css`
              display: flex;
              align-items: center;
              margin-bottom: 16px;
            `}
          >
            <Typography variant='h2'>Ago</Typography>
            <div style={{ flex: 1 }} />
            <MenuBtn />
          </div>
          <Tasks /> */}
        </Container>
      </ThemeProvider>
    </GlobalCtxProvider>
  )
}

export default App
