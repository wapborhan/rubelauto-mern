const Loading = ({
  text = "লোড হচ্ছে...",
  size = "md",
  className = "",
  showText = true,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-14 h-14 border-4",
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-6 select-none ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulse */}
        <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-md animate-pulse"></div>

        {/* Dual-Tone Spinner Ring */}
        <div
          className={`${spinnerSize} rounded-full border-blue-100 border-t-blue-600 border-r-indigo-600 animate-spin`}
        ></div>

        {/* Center Accent Dot */}
        <div className="absolute w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
      </div>

      {showText && text && (
        <p className="text-xs font-semibold text-gray-500 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;
