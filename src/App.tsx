import React from "react";
import { Container, Grid, GridContainer, Overlay } from "./App.styles";
import Button from "./components/Button";
import GridCell from "./components/GridCell";
import {
  BOARD_SIZE_PX,
  FOOD_CHANGE_POSITION_INTERVAL_MS,
  SNAKE_MOVE_INTERVAL_MS,
  TOTAL_BOARD_CELLS_IN_A_ROW_NUM,
} from "./utils/constants/constants";
import { arrayDiff } from "./utils/helpers/getArrayDiff";
import { shallowEquals } from "./utils/helpers/getShallowEquals";

interface MyState {
  direction: number;
  snake: any;
  food: any;
  status: number;
}

class App extends React.Component<{}, MyState> {
  numCells: any;
  moveSnakeInterval: NodeJS.Timer | undefined;
  moveFoodTimeout: any;
  el: HTMLDivElement | null | undefined;

  constructor(props: MyState) {
    super(props);
    this.state = {
      snake: [],
      food: [],
      // 0 = not started, 1 = in progress, 2 = finished
      status: 0,
      // using keycodes to indicate direction
      direction: 39,
    };

    this.moveFood = this.moveFood.bind(this);
    this.checkIfAteFood = this.checkIfAteFood.bind(this);
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
    this.moveSnake = this.moveSnake.bind(this);
    this.doesntOverlap = this.doesntOverlap.bind(this);
    this.setDirection = this.setDirection.bind(this);
    this.removeTimers = this.removeTimers.bind(this);
  }

  // randomly place snake food
  moveFood() {
    if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout);
    const x = parseInt((Math.random() * this.numCells) as any);
    const y = parseInt((Math.random() * this.numCells) as any);
    this.setState({ food: [x, y] });
    this.moveFoodTimeout = setTimeout(
      this.moveFood,
      FOOD_CHANGE_POSITION_INTERVAL_MS
    );
  }

  setDirection({ keyCode }: { keyCode: number }) {
    // if it's the same direction or simply reversing, ignore
    let changeDirection = true;
    [
      [38, 40],
      [37, 39],
    ].forEach((dir) => {
      if (dir.indexOf(this.state.direction) > -1 && dir.indexOf(keyCode) > -1) {
        changeDirection = false;
      }
    });

    if (changeDirection) this.setState({ direction: keyCode });
  }

  moveSnake() {
    const newSnake = [];
    // set in the new "head" of the snake
    switch (this.state.direction) {
      // down
      case 40:
        newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] + 1];
        break;
      // up
      case 38:
        newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] - 1];
        break;
      // right
      case 39:
        newSnake[0] = [this.state.snake[0][0] + 1, this.state.snake[0][1]];
        break;
      // left
      case 37:
        newSnake[0] = [this.state.snake[0][0] - 1, this.state.snake[0][1]];
        break;
      // Enter
      case 13:
        return null;
    }
    // now shift each "body" segment to the previous segment's position
    [].push.apply(
      newSnake,
      this.state.snake.slice(1).map((s: any, i: string | number) => {
        // since we're starting from the second item in the list,
        // just use the index, which will refer to the previous item
        // in the original list
        return this.state.snake[i];
      })
    );

    this.setState({ snake: newSnake });

    this.checkIfAteFood(newSnake);
    if (!this.isValid(newSnake[0]) || !this.doesntOverlap(newSnake)) {
      // end the game
      this.endGame();
    }
  }

  checkIfAteFood(newSnake: any[]) {
    if (!shallowEquals(newSnake[0], this.state.food)) return;
    // snake gets longer
    let newSnakeSegment;
    const lastSegment = newSnake[newSnake.length - 1];

    // where should we position the new snake segment?
    // here are some potential positions, we can choose the best looking one
    let lastPositionOptions = [
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
    ];

    // the snake is moving along the y-axis, so try that instead
    if (newSnake.length > 1) {
      lastPositionOptions[0] = arrayDiff(
        lastSegment,
        newSnake[newSnake.length - 2]
      );
    }

    for (var i = 0; i < lastPositionOptions.length; i++) {
      newSnakeSegment = [
        lastSegment[0] + lastPositionOptions[i][0],
        lastSegment[1] + lastPositionOptions[i][1],
      ];
      if (this.isValid(newSnakeSegment)) {
        break;
      }
    }

    this.setState({
      snake: newSnake.concat([newSnakeSegment]),
      food: [],
    });
    this.moveFood();
  }

  // is the cell's position inside the grid?
  isValid(cell: any[]) {
    return (
      cell[0] > -1 &&
      cell[1] > -1 &&
      cell[0] < this.numCells &&
      cell[1] < this.numCells
    );
  }

  doesntOverlap(snake: any[][]) {
    return (
      snake.slice(1).filter((c) => {
        return shallowEquals(snake[0], c);
      }).length === 0
    );
  }

  startGame() {
    this.removeTimers();
    this.moveSnakeInterval = setInterval(
      this.moveSnake,
      SNAKE_MOVE_INTERVAL_MS
    );
    this.moveFood();

    this.setState({
      status: 1,
      snake: [[5, 5]],
      food: [10, 10],
    });
    //need to focus so keydown listener will work!
    this.el?.focus();
  }

  endGame() {
    this.removeTimers();
    this.setState({
      status: 2,
    });
  }

  removeTimers() {
    if (this.moveSnakeInterval) clearInterval(this.moveSnakeInterval);
    if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout);
  }

  componentWillUnmount() {
    this.removeTimers();
  }

  render() {
    this.numCells = Math.floor(BOARD_SIZE_PX / TOTAL_BOARD_CELLS_IN_A_ROW_NUM);
    const cellSize = BOARD_SIZE_PX / this.numCells;
    const cellIndexes = Array.from(Array(this.numCells).keys());
    const cells = cellIndexes.map((y) => {
      return cellIndexes.map((x) => {
        const foodCell = this.state.food[0] === x && this.state.food[1] === y;
        let snakeCell = this.state.snake.filter(
          (c: number[]) => c[0] === x && c[1] === y
        );
        snakeCell = snakeCell.length && snakeCell[0];

        return (
          <GridCell
            foodCell={foodCell}
            snakeCell={snakeCell}
            regularCell={!foodCell && !snakeCell}
            size={cellSize}
            key={x + " " + y}
          />
        );
      });
    });

    let overlay;
    if (this.state.status === 0) {
      overlay = (
        <Overlay>
          <Button text="Start game!" onClick={this.startGame} />
        </Overlay>
      );
    } else if (this.state.status === 2) {
      overlay = (
        <Overlay>
          <div style={{ marginBottom: "1rem" }}>
            <b>GAME OVER!</b>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            Your score: {this.state.snake.length}{" "}
          </div>
          <Button text="Start a new game" onClick={this.startGame} />
        </Overlay>
      );
    }

    return (
      <Container>
        <GridContainer
          onKeyDown={this.setDirection}
          style={{
            width: BOARD_SIZE_PX + "px",
            height: BOARD_SIZE_PX + "px",
          }}
          ref={(el) => (this.el = el)}
          tabIndex={-1}
        >
          {overlay}
          <Grid
            style={{
              width: BOARD_SIZE_PX + "px",
              height: BOARD_SIZE_PX + "px",
            }}
          >
            {cells}
          </Grid>
        </GridContainer>
      </Container>
    );
  }
}

export default App;
