import client from "../database/client";

/**
 * Retrieves posts from the database asynchronously.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of post objects.
 */
export async function getPosts() {
  return await client.post.findMany();
}
