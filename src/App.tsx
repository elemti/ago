import {
  Container,
  createTheme,
  css,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useMemo } from 'react';
import { GlobalCtxProvider } from './libs/globalContext';
import MenuBtn from './components/MenuBtn';
import { Tasks } from './components/Tasks';
import { SortBtn } from './components/SortBtn';

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );
  return (
    <GlobalCtxProvider>
      <ThemeProvider theme={theme}>
        <Container
          component="main"
          maxWidth="sm"
          css={css`
            padding-top: 16px;
            padding-bottom: 16px;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              margin-bottom: 16px;
            `}
          >
            <Typography variant="h2">Ago</Typography>
            <div style={{ flex: 1 }} />
            <div
              css={css`
                display: flex;
                gap: 4px;
              `}
            >
              <SortBtn />
              <MenuBtn />
            </div>
          </div>
          <Tasks />
        </Container>
      </ThemeProvider>
    </GlobalCtxProvider>
  );
};

export default App;
