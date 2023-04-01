let globalQuestionArray = [] //The array that all functions can use. Can be global since it only changes on game reset.
let lockQuestionArray = []
let lockCellClicks = false
let runningDollarVal = 0
let currentDollarVal = 0
let userAnswer = ""
let currentQuestion = ""
let currentAnswer = ""

/*
Code to finish logic.
    3. Look up how to style web pages so it works for mobile phones.
    5. Make it so you can replay the game at the end of it.
    6. Style sides and other areas

*/



function handleKeyDown(e) {
    if (e.key == 'Enter') {
        handleSubmit()
    }
}

function compareAnswers(correctAnswer, userAnswer) {
    let comparableCorrectAnswer = correctAnswer.replace(/[^a-zA-Z0-9]/, '')
    comparableCorrectAnswer = comparableCorrectAnswer.replace(/\s/g, "");
    let correctAnswerResult = comparableCorrectAnswer.toLowerCase()
    //Change user answer so its comparable
    let comparableUserAnswer = userAnswer.replace(/[^a-zA-Z0-9]/, '')
    comparableUserAnswer = comparableUserAnswer.replace(/\s/g, "");
    let userAnswerResult = comparableUserAnswer.toLowerCase()
    console.log(correctAnswerResult)
    console.log(userAnswerResult)
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

function handleSubmit(){
    let errorCellLocked = document.getElementsByClassName("error_cell_locked")
    errorCellLocked.innerHTML = ""
    let answerInput = document.getElementsByClassName("answer_input")
    let jeopardyQuestion = document.getElementsByClassName("jeopardy_question")
    jeopardyQuestion.innerText = ""
    userAnswer = answerInput.value
    answerInput.value = ""
    let correctAnswerDiv = document.getElementsByClassName("correct_answer")
    correctAnswerDiv.innerHTML = "Answer: " + currentAnswer
    let userAnswerDiv = document.getElementsByClassName("user_answer")
    userAnswerDiv.innerHTML = "Your Answer: " + userAnswer
    let correctAnswer = compareAnswers(currentAnswer, userAnswer)
    let correctOrIncorrectDiv = document.getElementsByClassName("correct_or_incorrect")
    if (correctAnswer == true) {
        correctOrIncorrectDiv.innerHTML = "Correct!"
    } else {
        correctOrIncorrectDiv.innerHTML = "Incorrect"
    }
    if (correctAnswer == true) {
        runningDollarVal += currentDollarVal
        let runningDollarAmount = document.getElementsByClassName("running_dollar_amount")
        runningDollarAmount.innerHTML = "$" + runningDollarVal.toString()
    }
    console.log(correctAnswer)
    lockCellClicks = false
    window.scrollTo(0, document.body.scrollHeight);
}

function handleCell(event) {
    let rowNum = parseInt(event.srcElement.id[4]) - 1 //Format is Row X Col Y which is 4th and 10th index
    let colNum = parseInt(event.srcElement.id[10]) - 1
    let lockedCell = false
    let correctAnswerDiv = document.getElementsByClassName("correct_answer")
    correctAnswerDiv.innerHTML = ""    
    let userAnswerDiv = document.getElementsByClassName("user_answer")
    userAnswerDiv.innerHTML = ""
    let correctOrIncorrectDiv = document.getElementsByClassName("correct_or_incorrect")
    correctOrIncorrectDiv.innerHTML = ""
    if (lockCellClicks == true) {
        let errorCellLocked = document.getElementsByClassName("error_cell_locked")
        errorCellLocked.innerHTML = "Please answer the current question before clicking on a new one."
        lockedCell = true
    } 
    for (let i = 0; i < lockQuestionArray.length; ++i) {
        if ((lockQuestionArray[i][0] == rowNum) && (lockQuestionArray[i][1] == colNum)) { //See if the cell has already been clicked
            lockedCell = true
        }
    }
    if (lockedCell == false) {   
        currentDollarVal = parseInt(event.target.innerText.slice(1))
        event.target.innerHTML = ""
        currentQuestion = globalQuestionArray[colNum][rowNum].question
        currentAnswer = globalQuestionArray[colNum][rowNum].answer
        console.log(currentQuestion)
        console.log(currentAnswer)
        let jeopardyQuestion = document.getElementsByClassName("jeopardy_question")
        jeopardyQuestion.innerText = currentQuestion

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

fetchQuestions().then(data => {
    globalQuestionArray = []
    lockQuestionArray = []
    lockCellClicks = false
    let questionArray = []
    let categoryCount = 0
    let startTracker = 0
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

//Data wil be sorted by category, so 5 in cat 1, 5 in cat 2, etc. in the array


/*
 OnClick data table event
    1. Get the name of the id that performed the click. Maybe pass it through the event or just grab the id
    2. Remove the Col and Row from the name.
    3. Formula for calculating place in array based on col and row is as follows...
        X = (Row * 5) + Col - 6
    4. Then output QuestionArray[X].question and QuestionArray[X].answer if question has not already been selected
    5. If right, add the correct money value.
    6. Right or Wrong, hide the money value in the table and make it not selectable.


*/

