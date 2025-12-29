const db = require('../config/db');

// Function to get all questions
async function getAllQuestions(req, res) {
  try {
    const [questions] = await db.promise().query(
      `SELECT q.*, u.username as user_name 
       FROM questions q 
       JOIN users u ON q.userid = u.userid 
       ORDER BY q.created_at DESC`
    );

    if (questions.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "No questions found."
      });
    }

    res.status(200).json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred."
    });
  }
}

// Function to get single question
async function getSingleQuestion(req, res) {
  const { question_id } = req.params;

  try {
    const [questions] = await db.promise().query(
      `SELECT q.*, u.username as user_name 
       FROM questions q 
       JOIN users u ON q.userid = u.userid 
       WHERE q.questionid = ?`,
      [question_id]
    );

    if (questions.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "The requested question could not be found."
      });
    }

    res.status(200).json({ question: questions[0] });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred."
    });
  }
}

// ============================================
// TASK #10: POST QUESTION FUNCTION
// ============================================
async function postQuestion(req, res) {
  const { title, description } = req.body;
  
  // Get user ID from auth middleware
  const userid = req.user?.userid || req.userId;

  // Validation: Check for required fields
  if (!title || !description) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide all required fields"
    });
  }

  // Validate title length
  if (title.trim().length < 5) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Title must be at least 5 characters long"
    });
  }

  // Validate description length
  if (description.trim().length < 10) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Description must be at least 10 characters long"
    });
  }

  try {
    // Insert the question into database
    const [result] = await db.promise().query(
      `INSERT INTO questions (title, description, userid) 
       VALUES (?, ?, ?)`,
      [title.trim(), description.trim(), userid]
    );

    // Success response as per API documentation
    res.status(201).json({
      message: "Question created successfully"
    });

  } catch (error) {
    console.error('Error posting question:', error);
    
    // Handle specific database errors
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid user ID"
      });
    }

    // Generic server error as per API documentation
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred."
    });
  }
}

// Export functions
module.exports = { 
  getAllQuestions, 
  getSingleQuestion, 
  postQuestion 
};