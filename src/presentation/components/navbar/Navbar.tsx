import "./styles.css";

import { Dispatch, SetStateAction } from "react";

export const Navbar = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => (
  <nav className="navbar">
    <button
      onClick={() => setIsOpen(true)}
      className="burger material-symbols-outlined"
    > menu </button>
    <div className="logo"></div>
    <div className="center"></div>

    <nav>
      <i className="material-symbols-outlined">notifications</i>
    </nav>
  </nav>
);
