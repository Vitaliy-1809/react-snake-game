import React, { FC } from "react";
import {
  ControlsAndActionsBlock,
  StyledList,
  StyledListName,
} from "./GameMenu.styles";

const GameMenu: FC = () => {
  return (
    <ControlsAndActionsBlock>
      <StyledListName>Game controls:</StyledListName>
      <StyledList>
        <li>move Up: "T"</li>
        <li>move Left: "F"</li>
        <li>move Down: "G"</li>
        <li>move Right: "H"</li>
      </StyledList>
      <StyledListName>Game actions:</StyledListName>
      <StyledList>
        <li>
          <u>pause game</u>: double click on the board
        </li>
        <li>
          <u>reset game</u>: 'Cmd+click' on the board
        </li>
        <li>click on snake: change its color</li>
        <li>click on the board: change its border color</li>
      </StyledList>
    </ControlsAndActionsBlock>
  );
};

export default GameMenu;
