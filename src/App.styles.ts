import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const GridContainer = styled.div`
  position: relative;
  &:focus {
    outline: none;
  }
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
