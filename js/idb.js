// indexedDB stuff
const indexedDB = self.indexedDB || window.indexedDB;

const request = indexedDB.open('greetings', 1);
let db;

request.onupgradeneeded = () => {
    console.log('onupgradeneeded');
    db = request.result;
    const outBoxStore = db.createObjectStore('outbox', {autoIncrement: true});
    const inBoxStore = db.createObjectStore('inbox', {autoIncrement: true});
};

request.onsuccess = async () => {
    console.log('request onsuccess');
    db = request.result;
/* 
    const ready = await saveData('outbox', {
        username: 'testi',
        greeting: 'hello'
    });
    console.log(`is greeting saved already? ${ready}`); */

    // database errors
    db.onerror = (event) => {
        console.log('Database error: ' + event.target.errorCode);
    };
};

// database connection error
request.onerror = () => {
    console.log('request onerror');
};

const saveData = (storeName, data) => {
    return new Promise((resolve, reject)=>{
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.put(data);
    tx.oncomplete = () => {
        console.log(`${storeName} saved`);
        resolve(true);
    };
    tx.onerror = () => {
        reject('Save data error');
    };
    });
};

const loadData = (storeName) => {
    return new Promise((resolve, reject)=>{
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const query = store.getAll();
    tx.oncomplete = () => {
        console.log(`${storeName} loaded`);
        resolve(query.result);
    };
    tx.onerror = () => {
        reject('Load data error');
    };
    });
};

const clearData = (storeName) => {
    return new Promise((resolve, reject)=>{
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.clear();
    tx.oncomplete = () => {
        console.log(`${storeName} cleared`);
        resolve(true);
    };
    tx.onerror = () => {
        reject('Clear data error');
    };
    });
};
