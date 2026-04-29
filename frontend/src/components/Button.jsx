import clsx from "clsx";

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus:ring-offset-gray-950";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
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
