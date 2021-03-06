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

/**
 * Initializes the app.
 */
function Mixomator9000() {
  this.filters = {
    type: '',
  };

  this.dialogs = {};

  var that = this;

  const storageService = firebase.storage();
  this.storageRef = storageService.ref();

  firebase.firestore().settings({
    timestampsInSnapshots: true
  });

  firebase.firestore().enablePersistence()
    .then(function() {
      return firebase.auth().signInAnonymously();
    })
    .then(function() {
      that.initTemplates();
      that.initRouter();
      that.initFilterDialog();
      that.initAddDrinkDialog();
      that.initEditPumpDialog();
      that.initEditDrinkDialog();
      that.initDrinkDetailsDialog();
    }).catch(function(err) {
      console.log(err);
    });
}

/**
 * Initializes the router for the app.
 */
Mixomator9000.prototype.initRouter = function() {
  this.router = new Navigo();

  var that = this;
  this.router
    .on({
      '/order': function() {
        that.updateQuery(that.filters);
      }
    })
    .on({
      '/drinks': function() {
        that.viewDrinks();
      }
    })
    .on({
      '/setup': function() {
        that.viewSetup();
      }
    })
    .on({
      '/drinks/*': function() {
        var path = that.getCleanPath(document.location.pathname);
        var id = path.split('/')[2];
        that.viewDrink(id);
      }
    })
    .on({
      '/pumps': function() {
        that.viewPumps();
      }
    })
    .on({
      '/clean': function() {
        that.viewClean();
      }
    })
    .resolve();

  firebase
    .firestore()
    .collection('drinks')
    .limit(1)
    .onSnapshot(function(snapshot) {
      if (snapshot.empty) {
        that.router.navigate('/setup');
      }
    });
};

Mixomator9000.prototype.getCleanPath = function(dirtyPath) {
  if (dirtyPath.startsWith('/order.html')) {
    return dirtyPath.split('/').slice(1).join('/');
  } else {
    return dirtyPath;
  }
};

Mixomator9000.prototype.getFirebaseConfig = function() {
  return firebase.app().options;
};

Mixomator9000.prototype.getRandomItem = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

Mixomator9000.prototype.data = {
  type: [
    'alcoholic',
    'nonalcoholic'
  ]
};

window.onload = function() {
  window.app = new Mixomator9000();
};
