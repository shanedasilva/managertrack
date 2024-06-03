// pages/index.js
import { getPosts } from "../../server/models/Post";

async function getData() {
  const posts = await getPosts();
  return posts;
}

export default async function Page() {
  const posts = await getData();

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
