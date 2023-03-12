import { Overlay } from "../../App.styles";
import Button from "../../components/Button";

export const getOverlay = (
  status: number,
  snake: any[],
  startGame: () => void
) => {
  let overlay;
  if (status === 0) {
    overlay = (
      <Overlay>
        <Button text="Start game!" onClick={startGame} />
      </Overlay>
    );
  } else if (status === 2) {
    overlay = (
      <Overlay>
        <div style={{ marginBottom: "1rem" }}>
          <b>GAME OVER!</b>
        </div>
        <div style={{ marginBottom: "1rem" }}>Your score: {snake.length} </div>
        <Button text="Start a new game" onClick={startGame} />
      </Overlay>
    );
  }

  return overlay;
};
