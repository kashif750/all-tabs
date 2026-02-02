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
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all px-1.5 py-2 border flex flex-col gap-2 group relative ${isStarred ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>

      {/* Main Row: Icon + Text + Actions */}
      <div className="flex items-center gap-3">

        {/* Icon */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 ${isStarred ? 'bg-amber-100 text-amber-600' : 'bg-primary/20 text-primary-content'}`}>
          {Icon ? <Icon /> : <FaGlobe />}
        </div>

        {/* Label & URL */}
        <div className="flex flex-col overflow-hidden mr-auto min-w-0">
          <Link
            to={url}
            target="_blank"
            className="font-semibold text-slate-700 hover:text-primary-content truncate text-sm leading-tight"
            title={label}
          >
            {label}
          </Link>
          <span className="text-xs text-slate-400 truncate" title={url}>
            {url}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1 shrink-0 self-center">
          {hasCredentials && (
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className={`p-1 rounded-full transition-colors ${showCredentials ? 'text-primary-content bg-primary/10' : 'text-slate-300 hover:text-primary-content'}`}
              title={showCredentials ? "Hide Credentials" : "Show Credentials"}
            >
              {showCredentials ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
            </button>
          )}
          <button
            onClick={() => onToggleStar(id)}
            className={`p-1 rounded-full transition-colors ${isStarred ? 'text-amber-400 hover:text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}
            title={isStarred ? "Unstar" : "Star"}
          >
            {isStarred ? <FaStar size={14} /> : <FaRegStar size={14} />}
          </button>
          <button
            onClick={() => onEdit({ id, label, url, username, password })}
            className="p-1 rounded-full text-slate-300 hover:text-sky-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            title="Edit"
          >
            <FaPen size={12} />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1 rounded-full text-slate-300 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            title="Delete"
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>

      {/* Expanded Credentials View */}
      {showCredentials && hasCredentials && (
        <div className="mt-1 text-xs animate-in fade-in slide-in-from-top-1 duration-200 pl-12">
          {/* Added pl-12 to align with text start (Icon w-9 + gap-3 = 36px + 12px = 48px ~ pl-12) */}
          <div className="flex flex-col gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 shadow-inner">
            {username && (
              <div className="flex justify-between items-center group/creds">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Username</span>
                  <span className="text-slate-600 font-mono select-all text-xs truncate pr-2">{username}</span>
                </div>
                <button onClick={() => copyToClipboard(username)} className="text-slate-400 hover:text-primary-content p-1 shrink-0" title="Copy">
                  <FaCopy size={12} />
                </button>
              </div>
            )}
            {username && password && <div className="h-px bg-slate-200 my-0.5"></div>}
            {password && (
              <div className="flex justify-between items-center group/creds">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</span>
                  <span className="text-slate-600 font-mono text-xs max-w-[140px] truncate">
                    {showPassword ? password : "•••••••••••••"}
                  </span>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-primary-content p-1" title={showPassword ? "Hide" : "Show"}>
                    {showPassword ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                  </button>
                  <button onClick={() => copyToClipboard(password)} className="text-slate-400 hover:text-primary-content p-1" title="Copy">
                    <FaCopy size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkCard;
