//BUDGET CONTROLLER
const budgetController = (function(){



})();

//UI CONTROLLER

const UIController = (function(){

    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

return{
    getInput: function(){
        return {
            type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
        };
    },

    getDOMstrings : function(){
        return DOMstrings;
    }
}


})();

//GLOBAL APP CONTROLLER
const controller = (function(budgetCtrl, UIctrl){

    //This gets the information in the UI controller = DOMStrings object
    const DOM = UIctrl.getDOMstrings();

    //We built this function to stay DRY - it is called in both keypress and event listener below.
    const ctrlAddItem = function(){

    //1. get input data
        let input = UIctrl.getInput();
        console.log(input);

    //2. add the item to the budget controller
    //3. add the item to the UI
    //4, calculate the budget
    //5. display the budget on the UI

    }

document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
document.addEventListener('keypress', function(event){
    if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
    }
});

})(budgetController, UIController);
//We do this so this module can access the other modules code.


