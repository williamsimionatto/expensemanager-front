import { useState } from "react";
import Main from "./routes/routes";
import { Navbar, Sidebar } from "./presentation/components";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';

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
        <Main />
      </ThemeProvider>
    </>
  );
}

export default App;
