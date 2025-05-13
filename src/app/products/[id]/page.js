import React from 'react';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  );
  return posts.map((post) => ({
    id: String(post.id),
  }));
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const post = await fetch(`https://api.vercel.app/blog/${id}`).then((res) =>
    res.json()
  );
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  );
}
