import { useState } from "react";
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
    </>
  );
}

export default App;
