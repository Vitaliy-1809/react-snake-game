import styled from "styled-components";

export const StyledGrid = styled.div`
  box-sizing: content-box;
  padding: 0;
  border: 10px solid;
  border-color: ${(props: any) =>
    props.newBoardBorderColor ? "#E00712" : "#333333"};
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
`;
