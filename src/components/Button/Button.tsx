import React, { FC, MouseEventHandler } from "react";
import { StyledButton } from "./Button.styles";

interface Props {
  text: string;
  type?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: FC<Props> = ({ type, text, disabled, onClick, ...rest }) => {
  return (
    <StyledButton disabled={disabled} onClick={onClick} {...rest}>
      {text}
    </StyledButton>
  );
};

export default Button;
