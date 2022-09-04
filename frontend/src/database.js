import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  get,
  child,
} from "firebase/database";
import { v1 as createUuid } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyCXuopFzicu8GeCSRWAaRD5aXrmNq93viM",
  authDomain: "game-d694e.firebaseapp.com",
  databaseURL: "https://game-d694e-default-rtdb.firebaseio.com",
  projectId: "game-d694e",
  storageBucket: "game-d694e.appspot.com",
  messagingSenderId: "1093121221862",
  appId: "1:1093121221862:web:bdf7ed846ec4fbb41f4727",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function create({ table, noId = false, ...attributes }) {
  const id = createUuid();
  const path = noId ? `${table}/` : `${table}/${id}`;
  console.log(path);
  set(ref(db, path), {
    ...attributes,
  });
}

function updateItem({ table, id, ...attributes }) {
  const path = id ? `${table}/${id}` : `${table}/`;
  const updates = {};
  updates[path] = attributes;
  console.log(updates[path]);
  return update(ref(db), updates);
}

function listen({ table, id, callback, noId = false }) {
  const path = noId ? `${table}/` : `${table}/${id}`;
  console.log(path);
  const docRef = ref(db, path);
  return () => onValue(docRef, (snapshot) => callback(snapshot));
}

function find({ table, id }) {
  const dbRef = ref(db);
  const path = id ? `${table}/${id}` : `${table}/`;
  console.log("find path:", path);
  return get(child(dbRef, path))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.log("asdioasdoihadsihoasdoihoadishiohads");
      console.error(error);
    });
}

export { db, create, listen, updateItem, find };
