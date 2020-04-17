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

    const calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    };

    const data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;

            //create new ID
            if(data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else{
            ID =0;
            }
            //create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            //push to our data structure
            data.allItems[type].push(newItem);

            //return to new element
            return newItem;
        },

        calculateBudget: function(){

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if(data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    }


})();




//********************UI CONTROLLER

const UIController = (function(){

    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: ".budget__expenses--percentage"
    }

return{
    getInput: function(){
        return {
            type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
        };
    },

    addListItem: function(obj, type){
    let html, newHtml, element;
    //Create HTML string with placeholder text
    if(type === 'inc'){
    element = DOMstrings.incomeContainer;

    html =  '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    } else if (type ==='exp'){
    element = DOMstrings.expensesContainer;

    html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    }
    //replace placeholder with data
    newHtml = html.replace("%id%", obj.id);
    newHtml = newHtml.replace('%description%', obj.description);
    newHtml = newHtml.replace('%value%', obj.value);

    //insert the HTML into the DOM
    document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function(){
        let fields, fieldsArr;

        fields = document.querySelectorAll(DOMstrings.inputDescription + ', '  +
        DOMstrings.inputValue); 

        //tricks slice method into thinking that 'fields' list is an array.
        fieldsArr = Array.prototype.slice.call(fields);

        fieldsArr.forEach(function(current, index, array){
            current.value = "";
        });

        fieldsArr[0].focus();
    },

    //This function updates the labels at the top of the app
    displayBudget: function(obj){
        document.querySelector(DOMstrings.budgetLabel).textContent = '$' + obj.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

        if(obj.percentage > 0){
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        } else{
            document.querySelector(DOMstrings.percentageLabel).textContent = "---"
        }
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

    const updateBudget = function(){
    //1. calculate the budget
    budgetCtrl.calculateBudget();
    
    //2. return the budget
    let budget = budgetCtrl.getBudget();

    //3. display the budget on the UI
    UIctrl.displayBudget(budget);
    };

    //We built this function to stay DRY - it is called in both keypress and event listener below.
    const ctrlAddItem = function(){
    let input, newItem;

    //1. get input data
    input = UIctrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){

    //2. add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //3. add the item to the UI
    UIctrl.addListItem(newItem, input.type);

    //4. Clear the fields
    UIctrl.clearFields();

    //5 calculate and update the budget
    updateBudget();
    
}

};

    return {
        init: function(){
            UIctrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);
//We do the above code so this module can access the other modules code.

controller.init();

