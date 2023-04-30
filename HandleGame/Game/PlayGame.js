let globalQuestionArray = [] //The array that all functions can use. Can be global since it only changes on game reset.
let lockQuestionArray = []
let lockCellClicks = false
let runningDollarVal = 0
let currentDollarVal = 0
let userAnswer = ""
let currentQuestion = ""
let currentAnswer = ""
let questionCounter = 1;

function handleKeyDown(e) {
    if (e.key == 'Enter') {
        handleSubmit()
    }
}

function compareAnswers() {
    let comparableCorrectAnswer = currentAnswer;
    comparableCorrectAnswer = comparableCorrectAnswer.replace(/[^a-zA-Z0-9]/, '')
    comparableCorrectAnswer = comparableCorrectAnswer.replace(/\s/g, "");
    let correctAnswerResult = comparableCorrectAnswer.toLowerCase()
    //Change user answer so its comparable
    let comparableUserAnswer = userAnswer;
    comparableUserAnswer = comparableUserAnswer.replace(/[^a-zA-Z0-9]/, '')
    comparableUserAnswer = comparableUserAnswer.replace(/\s/g, "");
    let userAnswerResult = comparableUserAnswer.toLowerCase()
    if (userAnswerResult.length >= 3) {
        if (correctAnswerResult.includes(userAnswerResult)) {
            return true
        }
        else if (userAnswerResult.includes(correctAnswerResult)) {
            return true
        }

    } else {
        if (correctAnswerResult == userAnswerResult) {
            return true
        }
    }
    return false

}

function handlePlayAgain() {
    startGame()
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function handleMainMenu() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    location.href = '../../index.html'
}

function nextQuestion() {
    if (questionCounter == 31) {
        document.getElementById("answer_screen").style.display = "none"
        let finalScore = document.getElementById("finish_game_score")
        finalScore.innerText = "$" + runningDollarVal.toString()
        document.getElementById("finish_game_container").style.display = "block"
    } else {
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
    }

}

function handleSubmit(){
    document.getElementById("question_screen").style.display = "none"
    document.getElementById("answer_screen").style.display = "block"
    let answerInput = document.getElementById("answer_input")
    userAnswer = answerInput.value
    answerInput.value = ""
    let jeopardyQuestion = document.getElementById("jeopardy_question")
    jeopardyQuestion.innerText = currentQuestion
    let jeopardyAnswerUser = document.getElementById("jeopardy_answer_user")
    jeopardyAnswerUser.innerText = userAnswer
    let jeopardyAnswerCorrect = document.getElementById("jeopardy_answer_correct")
    jeopardyAnswerCorrect.innerText = currentAnswer
    let correctOrIncorrect = document.getElementById("correct_or_incorrect")
    let questionMoney = document.getElementById("money")
    questionMoney.innerText = "$" + currentDollarVal.toString()
    //current winnings
    let currentMoney = document.getElementById("current_money")
    currentMoney.innerText = "$" + runningDollarVal.toString()
    //final money
    let correctAnswer = compareAnswers()
    if (correctAnswer == true) {
        correctOrIncorrect.innerText = "Correct!"
        let addedMoney = document.getElementById("added_money")
        addedMoney.innerText = "$" + currentDollarVal.toString()
    } else {
        correctOrIncorrect.innerText = "Incorrect"
        let addedMoney = document.getElementById("added_money")
        addedMoney.innerText = "$" + "0"
    }
    if (correctAnswer == true) {
        runningDollarVal += currentDollarVal
        let runningDollarAmount = document.getElementById("running_dollar_amount")
        runningDollarAmount.innerHTML = "$" + runningDollarVal.toString()
        let finalMoney = document.getElementById("final_money")
        finalMoney.innerText = "$" + runningDollarVal.toString()
    } else {
        let finalMoney = document.getElementById("final_money")
        finalMoney.innerText = "$" + runningDollarVal.toString()
    }
    lockCellClicks = false
    ++questionCounter;
}

function handleCell(event) {
    document.getElementById("question_screen").style.display = "block"
    document.getElementById("answer_screen").style.display = "none"
    document.getElementById("finish_game_container").style.display = "none"
    let rowNum = parseInt(event.srcElement.id[4]) - 1 //Format is Row X Col Y which is 4th and 10th index
    let colNum = parseInt(event.srcElement.id[10]) - 1
    let lockedCell = false
    for (let i = 0; i < lockQuestionArray.length; ++i) {
        if ((lockQuestionArray[i][0] == rowNum) && (lockQuestionArray[i][1] == colNum)) { //See if the cell has already been clicked
            lockedCell = true
        }
    }
    if (lockedCell == false) {  
        currentDollarVal = parseInt(event.target.innerText.slice(1))
        //Change text color here.
        event.target.innerHTML = "&nbsp;"
        //document.getElementById(event.target.id).style.color = "#050066";
        currentQuestion = globalQuestionArray[colNum][rowNum].question
        currentAnswer = globalQuestionArray[colNum][rowNum].answer
        currentAnswer = currentAnswer.replace('<i>', '')
        currentAnswer = currentAnswer.replace('</i>', '')
        currentAnswer = currentAnswer.replace("\\'", "'")
        //Some of the values are improperly entered in the API. This fixes that.
        //<i> </i>
        // \\'
        //Goto new page here with currentQuestion and currentAnswer
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
        let jeopardyQuestion = document.getElementById("jeopardy_question")
        jeopardyQuestion.innerText = currentQuestion
        /*let questionMoney = document.getElementById("money")
        questionMoney.innerText = "$" + runningDollarVal.toString()*/
        let tempArray = []
        tempArray.push(rowNum)
        tempArray.push(colNum)
        lockQuestionArray.push(tempArray)
        lockCellClicks = true
    }
    window.scrollTo(0, document.body.scrollHeight);
}


async function fetchQuestions() {
    return await fetch('https://jservice.io/api/clues')
        .then((response) => response.json())
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error(error)
        })
}

function startGame() {
    fetchQuestions().then(data => {
        globalQuestionArray = []
        lockQuestionArray = []
        lockCellClicks = false
        runningDollarVal = 0
        currentDollarVal = 0
        let questionArray = []
        let categoryCount = 0
        let startTracker = 0
        questionCounter = 1
        let startValue = 200;
        for (let i = 1; i < 6; ++i) { //Makes all dollar values on screen the correct color.
            let replacementValue = "$" + startValue.toString()
            for (let j = 1; j < 7; ++j) {
                let idString = "Row " + i.toString() + " Col " + j.toString()
                document.getElementById(idString).innerHTML = replacementValue;
            }
            startValue += 200;
        }
        document.getElementById("loading_container").style.display = "none"
        while (categoryCount < 6) { //Amount of categories needed    
            let tempArray = []
            let categoryId = data[startTracker].category_id
            for (let i = startTracker; i < data.length; ++i) {
                if (data[i].category_id == categoryId) {
                    tempArray.push(data[i])
                }
            }
            if (tempArray.length == 5) {
                questionArray.push(tempArray)
                ++categoryCount
            }
            ++startTracker
        } 
        console.log(questionArray)
        globalQuestionArray = questionArray
        let header1 = document.getElementById("header1")
        let header2 = document.getElementById("header2")
        let header3 = document.getElementById("header3")
        let header4 = document.getElementById("header4")
        let header5 = document.getElementById("header5")
        let header6 = document.getElementById("header6")
        header1.innerText = questionArray[0][0].category.title
        header2.innerText = questionArray[1][0].category.title
        header3.innerText = questionArray[2][0].category.title
        header4.innerText = questionArray[3][0].category.title
        header5.innerText = questionArray[4][0].category.title
        header6.innerText = questionArray[5][0].category.title
        let elements = document.getElementById("hidden_elements")
        elements.style.visibility = "visible"
    })

}

startGame();