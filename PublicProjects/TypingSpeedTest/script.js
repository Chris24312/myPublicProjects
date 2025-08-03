const buttonsContainer = document.getElementById("buttons-container")
const resultsDisplay = document.getElementById("results-display")
const darkBackground = document.getElementById("dark-background")

const textDisplayP = document.getElementById("text-display-p")
const textInput = document.getElementById("text-input")
const wordsSlider = document.getElementById("words-slider")
const wordsSliderCounter = document.getElementById("words-slider-counter")
const startButton = document.getElementById("start-button")
const stopButton = document.getElementById("stop-button")
const regenerateButton = document.getElementById("regenerate-button")
const closeResultsButton = document.getElementById("close-results-button")

const resultsTitle = document.getElementById("results-title")
const timeH2 = document.getElementById("time-h2")
const wpmH2 = document.getElementById("wpm-h2")

let startTime = null
let endTime = null

let toWrite = ""
const words = {
    easy: ["a", "an", "and", "as", "at", "be", "big", "box", "by", "can","cat", "cow", "cry", "day", "dog", "ear", "eat", "egg", "fan", "far","fun", "gap", "go", "hat", "hen", "hey", "hop", "hot", "ice", "if","in", "is", "it", "jam", "jet", "joy", "key", "kit", "lap", "lay","let", "log", "man", "map", "net", "now", "off", "on", "out", "owl","pan", "pet", "pop", "pot", "ram", "rat", "red", "rip", "run", "sad","sat", "say", "see", "set", "sip", "sit", "six", "sky", "son", "spy","sun", "tap", "tax", "ten", "the", "tie", "tip", "top", "toy", "try","two", "up", "use", "van", "vet", "was", "wax", "way", "web", "wet","who", "why", "win", "wow", "yes", "yet", "you", "zip", "able", "aged","also", "area", "army", "away", "baby", "back", "bake", "ball", "band", "bank","base", "bath", "bear", "beat", "been", "bell", "belt", "best", "bill", "bird","blow", "blue", "boat", "body", "bomb", "bond", "bone", "book", "boom", "born","boss", "both", "bowl", "buck", "burn", "bush", "busy", "cake", "calm", "camp","card", "care", "case", "cash", "cast", "cell", "chat", "chip", "city", "club","code", "cold", "cook", "cool", "cope", "copy", "core", "cost", "crew", "crop","dark", "data", "date", "dead", "deal", "dean", "dear", "deep", "desk", "dial","died", "diet", "disk", "door", "dose", "down", "draw", "drop", "drum", "duck","each", "earn", "ease", "east", "easy", "edge", "else", "even", "ever", "evil","face", "fact", "fail", "fair", "fall", "farm", "fast", "fate", "fear", "feed",],
    medium: ["apple", "angle", "admit", "alarm", "avoid", "badge", "basic", "beach", "begin", "birth","black", "block", "board", "brain", "break", "bring", "build", "buyer", "cabin", "cause","chain", "chair", "chalk", "charm", "cheap", "check", "chess", "chief", "child", "claim","class", "clean", "clear", "clerk", "click", "clock", "cloud", "coach", "coast", "color","count", "court", "cover", "crack", "craft", "crash", "cream", "cross", "crowd", "crown","dance", "dated", "debut", "delay", "depth", "devil", "dirty", "ditch", "doubt", "draft","drain", "drama", "dream", "drink", "drive", "early", "earth", "elbow", "elect", "enemy","enjoy", "entry", "equal", "error", "event", "exact", "exist", "extra", "faith", "false","fault", "feast", "fence", "field", "fight", "final", "first", "flame", "flash", "fleet","flesh", "float", "floor", "fluid", "focus", "force", "forth", "found", "frame", "fresh","front", "frown", "fruit", "giant", "given", "glide", "glory", "grace", "grade", "grain","grant", "graph", "grass", "great", "green", "grind", "group", "guard", "guess", "guest","habit", "happy", "heart", "heavy", "honey", "honor", "horse", "hotel", "house", "human","humor", "ideal", "image", "index", "inner", "input", "issue", "ivory", "jelly", "joint","judge", "juice", "knife", "known", "label", "labor", "large", "laugh", "layer", "learn","lease", "least", "leave", "level", "light", "limit", "liver", "local", "lodge", "loose","lucky", "lunar", "magic", "major", "maker", "match", "maybe", "metal", "minor", "model","money", "month", "motor", "mount", "mouse", "mouth", "movie", "music", "naked", "nerve","never", "noble", "noise", "north", "novel", "occur", "offer", "often", "order", "organ","other", "owner", "panel", "party", "pause", "peace", "phase", "phone", "photo", "piano"],
    hard: ["abandon", "ability", "absence", "academy", "account", "accused", "achieve", "acquire", "admiral", "advance","advice", "against", "airline", "airport", "alcohol", "allege", "already", "amazing", "analyze", "ancient","anxiety", "appeal", "applied", "appoint", "approve", "arrival", "article", "attempt", "attract", "auction", "average", "balance", "banking", "barrier", "battery", "beneath", "benefit", "besides", "between", "bicycle", "bizarre", "blanket", "bothered", "breathe", "brother", "cabinet", "capture", "careful", "carried", "cassette", "caution", "century", "certain", "chamber", "channel", "charity", "chicken", "choices", "climate", "closure", "collect", "combine", "comfort", "command", "comment", "compare", "compete", "complex", "compose", "concept", "confirm", "connect", "consent", "contest", "control", "convert", "cooking", "council", "counter", "country","crimson", "crystal", "culture", "curious", "current", "curtain", "customs", "cyclone", "default", "deliver", "density", "deposit", "deserve", "desktop", "despair", "despite", "destroy", "develop", "diamond", "digital", "disease", "dismiss", "display", "dispute", "distant", "diverse", "drawing", "driving", "dynamic", "eastern", "economy", "edition", "educate", "elegant", "embrace", "emotion", "emperor", "employe", "endeavor", "engaged",  "enhance", "enlarge", "enquiry", "envelope", "episode", "equality", "escape", "essence", "establish", "evening", "exactly", "examine", "example", "exceed", "exclude", "execute", "exhibit", "expense", "explain", "explode", "explore", "express", "extreme", "failure", "fantasy", "fashion", "feature", "federal", "feeling", "fiction", "finance", "finding", "fitness", "flaming", "flavour", "flexible", "focused", "foreign", "fortune", "forward", "freedom", "freight", "friends", "frontal", "further", "gallery", "garment", "general", "gesture", "glimpse", "goodness", "governor", "grammar", "greater", "greeting", "harmony", "healthy", "hearing", "heavily", "helpful", "history", "holding", "holiday", "hostage", "however", "hunting", "husband", "illusion", "imagine", "immense","improve", "include", "income", "increase", "indicate", "industry", "inquire", "insight", "inspire", "install"],
}

const showDarkBackground = () => darkBackground.style.display = "block"
const hideDarkBackground = () => darkBackground.style.display = "none"

const showResultsDisplay = () => {resultsDisplay.style.display = "flex"; showDarkBackground()}
const hideResultsDisplay = () => {resultsDisplay.style.display = "none"; hideDarkBackground()}

const showTextInput = () => textInput.style.display = "block"
const hideTextInput = () => textInput.style.display = "none"

const showStartButton = () => {startButton.style.display = "block"; stopButton.style.display = "none"; regenerateButton.style.display = "block"}
const showStopButton = () => {startButton.style.display = "none"; stopButton.style.display = "block"; regenerateButton.style.display = "none"}

const clearTextArea = () => {textInput.value = ""}

const getRandomNumber = (max) => Math.floor(Math.random() * max)

const displayText = (text) => textDisplayP.textContent = text

function countCorrectCharacters() {
    let correctCount = 0;
    const userInput = textInput.value

    if (userInput.trim() !== "") {
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === toWrite[i]) {
              correctCount++;
            }
        }
    }
    return correctCount;
}

function displayResults(userText, timeSec) {
    if (timeSec) {
        timeH2.textContent = `Time: ${timeSec}sec`
    } else {
        timeH2.textContent = "Time: error"
    }
    if (userText) {
        wpmH2.textContent = `Wpm: ${(userText.length / 5 / (timeSec / 60)).toFixed(0)}`
    } else {
        wpmH2.textContent = "Wpm: error"
    }
    showResultsDisplay()
}

function startTimer() {
    startTime = Date.now()
    endTime = null
}

function stopTimer() {
    if (startTime === null) {
        return 
    }
    endTime = Date.now()
    const elapsedSeconds = ((endTime - startTime) / 1000).toFixed(0)
    return elapsedSeconds
}

function buildSentence() {
    toWrite = ""
    const wordsAmount = wordsSlider.value
    const checkedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    let sentence = ""
    if (wordsAmount >= 1) {
        if (checkedDifficulty === "easy" || checkedDifficulty === "medium" || checkedDifficulty === "hard") {
            for (let i = 1; i < wordsAmount ; i++) {
                sentence += words[checkedDifficulty][getRandomNumber(words[checkedDifficulty].length)] + " ";
            }
        } else if (checkedDifficulty === "random") {
            for (let i = 1; i < wordsAmount ; i++) {
                const numb = getRandomNumber(3)
                if (numb === 0) {
                    sentence += words["easy"][getRandomNumber(words["easy"].length)] + " ";
                } else if (numb === 1) {
                    sentence += words["medium"][getRandomNumber(words["medium"].length)] + " ";
                } else if (numb === 2) {
                    sentence += words["hard"][getRandomNumber(words["hard"].length)] + " ";
                }
            }
        }
    }
    toWrite = sentence
    return sentence
}

displayText(buildSentence())

buttonsContainer.addEventListener("click", (e) => {
    const target = e.target
    if (target.tagName === "BUTTON") {
        if (target.id === "start-button") {
            showTextInput()
            showStopButton()
            textInput.focus()
            startTimer()
            return
        }
        if (target.id === "stop-button") {
            if (textInput.value.trim() === "") {
                hideTextInput()
                showStartButton()
                clearTextArea()
            } else {
                displayResults(textInput.value.trim(), stopTimer())
                hideTextInput()
                showStartButton()
                clearTextArea()
            }
            return
        }
        if (target.id === "regenerate-button") {
            displayText(buildSentence())
            hideTextInput()
            clearTextArea()
            return
        }
    }
})

wordsSlider.addEventListener("input", () => {
    wordsSliderCounter.innerText = `Words(${wordsSlider.value}):` 
})

closeResultsButton.addEventListener("click", () => {
    hideResultsDisplay()
}) 
