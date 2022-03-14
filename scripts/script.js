let leftOperand = {
    id: 'LEFT',
    text: ''
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
            currentObject = operator;
            break;
    }
}

function processSpecialInput ( input ) {
    switch ( input ) {
        case 'EQL':
            if (currentObject.id = 'RIGHT') {
                leftOperand.text = performCalculation();
                rightOperand.text = '';
                operator.text = '';
                currentObject = leftOperand;
            }
    }

    
}


function performCalculation() {
    switch ( operator.text ) {
        case 'ADD':
            return parseInt(leftOperand.text) + parseInt(rightOperand.text);
            break
    }
}


function updateDisplay () {
    switch (currentObject.id) {
        case 'LEFT':
            displayText.textContent = currentObject.text;
            break;
        case 'OPERATOR':
            displayText.textContent = currentObject.text;
            break;
        case 'RIGHT':
            displayText.textContent = currentObject.text;
            break;
    }
}
