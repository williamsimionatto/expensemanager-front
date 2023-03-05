import { useState } from "react";
import Main from "./routes/routes";
import { Navbar, Sidebar } from "./ui/components";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`overlay ${isOpen ? "open" : ""}`}
      />
      <Navbar setIsOpen={setIsOpen} />
      <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} />
      <Main />
    </>
  );
}

export default App;
