//BUDGET CONTROLLER
const budgetController = (function(){

    const Expense = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value
    };

    const Income = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value
    };

    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }


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

    const setupEventListeners = function(){
    //This gets the information in the UI controller = DOMStrings object
    const DOM = UIctrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
        }
        });

    };

    //We built this function to stay DRY - it is called in both keypress and event listener below.
    const ctrlAddItem = function(){

    //1. get input data
        let input = UIctrl.getInput();

    //2. add the item to the budget controller
    //3. add the item to the UI
    //4, calculate the budget
    //5. display the budget on the UI

    };

    return {
        init: function(){
            setupEventListeners();
        }
    }

})(budgetController, UIController);
//We do the above code so this module can access the other modules code.

controller.init();

