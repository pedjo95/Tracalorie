// Storage Controller



// Item Controller
const ItemCtrl = (function() {
  // Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data structure/ state
  const data = {
    items: [
      // { id: 0, name: 'Steak Dinner', calories: 1200 },
      // { id: 1, name: 'Cookie', calories: 400 },
      // { id: 2, name: 'Eggs', calories: 300 }
    ],
    currentItem: null,
    totalCalories: 0
  }
  
  // Public Methods
  return {
    getItems: function() {
      return data.items;
    },

    addItem: function(name, calories) {
      let ID;

      // create Id
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // create a new item
      newItem = new Item(ID, name, calories);

      // add to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemById: function(id) {
      let found = null;

      // loop through items
      data.items.forEach(item => {
        if(item.id === id) {
          found = item;
        }  
      });

      return found;
    },

    setCurrentItem: function(item) {
      data.currentItem = item;
    },

    getCurrentItem: function() {
      return data.currentItem;
    },

    getTotalCalories: function() {
      let total = 0;

      data.items.forEach((item) => {
        total += item.calories;
      });

      // set total in data structure
      data.totalCalories = total;

      // return total
      return data.totalCalories;
    },

    logData: function() {
      return data;
    }
  }
})();



// UI Controller
const UICtrl = (function() {
  const UiSelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
  }
  
  // Public Methods
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(item => {
        html += `
          <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          </li>
        `; 
      });

      // Insert into the UI
      document.querySelector(UiSelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UiSelectors.itemNameInput).value,
        calories: document.querySelector(UiSelectors.itemCaloriesInput).value,
      }
    },

    addListItem: function(item) {
      // Show the ul
      document.querySelector(UiSelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // add class
      li.className = 'collection-item'
      // add id
      li.id = `item-${item.id}`;

      // add HYML
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
        </a>
      `;

      // Insert item
      document.querySelector(UiSelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    clearInput: function() {
      document.querySelector(UiSelectors.itemNameInput).value = '';
      document.querySelector(UiSelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function() {
      document.querySelector(UiSelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UiSelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },

    hideList: function() {
      document.querySelector(UiSelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function(totalCalories) {
      document.querySelector(UiSelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: function() {
      UICtrl.clearInput();

      document.querySelector(UiSelectors.updateBtn).style.display = 'none';
      document.querySelector(UiSelectors.deleteBtn).style.display = 'none';
      document.querySelector(UiSelectors.backBtn).style.display = 'none';
      document.querySelector(UiSelectors.addBtn).style.display = 'inline';
    },

    showEditState: function() {

      document.querySelector(UiSelectors.updateBtn).style.display = 'inline';
      document.querySelector(UiSelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UiSelectors.backBtn).style.display = 'inline';
      document.querySelector(UiSelectors.addBtn).style.display = 'none';
    },

    getSelectors: function() {
      return UiSelectors;
    }
  }
})();



//APP Controller 
const App = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    const UiSelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UiSelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Edit icon event
    document.querySelector(UiSelectors.itemList).addEventListener('click', itemUpdateSubmit);
  }

  // Add item func
  const itemAddSubmit = function(e) {

    // Get input from the UI
    const input = UICtrl.getItemInput();
    
    if(input.name !== '' && input.calories !== '') {
      // add Item 
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // add Item to the Ui
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to the UI
      UICtrl.showTotalCalories(totalCalories)

      // clear input
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Edit item func
  const itemUpdateSubmit = function(e) {

    if(e.target.classList.contains('edit-item')) {
      // get list item id
      const listId = e.target.parentNode.parentNode.id;

      // break into an array
      const listIdArray = listId.split('-');

      // get the id
      const id = parseInt(listIdArray[1]);

      // get item form db
      const itemToEdit = ItemCtrl.getItemById(id);
      
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // Public Methods
  return {
    init: function() {
      // Clear edit state
      UICtrl.clearEditState();

      // fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items 
      if(items.length === 0) {
        UICtrl.hideList();

      } else {
        // populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to the UI
      UICtrl.showTotalCalories(totalCalories)

      // load event listener
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

App.init();
