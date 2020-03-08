const create = (collection, newEntity) => {
  return collection.push([newEntity, ...collection]);
};

const update = (collection, newEntity) => {
  return collection.map(entity =>
    entity.id === newEntity.id ? { ...newEntity } : entity
  );
};

const remove = (collection, targetEntity) => {
  return collection.filter(entity => entity.id !== targetEntity.id);
};

const getById = (collection, id) => {
  return collection.find(entity => entity.id === id);
};

const getAll = (collection) => {
  return collection;
};

const search = (collection, searchText) => {
  console.log(collection);
  const searchTextLower = searchText.toLowerCase();
  return collection.filter(entity => {
    let isMatching = false;
    for (const [key, val] of Object.entries(entity)) {
      if (val.toLowerCase().includes(searchTextLower)) {
        isMatching = true;
        break;
      }
    }
    return isMatching;
  });
};
export { create, update, remove, search, getAll, getById };
