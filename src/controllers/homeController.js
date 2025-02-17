// controllers/homeController.js
exports.getWelcomeMessage = (req, res) => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Finance Management API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #4a90e2;
          }
          .endpoints {
            margin-top: 1rem;
            text-align: left;
          }
          .endpoints h2 {
            color: #333;
          }
          .endpoints ul {
            list-style-type: none;
            padding: 0;
          }
          .endpoints li {
            margin: 0.5rem 0;
            font-size: 1.1rem;
          }
          .endpoints li strong {
            color: #4a90e2;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to the Finance Management API</h1>
          <div class="endpoints">
            <h2>Available Endpoints:</h2>
            <ul>
            <p>Users</p>
              <li><strong>GET</strong> /users - Get all users</li>
              <li><strong>GET</strong> /users/:id - Get users with ID(Firebase)</li>
              <li><strong>GET</strong> /users/search? - Get users by name,email,phone</li>
             
              <li><strong>POST</strong> /user - Create a new user</li>
              <li><strong>PUT</strong> /user/:id - Update a user</li>
              <li><strong>DELETE</strong> /user/:id - Delete a user</li>
              <p>Expense</p>
              <li><strong>GET</strong> /expenses - Get all expenses</li>
              <li><strong>POST</strong> /expenses - Create a new expense</li>
              <li><strong>PUT</strong> /expenses/:id - Update a expense/li>
              <li><strong>DELETE</strong> /expenses/:id - Delete a expense</li>
              <p>Income</p>
              <li><strong>GET</strong> /income - Get all income</li>
              <li><strong>POST</strong> /income - Create a new income</li>
              <li><strong>PUT</strong> /income/:id - Update a income</li>
              <li><strong>DELETE</strong> /income/:id - Delete a income</li>
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;
  
    res.send(html);
  };