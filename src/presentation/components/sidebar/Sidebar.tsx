import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../button";
import { Icon } from "../icon";

import "./styles.css";

const menuItems = [
  {
    name: "Categories",
    icon: "category",
    route: "/categories",
  },
  {
    name: "Periods",
    icon: "date_range",
    route: "/periods",
  },
  {
    name: "Expenses",
    icon: "attach_money",
    route: "/expenses",
  },
  {
    name: "Reports",
    icon: "bar_chart",
    route: "/expenses/report",
  }
];

const NavHeader = ({ onClick }: { onClick: VoidFunction }) => (
  <header className="sidebar-header">
    <button onClick={onClick} type="button">
      <Icon icon="menu_open" />
    </button>
  </header>
);

export const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [activeItem, setActiveItem] = useState<string>("");

  const handleClick = (item: string) => {
    setActiveItem(item !== activeItem ? item : "");
    setIsOpen(false);
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <nav className="sidebar-nav">
        <NavHeader onClick={() => setIsOpen(false)} />
        {menuItems.map((item) => (
          <Button
            onClick={handleClick}
            name={item.name}
            icon={item.icon}
            isActive={activeItem === item.name}
            key={item.name}
            redirectTo={item.route}
          />
        ))}
      </nav>
    </aside>
  );
};
