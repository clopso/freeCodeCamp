'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      if(req.body.puzzle === undefined || req.body.coordinate === undefined || req.body.value === undefined){
        return res.json({ error: 'Required field(s) missing' });
      }

      if (!(req.body.value > 0) || !(req.body.value < 10)) {
        return res.json({ error: 'Invalid value' });
      }

      if (!/^[A-I][1-9]$/.test(req.body.coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      const puzzleString = req.body.puzzle;

      const validString = solver.validate(puzzleString);
      if(validString !== true){
        return res.json(validString);
      }

      const row = parseInt(req.body.coordinate[0].toUpperCase().charCodeAt(0) - 65, 10);
      const col = parseInt(req.body.coordinate[1], 10);
      const conflict = [];
      
      if(req.body.value.toString() === puzzleString[row * 9 + col - 1]){
        return res.json({ valid: true });
      }

      if (!solver.checkRowPlacement(puzzleString, row, col, req.body.value)) {
        conflict.push('row');
      }

      if (!solver.checkColPlacement(puzzleString, row, col, req.body.value)) {
        conflict.push('column');
      }

      if (!solver.checkRegionPlacement(puzzleString, row, col, req.body.value)) {
        conflict.push('region');
      }

      const valid = conflict.length === 0;

      res.json({ valid, conflict });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if(!req.body.puzzle){
        return res.json({ error: 'Required field missing' });
      }

      const puzzleString = req.body.puzzle;

      const solution = solver.solve(puzzleString);

      if(!solution){
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      if(solution.error){
        return res.json({ error: solution.error });
      }
      
      res.json({ solution: solution })
    });
};
