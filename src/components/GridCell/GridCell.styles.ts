import styled from "styled-components";

export const StyledGridCell = styled.div`
  border-left: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  background-color: ${(props: any) => (props.foodCell ? "#E00712" : "")};
  background-color: ${(props: any) => (props.snakeCell ? "#333333" : "")};
  background-color: ${(props: any) => (props.regularCell ? "#91C088" : "")};
`;
