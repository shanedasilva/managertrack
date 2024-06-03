// pages/index.js
import prisma from "../../lib/database/prisma";

async function getData() {
  const posts = await prisma.post.findMany();

  return posts;
}

export default async function Posts() {
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
