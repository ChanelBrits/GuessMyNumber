'use strict';

const GAME_CONSTANTS = {
  MAX_SCORE: 20,
  MAX_INPUT: 20,
  WINNING_COLOR: '#60b347',
  DEFAULT_COLOR: '#222',
};

const html = {
  message: document.querySelector('.message'),
  number: document.querySelector('.number'),
  score: document.querySelector('.score'),
  guess: document.querySelector('.guess'),
  checkBtn: document.querySelector('.check'),
  body: document.querySelector('body'),
  againBtn: document.querySelector('.again'),
  highscoreElement: document.querySelector('.highscore'),
};

const messages = {
  invalid: '⛔️ Please enter a valid number',
  correct: '🎉 Correct Number!',
  high: '📈 Too high!',
  low: '📉 Too low!',
  lost: '💥 You lost the game!',
};

/**
 * Generates a random number between 1 and {@link GAME_CONSTANTS.MAX_INPUT}
 * @param {number} max - The maximum number to generate
 * @returns {number}
 */
const generateRandomNumber = (max) => {
  return Math.trunc(Math.random() * max) + 1;
};

let secretNumber = generateRandomNumber(GAME_CONSTANTS.MAX_INPUT);
let currentScore = GAME_CONSTANTS.MAX_SCORE;
let highScore = 0;
let messageText = '';

/**
 * Handles the scenario when the user guesses the correct number. Updates the
 * HTML elements to the correct number, adjusting style elements, and updating
 * the high score if necessary.
 *
 * @returns {object} - An object containing the correct message and the updated
 * score
 */
const handleCorrectGuess = () => {
  const { number, body, highscoreElement } = html;
  messageText = messages.correct;
  number.innerHTML = secretNumber;
  body.style.backgroundColor = GAME_CONSTANTS.WINNING_COLOR;
  number.style.width = '30rem';

  if (currentScore > highScore) {
    highScore = currentScore;
    highscoreElement.innerHTML = highScore;
  }

  return { message: messageText, updatedScore: currentScore };
};

/**
 * Handles the scenario when the user guesses incorrectly. Adjusts the message
 * based on whether the guessed number is too high or too low. Clears the guess
 * input field in the HTML and decrements the current score. If the score reaches
 * or falls below one, it indicates that the user has lost the game.
 *
 * @param {number} guessInput - The user's guessed number.
 * @returns {object} - An object containing the message for the incorrect guess
 * and the updated score.
 */
const handleIncorrectGuess = (guessInput) => {
  const { high, low, lost } = messages;
  const isHigh = guessInput > secretNumber;
  messageText = isHigh ? high : low;
  html.guess.value = '';

  if (currentScore > 1) {
    currentScore--;
  } else {
    messageText = lost;
    currentScore = 0;
  }

  return { message: messageText, updatedScore: currentScore };
};

/**
 * Checks if the input is falsy or exceeds the maximum allowed value. If
 * validation fails, it updates the HTML to display an invalid message, clears
 * the guess input field, and returns `false`. Otherwise, it returns `true`.
 *
 * @param {number} guessInput - The user's guessed number.
 * @returns {boolean} - `true` if the input is valid; `false` if validation
 * fails.
 */
const validateInput = (guessInput) => {
  if (!guessInput || guessInput > GAME_CONSTANTS.MAX_INPUT) {
    messageText = messages.invalid;
    html.message.innerHTML = messageText;
    html.guess.value = '';

    return false;
  }
  return true;
};

/**
 * Handles the user's guess by first validating the input. If the input is
 * invalid, it returns an object containing the invalid message and the current
 * score. If the input is correct, it calls the {@link handleCorrectGuess} function.
 * Otherwise, it calls the {@link handleIncorrectGuess} function and returns the
 * result.
 *
 * @param {number} guessInput - The user's guessed number.
 * @returns {object} - An object containing the message for the guess and the
 * updated score.
 */
const handleGuess = (guessInput) => {
  if (!validateInput(guessInput)) {
    return { message: messageText, updatedScore: currentScore };
  }

  if (guessInput === secretNumber) {
    return handleCorrectGuess();
  }

  return handleIncorrectGuess(guessInput);
};

/**
 * Handles the click event on the "Check" button, retrieves the user's guessed
 * number from the input field, and calls the {@link handleGuess} function
 * determine if the guess is correct, too high or too low. Updates the HTML
 * elements with the result message and the updated score.
 */
const handleClickBtn = () => {
  const { guess, message, score } = html;
  const guessInput = parseInt(guess.value);

  const result = handleGuess(guessInput);

  message.innerHTML = result.message;
  score.innerHTML = result.updatedScore;
};

/**
 * Handles the click event on the "Again" button, resets the game by setting the
 * current score back to the maximum, generating a new secret number, and
 * updating the HTML elements to their initial state for a new round. The high
 * score remains unchanged to allow the user to beat their previous high score.
 */
const handleAgainBtn = () => {
  const { score, message, number, guess, body } = html;
  currentScore = GAME_CONSTANTS.MAX_SCORE;
  secretNumber = generateRandomNumber(GAME_CONSTANTS.MAX_INPUT);

  message.innerHTML = 'Start guessing...';
  score.innerHTML = currentScore;
  number.innerHTML = '?';
  guess.value = '';
  body.style.backgroundColor = GAME_CONSTANTS.DEFAULT_COLOR;
  number.style.width = '15rem';
};

const handleEnterBtn = (event) => {
  if (event.key === 'Enter') {
    handleClickBtn();
  }
};

html.checkBtn.addEventListener('click', handleClickBtn);
html.againBtn.addEventListener('click', handleAgainBtn);
document.addEventListener('keydown', handleEnterBtn);
