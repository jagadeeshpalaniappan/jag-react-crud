const create = (collection, newEntity) => {
  return collection.push([newEntity, ...collection]);
};

const update = (collection, newEntity) => {
  return collection.map(entity =>
    entity.id === newEntity.id ? { ...newEntity } : entity
  );
};

const remove = (collection, targetEntity) => {
  console.log("remove", targetEntity);
  return collection.filter(entity => entity.id !== targetEntity.id);
};

const getById = (collection, id) => {
  return collection.find(entity => entity.id === id);
};

// TODO: search can be improved
const search = (collection, searchText) => {
  console.log("search:", collection);
  const searchTextLower = searchText.toLowerCase();
  return collection.filter(entity => {
    let isMatching = false;
    for (const [key, val] of Object.entries(entity)) {
      const valStr = typeof val === "string" ? val : val.toString(2);
      if (valStr.toLowerCase().includes(searchTextLower)) {
        isMatching = true;
        break;
      }
    }
    return isMatching;
  });
};

export default { create, update, remove, search, getById };
