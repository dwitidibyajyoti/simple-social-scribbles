import { useState } from "react";
import { PostCreator } from "./PostCreator";
import { Post, PostData } from "./Post";

export const Feed = () => {
  const [posts, setPosts] = useState<PostData[]>([
    {
      id: "1",
      author: "John Doe",
      content: "Just finished a great workout! Feeling energized and ready to tackle the rest of the day. 💪 #fitness #motivation",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 12,
      comments: 3
    },
    {
      id: "2", 
      author: "Sarah Wilson",
      content: "Beautiful sunset from my balcony today. Sometimes you just need to pause and appreciate the simple moments in life. 🌅",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      likes: 28,
      comments: 8
    },
    {
      id: "3",
      author: "Mike Johnson", 
      content: "Excited to share that I just launched my new project! It's been months of hard work and I'm grateful for everyone who supported me along the way. 🚀",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      likes: 45,
      comments: 15
    }
  ]);

  const handleNewPost = (content: string) => {
    const newPost: PostData = {
      id: Date.now().toString(),
      author: "You",
      content,
      timestamp: new Date(),
      likes: 0,
      comments: 0
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <PostCreator onPost={handleNewPost} />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};