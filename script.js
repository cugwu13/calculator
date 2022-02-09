class Operate {
    a;
    b;

    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    add() {
        return this.a + this.b;
    }

    subtract() {
        return this.a - this.b;
    }

    multiply() {
        return this.a * this.b;
    }

    divide() {
        return this.a / this.b;
    }
};

const buttons = document.querySelectorAll(".clickable");
const inputDisplay = document.querySelector(".input");
const expressionDisplay = document.querySelector(".expression");

// Store whatever the input is
let input = "";

// Store input 'a' and input 'b'
let a;
let b;

// Store operation type
let operation;
let expressionOperation;
let operationArray = [];

// Store state of equals button
equalsButtonClicked = false;

// Handle keydown events
document.addEventListener('keydown', (e) => {
    executeKeydownEvent(e);
});

buttons.forEach(button => button.addEventListener('click', () => {
    resetAfterEquals(button);
    changeSign(button);
    checkButtonType(button);
    checkEqualsButton(button);
    getOperationType();
    populateExpression();
    executeEqualsButton(button);
    clearEntry(button);
}));

function calculation() {
    a = parseFloat(a);
    b = parseFloat(b);
    let calculate = new Operate(a, b);
    if (operationArray[0] === '+') return Math.floor(calculate.add() * 100) / 100
    else if (operationArray[0] === '-') return Math.floor(calculate.subtract() * 100) / 100
    else if (operationArray[0] === 'x' || operationArray[0] === '*') return Math.floor(calculate.multiply() * 100) / 100
    else if (operationArray[0] === '÷' || operationArray[0] === '/') return Math.floor(calculate.divide() * 100) / 100
}

// Check if any operations have been input and get operation type
function checkButtonType(button) {
    if (button.className.match(/add|subtract|multiply|divide/g)) {
        operation = button.innerText;
        expressionOperation = operation;
        if (a) {
            b = input;
            input = "";
            inputDisplay.innerText = input;
        } else {
            a = input;
            input = "";
            inputDisplay.innerText = input;
        }
    } else if (!button.className.match(/pos-neg|equals|decimal/g)) {
        input += button.innerText;
        inputDisplay.innerText = input;
    } else if (button.className.includes("decimal")) {
        checkDecimalStatus() ? inputDisplay.innerText = input : input += button.innerText, inputDisplay.innerText = input;
    }
}

// Update expressionDisplay
function populateExpression() {
    if (!a) {
        expressionDisplay.innerText = input;
    } else if (a && !b) {
        expressionDisplay.innerText = `${a} ${expressionOperation} ${input}`;
    } else if (a && b) {
        expressionDisplay.innerText = `${a} ${expressionOperation} ${b}`;
    }
}

// Get the operation type
function getOperationType() {
    if (operation) {
        if (operationArray[0] && operationArray[1]) {
            operationArray.shift();
            operationArray[1] = operation;
        } else if (operationArray[0]) {
            operationArray[1] = operation;
        } else {
            operationArray[0] = operation;
        }

        // Check if 'a' & 'b' have been assigned values
        if (a && b) {
            a = calculation();
            expressionDisplay.innerText = a;
            inputDisplay.innerText = a;
            b = null;
        }

        // Clear operation
        operation = null;
    }
}

// Perform 'equals' button action
function executeEqualsButton(button) {
    if (button.className.match("equals")) {
        executeEqualsCalc();
    }
}

function executeEqualsCalc() {
    // Check if a has been assigned
    if (a) {
        expressionDisplay.innerText += " =";
        b = input;
        a = parseFloat(a);
        b = parseFloat(b);
        let calculate = new Operate(a, b);
        if (expressionOperation === '+') inputDisplay.innerText = Math.floor(calculate.add() * 100) / 100
        else if (expressionOperation === '-') inputDisplay.innerText = Math.floor(calculate.subtract() * 100) / 100
        else if (expressionOperation === 'x' || expressionOperation === '*') inputDisplay.innerText = Math.floor(calculate.multiply() * 100) / 100
        else if (expressionOperation === '÷' || expressionOperation === '/') inputDisplay.innerText = Math.floor(calculate.divide() * 100) / 100
        input = "";
        a = inputDisplay.innerText;
        b = null;
    } else if (!a) {
        resetAll();
    }
}

// Check if equals button was last button pressed
function checkEqualsButton(button) {
    button.className.match("equals") ? equalsButtonClicked = true : equalsButtonClicked = false;
}

// Reset variables if a digit key is pressed after the equals button is pressed
function resetAfterEquals(button) {
    if (equalsButtonClicked === true && !button.className.match(/add|subtract|multiply|divide|pos-neg/g)) {
        a = null;
        b = null;
        input = "";
        operation = "";
        expressionOperation = "";
        operationArray = [];
    }
}

// Turn 'a' or 'b' positive negative
function changeSign(button) {
    if (button.className.includes("pos-neg")) {
        if (input.includes("-")) {
            input = input.replace("-", "");
        } else {
            input = "-" + input;
        }
        inputDisplay.innerText = input;
        equalsButtonClicked = false;
    }
}

// Check if '.' already exits in input string
function checkDecimalStatus() {
    return input.includes(".");
}

// Clear calculator entry
function clearEntry(button) {
    if (button.className.match("clear")) {
        resetAll();
    }
}

function resetAll() {
    a = null;
    b = null;
    inputDisplay.innerText = "";
    expressionDisplay.innerText = "";
    input = "";
    operation = "";
    expressionOperation = "";
    operationArray = [];
}

function executeKeydownEvent(e) {
    // Handle specific keydown keys
    if (e.key.match(/[0-9]/g)) {
        if (equalsButtonClicked === true) {
            a = null;
            b = null;
            input = "";
            operation = "";
            expressionOperation = "";
            operationArray = [];
        }
        input += e.key;
        inputDisplay.innerText = input;
        populateExpression();
    } else if (e.key.match(/\+|\-|\*|\//g)) {
        if (e.key === "*") {
            operation = "x";
        } else if (e.key === "/") {
            operation = "÷";
        } else operation = e.key;
        expressionOperation = operation;
        if (a) {
            b = input;
            input = "";
            populateExpression();
            inputDisplay.innerText = input;
        } else {
            a = input;
            input = "";
            populateExpression();
            inputDisplay.innerText = input;
        }
        getOperationType();
    } else if (e.key === ".") {
        checkDecimalStatus() ? inputDisplay.innerText = input : input += e.key, inputDisplay.innerText = input;
    } else if (e.key === "Enter") {
        populateExpression();
        executeEqualsCalc();
    }
    // Check equals button
    e.key === "Enter" ? equalsButtonClicked = true : equalsButtonClicked = false;
}
