module.exports = (db) => {
  const getInitData = () => ({
    code: 0,
    data: {},
    message: 'ok',
  });

  const create = async (collectionName, data) => new Promise((resolve, reject) => {
    db.collection(collectionName)
      .add({ data })
      .then(resolve)
      .catch(reject);
  });

  const update = async (collectionName, data, condition) => new Promise((resolve, reject) => {
    db.collection(collectionName)
      .where(condition)
      .update({ data })
      .then(resolve)
      .catch(reject);
  });

  const read = async (collectionName, data, condition) => new Promise((resolve, reject) => {
    db.collection(collectionName)
      .where(condition)
      .get()
      .then(resolve)
      .catch(reject);
  });

  const CRUDMap = {
    post: create,
    put: update,
    get: read,
  };

  return {
    getInitData,
    CRUDMap,
  };
};