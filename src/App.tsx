import React from "react";
import { Container, GridContainer } from "./App.styles";
import GameMenu from "./components/GameMenu";
import Grid from "./components/Grid";
import GridCell from "./components/GridCell";
import {
  BOARD_SIZE_PX,
  FOOD_CHANGE_POSITION_INTERVAL_MS,
  SNAKE_MOVE_INTERVAL_MS,
  TOTAL_BOARD_CELLS_IN_A_ROW_NUM,
} from "./utils/constants/constants";
import { arrayDiff } from "./utils/helpers/getArrayDiff";
import { getOverlay } from "./utils/helpers/getOverlay";
import { shallowEquals } from "./utils/helpers/getShallowEquals";

interface MyState {
  direction: number;
  snake: any;
  food: any;
  status: number;
  newBoardBorderColor: boolean;
  newSnakeColor: boolean;
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
      // 0 = not started, 1 = in progress, 2 = finished, 3 = paused
      status: 0,
      // using keycodes to indicate direction
      direction: 72,
      newBoardBorderColor: false,
      newSnakeColor: false,
    };

    this.moveFood = this.moveFood.bind(this);
    this.checkIfAteFood = this.checkIfAteFood.bind(this);
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
    this.pauseGame = this.pauseGame.bind(this);
    this.resumeGame = this.resumeGame.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.moveSnake = this.moveSnake.bind(this);
    this.doesntOverlap = this.doesntOverlap.bind(this);
    this.setDirection = this.setDirection.bind(this);
    this.removeTimers = this.removeTimers.bind(this);
    this.toggleBoardColor = this.toggleBoardColor.bind(this);
    this.toggleSnakeColor = this.toggleSnakeColor.bind(this);
    this.handleOnSnakeClick = this.handleOnSnakeClick.bind(this);
    this.handleOnBoardClick = this.handleOnBoardClick.bind(this);
  }

  // randomly place snake food
  moveFood() {
    if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout);
    if (this.state.status === 3) return;

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
      [84, 71],
      [70, 72],
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
      // G button (down)
      case 71:
        newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] + 1];
        break;
      // T button (up)
      case 84:
        newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] - 1];
        break;
      // H button (right)
      case 72:
        newSnake[0] = [this.state.snake[0][0] + 1, this.state.snake[0][1]];
        break;
      // F button(left)
      case 70:
        newSnake[0] = [this.state.snake[0][0] - 1, this.state.snake[0][1]];
        break;
      // Pause game case
      case 0:
        return null;
      // Command button
      case 91:
        return null;
      default:
        return this.resetGame();
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
      newBoardBorderColor: false,
      newSnakeColor: false,
    });
  }

  pauseGame() {
    this.setState({
      status: 3,
      direction: 0,
    });
  }

  resumeGame() {
    this.setState({
      status: 1,
      direction: 72,
    });
  }

  resetGame() {
    this.removeTimers();
    this.setState({
      snake: [],
      food: [],
      status: 0,
      direction: 72,
      newBoardBorderColor: false,
      newSnakeColor: false,
    });
  }

  toggleBoardColor() {
    this.setState((prevState) => ({
      newBoardBorderColor: !prevState.newBoardBorderColor,
    }));
  }

  toggleSnakeColor() {
    this.setState((prevState) => ({
      newSnakeColor: !prevState.newSnakeColor,
    }));
  }

  handleOnBoardClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.metaKey) {
      this.resetGame();
    } else {
      this.toggleBoardColor();
    }
  }

  handleOnSnakeClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    snakeCell: any
  ) {
    if (!snakeCell) return;

    e.stopPropagation();
    this.toggleSnakeColor();
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
            defaultSnakeCell={snakeCell}
            yellowSnakeCell={snakeCell && this.state.newSnakeColor}
            regularCell={!foodCell && !snakeCell}
            size={cellSize}
            key={x + " " + y}
            onClick={(e) => this.handleOnSnakeClick(e, snakeCell)}
            onDoubleClick={this.pauseGame}
          />
        );
      });
    });

    const overlay = getOverlay(
      this.state.status,
      this.state.snake,
      this.startGame,
      this.resumeGame
    );

    return (
      <Container>
        <GameMenu />
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
            newBoardBorderColor={this.state.newBoardBorderColor}
            onClick={(e) => this.handleOnBoardClick(e)}
          >
            {cells}
          </Grid>
        </GridContainer>
      </Container>
    );
  }
}

export default App;
