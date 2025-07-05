import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share, MoreHorizontal, Send, Reply } from "lucide-react";
import avatarImage from "@/assets/avatar.jpg";
import axios from 'axios';

export interface CommentData {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  replies?: CommentData[];
  _id?: string;
  text?: string;
  createdAt?: string;
  children?: CommentData[];
}

export interface PostData {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
}

interface PostProps {
  post: PostData;
}

interface CommentProps {
  comment: CommentData;
  onAddReply: (parentId: string, reply: CommentData) => void;
  level?: number;
}

const Comment = ({ comment, onAddReply, level = 0 }: CommentProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleAddReply = async () => {
    if (!replyText.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/comments', {
        postId: comment.postId || '1', // You might need to pass postId to comment
        text: replyText.trim(),
        parentId: comment._id || comment.id,
      });

      const savedReply = response.data;

      const reply: CommentData = {
        id: savedReply._id,
        author: "You",
        content: savedReply.text,
        timestamp: new Date(savedReply.createdAt),
        _id: savedReply._id,
        text: savedReply.text,
        createdAt: savedReply.createdAt,
      };

      onAddReply(comment._id || comment.id, reply);
      setReplyText("");
      setShowReplyInput(false);
    } catch (err) {
      console.error('Failed to add reply:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddReply();
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  // Use text field from API or fallback to content
  const commentContent = comment.text || comment.content;
  const commentId = comment._id || comment.id;

  console.log(`c`, comment.children);



  return (
    <div className={`${level > 0 ? 'ml-8' : ''}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarImage} alt={comment.author} />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <p className="font-semibold text-sm text-foreground">{comment.author}</p>
              <p className="text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</p>
            </div>
            <p className="text-sm text-foreground">{commentContent}</p>
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-xs text-muted-foreground hover:text-primary p-1 h-auto"
              >
                {typeof comment.children !== 'undefined' && (
                  <>
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3">
              <div className="flex items-start space-x-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={avatarImage} alt="You" />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[60px] resize-none text-sm"
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowReplyInput(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddReply}
                      disabled={!replyText.trim()}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {(comment.children && comment.children.length > 0) && (
        <div className="mt-3 space-y-3">
          {comment.children.map((reply) => (
            <Comment
              key={reply._id || reply.id}
              comment={reply}
              onAddReply={onAddReply}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Post = ({ post }: PostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch comments when component mounts or when comments section is opened
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, post.id]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/comments/${post.id}`);
      const apiComments = response.data.map((comment: any) => ({
        id: comment._id,
        author: "User", // You might want to fetch user data separately
        content: comment.text,
        timestamp: new Date(comment.createdAt),
        _id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        children: comment.children?.map((child: any) => ({
          id: child._id,
          author: "User",
          content: child.text,
          timestamp: new Date(child.createdAt),
          _id: child._id,
          text: child.text,
          createdAt: child.createdAt,
        })) || [],
      }));
      setComments(apiComments);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/comments', {
        postId: post.id,
        text: newComment.trim(),
        parentId: null, // root comment
      });

      const savedComment = response.data;

      const comment: CommentData = {
        id: savedComment._id,
        author: "You",
        content: savedComment.text,
        timestamp: new Date(savedComment.createdAt),
        _id: savedComment._id,
        text: savedComment.text,
        createdAt: savedComment.createdAt,
      };

      // setComments(prev => [comment, ...prev]);
      fetchComments(); // Refresh comments after adding a new one
      setNewComment("");
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleAddReply = (parentId: string, reply: CommentData) => {
    setComments(prev =>
      prev.map(comment => {
        if (comment._id === parentId || comment.id === parentId) {
          return {
            ...comment,
            children: [...(comment.children || []), reply]
          };
        }
        return comment;
      })
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  console.log(`comments`, comments);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarImage} alt={post.author} />
              <AvatarFallback>{post.author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{post.author}</p>
              <p className="text-sm text-muted-foreground">{formatTimestamp(post.timestamp)}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        <p className="text-foreground leading-relaxed">{post.content}</p>
      </div>

      {/* Post Stats */}
      {(likeCount > 0 || post.comments > 0) && (
        <div className="px-4 py-2 text-sm text-muted-foreground border-b">
          <div className="flex items-center justify-between">
            {likeCount > 0 && (
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                {likeCount}
              </span>
            )}
            {comments.length > 0 && (
              <span>{comments.length} comment{post.comments !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="p-2">
        <div className="flex justify-around">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex-1 py-3 ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-primary'}`}
          >
            <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            Like
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCommentClick}
            className={`flex-1 py-3 ${showComments ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 py-3 text-muted-foreground hover:text-primary">
            <Share className="h-5 w-5 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t">
          {/* Comment Input */}
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarImage} alt="You" />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || loading}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          {loading ? (
            <div className="px-4 pb-4 text-center text-muted-foreground">
              Loading comments...
            </div>
          ) : comments.length > 0 ? (
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Comment
                    key={comment._id || comment.id}
                    comment={comment}
                    onAddReply={handleAddReply}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 pb-4 text-center text-muted-foreground">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      )}
    </Card>
  );
};