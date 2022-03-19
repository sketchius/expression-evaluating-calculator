


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

let cursorPostion = 0;

let numberOfIds=0;

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
			node.value = doArithmetic(node.previousNode.value,node.nextNode.value,node.value);
			removeAdjacentNodes(node,true,true);
			breakOut = true;
		}
	}
	if (expressionNodes.length != 1)
		window.setTimeout( animate, 1000)

	updateDisplay();
}


function processInput ( inputType, inputCode ) {
    const currentExpressionNode = expressionNodes[expressionNodes.length-1+cursorPostion];

    let action = '';


        


    switch (inputType) {
        case 'Number':
			handleNumberInput(currentExpressionNode,inputCode);
			break;

        case 'Operator':
            handleOperatorInput(currentExpressionNode,inputCode);
            break;

		case 'Decimal':
			handleDecimalInput(currentExpressionNode,inputCode);

		case 'OpenBracket':
			handleOpenBracketInput(currentExpressionNode,inputCode);
			break;

		case 'CloseBracket':
			handleCloseBracketInput(currentExpressionNode,inputCode);
			break;

        case 'Equals':
            // action = 'Evaluate';
			// animate();
			// debugger;

			computeNodePriorities();
			let expressionNodesOrderedByOperation = expressionNodes.slice(); 
			
			expressionNodesOrderedByOperation.sort(
				function (nodeA, nodeB) {
					return nodeB.priority-nodeA.priority;

					
			})
			console.table(expressionNodesOrderedByOperation);
			let done = false;
			let counter = 0;
			debugger;
			while (done == false && counter < 100) {
				let breakOut = false;
				for (let i = 0; i < expressionNodesOrderedByOperation.length && breakOut == false; i++ ) {
					let node = expressionNodesOrderedByOperation[i]
					switch (node.type) {
						case 'Operator':
							node.type = 'Number';
							node.value = doArithmetic(node.previousNode.value,node.nextNode.value,node.value);
							node.priority = -1;
							removeExpressionNodeById(expressionNodesOrderedByOperation,node.nextNode.id);
							removeExpressionNodeById(expressionNodesOrderedByOperation,node.previousNode.id);
							removeAdjacentNodes(node,true,true);
							breakOut = true;
							break;
						case 'OpenBracket':
							removeNode(node);
							removeExpressionNodeById(expressionNodes,node.id);
							removeExpressionNodeById(expressionNodesOrderedByOperation,node.id);
							breakOut = true;
							break;
						case 'CloseBracket':
							removeNode(node);
							removeExpressionNodeById(expressionNodes,node.id);
							removeExpressionNodeById(expressionNodesOrderedByOperation,node.id);
							breakOut = true;
							break;
					}
				}
				if (expressionNodesOrderedByOperation.length == 1)
					done = true;
				counter++;
			}
            break;

    }



		console.log(`Action = ${action}`);


    // switch ( action ) {
    //     case 'Create':
    //         expressionNodes.splice(expressionNodes.length+cursorPostion,0,new ExpressionNode(inputType,inputCode,currentExpressionNode===undefined?null:currentExpressionNode,null));
    //         if (currentExpressionNode != undefined)
    //             currentExpressionNode.nextNode = expressionNodes[expressionNodes.length-1];
    //         break;
	// 	case 'CreatePair':
	// 		expressionNodes.splice(expressionNodes.length+cursorPostion,0,new ExpressionNode(inputType,inputCode,currentExpressionNode===undefined?null:currentExpressionNode,null));
    //         if (currentExpressionNode != undefined)
    //             currentExpressionNode.nextNode = expressionNodes[expressionNodes.length-1];
	// 		expressionNodes.splice(expressionNodes.length+cursorPostion,0,new ExpressionNode('CloseBracket',')',currentExpressionNode===undefined?null:currentExpressionNode,null));
	// 		cursorPostion--;
	// 		break;
    //     case 'Append':
    //         currentExpressionNode.value = currentExpressionNode.value + inputCode;
    //         break;
    //     case 'Overwrite':
    //         currentExpressionNode.type = inputType;
    //         currentExpressionNode.value = inputCode;
    //     case 'Evaluate':
            
    // }

    console.table(expressionNodes);

    updateDisplay();
}


function handleNumberInput(currentExpressionNode, input) {
    if (currentExpressionNode === undefined) {
		createNode(currentExpressionNode,'Number',input);
		return;
	}

	switch (currentExpressionNode.type) {
		case 'Number':
			currentExpressionNode.value = currentExpressionNode.value + input;
			break;
		case 'Operator':
		case 'OpenBracket':
			createNode(currentExpressionNode,'Number',input);
			break;

	}
}

function handleOperatorInput(currentExpressionNode, input) {
    if (currentExpressionNode === undefined) {
		createNode(currentExpressionNode,'Operator',input);
		return;
	}

	switch (currentExpressionNode.type) {
		case 'Number':
		case 'CloseBracket':
			createNode(currentExpressionNode,'Operator',input);
			break;
		case 'Operator':
            currentExpressionNode.value = input;
			break;

	}
}

function handleDecimalInput(currentExpressionNode, input) {
    if (currentExpressionNode === undefined) {
		createNode(currentExpressionNode,'Number','0' + input);
		return;
	}

	switch (currentExpressionNode.type) {
		case 'Number':
			if (!currentExpressionNode.value.includes('.')) {
				currentExpressionNode.value = currentExpressionNode.value + input;
			}
			break;
		case 'Operator':
		case 'OpenBracket':
			createNode(currentExpressionNode,'Number','0' + input);
			break;

	}
}

function handleOpenBracketInput(currentExpressionNode, input) {
    createNode(currentExpressionNode,'OpenBracket','(');
    createNode(expressionNodes[expressionNodes.length-1+cursorPostion],'CloseBracket',')');
	cursorPostion--;
}
	// 	case 'CreatePair':
	// 		expressionNodes.splice(expressionNodes.length+cursorPostion,0,new ExpressionNode(inputType,inputCode,currentExpressionNode===undefined?null:currentExpressionNode,null));
    //         if (currentExpressionNode != undefined)
    //             currentExpressionNode.nextNode = expressionNodes[expressionNodes.length-1];
	// 		expressionNodes.splice(expressionNodes.length+cursorPostion,0,new ExpressionNode('CloseBracket',')',currentExpressionNode===undefined?null:currentExpressionNode,null));
	// 		cursorPostion--;
	// 		break;

function handleCloseBracketInput(currentExpressionNode, input) {
    if (currentExpressionNode === undefined) {
		return;
	}
	for (let i = cursorPostion; i <= 0; i++) {
		console.log(`Item ${i}: Type ${expressionNodes[expressionNodes.length-1+i].type}, Value: ${expressionNodes[expressionNodes.length-1+i].value}`);
		if (expressionNodes[expressionNodes.length-1+i].value == ')') {
			cursorPostion = i;
			break;
		}
	}
	const lastNodeInsideBracket = expressionNodes[expressionNodes.length-2+cursorPostion];

	switch (lastNodeInsideBracket.type) {
		case 'Number':
			return;
		case 'CloseBracket':
		case 'Operator':
			cursorPostion--;
			runBackspace();
			cursorPostion++;
			return;
		case 'OpenBracket':
			runBackspace();
			runBackspace();
			return;
		

	}
}

function createNode(currentExpressionNode,inputType,inputCode) {
	expressionNodes.splice(expressionNodes.length+cursorPostion,0,new ExpressionNode(inputType,inputCode,currentExpressionNode===undefined?null:currentExpressionNode,null));
	if (currentExpressionNode != undefined)
		currentExpressionNode.nextNode = expressionNodes[expressionNodes.length-1+cursorPostion];
	if (cursorPostion < 0) {
		expressionNodes[expressionNodes.length-1+cursorPostion].nextNode = expressionNodes[expressionNodes.length-1+cursorPostion+1];
		expressionNodes[expressionNodes.length-1+cursorPostion+1].previousNode = expressionNodes[expressionNodes.length-1+cursorPostion];
	}
}

function runBackspace() {
	const previousNode = expressionNodes[expressionNodes.length-2+cursorPostion];
	const nextNode = expressionNodes[expressionNodes.length-0+cursorPostion];
	if (previousNode != undefined && nextNode != undefined) {
		previousNode.nextNode = nextNode;
		nextNode.previousNode = previousNode;
	}
	if (previousNode != undefined && nextNode == undefined) {
		previousNode.nextNode = null;
	}
	if (previousNode == undefined && nextNode != undefined) {
		nextNode.previousNode = null;
	}
	expressionNodes.splice(expressionNodes.length-1+cursorPostion,1);
}

function getNewNodeAction (currentExpressionNode, inputType, input, sameTypeRule ) {
    if (currentExpressionNode === undefined) {
		if (sameTypeRule == 'CreatePair')
		return 'CreatePair'
	else
		return 'Create';
	}

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
			case 'CreatePair':
				return 'CreatePair';
        }
    } else {
		if (sameTypeRule == 'CreatePair')
			return 'CreatePair'
		else
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
			case 'OpenBracket':
					currentBracketLevel++;
					node.priority = currentBracketLevel*10000 + (expressionNodes.length-i);
					continue;
			case 'CloseBracket':
					node.priority = currentBracketLevel*10000 + (expressionNodes.length-i);
					currentBracketLevel--;
					continue;

		}
		node.priority = -1;
		continue;

	}
}



function removeAdjacentNodes(expressionNode, removePrevious, removeNext ) {
    if (removePrevious) {
        const previous = expressionNode.previousNode;
        expressionNode.previousNode = previous.previousNode;
        if (expressionNode.previousNode != undefined)
            expressionNode.previousNode.nextNode = expressionNode;
        previous.previousNode = undefined;
        previous.nextNode = undefined;
        removeExpressionNodeById(expressionNodes,previous.id);
    }
    if (removeNext) {
        const next = expressionNode.nextNode;
        expressionNode.nextNode = next.nextNode;
        if (expressionNode.nextNode != undefined)
            expressionNode.nextNode.previousNode = expressionNode;
        next.previousNode = undefined;
        next.nextNode = undefined;
        removeExpressionNodeById(expressionNodes,next.id);
    }
}

function removeNode(expressionNode) {
	const previous = expressionNode.previousNode;
	const next = expressionNode.nextNode;
	if (previous != undefined)
		previous.nextNode = next;
	if (next != undefined)
		next.previousNode = previous;
	removeExpressionNodeById(expressionNodes,expressionNode.id);
}



function removeExpressionNodeById( nodeArray, id ) {
    const nodeIndex = nodeArray.findIndex( Node => Node.id == id)
    if (nodeIndex != -1) 
	nodeArray.splice(nodeIndex,1);
}


function doArithmetic( leftOperand, rightOperand, operator ) {
	leftOperand.replaceAll('⁻','-');
	rightOperand.replaceAll('⁻','-');
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
		if (expressionNodes[i].value == '+') {
			displayString = displayString + "<span class='red'>" + expressionNodes[i].value + "</span>";
		} else
			displayString = displayString + expressionNodes[i].value;
	}

	displayText.innerHTML = displayString;


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