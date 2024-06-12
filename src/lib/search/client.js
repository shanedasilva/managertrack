import algoliasearch from "algoliasearch/lite";

let client;

if (process.env.SEARCH_ENABLED) {
  // Initialize the Algolia client with the given application ID and API key
  client = algoliasearch(
    process.env.ALGOLIA_SEARCH_APP_ID,
    process.env.ALGOLIA_SEARCH_API_KEY
  );
}

/**
 * Creates or updates objects in the specified index.
 *
 * @param {string} indexName - The name of the index.
 * @param {<Object>} object - The objects to be added to the index.
 */
export const createSearchObject = async (indexName, object) => {
  // Initialize the index
  const index = client.initIndex(indexName);

  try {
    await index.saveObject(object);
  } catch (error) {
    console.error("Error creating algolia search object:", error);
  }
};

/**
 * Replaces all objects in the specified index with the given objects.
 *
 * @param {string} indexName - The name of the index.
 * @param {Object} object - The objects to replace the existing objects in the index.
 */
export const updateSearchObject = async (indexName, object) => {
  // Initialize the index
  const index = client.initIndex(indexName);

  try {
    // Replace all objects in the index
    await index.partialUpdateObject(object);
  } catch (error) {
    console.error("Error updating algolia search object:", error);
  }
};

/**
 * Deletes objects from the specified index.
 *
 * @param {string} indexName - The name of the index.
 * @param {Object} object - The  object to be deleted from the index.
 */
export const deleteSearchObjects = async (indexName, object) => {
  // Initialize the index
  const index = client.initIndex(indexName);

  try {
    // Delete objects by their IDs
    await index.deleteObjects([object.id]);
  } catch (error) {
    console.error("Error deleting algolia search object:", error);
  }
};
