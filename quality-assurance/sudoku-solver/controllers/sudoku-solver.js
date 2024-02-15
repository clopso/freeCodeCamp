class SudokuSolver {

  validate(puzzleString) {
    if(puzzleString.length !== 81){
      return {
        error: 'Expected puzzle to be 81 characters long'
      };
    };
    
    if(/[^0-9.]/.test(puzzleString)){
      return {
        error: 'Invalid characters in puzzle'
      };
    };

    return true;
  };

  checkRowPlacement(puzzleString, row, column, value) {
    let rowString = puzzleString.slice(row * 9, row * 9 + 9);
    
    if(rowString.includes(value)){
      return false;
    };
    
    return true;
  };

  checkColPlacement(puzzleString, row, column, value) {
    let colString = '';
    column -= 1;
    for(let i = 0; i < 9; i++){
      colString += puzzleString[(i * 9) + column];
    };
    
    if(colString.includes(value)){
      return false;
    };
    
    return true;
  };

  checkRegionPlacement(puzzleString, row, column, value) {    
    let regionRow = Math.floor(row / 3) * 3;
    let regionCol = Math.floor((column - 1)/ 3) * 3;

    for(let i = regionRow; i < regionRow + 3; i++){
      for(let j = regionCol; j < regionCol + 3; j++){

        if(puzzleString[(i * 9) + j] == value){
          return false;
        };
      };
    };

    return true;
  }

  solve(puzzleString) {    
    if(this.validate(puzzleString) !== true){
      return this.validate(puzzleString);
    }

    const emptyIndex = puzzleString.indexOf('.');
    if(emptyIndex === -1){
      return puzzleString;
    }

    const row = Math.floor(emptyIndex / 9)
    const col = emptyIndex % 9 + 1;
    
    for(let i = 1; i <= 9; i++){
      const value = i.toString();
      if(this.checkRowPlacement(puzzleString, row, col, value) &&
         this.checkColPlacement(puzzleString, row, col, value) &&
         this.checkRegionPlacement(puzzleString, row, col, value)){
        let newPuzzleString = puzzleString.slice(0, emptyIndex) + value + puzzleString.slice(emptyIndex + 1);
        
        let solution = this.solve(newPuzzleString);
        
        if(solution !== false){
          return solution;
        }
      }
    }
    return false;
  }
}

module.exports = SudokuSolver;

