import { FC, MouseEvent } from "react";
import { Icon } from "../icon/Icon";
import { useRipple } from "../../../hooks/useRipple";
import { useNavigate } from "react-router-dom";

type ButtonProps = {
  onClick: (item: string) => void;
  name: string;
  icon?: string;
  isActive: boolean;
  redirectTo?: string;
};

export const Button: FC<ButtonProps> = ({ onClick, name, icon, isActive, redirectTo }) => {
  const [createRipple] = useRipple();
  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    createRipple(e, name);
    onClick(name);
    redirectTo && goTo(redirectTo);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={isActive ? "active" : ""}
    >
      <span className="button-content">
        {icon && <Icon icon={icon} />}
        <span>{name}</span>
      </span>

      <span id={`ripple-container-${name}`}></span>
    </button>
  );
};
