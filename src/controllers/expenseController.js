const db = require('../config/firebase');
const expensesCollection = db.collection('expenses');

// Get all expenses
exports.getAllExpenses = async (req, res, next) => {
  try {
    const snapshot = await expensesCollection.get();
    const expenses = [];
    
    snapshot.forEach(doc => {
      expenses.push({ id: doc.id, ...doc.data() });
    });
    //Object.entries() converts an object into an array of key-value pairs
    res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Expenses List</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: #f5f5f5;
              }
              .income-card {
                background: white;
                padding: 15px;
                margin: 10px 0;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .income-id {
                color: #666;
                font-size: 0.9em;
              }
              .category {
                font-weight: bold;
                color: #2c5282;
                margin-top: 10px;
              }
              .item {
                margin-left: 20px;
                color: #444;
              }
              .amount {
                color: #2f855a;
              }
            </style>
          </head>
          <body>
            <h1>Expenses List</h1>
            ${expenses.map(expense => `
              <div class="income-card">
                <div class="income-id">ID: ${expense.id}</div>
                
                ${Object.entries(expense)
                  .filter(([key]) => key !== 'id')
                  .map(([category, items]) => `
                    <div class="category">${category}</div>
                    ${typeof items === 'object' ? 
                      Object.entries(items).map(([item, amount]) => `
                        <div class="item">
                          ${item}: <span class="amount">$${amount}</span>
                        </div>
                      `).join('') : 
                      `<div class="item">${items}</div>`
                    }
                  `).join('')}
              </div>
            `).join('')}
          </body>
        </html>`)
    
    //res.json(expenses);
  } catch (error) {
    console.error('Error getting expenses:', error);
    next(error);
  }
};

// Create new expense
exports.createExpense = async (req, res, next) => {
  try {
    // Get data from request body
    const expenseData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };

    // Save to Firebase
    const docRef = await expensesCollection.add(expenseData);

    // Return saved expense with ID
    res.status(201).json({
      id: docRef.id,
      ...expenseData
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    next(error);
  }
};

// Update expense
exports.updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if expense exists
    const expenseRef = expensesCollection.doc(id);
    const doc = await expenseRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        message: 'Expense not found',
        requestedId: id
      });
    }

    // Update the expense
    const updatedData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await expenseRef.update(updatedData);
    
    // Return updated expense
    res.json({
      id,
      ...updatedData
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    next(error);
  }
};

// Delete expense
exports.deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    await expensesCollection.doc(id).delete();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    next(error);
  }
}; 