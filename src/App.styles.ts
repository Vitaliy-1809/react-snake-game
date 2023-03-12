import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const GridContainer = styled.div`
  position: relative;
  &:focus {
    outline: none;
  }
`;

export const Grid = styled.div`
  box-sizing: content-box;
  padding: 0;
  border: 10px solid #333333;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: -10px;
  bottom: -10px;
  background-color: black;
  opacity: 0.9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.2rem;
`;
