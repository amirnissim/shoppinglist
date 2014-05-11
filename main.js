(function() {
  'use strict';

  function $(s) {
    return document.querySelector(s);
  }
  function setState(state) {
    document.body.className = state;
  }
  var elements = {
    input: $('#input'),
    list: $('#list'),
    addItem: $('#addItem'),
    // clear: $('#clear'),
    form: $('form')
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

      this.dataRef.on('value', function(dataSnapshot) {
        setState(dataSnapshot.val() ? 'list' : '');
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

      li.className = 'list-group-item';
      li.textContent = item;
      li.dataset.key = key;

      a.className = 'remove-item';
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
      elements.input.value = '';
    }
  }

  ShoppingList.init();
  elements.addItem.addEventListener('click', addItem);
  // elements.clear.addEventListener('click', ShoppingList.clear.bind(ShoppingList));
  elements.form.addEventListener('submit', function(e) {
    e.preventDefault();
    addItem();
  });
})();





