const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

// Initialize Express
const app = express();
const PORT = 3000; // Unified port for the server

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/exam-portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1); // Exit the process with failure
});

// Define the schema for user and admin
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Define the User and Admin models
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", userSchema); // Reusing the same schema for simplicity

// Define the schema for questions
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],  // Array of 4 options
  answer: String,     // Correct answer
});

// Define the schema for user scores
const scoreSchema = new mongoose.Schema({
  username: String,
  score: Number,
  date: { type: Date, default: Date.now }
});

// Define Models
const Question = mongoose.model('Question', questionSchema);
const Score = mongoose.model('Score', scoreSchema);

// Default questions to populate the DB
const defaultQuestions = [
  { question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], answer: "O(log n)" },
  { question: "Which of these is not a programming language?", options: ["Python", "Java", "HTML", "C++"], answer: "HTML" },
  { question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], answer: "Cascading Style Sheets" },
  { question: "What is the default HTTP status code for a successful GET request?", options: ["200", "201", "404", "500"], answer: "200" },
  { question: "Which data structure works on the principle of FIFO?", options: ["Stack", "Queue", "Tree", "Graph"], answer: "Queue" },
  { question: "Which HTML element is used to define an unordered list?", "options": ["<ul>", "<ol>", "<li>", "<dl>"], "answer": "<ul>" },
  { question: "Which of these is a JavaScript framework?", "options": ["React", "Django", "Laravel", "Flask"], "answer": "React" },
  { question: "What does SQL stand for?", "options": ["Structured Query Language", "Simple Query Language", "Standard Query Language", "Server Query Language"], "answer": "Structured Query Language" },
  { question: "Which of the following is not an HTTP method?", "options": ["GET", "POST", "PUT", "SEND"], "answer": "SEND" },
  { question: "Which of these is a NoSQL database?", "options": ["MySQL", "PostgreSQL", "MongoDB", "SQLite"], "answer": "MongoDB" },
  { question: "In Python, what is the output of print(2 ** 3)?", "options": ["6", "8", "9", "16"], "answer": "8" },
  { question: "Which CSS property is used to change the text color of an element?", "options": ["font-color", "color", "text-color", "background-color"], "answer": "color" },
  { question: "Which symbol is used to start a comment in JavaScript?", "options": ["//", "#", "<!--", "*"], "answer": "//" },
  { question: "What is the purpose of the 'this' keyword in JavaScript?", "options": ["Refers to the current object", "Refers to a global variable", "Refers to a local variable", "Refers to a function"], "answer": "Refers to the current object" },
  { question: "What does HTTP stand for?", "options": ["HyperText Transfer Protocol", "Hyperlink Text Transfer Protocol", "HyperText Transmission Protocol", "Hyperlink Transmission Protocol"], "answer": "HyperText Transfer Protocol" },
  { question: "Which tag is used to create a hyperlink in HTML?", "options": ["<a>", "<link>", "<href>", "<hyperlink>"], "answer": "<a>" },
  { question: "Which of the following is a front-end framework?", "options": ["Angular", "Spring", "Node.js", "Django"], "answer": "Angular" },
  { question: "What does API stand for?", "options": ["Application Programming Interface", "Application Process Interface", "Application Protocol Interface", "Application Proxy Interface"], "answer": "Application Programming Interface" },
  { question: "Which function is used to parse a string to an integer in JavaScript?", "options": ["parseInt()", "parseFloat()", "Number()", "toString()"], "answer": "parseInt()" },
  { question: "Which of these is a version control system?", "options": ["Git", "Docker", "Jenkins", "Kubernetes"], "answer": "Git" },
  { question: "What is the primary purpose of a database index?", "options": ["To increase data storage", "To improve query performance", "To maintain data integrity", "To ensure data consistency"], "answer": "To improve query performance" },
  { question: "Which protocol is used for secure communication over a computer network?", "options": ["FTP", "HTTP", "SSH", "Telnet"], "answer": "SSH" },
  { question: "Which CSS property controls the size of text?", "options": ["text-size", "font-size", "size", "text-style"], "answer": "font-size" },
  { question: "Which of these is not a valid JavaScript data type?", "options": ["String", "Boolean", "Float", "Object"], "answer": "Float" },
  { question: "What is the output of 'typeof null' in JavaScript?", "options": ["null", "object", "undefined", "boolean"], "answer": "object" }
];

// Insert questions if the collection is empty
async function populateDB() {
  try {
    for (const defaultQuestion of defaultQuestions) {
      const exists = await Question.exists({ question: defaultQuestion.question });
      if (!exists) {
        await Question.create(defaultQuestion);
        //console.log(`Question added: ${defaultQuestion.question}`);
      }
    }
    console.log("Database population completed.");
  } catch (error) {
    console.error("Failed to populate the database with questions", error);
  }
}
populateDB();


// Server check
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Admin Signup endpoint
app.post("/AdminSignin", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.json({ status: 'exist' }); // Admin already exists
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();
    res.json({ status: 'notexist' }); // Successful signup
  } catch (error) {
    console.error(error); // Log error details for debugging
    res.status(500).json({ status: 'fail', error: 'Server error' });
  }
});

// Admin Login endpoint
app.post("/AdminLogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (admin && await bcrypt.compare(password, admin.password)) {
      return res.json({ status: 'exist', name: admin.username });
    } else {
      return res.json({ status: 'notexist' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', error: 'Server error' });
  }
});

// Route to handle admin forgot password
app.post('/api/admin/forget-password1', async (req, res) => { // Ensure this matches your front-end path
  const { email, newPassword } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ status: 'fail', error: 'Admin not found' });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ status: 'success', message: 'Password updated' });
  } catch (error) {
    console.error("Failed to update password", error);
    res.status(500).json({ status: 'fail', error: 'Server error' });
  }
});


// Student Signup endpoint
app.post("/LoginSignup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ status: 'exist' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.json({ status: 'notexist' }); // Successful signup
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', error: 'Server error' });
  }
});

// Student Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      return res.json({ status: 'exist', name: user.username });
    } else {
      return res.json({ status: 'notexist' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', error: 'Server error' });
  }
});

// Route to handle forgot password
app.post('/api/forget-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: 'fail', error: 'User not found' });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Password updated' });
  } catch (error) {
    console.error("Failed to update password", error);
    res.status(500).json({ status: 'fail', error: 'Server error' });
  }
});

// Fetch all questions for the quiz
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error("Failed to fetch questions", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Save student test score
app.post('/api/submit-score', async (req, res) => {
  const { username, score } = req.body;

  try {
    const newScore = new Score({ username, score });
    await newScore.save();
    res.json({ status: "success", message: "Score saved" });
  } catch (error) {
    console.error("Failed to save score", error);
    res.status(500).json({ error: "Failed to save score" });
  }
});

// Fetch student scores by username
app.get('/api/scores', async (req, res) => {
  const { username } = req.query; // Get the username from query parameters

  try {
    const scores = await Score.find({ username });
    res.json(scores);
  } catch (error) {
    console.error("Failed to fetch scores", error);
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
