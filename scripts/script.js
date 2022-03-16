let leftOperand = {
    id: 'LEFT',
    text: '0'
};
let rightOperand = {
    id: 'RIGHT',
    text: ''
};
let operator = {
    id: 'OPERATOR',
    text: ''
};


let currentObject = leftOperand;

let buttons = document.querySelectorAll('.btn');
let displayText = document.querySelector('.display');


updateDisplay();


buttons.forEach( (button) => button.addEventListener('click',(e) => {
    processInput( e.currentTarget.getAttribute('data-inputtype'),e.currentTarget.getAttribute('data-inputcode'));
}));


document.addEventListener('keydown',(e) => {
    if (!e.repeat) {
        console.log(e);
        handleKeyboardInput(e.code);
    }

})


function processInput ( inputType, inputCode ) {
    switch (inputType) {
        case 'NUM':
            processNumberInput( inputCode );
            break;

        case 'OPR':
            processOperatorInput( inputCode );
            break;

        case 'SPL':
            processSpecialInput( inputCode );
            break;
    }

    updateDisplay();
}

function processNumberInput ( input ) {
    if (currentObject.id == 'OPERATOR') {
        currentObject = rightOperand;
    }
    if (currentObject.text == '0') {
        currentObject.text = '';
    }
    currentObject.text = currentObject.text + input;
}

function processOperatorInput ( input ) {
    operator.text = input;
    switch (currentObject.id) {
        case 'LEFT':
        case 'OPERATOR':
            currentObject = operator;
            break;
        case 'RIGHT':
            //This means the user entered something like "4 + 2 +". Meaning that we need to process the current operation
            //first, then copy the result to the left operand and retain the new operator that was just inputed.
            runEquals();
            currentObject = operator;
            break;
    }
}

function processSpecialInput ( input ) {


    switch ( input ) {
        case 'EQL':
            if (currentObject.id == 'RIGHT' && rightOperand.text != "") {
                runEquals();
                operator.text = '';
                currentObject = leftOperand;
            }
            break;
        case 'DOT':
            if (currentObject.id != 'OPERATOR') {
                if (!currentObject.text.includes('.')) {
                    currentObject.text = currentObject.text + '.';
                }
            } else {
                currentObject = rightOperand;
                currentObject.text =  '0.';
            }
            break;
        case 'NEG':
            if (currentObject.id != 'OPERATOR') {
                if (currentObject.text.includes('-')) {
                    currentObject.text = currentObject.text.replaceAll('-','');
                } else {
                    currentObject.text = '-' + currentObject.text;
                }
            }
            break;
        case 'CLR':
            currentObject = leftOperand;
            leftOperand.text = "0";
            rightOperand.text = "";
            operator.text = "";
            break;
        case 'BCK':
            if (currentObject.id != 'OPERATOR') {
                currentObject.text = currentObject.text.slice(0,currentObject.text.length-1);
            }
            break;
    }

    
}


function runEquals() {
    leftOperand.text = processDecimal(performCalculation(parseFloat(leftOperand.text),parseFloat(rightOperand.text),operator.text)) + '';
    rightOperand.text = '';
}


function performCalculation( leftComponent, rightComponent, operator ) {
    switch ( operator ) {
        case 'ADD':
            return leftComponent + rightComponent;
            break
        case 'SUB':
            return leftComponent - rightComponent;
            break
        case 'MPY':
            return leftComponent * rightComponent;
            break
        case 'DIV':
            return leftComponent / rightComponent;
            break
    }
    
}


function processDecimal ( number ) {
    // This limits the number of decimal points based on how many digits
    // are being used on the left side of the decimal.
    let currentDigits = (parseInt(number)+"").length;
    // Below, the '+' in '+number.toFixed(...' will remove any unnecessary decimal digits as
    // part of the conversion from string (i.e. '10.0000000000000' -> 10) 
    return +number.toFixed(Math.max(0,15-currentDigits));
}


function updateDisplay () {
    switch (currentObject.id) {
        case 'LEFT':
        case 'OPERATOR':
            displayText.textContent = leftOperand.text;
            break;
        case 'RIGHT':
            displayText.textContent = currentObject.text;
            break;
    }
}


function handleKeyboardInput ( keyCode ) {
    if (keyCode.includes('Digit')) {
        let number = keyCode.slice(keyCode.length-1,keyCode.length);
        processInput('NUM',number);0000000
            case 'Equal':
                processInput('OPR','ADD');
                break;
            case 'KeyX':
                processInput('OPR','MPY');
                break;
            case 'Slash':
                processInput('OPR','DIV');
                break;
            case 'Enter':
                processInput('SPL','EQL');
                break;
            case 'Escape':
                processInput('SPL','CLR');
                break;
            case 'Period':
                processInput('SPL','DOT');
                break;
            case 'Backquote':
                processInput('SPL','NEG');
                break;
            case 'Backspace':
                processInput('SPL','BCK');
                break;


        }
    }
}