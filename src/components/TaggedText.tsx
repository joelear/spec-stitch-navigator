import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface TaggedTextProps {
  text: string;
  className?: string;
}

export function TaggedText({ text, className = "" }: TaggedTextProps) {
  const navigate = useNavigate();

  const parseText = (text: string) => {
    const tagRegex = /\{\{(screen|ui)\.([^}]+)\}\}/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(text)) !== null) {
      // Add text before the tag
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.index)
        });
      }

      // Add the tag
      parts.push({
        type: "tag",
        tagType: match[1], // 'screen' or 'ui'
        content: match[2], // the name after the dot
        fullMatch: match[0] // the full {{...}} match
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex)
      });
    }

    return parts;
  };

  const handleTagClick = (tagType: string, content: string) => {
    if (tagType === "screen") {
      // Navigate to screens page with filter
      navigate(`/screens?filter=${content}`);
    } else if (tagType === "ui") {
      // Navigate to component detail
      navigate(`/components/${content}`);
    }
  };

  const parts = parseText(text);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === "text") {
          return <span key={index}>{part.content}</span>;
        } else {
          const variant = part.tagType === "screen" ? "secondary" : "outline";
          const bgColor = part.tagType === "screen" 
            ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50" 
            : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50";
          
          return (
            <Badge
              key={index}
              variant={variant}
              className={`cursor-pointer transition-colors mx-1 ${bgColor}`}
              onClick={(e) => {
                e.stopPropagation();
                handleTagClick(part.tagType!, part.content!);
              }}
              title={`${part.tagType}: ${part.content}`}
            >
              {part.tagType}.{part.content}
            </Badge>
          );
        }
      })}
    </span>
  );
}