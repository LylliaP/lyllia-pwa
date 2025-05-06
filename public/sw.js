self.addEventListener('install', event => {
    console.log('Service worker installed.');
  });
  
  self.addEventListener('fetch', event => {
    // オフライン対応などは必要に応じて後で追加できます
  });
  