/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

Mixomator9000.prototype.initTemplates = function() {
  this.templates = {};

  var that = this;
  document.querySelectorAll('.template').forEach(function(el) {
    that.templates[el.getAttribute('id')] = el;
  });
};

Mixomator9000.prototype.viewHome = function() {
  this.getAllDrinks();
};

Mixomator9000.prototype.viewDrinks = function() {

  var mainEl = this.renderTemplate('main-adjusted');
  var headerEl = this.renderTemplate('header-base', {
    hasSectionHeader: true
  });

  this.replaceElement(document.querySelector('.header'), headerEl);
  this.replaceElement(document.querySelector('main'), mainEl);

  var that = this;

  var renderResults = function(doc) {
    if (!doc) {
      var headerEl = that.renderTemplate('header-base', {
        hasSectionHeader: true
      });

      var noResultsEl = that.renderTemplate('no-results');

      that.replaceElement(document.querySelector('.header'), headerEl);
      that.replaceElement(document.querySelector('main'), noResultsEl);
      return;
    }
    var data = doc.data();
    data['.id'] = doc.id;
    data['go_to_drink'] = function() {
      var dialog = document.querySelector('#dialog-edit-drink');
      dialog.querySelector('#drinkid').value = doc.id;
      dialog.querySelector('#drinkname').value = data.name;
      dialog.querySelector('#drinktype').value = data.type;
      dialog.querySelector('#drinkphoto').value = data.photo;
      dialog.querySelector('#drinkingredients').value = JSON.stringify(data.ingredients);
      that.dialogs.editdrink.show();
    };

    var el = that.renderTemplate('drink-card', data);

    mainEl.querySelector('#cards').append(el);
  };

  this.getAllDrinks(renderResults);

  var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
  toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');

  var addEl = this.renderTemplate('add-drinks');
  var button = addEl.querySelector('#add_drink');
  var that = this;
  button.addEventListener('click', function() {
    that.dialogs.adddrink.show();
  });
  document.querySelector('main').append(addEl);  
};

Mixomator9000.prototype.viewMenu = function(filters, filter_description) {
  if (!filter_description) {
    filter_description = 'any type of drink';
  }

  var mainEl = this.renderTemplate('main-adjusted');
  var headerEl = this.renderTemplate('header-base', {
    hasSectionHeader: true
  });

  this.replaceElement(
    headerEl.querySelector('#section-header'),
    this.renderTemplate('filter-display', {
      filter_description: filter_description
    })
  );

  this.replaceElement(document.querySelector('.header'), headerEl);
  this.replaceElement(document.querySelector('main'), mainEl);

  var that = this;
  headerEl.querySelector('#show-filters').addEventListener('click', function() {
    that.dialogs.filter.show();
  });

  var renderResults = function(doc) {
    if (!doc) {
      var headerEl = that.renderTemplate('header-base', {
        hasSectionHeader: true
      });

      var noResultsEl = that.renderTemplate('no-results');

      that.replaceElement(
        headerEl.querySelector('#section-header'),
        that.renderTemplate('filter-display', {
          filter_description: filter_description
        })
      );

      headerEl.querySelector('#show-filters').addEventListener('click', function() {
        that.dialogs.filter.show();
      });

      that.replaceElement(document.querySelector('.header'), headerEl);
      that.replaceElement(document.querySelector('main'), noResultsEl);
      return;
    }
    var data = doc.data();
    data['.id'] = doc.id;
    data['go_to_drink'] = function() {
      var dialog = document.querySelector('#dialog-drink-details');
      dialog.querySelector('#drinkid').value = doc.id;
      dialog.querySelector('#drinkname').value = data.name;
      dialog.querySelector('#drinktype').value = data.type;
      dialog.querySelector('#drinkingredients').value = JSON.stringify(data.ingredients);
      that.dialogs.drinkdetails.show();
    };

    var el = that.renderTemplate('drink-card', data);

    mainEl.querySelector('#cards').append(el);
  };

  if (filters.type ) {
    this.getAvailableFilteredDrinks({
      type: filters.type || 'Any'
    }, renderResults);
  } else {
    this.getAvailableDrinks(renderResults);
  }

  var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
  toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');

}

Mixomator9000.prototype.viewPumps = function() {
  var headerEl = this.renderTemplate('header-base', {
    hasSectionHeader: false
  });
  this.replaceElement(document.querySelector('.header'), headerEl);
  var mainEl = this.renderTemplate('main-pump-adjusted');

  var that = this;
  var renderResults = function(doc) { 
    var data = doc.data();
    data['go_to_pump'] = function() {
      var dialog = document.querySelector('#dialog-edit-pump');
      dialog.querySelector('#pumpid').value = doc.id;
      dialog.querySelector('#pumpname').value = data.name;
      dialog.querySelector('#pumppin').value = data.pin;
      dialog.querySelector('#pumpvalue').value = data.value;
      that.dialogs.editpump.show();
    };
    var el = that.renderTemplate('pump-card', data);
    mainEl.querySelector('#cards').append(el);
  }
  this.getAllPumps(renderResults);
  this.replaceElement(document.querySelector('main'), mainEl);
}

Mixomator9000.prototype.viewSetup = function() {
  var headerEl = this.renderTemplate('header-base', {
    hasSectionHeader: false
  });

  var config = this.getFirebaseConfig();
  //var noRestaurantsEl = this.renderTemplate('add-drinks', config);

  //var button = noRestaurantsEl.querySelector('#add_drink');
  var addingMockData = false;

  var that = this;
  /*button.addEventListener('click', function(event) {
    if (addingMockData) {
      return;
    }

    addingMockData = true;

    event.target.style.opacity = '0.4';
    event.target.innerText = 'Please wait...';

    that.addMockDrinks().then(function() {
      that.rerender();
    });
  });*/

  this.replaceElement(document.querySelector('.header'), headerEl);
  //this.replaceElement(document.querySelector('main'), noRestaurantsEl);

  firebase
    .firestore()
    .collection('drinks')
    .limit(1)
    .onSnapshot(function(snapshot) {
      if (snapshot.size && !addingMockData) {
        that.router.navigate('/');
      }
    });
};

Mixomator9000.prototype.viewClean = function() {
  var headerEl = this.renderTemplate('header-base', {
    hasSectionHeader: false
  });
  this.replaceElement(document.querySelector('.header'), headerEl);
  
  var mainEl = this.renderTemplate('clean');
  var button = mainEl.querySelector('#clean_button');
  var that = this;
  button.addEventListener('click', function() {
    that.sendOrder('clean');
  });

  this.replaceElement(document.querySelector('main'), mainEl);
}

Mixomator9000.prototype.initFilterDialog = function() {
  // TODO: Reset filter dialog to init state on close.
  this.dialogs.filter = new mdc.dialog.MDCDialog(document.querySelector('#dialog-filter-all'));

  var that = this;
  this.dialogs.filter.listen('MDCDialog:accept', function() {
    that.updateQuery(that.filters);
  });

  var dialog = document.querySelector('aside');
  var pages = dialog.querySelectorAll('.page');

  this.replaceElement(
    dialog.querySelector('#type-list'),
    that.renderTemplate('item-list', { items: ['Any'].concat(that.data.type) })
  );

  var renderAllList = function() {
    that.replaceElement(
      dialog.querySelector('#all-filters-list'),
      that.renderTemplate('all-filters-list', that.filters)
    );

    dialog.querySelectorAll('#page-all .mdc-list-item').forEach(function(el) {
      el.addEventListener('click', function() {
        var id = el.id.split('-').slice(1).join('-');
        displaySection(id);
      });
    });
  };

  var displaySection = function(id) {
    if (id === 'page-all') {
      renderAllList();
    }

    pages.forEach(function(sel) {
      if (sel.id === id) {
        sel.style.display = 'block';
      } else {
        sel.style.display = 'none';
      }
    });
  };

  pages.forEach(function(sel) {
    var type = sel.id.split('-')[1];
    if (type === 'all') {
      return;
    }

    sel.querySelectorAll('.mdc-list-item').forEach(function(el) {
      el.addEventListener('click', function() {
        that.filters[type] = el.innerText.trim() === 'Any'? '' : el.innerText.trim();
        displaySection('page-all');
      });
    });
  });

  displaySection('page-all');
  dialog.querySelectorAll('.back').forEach(function(el) {
    el.addEventListener('click', function() {
      displaySection('page-all');
    });
  });
};

Mixomator9000.prototype.initAddDrinkDialog = function() {
  var dialog = document.querySelector('#dialog-add-drink');
  this.dialogs.adddrink = new mdc.dialog.MDCDialog(dialog);

  var that = this;
  this.dialogs.adddrink.listen('MDCDialog:accept', function() {
    var drinkname = dialog.querySelector('#drinkname').value;
    var drinktype = dialog.querySelector('#drinktype').value;
    var drinkphoto = dialog.querySelector('#drinkphoto').value;
    var drinkingredients = JSON.parse(dialog.querySelector('#drinkingredients').value);
    that.addDrink({
      available: false,
      name: drinkname,
      type: drinktype,
      photo: drinkphoto,
      ingredients: drinkingredients
    }).then(function() {
      that.rerender();
    });
  });
};

Mixomator9000.prototype.initEditDrinkDialog = function() {
  var dialog = document.querySelector('#dialog-edit-drink');
  this.dialogs.editdrink = new mdc.dialog.MDCDialog(dialog);

  var that = this;
  this.dialogs.editdrink.listen('MDCDialog:accept', function() {
    var drinkid = dialog.querySelector('#drinkid').value;
    var drinkname = dialog.querySelector('#drinkname').value;
    var drinktype = dialog.querySelector('#drinktype').value;
    var drinkphoto = dialog.querySelector('#drinkphoto').value;
    var drinkingredients = JSON.parse(dialog.querySelector('#drinkingredients').value);
    that.updateDrink(drinkid,{
      name: drinkname,
      type: drinktype,
      photo: drinkphoto,
      ingredients: drinkingredients
    }).then(function() {
      that.rerender();
    });
  });
};

Mixomator9000.prototype.initDrinkDetailsDialog = function() {
  var dialog = document.querySelector('#dialog-drink-details');
  this.dialogs.drinkdetails = new mdc.dialog.MDCDialog(dialog);

  var that = this;
  this.dialogs.drinkdetails.listen('MDCDialog:accept', function() {
    var drinkid = dialog.querySelector('#drinkid').value;
    that.sendOrder(drinkid);
  });
};

Mixomator9000.prototype.sendOrder = function(drinkid) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "https://io.adafruit.com/api/v2/"+this.AIOUser+"/feeds/"+this.AIOFeed+"/data", true );
  xmlHttp.setRequestHeader('X-AIO-Key', this.AIOKey);
  xmlHttp.setRequestHeader("Content-Type", "application/json");
  xmlHttp.onreadystatechange = function() {
    if(this.readyState == XMLHttpRequest.DONE) {
      if (this.status == 200) {
        //console.log(xmlHttp.responseText);
        alert('Your order has been sent!');
      }
      else {
        alert('Ooops... Something went wrong and could not send your order.');
      }
    }
  }
  xmlHttp.send('{"value":"'+drinkid+'"}');
};

Mixomator9000.prototype.initEditPumpDialog = function() {
  var dialog = document.querySelector('#dialog-edit-pump');
  this.dialogs.editpump = new mdc.dialog.MDCDialog(dialog);

  var that = this;

  this.dialogs.editpump.listen('MDCDialog:accept', function() {
    var pumpvalue = dialog.querySelector('#pumpvalue').value;
    var pumpid = dialog.querySelector('#pumpid').value;
    that.updatePump(pumpid,pumpvalue).then(function() {
      that.rerender();
    });
  });
};

Mixomator9000.prototype.updateQuery = function(filters) {
  var query_description = '';

  if (filters.type !== '') {
    query_description += filters.type + ' drinks';
  } else {
    query_description += 'all drinks';
  }

  this.viewMenu(filters, query_description);
};

Mixomator9000.prototype.renderTemplate = function(id, data) {
  var template = this.templates[id];
  var el = template.cloneNode(true);
  el.removeAttribute('hidden');
  this.render(el, data);
  return el;
};

Mixomator9000.prototype.render = function(el, data) {
  if (!data) {
    return;
  }

  var that = this;
  var modifiers = {
    'data-fir-foreach': function(tel) {
      var field = tel.getAttribute('data-fir-foreach');
      var values = that.getDeepItem(data, field);

      values.forEach(function (value, index) {
        var cloneTel = tel.cloneNode(true);
        tel.parentNode.append(cloneTel);

        Object.keys(modifiers).forEach(function(selector) {
          var children = Array.prototype.slice.call(
            cloneTel.querySelectorAll('[' + selector + ']')
          );
          children.push(cloneTel);
          children.forEach(function(childEl) {
            var currentVal = childEl.getAttribute(selector);

            if (!currentVal) {
              return;
            }

            childEl.setAttribute(
              selector,
              currentVal.replace('~', field + '/' + index)
            );
          });
        });
      });

      tel.parentNode.removeChild(tel);
    },
    'data-fir-content': function(tel) {
      var field = tel.getAttribute('data-fir-content');
      tel.innerText = that.getDeepItem(data, field);
    },
    'data-fir-click': function(tel) {
      tel.addEventListener('click', function() {
        var field = tel.getAttribute('data-fir-click');
        that.getDeepItem(data, field)();
      });
    },
    'data-fir-if': function(tel) {
      var field = tel.getAttribute('data-fir-if');
      if (!that.getDeepItem(data, field)) {
        tel.style.display = 'none';
      }
    },
    'data-fir-if-not': function(tel) {
      var field = tel.getAttribute('data-fir-if-not');
      if (that.getDeepItem(data, field)) {
        tel.style.display = 'none';
      }
    },
    'data-fir-attr': function(tel) {
      var chunks = tel.getAttribute('data-fir-attr').split(':');
      var attr = chunks[0];
      var field = chunks[1];
      tel.setAttribute(attr, that.getDeepItem(data, field));
    },
    'data-fir-style': function(tel) {
      var chunks = tel.getAttribute('data-fir-style').split(':');
      var attr = chunks[0];
      var field = chunks[1];
      var value = that.getDeepItem(data, field);

      if (attr.toLowerCase() === 'backgroundimage') {
        value = 'url(' + value + ')';
      }
      tel.style[attr] = value;
    }
  };

  var preModifiers = ['data-fir-foreach'];

  preModifiers.forEach(function(selector) {
    var modifier = modifiers[selector];
    that.useModifier(el, selector, modifier);
  });

  Object.keys(modifiers).forEach(function(selector) {
    if (preModifiers.indexOf(selector) !== -1) {
      return;
    }

    var modifier = modifiers[selector];
    that.useModifier(el, selector, modifier);
  });
};

Mixomator9000.prototype.useModifier = function(el, selector, modifier) {
  el.querySelectorAll('[' + selector + ']').forEach(modifier);
};

Mixomator9000.prototype.getDeepItem = function(obj, path) {
  path.split('/').forEach(function(chunk) {
    obj = obj[chunk];
  });
  return obj;
};

Mixomator9000.prototype.replaceElement = function(parent, content) {
  parent.innerHTML = '';
  parent.append(content);
};

Mixomator9000.prototype.rerender = function() {
  this.router.navigate(document.location.pathname + '?' + new Date().getTime());
  //this.router.navigate(document.location.pathname);
};
