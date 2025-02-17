const db=require('../config/firebase');
const incomesCollection=db.collection('incomes');

//get all incomes

exports.getAllIncome=async (req,res,next)=>{
    try{
const snapshot=await incomesCollection.get();
const income=[];
snapshot.forEach(doc=>{income.push({id: doc.id,...doc.data()})}
    )

    //Object.entries() converts an object into an array of key-value pairs
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Income List</title>
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
        <h1>Income List</h1>
        ${income.map(income => `
          <div class="income-card">
            <div class="income-id">ID: ${income.id}</div>
            
            ${Object.entries(income)
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

    //res.json(income);


    }catch(error){

        next(error);
    }

};

//create income

exports.createIncome=async (req,res,next)=>{
    try{
        if (!req.body || Object.keys(req.body).length === 0) {
            const error = new Error('Request body is empty');
            error.code = 'INVALID_ARGUMENT';
            return next(error);
          }
        if (!req.body.amount) {
            const error = new Error('Amount is required');
            next(error);
          }
        console.log('I am in creating new income..')
        const incomeData={
            ...req.body,
            createdAt: new Date().toISOString()
        };
        //save to firebase
        const docRef=await incomesCollection.add(incomeData);
        //return saved incometh ID
        res.status(201).json({
            id: docRef.id,
            ...incomeData
        });

    }catch(error){
        console.log('Error creating income: ',error)
        next(error);
    }
}

exports.updateIncome=async (req,res,next)=>{
    try{
        const { id } = req.params;
    
    // Check if income exists
    const incomeRef = incomesCollection.doc(id);
    const doc = await incomeRef.get();
    if(!doc.exists){
        return res.status(404).json({
            message:'Income not found',
            requestedId: id
        });
    }
    const data={
        ...req.body,
        updatedAt: new Date().toISOString()
    }
    await incomeRef.update(data);
    //return updated income
    res.json({
        id,
        ...data
    });

    }catch(error){
        console.log("Error in updating income");
        next(error);
    }

};

// Delete income
exports.deleteIncome = async (req, res, next) => {
    try {
      const { id } = req.params;
      await incomesCollection.doc(id).delete();
      res.json({ message: 'Income deleted successfully' });
    } catch (error) {
      console.error('Error deleting income:', error);
      next(error);
    }
  }; 