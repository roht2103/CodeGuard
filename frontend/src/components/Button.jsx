import clsx from "clsx";

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus:ring-offset-[#0B1120]";

  const variants = {
    primary:
      "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 border border-transparent dark:border-white",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-[#111827] dark:text-gray-100 dark:hover:bg-[#1f2937] border border-transparent dark:border-white/10",
    outline:
      "border border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/5",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-lg",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
