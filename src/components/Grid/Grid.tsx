import React, { FC, PropsWithChildren } from "react";
import { BOARD_SIZE_PX } from "../../utils/constants/constants";
import { StyledGrid } from "./Grid.styles";

interface Props {
  newBoardBorderColor: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const Grid: FC<PropsWithChildren<Props>> = ({ onClick, children, ...rest }) => {
  return (
    <StyledGrid
      style={{
        width: BOARD_SIZE_PX + "px",
        height: BOARD_SIZE_PX + "px",
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </StyledGrid>
  );
};

export default Grid;
