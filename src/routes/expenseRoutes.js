const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
console.log('Setting up expense routes');
//all expense controller methods 

router.get('/', expenseController.getAllExpenses);
router.post('/', expenseController.createExpense);

// This route definition:
router.put('/:id', (req, res, next) => {
  console.log('Expense update route hit:', {
    id: req.params.id,
    body: req.body,
    url: req.url,
    path: req.path
  });
  expenseController.updateExpense(req, res, next);  // This line calls the controller function
});
router.delete('/:id', expenseController.deleteExpense);

module.exports = router; 