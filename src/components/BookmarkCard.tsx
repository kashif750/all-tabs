import { useState } from "react";
import { FaCopy, FaEye, FaEyeSlash, FaGlobe, FaTrash, FaStar, FaRegStar, FaPen } from "react-icons/fa";
import { Link } from "react-router";

interface BookmarkCardProps {
  id: string;
  label: string;
  url: string;
  username?: string;
  password?: string;
  icon?: any;
  isStarred?: boolean;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onEdit: (data: any) => void;
}

const BookmarkCard = ({
  id,
  label,
  url,
  username,
  password,
  icon: Icon,
  isStarred = false,
  onDelete,
  onToggleStar,
  onEdit
}: BookmarkCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const hasCredentials = username || password;

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 border flex flex-col gap-3 group relative ${isStarred ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">

        {/* Credentials Toggle (Eye) - Only if credentials exist */}
        {hasCredentials && (
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className={`p-1.5 rounded-full transition-colors ${showCredentials ? 'text-primary-content bg-primary/10' : 'text-slate-300 hover:text-primary-content'}`}
            title={showCredentials ? "Hide Credentials" : "Show Credentials"}
          >
            {showCredentials ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </button>
        )}

        <button
          onClick={() => onToggleStar(id)}
          className={`p-1.5 rounded-full transition-colors ${isStarred ? 'text-amber-400 hover:text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}
          title={isStarred ? "Unstar" : "Star"}
        >
          {isStarred ? <FaStar size={14} /> : <FaRegStar size={14} />}
        </button>

        <button
          onClick={() => onEdit({ id, label, url, username, password })}
          className="p-1.5 rounded-full text-slate-300 hover:text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Edit"
        >
          <FaPen size={12} />
        </button>

        <button
          onClick={() => onDelete(id)}
          className="p-1.5 rounded-full text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete"
        >
          <FaTrash size={12} />
        </button>
      </div>

      <div className="flex items-center gap-3 pr-16">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${isStarred ? 'bg-amber-100 text-amber-600' : 'bg-primary/20 text-primary-content'}`}>
          {Icon ? <Icon /> : <FaGlobe />}
        </div>
        <Link
          to={url}
          target="_blank"
          className="font-semibold text-slate-700 hover:text-primary-content truncate flex-1 block"
          title={url}
        >
          {label}
        </Link>
      </div>

      {/* Expanded Credentials View */}
      {showCredentials && hasCredentials && (
        <div className="mt-2 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 shadow-inner">
            {username && (
              <div className="flex justify-between items-center group/creds">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Username</span>
                  <span className="text-slate-600 font-mono select-all text-sm">{username}</span>
                </div>
                <button onClick={() => copyToClipboard(username)} className="text-slate-400 hover:text-primary-content p-1" title="Copy">
                  <FaCopy />
                </button>
              </div>
            )}
            {username && password && <div className="h-px bg-slate-200 my-0.5"></div>}
            {password && (
              <div className="flex justify-between items-center group/creds">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</span>
                  <span className="text-slate-600 font-mono text-sm max-w-[140px] truncate">
                    {showPassword ? password : "•••••••••••••"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-primary-content p-1" title={showPassword ? "Hide" : "Show"}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button onClick={() => copyToClipboard(password)} className="text-slate-400 hover:text-primary-content p-1" title="Copy">
                    <FaCopy />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer / URL - Only show if not showing credentials to keep card compact, or always show? 
          Option: If credentials shown, maybe URL is less important or can sit below?
          Let's always show URL at bottom for consistency unless collapsed mode requires it.
      */}
      {!showCredentials && (
        <div className="mt-auto pt-1">
          <Link to={url} target="_blank" className="text-xs text-slate-400 hover:text-primary-content truncate block">
            {url}
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookmarkCard;
