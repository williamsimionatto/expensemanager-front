import { useState } from "react";
import { Navbar, Sidebar } from "./presentation/components";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './App.css';
import Router from "./routes/routes";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <div
          onClick={() => setIsOpen(false)}
          className={`overlay ${isOpen ? "open" : ""}`}
        />
        <Navbar setIsOpen={setIsOpen} />
        <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} />
        <Router />
      </ThemeProvider>
    </>
  );
}

export default App;
