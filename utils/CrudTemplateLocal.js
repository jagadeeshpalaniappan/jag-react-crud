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

const search = (collection, searchText) => {
  return collection.filter(
    entity =>
      entity.name.includes(searchText) ||
      entity.email.startsWith(searchText) ||
      entity.mobile.startsWith(searchText) ||
      entity.notes.startsWith(searchText)
  );
};

const getById = (collection, id) => {
  return collection.find(entity => entity.id === id);
};

const getAll = (collection) => {
  return collection;
};

export { create, update, remove, search, getAll, getById };
