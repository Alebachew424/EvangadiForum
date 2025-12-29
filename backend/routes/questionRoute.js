const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

// ============================================
// ROUTE: GET ALL QUESTIONS
// Endpoint: GET /api/question
// ============================================
router.get('/', questionController.getAllQuestions);

// ============================================
// ROUTE: GET SINGLE QUESTION BY ID
// Endpoint: GET /api/question/:question_id
// ============================================
router.get('/:question_id', questionController.getSingleQuestion);

// ============================================
// ROUTE: POST NEW QUESTION (TASK #10)
// Endpoint: POST /api/question
// Protected by authentication middleware
// ============================================
router.post('/', authMiddleware.authenticateToken, questionController.postQuestion);

module.exports = router;