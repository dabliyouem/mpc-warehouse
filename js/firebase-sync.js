// MPC/SRC Warehouse - Firebase Realtime Database Sync Engine
(function () {
  'use strict';

  var firebaseApp = null;
  var firebaseDb = null;

  function getEffectiveConfig() {
    // 1. Check window.FIREBASE_CONFIG from js/firebase-config.js
    if (window.FIREBASE_CONFIG && (window.FIREBASE_CONFIG.databaseURL || window.FIREBASE_CONFIG.apiKey)) {
      if (window.FIREBASE_CONFIG.apiKey && window.FIREBASE_CONFIG.apiKey.trim()) {
        return window.FIREBASE_CONFIG;
      }
    }
    // 2. Fallback to localStorage saved via Admin Panel
    try {
      var raw = localStorage.getItem('mpc_firebase_config');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && (parsed.databaseURL || parsed.apiKey || parsed.projectId)) {
          return parsed;
        }
      }
    } catch (e) {}
    return null;
  }

  function initFirebase() {
    var config = getEffectiveConfig();
    if (!config || typeof firebase === 'undefined') {
      return null;
    }
    try {
      if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(config);
      } else {
        firebaseApp = firebase.apps[0];
      }
      firebaseDb = firebase.database();
      return firebaseDb;
    } catch (e) {
      console.warn('Firebase init error:', e);
      return null;
    }
  }

  window.WarehouseCloud = {
    isConfigured: function () {
      var cfg = getEffectiveConfig();
      return !!(cfg && (cfg.databaseURL || cfg.apiKey));
    },
    getConfig: function () {
      return getEffectiveConfig();
    },
    saveConfig: function (configObj) {
      try {
        localStorage.setItem('mpc_firebase_config', JSON.stringify(configObj));
        firebaseDb = null;
        return !!initFirebase();
      } catch (e) {
        return false;
      }
    },
    clearConfig: function () {
      localStorage.removeItem('mpc_firebase_config');
      firebaseDb = null;
    },
    listenToProducts: function (callback) {
      var db = firebaseDb || initFirebase();
      if (!db) return;
      try {
        db.ref('products').on('value', function (snapshot) {
          var val = snapshot.val();
          if (val) {
            var arr = [];
            if (Array.isArray(val)) {
              arr = val.filter(Boolean);
            } else if (typeof val === 'object') {
              arr = Object.keys(val).map(function (k) { return val[k]; });
            }
            if (arr.length > 0) {
              try {
                localStorage.setItem('mpc_warehouse_products', JSON.stringify(arr));
              } catch (e) {}
              if (typeof callback === 'function') callback(arr);
            }
          }
        });
      } catch (e) {
        console.warn('Firebase listen error:', e);
      }
    },
    getProductsOnce: function () {
      var db = firebaseDb || initFirebase();
      if (!db) return Promise.resolve(null);
      return db.ref('products').once('value').then(function (snapshot) {
        var val = snapshot.val();
        if (!val) return null;
        if (Array.isArray(val)) return val.filter(Boolean);
        return Object.keys(val).map(function (k) { return val[k]; });
      });
    },
    saveProduct: function (product) {
      var db = firebaseDb || initFirebase();
      if (!db || !product || !product.id) return Promise.resolve(false);
      return db.ref('products/' + product.id).set(product);
    },
    deleteProduct: function (productId) {
      var db = firebaseDb || initFirebase();
      if (!db || !productId) return Promise.resolve(false);
      return db.ref('products/' + productId).remove();
    },
    updateQte: function (productId, qte) {
      var db = firebaseDb || initFirebase();
      if (!db || !productId) return Promise.resolve(false);
      return db.ref('products/' + productId + '/qte').set(qte);
    },
    syncAllProducts: function (productsList) {
      var db = firebaseDb || initFirebase();
      if (!db || !Array.isArray(productsList)) {
        return Promise.reject(new Error('Firebase Database not connected'));
      }
      var map = {};
      for (var i = 0; i < productsList.length; i++) {
        var p = productsList[i];
        if (p && p.id) map[p.id] = p;
      }
      return db.ref('products').set(map);
    }
  };

  // Run initial setup if SDK is already loaded
  if (typeof window !== 'undefined') {
    initFirebase();
  }
})();
