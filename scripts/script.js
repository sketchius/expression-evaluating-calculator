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


function processInput ( inputType, inputCode ) {
    debugger
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
            console.log("Set Operator to " + operator.text);
            currentObject = operator;
            break;
        case 'RIGHT':
            let leftComponent = leftOperand.text.includes('.') ? parseFloat(leftOperand.text) : parseInt(leftOperand.text);
            let rightComponent = rightOperand.text.includes('.') ? parseFloat(rightOperand.text) : parseInt(rightOperand.text);
            leftOperand.text = processDecimal(performCalculation(leftComponent,rightComponent,operator.text)) + '';
            rightOperand.text = '';
            currentObject = operator;
            break;
    }
}

function processSpecialInput ( input ) {


    switch ( input ) {
        case 'EQL':
            if (currentObject.id == 'RIGHT' && rightOperand.text != "") {
                let leftComponent = leftOperand.text.includes('.') ? parseFloat(leftOperand.text) : parseInt(leftOperand.text);
                let rightComponent = rightOperand.text.includes('.') ? parseFloat(rightOperand.text) : parseInt(rightOperand.text);
                leftOperand.text = processDecimal(performCalculation(leftComponent,rightComponent,operator.text)) + '';
                rightOperand.text = '';
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
    return +number.toFixed(10);
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
