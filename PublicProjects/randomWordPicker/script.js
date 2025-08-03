const siteTitle = document.getElementById("title")
const resetButton = document.getElementById("reset-button")
const addWordButton = document.getElementById("add-word")
const pickRandomWordButton = document.getElementById("pick-random-word-button")
const closeInfoButton = document.getElementById("close-info-button")

const textInputField = document.getElementById("text-input-field")
const wordsContainer = document.getElementById("words-container")
const randomWordDisplay = document.getElementById("random-word-display")

const mainContainer = document.getElementById("main-container")
const displayContainer = document.getElementById("display-container")
const infoContainer = document.getElementById("info-container")
const darkBackground = document.getElementById("dark-background")

const wordsArray = []

const showDarkScreen = () => darkBackground.style.display = "block"
const hideDarkScreen = () => darkBackground.style.display = "none"

const showInfoPage = () => {infoContainer.style.display = "inline"; showDarkScreen()}
const hideInfoPage = () => {infoContainer.style.display = "none"; hideDarkScreen()}

const showRandomWordDisplay = () => {displayContainer.style.display = "inline"; showDarkScreen()}
const hideRandomNumberDisplay = () => {displayContainer.style.display = "none"; hideDarkScreen()}

const cleanTextInputField = () => {textInputField.value = ""}

const getRandomNumber = (max, min = 0) => {return Math.floor(Math.random() * (max - min + 1)) + min}

function addWord(word) {
    const newWord = document.createElement("p")
    newWord.className = "added-word"
    newWord.innerText = word
    wordsContainer.appendChild(newWord)

    wordsArray.push(word)  

    cleanTextInputField()
}

function removeWord(word) {
    const index = wordsArray.indexOf(word)
    if (index !== -1) {
        wordsArray.splice(index, 1)
    }
    
}

function removeWordParagraph(word) {
    const paragraphs = wordsContainer.querySelectorAll("p")
    const paragraph = Array.from(paragraphs).find(p => p.innerText === word)
    paragraph.remove()
}

function showRandomWord() {
    let word = "missing"
    if (wordsArray.length > 0) {
        word = wordsArray[getRandomNumber(wordsArray.length - 1)]
    } else if (wordsArray.length === 0) {
        word = wordsArray[0]
    } else {return}
    randomWordDisplay.innerText = word
    showRandomWordDisplay()
}

mainContainer.addEventListener("click", (e) => {
    const target = e.target
    if (target.tagName === "BUTTON") {
        if (target.id === "reset-button") {
            wordsContainer.innerHTML = ""
            wordsArray.length = 0
        }
        if (target.id === "add-word") {
            const textInput = textInputField.value.trim()
            if (textInput !== "" && textInput.length <= 30 && wordsArray.length < 30) {
                addWord(textInput)
            }
        }
        if (target.id === "pick-random-word-button") {
            if (getComputedStyle(displayContainer).display === "none" && wordsArray.length > 0) {
                showRandomWord()
            }
        }
    }
    if (target.tagName === "P" && target.classList.contains("added-word")) {
        if (target.innerText) {
            removeWord(target.innerText)
            target.remove()
        }
    }
    if (target.id === "title") {
        showInfoPage()
    }
})
displayContainer.addEventListener("click", (e) => {
    const target = e.target
    if (target.tagName === "BUTTON") {
        if (target.id === "remove-current-word") {
            removeWord(randomWordDisplay.innerText)
            removeWordParagraph(randomWordDisplay.innerText)
            hideRandomNumberDisplay()
        }
        if (target.id === "close-display-button") {
            hideRandomNumberDisplay()
        }
    }
    

})
closeInfoButton.addEventListener("click", hideInfoPage)
textInputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const textInput = textInputField.value.trim()
        if (textInput !== "" && textInput.length <= 30 && wordsArray.length < 30) {
            addWord(textInput)
        }
    }
})