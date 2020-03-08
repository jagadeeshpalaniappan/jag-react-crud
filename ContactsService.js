

import { getAll, getById, create, update, remove, search } from "./utils/CrudTemplateLocal";

/* ###################### ContactsContainer:LocalData ###################### */
import DataGenerator from "./utils/DataGenerator";
const mapContact = id => ({
  id,
  name: `Person - ${id}`,
  email: `user${id}@gmail.com`,
  mobile: `+1 ${id}-456-7890`,
  notes:
    "Lorem ipsum dolor sit amet, consectetur elit. Voluptatibus quia, nulla!",
  tags: ["eat", "code", "sleep"]
});
const contacts = DataGenerator.generate(100, mapContact);

const getAll = () => contacts;

export { create, update, remove, search, getById, getAll };

