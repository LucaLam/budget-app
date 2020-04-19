//********BUDGET CONTROLLER
const budgetController = (function(){

    const Expense = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value,
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
    return this.percentage;
    }

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

        deleteItem: function (type, id) {
        let ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }

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

        calculatePercentages: function (){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(){
            let allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
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
        percentageLabel: ".budget__expenses--percentage",
        container: '.container',
        expensesPercLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    };

    const formatNumber = function(num, type){
        let numSplit, int, dec, sign;
        //+/- before the number, two decimal points and a comma separating the thousands
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];

        if(int.length > 3){
            int = int.substr(0, int.length -3) + ',' + int.substr(int.length -3, 3);
            //input 23100, output 23,100
        }

        dec = numSplit[1];

        return (type === 'exp' ? "-" : "+") + ' ' + int + '.' + dec;
    };

    let nodeListForEach = function(list, callback){
        for(let i = 0; i <list.length; i++){
            callback(list[i], i);
        }
    };

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

    html =  '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    } else if (type ==='exp'){
    element = DOMstrings.expensesContainer;

    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    }
    //replace placeholder with data
    newHtml = html.replace("%id%", obj.id);
    newHtml = newHtml.replace('%description%', obj.description);
    newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));

    //insert the HTML into the DOM
    document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID){
        let el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
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

        obj.budget > 0 ? type = 'inc' : type = 'exp';
        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

        if(obj.percentage > 0){
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        } else{
            document.querySelector(DOMstrings.percentageLabel).textContent = "---"
        }
    },

    displayPercentages: function(percentages){

        //This returns a Node List
        let fields  = document.querySelectorAll(DOMstrings.expensesPercLabel);

        nodeListForEach(fields, function(current, index){
            if(percentages[index] > 0){
            current.textContent = percentages[index] + '%';
            } else{
                current.textContent = "---";
            }
        });
    },

    displayMonth: function(){
        let now, months, month, year;

        now = new Date();

        months = ['Jan', 'Feb', 'March', 'April', 'May', 'Jun', "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        month = now.getMonth();
        year = now.getFullYear();

        document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " " + year ;
    },

    changedType: function(){
        let fields = document.querySelectorAll(
            DOMstrings.inputType + "," +
            DOMstrings.inputDescription + "," +
            DOMstrings.inputValue);

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    },

    getDOMstrings : function(){
        return DOMstrings;
    }
}
})();




//*********GLOBAL APP CONTROLLER
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changedType);

    };

    const updatePercentages = function(){
        //1. calculate percentages
        budgetCtrl.calculatePercentages();

        //2. read percentages from budget controller
        let percentages = budgetCtrl.getPercentages();

        //3. updated UI with the new percentages
        UIctrl.displayPercentages(percentages);

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

    //6. calculate and updated percentages
    updatePercentages();
    
}

};

const ctrlDeleteItem = function(event){
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID){
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);

        //1. delete item from the data structure
        budgetCtrl.deleteItem(type, ID);

        //2. delete the item from the UI
        UIctrl.deleteListItem(itemID);

        //3. Update and show the new budget
        updateBudget();

         //4. calculate and updated percentages
        updatePercentages();
    }


};

    return {
        init: function(){
            console.log('App Started!')
            UIctrl.displayMonth();
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

