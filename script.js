let num1, num2, correctAnswer;
const numChoices = 4;
let questionCount = 0;
let correctCount = 0;
let attempts = 0;
let difficulty = 'beginner';  // Default difficulty level
let questionTimeout;  // Variable to store the timeout reference
let consecutiveCorrectAnswers = 0;  // New variable for tracking consecutive correct answers

const backgroundMusic = document.getElementById("backgroundMusic");
const clickSound = document.getElementById("clickSound");  // Get the correct element for click sound
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

function playBackgroundMusic() {
    console.log("Attempting to play background music");
    backgroundMusic.play().then(() => {
        console.log("Background music is playing");
    }).catch((error) => {
        console.log("Failed to play background music", error);
    });
}

function selectDifficulty(selectedDifficulty) {
    difficulty = selectedDifficulty;
    document.getElementById('difficultyOptions').style.display = 'none';
    document.getElementById('playButton').style.display = 'block';
    document.getElementById('gifImage').style.display = 'block';  // Show the GIF

    // Adjust the Let's Go button style based on the selected difficulty
    const playButton = document.getElementById('playButton');
    if (difficulty === 'beginner') {
        document.body.className = '';  // Reset body class to default
        playButton.style.backgroundColor = '#28a745';
        playButton.style.color = '#fff';
    } else if (difficulty === 'master') {
        document.body.className = 'master-mode';  // Apply the master mode class
        playButton.style.backgroundColor = '#dc3545';
        playButton.style.color = '#fff';
    }

    // Start the background music when difficulty is selected
    playBackgroundMusic();
}

function startQuiz() {
    questionCount = 0;
    correctCount = 0;
    attempts = 0;
    consecutiveCorrectAnswers = 0;  // Reset consecutive correct answers
    document.getElementById("startPage").style.display = "none";
    document.getElementById("quizPage").style.display = "block";
    document.getElementById('gifImage').style.display = 'none';  // Hide the GIF
    document.getElementById('quizGif').style.display = 'block';  // Show the quiz page GIF
    generateQuestion();
}

function generateQuestion() {
    // Clear previous timeout to avoid overlap
    clearTimeout(questionTimeout);

    if (questionCount >= 15) {
        endQuiz();
        return;
    }

    num1 = getRandomInt(2, 10);
    num2 = getRandomInt(1, 10);
    correctAnswer = num1 * num2;

    // Adjust range for wrong answers based on difficulty
    const minWrongAnswer = difficulty === 'beginner' ? 2 : Math.max(2, correctAnswer - 5);
    const maxWrongAnswer = difficulty === 'beginner' ? 81 : correctAnswer + 5;

    // Generate four possible answers, including the correct one
    const answers = [correctAnswer];
    while (answers.length < numChoices) {
        const wrongAnswer = getRandomInt(minWrongAnswer, maxWrongAnswer);
        if (wrongAnswer !== correctAnswer && !answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
        }
    }

    // Shuffle the answers
    shuffleArray(answers);

    // Display the question
    document.getElementById("question").textContent = `What is ${num1} x ${num2}?`;

    // Display the answer choices
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = '';
    answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.className = 'choice-button';
        button.onclick = () => checkAnswer(answer);
        choicesDiv.appendChild(button);
    });

    // Clear the result message
    document.getElementById("result").textContent = '';

    // Set the question timeout based on difficulty
    questionTimeout = setTimeout(() => {
        // Move to the next question if time's up
        showResult(`Time's up! The correct answer was ${correctAnswer}.`, "red");
        questionCount++;
        generateQuestion();
    }, difficulty === 'master' ? 3000 : 5000);

    attempts = 0;
}

function checkAnswer(selectedAnswer) {
    // Only process the answer if within the time limit
    if (questionTimeout) {
        clearTimeout(questionTimeout);  // Clear the timeout if an answer is provided

        if (selectedAnswer === correctAnswer) {
            correctSound.play();  // Play correct answer sound
            consecutiveCorrectAnswers++;  // Increment the consecutive correct answers counter

            if (consecutiveCorrectAnswers === 4) {
                clickSound.play();  // Play the click sound effect
                consecutiveCorrectAnswers = 0;  // Reset the consecutive correct answers counter
            }

            correctCount += (attempts === 0) ? 1 : 0.5;
            questionCount++;
            generateQuestion();
        } else {
            handleWrongAnswer();
        }
    }
}

function handleWrongAnswer() {
    wrongSound.play();  // Play wrong answer sound
    if (attempts === 0) {
        showResult(`Wrong. Try again!`, "red");
        attempts++;
    } else {
        showResult(`Wrong. The correct answer is ${correctAnswer}.`, "red");
        questionCount++;
        setTimeout(generateQuestion, 1500);
        consecutiveCorrectAnswers = 0;  // Reset the consecutive correct answers counter
    }
}

function endQuiz() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    document.getElementById("quizPage").style.display = "none";
    document.getElementById("endPage").style.display = "block";
    document.getElementById('quizGif').style.display = 'none';  // Hide the quiz GIF on the end page

    const percentage = ((correctCount / questionCount) * 100).toFixed(2);
    document.getElementById("score").textContent = `You answered ${correctCount.toFixed(1)} out of ${questionCount} questions correctly. Your score is ${percentage}%`;
}

function restartQuiz() {
    document.getElementById("endPage").style.display = "none";
    document.getElementById("startPage").style.display = "block";
    document.getElementById("difficultyOptions").style.display = 'flex';
    document.getElementById("playButton").style.display = 'none';
    document.getElementById('gifImage').style.display = 'none';  // Hide the GIF
    document.getElementById('quizGif').style.display = 'none';  // Hide the quiz GIF
    document.body.className = '';  // Reset body class to default
    clearTimeout(questionTimeout);
    backgroundMusic.pause();  // Pause music on restart
    backgroundMusic.currentTime = 0;  // Reset music to the beginning
    playBackgroundMusic();  // Restart music for the new game
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showResult(message, color) {
    const resultDiv = document.getElementById("result");
    resultDiv.textContent = message;
    resultDiv.style.color = color;
}
