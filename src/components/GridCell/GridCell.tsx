import React, { FC } from "react";
import { StyledGridCell } from "./GridCell.styles";

export interface Props {
  size: number;
  foodCell: boolean;
  snakeCell: boolean;
  regularCell: boolean;
}

const GridCell: FC<Props> = ({ size, ...rest }) => {
  return (
    <StyledGridCell
      style={{ height: size + "px", width: size + "px" }}
      {...rest}
    />
  );
};

export default GridCell;
