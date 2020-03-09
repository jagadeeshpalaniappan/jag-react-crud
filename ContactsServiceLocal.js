import { hp, hf, wait } from "./utils/PromiseUtil";
import crudTemplateLocal from "./utils/CrudTemplateLocal";
// const { getAll, getById, create, update, remove, search } = CrudTemplateLocal;

/* ###################### ContactsService:LocalData ###################### */

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
let contacts = DataGenerator.generate(100, mapContact);

/* ###################### ContactsService:Local ###################### */

// updateLocalCollection
const updateLocalCollection = updatedCollection => {
  contacts = updatedCollection;
  return [null, true];
};

// GET:
// const getAll = async () => hp(contacts);
// getAllWithPagination
const getAll = async query => {
  const pageNo = (query && query.pageNo) || 1;
  const pageSize = (query && query.pageSize) || 10;

  const startIdx = (pageNo - 1) * pageSize;
  const endIdx = startIdx + pageSize;

  const pagedContacts = contacts.slice(startIdx, endIdx);
  const contactsResp = {
    meta: { totalRecords: contacts.length, pageNo, pageSize },
    data: pagedContacts
  };

  await wait(10000);

  return [null, contactsResp];
};

const getById = async (...args) =>
  hp(crudTemplateLocal.getById(contacts, ...args));
const search = async (...args) =>
  hp(crudTemplateLocal.search(contacts, ...args));

// MODIFY:
const create = async (...args) =>
  updateLocalCollection(crudTemplateLocal.create(contacts, ...args));
const update = async (...args) =>
  updateLocalCollection(crudTemplateLocal.update(contacts, ...args));
const remove = async (...args) =>
  updateLocalCollection(crudTemplateLocal.remove(contacts, ...args));

export { getAll, getById, search, create, update, remove };
