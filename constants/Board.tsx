import { Color } from "./Color";
import { getRandomPieceColor, PieceData } from "./Piece";
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive block sizes based on screen size and board size
export function getResponsiveBlockSize(boardLength: number): number {
  const maxBoardWidth = screenWidth * 0.85; // Use 85% of screen width
  const blockSize = Math.floor(maxBoardWidth / boardLength);
  
  // Ensure minimum and maximum block sizes
  const minBlockSize = 28;
  const maxBlockSize = 50;
  
  return Math.max(minBlockSize, Math.min(maxBlockSize, blockSize));
}

export function getResponsiveHandBlockSize(boardLength: number): number {
  const gridBlockSize = getResponsiveBlockSize(boardLength);
  return Math.floor(gridBlockSize * 1); // Hand blocks are ~75% of grid blocks (increased from 48%)
}

export function getResponsiveHitboxSize(boardLength: number): number {
  const gridBlockSize = getResponsiveBlockSize(boardLength);
  return Math.floor(gridBlockSize * 0.26); // Hitbox is ~26% of grid blocks
}

// Legacy constants for backward compatibility
export const GRID_BLOCK_SIZE = 46;
export const HAND_BLOCK_SIZE = 22;
export const HITBOX_SIZE = 12;
export const DRAG_JUMP_LENGTH = 116;

export interface XYPoint {
  x: number;
  y: number;
}

export enum BoardBlockType {
  EMPTY,
  HOVERED,
  HOVERED_BREAK_FILLED,
  HOVERED_BREAK_EMPTY,
  FILLED,
}

export interface BoardBlock {
  blockType: BoardBlockType;
  color: Color;
  hoveredBreakColor: Color;
}

export type Board = BoardBlock[][];

export function newEmptyBoard(boardLength: number): Board {
  return new Array(boardLength).fill(null).map(() => {
    return new Array(boardLength).fill(null).map(() => {
      return {
        blockType: BoardBlockType.EMPTY,
        color: getRandomPieceColor(), // used in the load up animation where blocks show on the grid
        hoveredBreakColor: { r: 0, g: 0, b: 0 },
      };
    });
  });
}

export type PossibleBoardSpots = number[][];

export function emptyPossibleBoardSpots(
  boardLength: number,
): PossibleBoardSpots {
  "worklet";
  return new Array(boardLength).fill(null).map(() => {
    return new Array(boardLength).fill(null).map(() => {
      return 0;
    });
  });
}

export function JS_emptyPossibleBoardSpots(
  boardLength: number,
): PossibleBoardSpots {
  return new Array(boardLength).fill(null).map(() => {
    return new Array(boardLength).fill(null).map(() => {
      return 0;
    });
  });
}
export function createPossibleBoardSpots(
  board: Board,
  piece: PieceData | null,
): PossibleBoardSpots {
  "worklet";
  const boardLength = board.length;
  if (piece == null) {
    return [];
  }
  const pieceHeight = piece.matrix.length;
  const pieceWidth = piece.matrix[0].length;
  const fitPositions: PossibleBoardSpots = emptyPossibleBoardSpots(boardLength);

  for (let boardY = 0; boardY <= boardLength - pieceHeight; boardY++) {
    for (let boardX = 0; boardX <= boardLength - pieceWidth; boardX++) {
      let canFit = true;

      for (let pieceY = 0; pieceY < pieceHeight; pieceY++) {
        for (let pieceX = 0; pieceX < pieceWidth; pieceX++) {
          if (
            piece.matrix[pieceY][pieceX] === 1 &&
            board[boardY + pieceY][boardX + pieceX].blockType ==
              BoardBlockType.FILLED
          ) {
            canFit = false;
            break;
          }
        }
        if (!canFit) break;
      }

      if (canFit) {
        fitPositions[boardY][boardX] = 1;
      }
    }
  }

  return fitPositions;
}

export function clearHoverBlocks(board: Board): Board {
  "worklet";
  const boardLength = board.length;
  for (let y = 0; y < boardLength; y++) {
    for (let x = 0; x < boardLength; x++) {
      const blockType = board[y][x].blockType;
      if (
        blockType == BoardBlockType.HOVERED ||
        blockType == BoardBlockType.HOVERED_BREAK_EMPTY
      ) {
        board[y][x].blockType = BoardBlockType.EMPTY;
        board[y][x].hoveredBreakColor = { r: 0, g: 0, b: 0 }; // Clear hover break color
      } else if (blockType == BoardBlockType.HOVERED_BREAK_FILLED) {
        board[y][x].blockType = BoardBlockType.FILLED;
        board[y][x].hoveredBreakColor = { r: 0, g: 0, b: 0 }; // Clear hover break color
      }
    }
  }
  return board;
}

export function placePieceOntoBoard(
  board: Board,
  piece: PieceData,
  dropX: number,
  dropY: number,
  blockType: BoardBlockType,
) {
  "worklet";
  for (let y = 0; y < piece.matrix.length; y++) {
    for (let x = 0; x < piece.matrix[0].length; x++) {
      if (piece.matrix[y][x] == 1) {
        board[dropY + y][dropX + x].blockType = blockType;
        board[dropY + y][dropX + x].color = piece.color;
      }
    }
  }
}

export function updateHoveredBreaks(
  board: Board,
  piece: PieceData,
  dropX: number,
  dropY: number,
) {
  "worklet";
  const boardLength = board.length;
  const tempBoard = [...board];
  placePieceOntoBoard(tempBoard, piece, dropX, dropY, BoardBlockType.HOVERED);

  const rowsToClear = new Set<number>();
  const colsToClear = new Set<number>();

  for (let row = 0; row < boardLength; row++) {
    if (
      tempBoard[row].every(
        (cell) =>
          cell.blockType == BoardBlockType.FILLED ||
          cell.blockType == BoardBlockType.HOVERED,
      )
    ) {
      rowsToClear.add(row);
    }
  }

  for (let col = 0; col < boardLength; col++) {
    if (
      tempBoard.every(
        (row) =>
          row[col].blockType == BoardBlockType.FILLED ||
          row[col].blockType == BoardBlockType.HOVERED,
      )
    ) {
      colsToClear.add(col);
    }
  }

  const count = rowsToClear.size + colsToClear.size;

  if (count > 0) {
     rowsToClear.forEach((row) => {
       for (let col = 0; col < boardLength; col++) {
         if (board[row][col].blockType == BoardBlockType.FILLED) {
           board[row][col].blockType = BoardBlockType.HOVERED_BREAK_FILLED;
           board[row][col].hoveredBreakColor = piece.color;
         } else {
           board[row][col].blockType = BoardBlockType.HOVERED_BREAK_EMPTY;
           board[row][col].hoveredBreakColor = piece.color;
         }
       }
     });

     colsToClear.forEach((col) => {
       for (let row = 0; row < boardLength; row++) {
         if (board[row][col].blockType == BoardBlockType.FILLED) {
           board[row][col].blockType = BoardBlockType.HOVERED_BREAK_FILLED;
           board[row][col].hoveredBreakColor = piece.color;
         } else {
           board[row][col].blockType = BoardBlockType.HOVERED_BREAK_EMPTY;
           board[row][col].hoveredBreakColor = piece.color;
         }
       }
     });
  }
}

export function breakLines(board: Board): number {
  "worklet";
  const boardLength = board.length;
  const rowsToClear = new Set<number>();
  const colsToClear = new Set<number>();

  for (let row = 0; row < boardLength; row++) {
    if (board[row].every((cell) => cell.blockType == BoardBlockType.FILLED)) {
      rowsToClear.add(row);
    }
  }

  for (let col = 0; col < boardLength; col++) {
    if (board.every((row) => row[col].blockType == BoardBlockType.FILLED)) {
      colsToClear.add(col);
    }
  }

  const count = rowsToClear.size + colsToClear.size;

  if (count > 0) {
    rowsToClear.forEach((row) => {
      for (let col = 0; col < boardLength; col++) {
        board[row][col].blockType = BoardBlockType.EMPTY;
        board[row][col].hoveredBreakColor = { r: 0, g: 0, b: 0 }; // Clear hover break color
      }
    });

    colsToClear.forEach((col) => {
      for (let row = 0; row < boardLength; row++) {
        board[row][col].blockType = BoardBlockType.EMPTY;
        board[row][col].hoveredBreakColor = { r: 0, g: 0, b: 0 }; // Clear hover break color
      }
    });
  }

  return count;
}

export function forEachBoardBlock(board: Board, each: ((block: BoardBlock, x: number, y: number) => boolean) | ((block: BoardBlock, x: number, y: number) => void)) {
  const length = board.length;
  for (let y = 0; y < length; y++) {
    for (let x = 0; x < length; x++) {
      each(board[y][x], x, y);
    }
  }
}

export function canAnyPieceFit(board: Board, pieces: (PieceData | null)[]): boolean {
  "worklet";
  const boardLength = board.length;
  
  for (const piece of pieces) {
    if (piece == null) continue;
    
    const pieceHeight = piece.matrix.length;
    const pieceWidth = piece.matrix[0].length;
    
    // Check if piece can fit anywhere on the board
    for (let boardY = 0; boardY <= boardLength - pieceHeight; boardY++) {
      for (let boardX = 0; boardX <= boardLength - pieceWidth; boardX++) {
        let canFit = true;
        
        for (let pieceY = 0; pieceY < pieceHeight; pieceY++) {
          for (let pieceX = 0; pieceX < pieceWidth; pieceX++) {
            if (
              piece.matrix[pieceY][pieceX] === 1 &&
              board[boardY + pieceY][boardX + pieceX].blockType == BoardBlockType.FILLED
            ) {
              canFit = false;
              break;
            }
          }
          if (!canFit) break;
        }
        
        if (canFit) {
          return true; // At least one piece can fit
        }
      }
    }
  }
  
  return false; // No pieces can fit
}