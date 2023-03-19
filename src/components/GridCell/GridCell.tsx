import React, { FC } from "react";
import { StyledGridCell } from "./GridCell.styles";

interface Props {
  size: number;
  foodCell: boolean;
  defaultSnakeCell: boolean;
  yellowSnakeCell: boolean;
  regularCell: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const GridCell: FC<Props> = ({ size, onClick, onDoubleClick, ...rest }) => {
  return (
    <StyledGridCell
      style={{ height: size + "px", width: size + "px" }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      {...rest}
    />
  );
};

export default GridCell;
