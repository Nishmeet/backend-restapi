const db = require('../config/firebase');

const usersCollection = db.collection('users');

// Helper function to format nested data
const formatUserData = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,

    ...data,
    // Format nested objects
    address: data.address || {}
    
  };
};

exports.getAllUsers = async (req, res, next) => {
  try {
    console.log('Fetching all users...');
    
    const snapshot = await usersCollection.get();

    const users = [];
    console.log('Document ID:', snapshot.id);
    
    snapshot.forEach(doc => {
      users.push(formatUserData(doc));
    });
    
    console.log('Retrieved users:', users);
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Users List</title>
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
          <h1>Users List</h1>
          ${users.map(user => `
            <div class="income-card">
              <div class="income-id">ID: ${user.id}</div>
              
              ${Object.entries(user)
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
    
    //res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    console.log('Attempting to create user with data:', req.body);
    
    // Example of nested data structure
    const user = {
      name: req.body.name?.trim(),
      email: req.body.email?.trim(),
      phone: req.body.phone?.trim(),
      address: {
        street: req.body.address?.street?.trim() || '',
        suite: req.body.address?.suite?.trim() || '',
        city: req.body.address?.city?.trim() || '',
        zipCode: req.body.address?.zipCode?.trim() || ''
      },
      createdAt: new Date().toISOString()
    };
    
    const docRef = await usersCollection.add(user);
    console.log('User created successfully with ID:', docRef.id);
    
    res.status(201).json({
      id: docRef.id,
      ...user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    // Clean the ID parameter by removing any 'id=' prefix
    let id = req.params.id.replace('id=', '');
    console.log('Original ID:', id);

    const docRef = usersCollection.doc(id);
    console.log('Attempting to fetch from path:', docRef.path);
    
    let doc = await docRef.get();
    
    // If not found and ID is numeric, try as a number
    if (!doc.exists && !isNaN(id)) {

      const numericId = Number(id);
      console.log('Trying with numeric ID:', numericId);
      const numericRef = usersCollection.doc(numericId.toString());
      doc = await numericRef.get();
    }

    if (!doc.exists) {
      console.log('Document not found with either string or numeric ID');
      return res.status(404).json({ 
        message: 'User not found',
        requestedId: id,
        exists: false
      });
    }

    console.log('Document found:', doc.id, doc.data());
    const userData = formatUserData(doc);
    
    res.json(userData);

  } catch (error) {
    console.error('Error fetching user:', error);
    next(error);
  }
};


exports.updateUser = async (req, res, next) => {
  try {
    console.log("I am in updateUser")
    const { id } = req.params;
    const updates = req.body;
    
    // Handle nested updates
    const userRef = usersCollection.doc(id);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const currentData = doc.data();
    const updatedUser = {
      ...currentData,
      ...updates,
      address: {
        ...currentData.address,
        ...updates.address
      },
      // preferences: {
      //   ...currentData.preferences,
      //   ...updates.preferences
      // },
      //updatedAt: new Date().toISOString()
    };
    
    await userRef.update(updatedUser);
    res.json({ id, ...updatedUser });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await usersCollection.doc(id).delete();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    const { name, email, phone } = req.query;
    //Add request logging
    console.log('Raw request query:', req.query);
    
    // Validate input
    if (!name && !email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'At least one search criteria (name, email, or phone) is required'
      });
    }
    
    // Clean up the search parameters and convert to lowercase
    const cleanName = name?.replace(/['"]+/g, '').trim().toLowerCase();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPhone = phone?.trim();
    
    console.log('Searching users with criteria:', { 
      name: cleanName, 
      email: cleanEmail, 
      phone: cleanPhone 
    });

    // Get all users first
    const snapshot = await usersCollection.get();
    const users = [];

    // Filter users manually for more flexible matching
    snapshot.forEach(doc => {
      const userData = doc.data();
      const matches = (!cleanName || userData.name.toLowerCase().includes(cleanName)) &&
                     (!cleanEmail || userData.email.toLowerCase().includes(cleanEmail)) &&
                     (!cleanPhone || userData.phone.includes(cleanPhone));
      
      if (matches) {
        users.push({ id: doc.id, ...userData });
      }
    });

    console.log(`Found ${users.length} matching users`);

    if (users.length === 0) {
      // Log all users to see what's in the database
      console.log('All users in database:', 
        (await usersCollection.get()).docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
      
      return res.status(404).json({
        message: 'No users found matching criteria',
        searchCriteria: { 
          name: cleanName, 
          email: cleanEmail, 
          phone: cleanPhone 
        }
      });
    }
  
   res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    next(error);
  }
}; 