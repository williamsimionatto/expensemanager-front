import "./styles.scss";

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

    <div className="center">
      <h1 className="title">
        Manage your finances in one place
      </h1>
    </div>
  </nav>
);
