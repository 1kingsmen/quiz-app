import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState(0);
  const [showScores, setShowScores] = useState(false);

  const decodeEntities = (html) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get('https://opentdb.com/api_category.php');
        setCategories(response.data.trivia_categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      if (selectedCategory) {
        try {
          const response = await axios.get(
            `https://opentdb.com/api.php?amount=${numQuestions}&category=${selectedCategory}&difficulty=${difficulty.toLowerCase()}`
          );
          const formattedQuestions = response.data.results.map((question) => ({
            question: decodeEntities(question.question),
            incorrect_answers: question.incorrect_answers.map(decodeEntities),
            correct_answer: decodeEntities(question.correct_answer),
          }));
          setQuestions(formattedQuestions);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
    fetchQuestions();
  }, [selectedCategory, numQuestions, difficulty]);

  const checkAnswer = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScores(scores + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScores(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScores(0);
    setShowScores(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg p-4 shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">Quiz App</h1>

        
        <div className="mb-4">
          <label htmlFor="numQuestions">Number of Questions:</label>
          <input
            type="number"
            id="numQuestions"
            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-red-500"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="difficulty">Select Difficulty:</label>
          <select
            id="difficulty"
            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-red-500"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="category">Select Category:</label>
          <select
            id="category"
            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-red-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select your category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {questions.length > 0 ? (
          showScores ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your score: {scores} / {questions.length}</h2>
              <button
                onClick={restartQuiz}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Restart Quiz
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Question {currentQuestion + 1}</h2>
              <p className="text-lg mb-4">{questions[currentQuestion].question}</p>
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].incorrect_answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => checkAnswer(answer)}
                    className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
                  >
                    {answer}
                  </button>
                ))}
                <button
                  onClick={() => checkAnswer(questions[currentQuestion].correct_answer)}
                  className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
                >
                  {questions[currentQuestion].correct_answer}
                </button>
              </div>
            </div>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default App;
