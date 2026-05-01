import clsx from "clsx";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
