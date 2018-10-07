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

Mixomator9000.prototype.addDrink = function(data) {
  var collection = firebase.firestore().collection('drinks');
  return collection.add(data);
};

Mixomator9000.prototype.getAllDrinks = function(render) {
  var query = firebase.firestore()
    .collection('drinks')
    .orderBy('name', 'asc')
    .limit(50);
  this.getDocumentsInQuery(query, render);
};

Mixomator9000.prototype.getDocumentsInQuery = function(query, render) {
  query.onSnapshot(function (snapshot) {
    if (!snapshot.size) {
      return render();
    }

    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'added') {
        render(change.doc);
      }
    });
  });
};

Mixomator9000.prototype.getDrink = function(id) {
  return firebase.firestore().collection('drinks').doc(id).get();
};

Mixomator9000.prototype.getFilteredDrinks = function(filters, render) {
  var query = firebase.firestore().collection('drinks');

  if (filters.type !== 'Any') {
    query = query.where('type', '==', filters.type);
  }

  this.getDocumentsInQuery(query, render);
};
