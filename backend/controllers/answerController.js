const answerService = require("../services/answer.service");
const db = require("../config/db");
const { StatusCodes } = require("http-status-codes");

const getAnswersByQuestion = async (req, res, next) => {
  const { question_id } = req.params;

  // Validation
  if (!question_id || isNaN(question_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid question_id",
    });
  }

  try {
    const answers = await answerService.getAnswersByQuestionId(question_id);

    if (answers.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,

        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }

    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
    next(error); // goes to error middleware
  }
};

module.exports = { getAnswersByQuestion };
