import { useState } from "react";
import { Navbar, Sidebar } from "./presentation/components";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Router from "./routes/routes";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={darkTheme}>
          <div
            onClick={() => setIsOpen(false)}
            className={`overlay ${isOpen ? "open" : ""}`}
          />
          <Navbar setIsOpen={setIsOpen} />
          <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} />
          <Router />
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
}

export default App;
