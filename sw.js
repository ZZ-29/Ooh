// Service Worker do Ooh! — cuida de notificações push em segundo plano

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC9lIJOZDLIyMgKsoq3sIdWkuYFHqKFI3o",
  authDomain: "ooh-notificacoes.firebaseapp.com",
  projectId: "ooh-notificacoes",
  storageBucket: "ooh-notificacoes.firebasestorage.app",
  messagingSenderId: "821455870640",
  appId: "1:821455870640:web:4324f0b08bbc6b1eda3975"
});

var messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  var titulo = (payload.data && payload.data.title) || 'Ooh! Lembrete';
  var corpo = (payload.data && payload.data.body) || '';
  self.registration.showNotification(titulo, {
    body: corpo,
    icon: '/Ooh/icon-512.png',
    badge: '/Ooh/icon-512.png',
    vibrate: [300, 100, 300]
  });
});

self.addEventListener('install', function(event){
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(self.clients.claim());
});
