import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

type Player = 'X' | 'O'; 
type Cell = Player | undefined;
type Row = [Cell, Cell, Cell];
type Squares = [...Row, ...Row, ...Row];
type History = Squares[];

function Square (props: {
  onClick: () => void
  value: Cell
}) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props: {
  squares: Squares
  onClick: (i: number) => void
}) {
  const winner = calculateWinner(props.squares);

  const renderSquare = (i: number) => {
    return  (
      <Square
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  };

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState<History>([Array(9).fill(undefined) as Squares]);
  const [stepNumber, setStepNumber] = useState(0);
  const [nextPlayer, setNextPlayer] = useState<Player>('X');  

  const current = history[stepNumber];
  const winner = calculateWinner(current);

  function handleClick (i: number) {
    if (current[i] || calculateWinner(current)) {
      return;
    }
    setNextPlayer(nextPlayer === 'X' ? 'O' : 'X');
    const squares = [...current] as Squares;
    squares[i] = nextPlayer;
    const history_ = history.slice(0, stepNumber + 1);
    setHistory([...history_, squares]);
    setStepNumber(history_.length);
  };

  function jumpTo(step: number) {
    setStepNumber(step);
    setNextPlayer((step % 2) === 0 ? 'X' : 'O');
  }

  const moves = history.map((step, move) => {
    const desc = move ?
      `Go to move #${move}` :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  const status = winner ? `Winner: ${winner}` : `Next player: ${nextPlayer}`;

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current} onClick={(i: number) => handleClick(i)}/>
      </div>
      <div className="game-info">
        <div>{ status }</div>
        <ol>{ moves }</ol>
      </div>
    </div>
  );
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Game />);

function calculateWinner(squares: Squares): Cell {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return undefined;
}
