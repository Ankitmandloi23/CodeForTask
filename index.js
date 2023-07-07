const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5050;

// Dummy database
const users = [];
const todos = [];

app.use(bodyParser.json());

app.get('/signup', (req, res) => {
//  const { email, mobile, password } = req.body;

console.log(req.body);
  // Check if email or mobile already exists
  const userExists = users.find(
    (user) => user.email === email || user.mobile === mobile
  );
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create new user
  const newUser = { email, mobile, password: hashedPassword };
  users.push(newUser);

  res.status(200).json({ message: 'Signup successful' });
});

// Login route
app.post('/login', (req, res) => {
  const { emailOrMobile, password } = req.body;

  // Check if user with email or mobile exists
  const user = users.find(
    (user) =>
      (user.email === emailOrMobile || user.mobile === emailOrMobile)
  );
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Compare passwords
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Create and sign a JWT token
  const token = jwt.sign({ userId: user.id }, 'secret-key');

  res.status(200).json({ message: 'Login successful', token });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = decoded.userId;
    next();
  });
}

// Dashboard route
app.get('/dashboard', authenticateToken, (req, res) => {
  // Retrieve user's todos from the database
  const userTodos = todos.filter((todo) => todo.userId === req.userId);

  res.status(200).json({ todos: userTodos });
});

// Logout route
app.post('/logout', (req, res) => {
  // Perform any logout-related operations, e.g., token invalidation

  res.status(200).json({ message: 'Logout successful' });
});

// Start the server
app.listen(port,function(err){
if(err)
{
console.log(`enable to connect ${err}`);
}
else
{
console.log(`ready to start server on port ${port}`);
}
});
