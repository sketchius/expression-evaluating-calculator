


function ExpressionNode( type, value, previousNode, nextNode) {
    this.id = numberOfIds;
    numberOfIds++;
    this.type = type;
    this.value = value;
    this.previousNode = previousNode;
    this.nextNode = nextNode;
    this.priority = 0;
}

const expressionNodes = [];



let numberOfIds=0;


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

function animate(  ) {
	let breakOut = false;
	for (let i = 0; i < expressionNodes.length && breakOut == false; i++ ) {
		let node = expressionNodes[i]
		if (node.type == 'Operator') {
			node.type = 'Number';
			node.value = runEquals(node.previousNode.value,node.nextNode.value,node.value);
			removeAdjacentNodes(node,true,true);
			breakOut = true;
		}
	}
	if (expressionNodes.length != 1)
		window.setTimeout( animate, 1000)

	updateDisplay();
}


function processInput ( inputType, inputCode ) {
    const currentExpressionNode = expressionNodes[expressionNodes.length-1];


    let action = '';

    switch (inputType) {
        case 'Number':
            if (inputCode.includes('.'))
                action = getNewNodeAction(currentExpressionNode,inputType,inputCode,'ExclusiveAppend');
            else
                action = getNewNodeAction(currentExpressionNode,inputType,inputCode,'Append');
            break;

        case 'Operator':
            action = getNewNodeAction(currentExpressionNode,inputType,inputCode,'Overwrite');
            break;

        case 'Special':
            action = getNewNodeAction(currentExpressionNode,inputType,inputCode,'ExclusiveAppend');
            break;

        case 'Equals':
            // action = 'Evaluate';
			// animate();
			// debugger;

			computeNodePriorities();
			debugger;
			let expressionNodesOrderedByOperation = expressionNodes.sort(
				function (nodeA, nodeB) {
					return nodeB.priority-nodeA.priority;

					
			})

			let done = false;
			let counter = 0;
			while (done == false && counter < 100) {
				let breakOut = false;
				for (let i = 0; i < expressionNodes.length && breakOut == false; i++ ) {
					let node = expressionNodes[i]
					if (node.type == 'Operator') {
						node.type = 'Number';
						node.value = runEquals(node.previousNode.value,node.nextNode.value,node.value);
						removeAdjacentNodes(node,true,true);
						breakOut = true;
					}
				}
				if (expressionNodes.length == 1)
					done = true;
				counter++;
			}
            break;
    }





    switch ( action ) {
        case 'Create':
            expressionNodes.push(new ExpressionNode(inputType,inputCode,currentExpressionNode===undefined?null:currentExpressionNode,null));
            if (currentExpressionNode != undefined)
                currentExpressionNode.nextNode = expressionNodes[expressionNodes.length-1];
            break;
        case 'Append':
            currentExpressionNode.value = currentExpressionNode.value + inputCode;
            break;
        case 'Overwrite':
            currentExpressionNode.type = inputType;
            currentExpressionNode.value = inputCode;
        case 'Evaluate':
            
    }

    console.table(expressionNodes);

    updateDisplay();
}

function getNewNodeAction (currentExpressionNode, inputType, input, sameTypeRule ) {
    if (currentExpressionNode === undefined) return 'Create';

    if (currentExpressionNode.type == inputType) {
        switch (sameTypeRule) {
            case 'Append':
                return 'Append';
            case 'ExclusiveAppend':
                if (!currentExpressionNode.value.includes(input))
                    return 'Append';
                else
                    return 'NullAction';
            case 'Overwrite':
                return 'Overwrite';
        }
    } else {
        return 'Create';
    }
    
}

function computeNodePriorities () {
	let currentBracketLevel = 0;
	for (let i = 0; i < expressionNodes.length; i++) {
		let node = expressionNodes[i];
		switch (node.type) {
			case 'Number':
				node.priority = -1;
				continue;
			case 'Operator':
				switch (node.value) {
					case '+':
					case '-':
						node.priority = 1000 + currentBracketLevel*10000 + (expressionNodes.length-i);
						continue;
					case '*':
					case '/':
						node.priority = 2000 + currentBracketLevel*10000 + (expressionNodes.length-i);
						continue;
							
				}
		}
		node.priority = -1;
		continue;

	}
}


function processSpecialInput ( currentExpressionNode, input ) {


    switch ( input ) {
        case 'EQL':
            if (currentObject.id == 'RIGHT' && rightOperand.text != '') {
                runEquals();
                operator.text = '';
                currentObject = leftOperand;
            }
            break;
        case '.':
            if (currentExpressionNode === undefined) {
                expressionNodes.push(new ExpressionNode('Number','0'+input,null,null));
            } else {
                switch (currentExpressionNode.type) {
                    case 'Number':
                        if (!currentExpressionNode.value.includes('.')) {
                            currentExpressionNode.value = currentExpressionNode.value + input;
                        }
                        break;
                    case 'Operator':       
                        expressionNodes.push(new ExpressionNode('Number','0'+input,null,null));   
                        break;
                }
            }



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
            leftOperand.text = '0';
            rightOperand.text = '';
            operator.text = '';
            break;
        case 'BCK':
            if (currentObject.id != 'OPERATOR') {
                currentObject.text = currentObject.text.slice(0,currentObject.text.length-1);
            }
            break;
    }

    console.table(expressionNodes);
    
}

function removeAdjacentNodes(expressionNode, removePrevious, removeNext ) {
    if (removePrevious) {
        const previous = expressionNode.previousNode;
        expressionNode.previousNode = previous.previousNode;
        if (expressionNode.previousNode != undefined)
            expressionNode.previousNode.nextNode = expressionNode;
        previous.previousNode = undefined;
        previous.nextNode = undefined;
        removeExpressionNodeById(previous.id);
    }
    if (removeNext) {
        const next = expressionNode.nextNode;
        expressionNode.nextNode = next.nextNode;
        if (expressionNode.nextNode != undefined)
            expressionNode.nextNode.previousNode = expressionNode;
        next.previousNode = undefined;
        next.nextNode = undefined;
        removeExpressionNodeById(next.id);
    }
}

function removeExpressionNodeById( id ) {
    const nodeIndex = expressionNodes.findIndex( Node => Node.id == id)
    if (nodeIndex != -1) 
        expressionNodes.splice(nodeIndex,1);
}


function runEquals( leftOperand, rightOperand, operator ) {
    return processDecimal(performCalculation(parseFloat(leftOperand),parseFloat(rightOperand),operator)) + '';
}


function performCalculation( leftNode, rightNode, operator ) {
    switch ( operator ) {
        case '+':
            return leftNode + rightNode;
            break
        case '-':
            return leftNode - rightNode;
            break
        case '*':
            return leftNode * rightNode;
            break
        case '/':
            return leftNode / rightNode;
            break
    }
    
}


function processDecimal ( number ) {
    // This limits the number of decimal points based on how many digits
    // are being used on the left side of the decimal.
    let currentDigits = (parseInt(number)+'').length;
    // Below, the '+' in '+number.toFixed(...' will remove any unnecessary decimal digits as
    // part of the conversion from string (i.e. '10.0000000000000' -> 10) 
    return +number.toFixed(Math.max(0,15-currentDigits));
}


function updateDisplay () {
	let displayString = '';

	for (let i = 0; i < expressionNodes.length; i++) {
		displayString = displayString + expressionNodes[i].value;
	}

	displayText.textContent = displayString;


}


function handleKeyboardInput ( keyCode ) {
    if (keyCode.includes('Digit')) {
        let number = keyCode.slice(keyCode.length-1,keyCode.length);
        processInput('Number',number);
    } else {
        switch( keyCode) {
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