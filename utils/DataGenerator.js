/* ###################### generate: DATA ###################### */
const MAX_CONTACTS = 10;

const contacts = console.log(contacts);

const generateIds = (max) => {
  var randomIds = new Set();
  while (randomIds.size < MAX_CONTACTS) {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    randomIds.add(randomId);
  }
  return Array.from(randomIds);
};

const generate = (max = MAX_CONTACTS, mapFn) => {
  return generateIds(max).map(mapFn);
};

export default { generate };
