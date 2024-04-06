import React, { useState } from "react";
import { Box, Grid, Button, useToast, Text } from "@chakra-ui/react";

// Helper function to calculate the winner
function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Simple AI for Tic Tac Toe using minimax algorithm
function bestMove(squares, player) {
  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < squares.length; i++) {
    // Is the spot available?
    if (squares[i] === null) {
      squares[i] = player;
      let score = minimax(squares, 0, false);
      squares[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

const scores = {
  X: 10,
  O: -10,
  tie: 0,
};

function minimax(squares, depth, isMaximizing) {
  let result = calculateWinner(squares);
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = "X";
        let score = minimax(squares, depth + 1, false);
        squares[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = "O";
        let score = minimax(squares, depth + 1, true);
        squares[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

const Square = ({ value, onClick }) => {
  return (
    <Button size="lg" onClick={onClick} isDisabled={value}>
      {value}
    </Button>
  );
};

const Index = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const toast = useToast();

  const winner = calculateWinner(squares);

  const handleClick = (i) => {
    const newSquares = squares.slice();
    if (winner || newSquares[i]) {
      return;
    }
    newSquares[i] = isXNext ? "X" : "O";
    setSquares(newSquares);
    setIsXNext(!isXNext);

    // AI makes a move as 'O'
    if (!isXNext) {
      const aiMove = bestMove(newSquares, "X");
      if (aiMove !== undefined) {
        newSquares[aiMove] = "X";
        setSquares(newSquares);
        setIsXNext(true);
      }
    }
  };

  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  };

  if (winner) {
    toast({
      title: `Player ${winner} wins!`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }

  return (
    <Box textAlign="center" fontSize="xl">
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {Array.from({ length: 9 }).map((_, i) => (
          <Box key={i} w="50px" h="50px">
            {renderSquare(i)}
          </Box>
        ))}
      </Grid>
      <Button mt={4} onClick={() => setSquares(Array(9).fill(null))}>
        Restart Game
      </Button>
      <Text mt={2}>{`Next player: ${isXNext ? "X" : "O"}`}</Text>
    </Box>
  );
};

export default Index;
