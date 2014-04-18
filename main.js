(function() {
  'use strict';

  function $(s) {
    return document.querySelector(s);
  }

  var elements = {
    input: $('#input'),
    list: $('#list'),
    addItem: $('#addItem'),
    clear: $('#clear'),
    form: $('#form')
  };

  var ShoppingList = {
    dataRef: null,
    init: function() {
      var fb = new Firebase('https://amirnissim.firebaseio.com/');

      this.dataRef = fb.child('shoppingList');
      this.dataRef.once('value', function(dataSnapshot) {
        dataSnapshot.forEach(function(childData){
          ShoppingList.push(childData.val().item, childData.name());
        });
      });
    },
    clear: function() {
      elements.list.innerHTML = '';
      this.dataRef.remove();
    },
    push: function(item, key) {
      var
      li = document.createElement('li'),
      a = document.createElement('a');

      li.textContent = item;
      li.dataset.key = key;

      a.className = 'removeItem';
      a.innerHTML = '&times;';
      a.addEventListener('click', function() {
        ShoppingList.remove(key);
        elements.list.removeChild(li);
      });

      li.appendChild(a);
      elements.list.appendChild(li);
    },
    remove: function(key) {
      var ref = this.dataRef.child(key);
      ref.remove();
    },
    add: function(item) {
      var ref = this.dataRef.push({'item': item});
      ShoppingList.push(item, ref.name());
    }
  };

  function addItem() {
    var item = elements.input.value;
    if (item) {
      ShoppingList.add(item);
    }
  }

  ShoppingList.init();
  elements.addItem.addEventListener('click', addItem);
  elements.clear.addEventListener('click', ShoppingList.clear.bind(ShoppingList));
  elements.form.addEventListener('submit', function(e) {
    debugger;
    e.preventDefault();
    addItem();
  });
})();





