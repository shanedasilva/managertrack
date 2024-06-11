import algoliasearch from "algoliasearch/lite";

let client;

if (process.env.SEARCH_ENABLED) {
  // Initialize the Algolia client with the given application ID and API key
  client = algoliasearch("latency", "6be0576ff61c053d5f9a3225e2a90f76");
}

/**
 * Creates or updates objects in the specified index.
 *
 * @param {string} indexName - The name of the index.
 * @param {Array<Object>} objects - The array of objects to be added to the index.
 */
export const createSearchObjects = async (indexName, objects) => {
  // Initialize the index
  const index = client.initIndex(indexName);

  try {
    // Save objects with auto-generated IDs if they don't exist
    await index.saveObjects(objects, {
      autoGenerateObjectIDIfNotExist: true,
    });
  } catch (error) {
    console.error("Error creating objects:", error);
  }
};

/**
 * Replaces all objects in the specified index with the given objects.
 *
 * @param {string} indexName - The name of the index.
 * @param {Array<Object>} objects - The array of objects to replace the existing objects in the index.
 */
export const updateSearchObjects = async (indexName, objects) => {
  // Initialize the index
  const index = client.initIndex(indexName);

  try {
    // Replace all objects in the index
    await index.replaceAllObjects(objects);
  } catch (error) {
    console.error("Error updating objects:", error);
  }
};

/**
 * Deletes objects from the specified index.
 *
 * @param {string} indexName - The name of the index.
 * @param {Array<Object>} objects - The array of objects to be deleted from the index.
 */
export const deleteSearchObjects = async (indexName, objects) => {
  // Initialize the index
  const index = client.initIndex(indexName);

  // Extract the IDs of the objects to be deleted
  const idsArray = objects.map(({ id }) => id);

  try {
    // Delete objects by their IDs
    await index.deleteObjects(idsArray);
  } catch (error) {
    console.error("Error deleting objects:", error);
  }
};
