import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, Smile } from "lucide-react";
import avatarImage from "@/assets/avatar.jpg";

interface PostCreatorProps {
  onPost: (content: string) => void;
}

export const PostCreator = ({ onPost }: PostCreatorProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim()) {
      onPost(content);
      setContent("");
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarImage} alt="Your avatar" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[60px] resize-none border-none shadow-none text-lg placeholder:text-muted-foreground focus-visible:ring-0"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <ImageIcon className="h-5 w-5 mr-2" />
                Photo
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Smile className="h-5 w-5 mr-2" />
                Feeling
              </Button>
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="bg-primary hover:bg-social-hover"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};