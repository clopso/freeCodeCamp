const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

import { puzzlesAndSolutions } from "../controllers/puzzle-strings";
const invalidPuzzle = 'ABC..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
const invalidLengthPuzzle = 'ABC1.5..2.84..63.12.7.2..5...123....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';


suite('Unit Tests', () => {
  
  suite('Validation tests', () => {
    
    test('Logic handles a valid puzzle string of 81 characters', (done) => {
      for (let i in puzzlesAndSolutions) {
        assert.isTrue(solver.validate(puzzlesAndSolutions[i][0]));
      }
      done();
    });
    
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
      let puzzleValidation = solver.validate(invalidPuzzle);
      assert.equal(puzzleValidation.error, 'Invalid characters in puzzle');

      done();
    });

    test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
      let puzzleValidation = solver.validate(invalidLengthPuzzle);
      assert.equal(puzzleValidation.error, 'Expected puzzle to be 81 characters long');

      done();
    });
  });
  
  suite('Placement tests', () => {

    test('Logic handles a valid row placement', (done) => {
      assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 1, 3, '5'), true);
      done();
    })

    test('Logic handles a invalid row placement', (done) => {
      assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 1, 3, '6'), false);
      done();
    })

    test('Logic handles a valid column placement', (done) => {
      assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 3, 3, '5'), false);
      done();
    })

    test('Logic handles an invalid column placement', (done) => {
      assert.equal(solver.checkColPlacement(puzzlesAndSolutions[1][0], 1, 1, '8'), false);
      done();
    })

    test('Logic handles a valid region (3x3 grid) placement', (done) => {
      const checks = [
        solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 0, 1, '3'),
        solver.checkRegionPlacement(puzzlesAndSolutions[1][0], 0, 1, '6'),
        solver.checkRegionPlacement(puzzlesAndSolutions[2][0], 0, 0, '2'),
      ];

      for (let i of checks) {
        assert.isTrue(i);
      }
      done();
    })

    test('Logic handles a invalid region (3x3 grid) placement', (done) => {
      const checks = [
        solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 0, 0, '2'),
        solver.checkRegionPlacement(puzzlesAndSolutions[1][0], 0, 0, '5'),
        solver.checkRegionPlacement(puzzlesAndSolutions[2][0], 0, 1, '8'),
      ];

      for (let i of checks) {
        assert.isFalse(i);
      }
      done();
    })
  });
  
  suite('Solving tests', () => {

    test('Valid puzzle strings pass the solver', (done) => {
      assert.equal(solver.solve(puzzlesAndSolutions[0][0]), puzzlesAndSolutions[0][1]);
      done();
    })

    test('Invalid puzzle strings fail the solver', (done) => {
      let puzzleSolver = solver.solve(invalidPuzzle)
      assert.isNotFalse(puzzleSolver.error, 'Invalid characters in puzzle');
      done();
    })

    test('Solver returns the expected solution for an incomplete puzzle', (done) => {
      for (let i in puzzlesAndSolutions) {
        assert.equal(
          solver.solve(puzzlesAndSolutions[i][0]),
          puzzlesAndSolutions[i][1]
        );
      }
      done();
    })
  });
});