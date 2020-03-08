import { hp, hf, wait } from "./utils/PromiseUtil";




/* ###################### ContactsService:LocalData ###################### */
/*
import {
  getAll,
  getById,
  create,
  update,
  remove,
  search
} from "./utils/CrudTemplateLocal";

import DataGenerator from "./utils/DataGenerator";
const mapContact = id => ({
  id,
  firstName: `Person - ${id}`,
  lastName: `C${id}al`,
  email: `user${id}@gmail.com`,
  mobile: `+1 ${id}-456-7890`,
  notes:
    "Lorem ipsum dolor sit amet, consectetur elit. Voluptatibus quia, nulla!",
  tags: ["eat", "code", "sleep"]
});
const contacts = DataGenerator.generate(100, mapContact);

const getAll = () => contacts;
*/

/* ###################### ContactsService:API ###################### */

const REST_ENDPOINT =
  "https://jag-rest-api.firebaseapp.com/api/v1/any/employees";

async function getAll() {
  return hf(fetch(`${REST_ENDPOINT}`));
}

async function getById(id) {
  return hf(fetch(`${REST_ENDPOINT}/${id}`));
}

async function search(url) {
  return hf(fetch(`${REST_ENDPOINT}?${id}`));
}

async function create(contact) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(contact)
  };

  return hf(fetch(`${REST_ENDPOINT}`, options));
}

async function update(contact) {
  const options = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(contact)
  };

  return hp(fetch(`${REST_ENDPOINT}/${contact.id}`, options));
}

async function remove(contact) {
  console.log("deleteContact:", contact.id);
  return hp(fetch(`${REST_ENDPOINT}/${contact.id}`, { method: "DELETE" }));
}

export { create, update, remove, search, getById, getAll };
