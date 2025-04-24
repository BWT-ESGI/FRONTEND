import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
  }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
  }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: idx * 0.05 } }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900"
                    )}
                  >
                    <div className="h-4 w-4">{item.icon}</div>
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full"
                    )}
                  >
                    <div className="h-4 w-4">{item.icon}</div>
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
  }[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn("mx-auto hidden h-16 gap-4 md:flex", className)}
    >
      {items.map((item) => (
        <IconContainer
          key={item.title}
          mouseX={mouseX}
          title={item.title}
          icon={item.icon}
          href={item.href}
          onClick={item.onClick}
        />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(
    mouseX,
    (val) =>
      val -
      (ref.current?.getBoundingClientRect().x ?? 0) -
      (ref.current?.getBoundingClientRect().width ?? 0) / 2
  );
  const width = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );
  const height = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );
  const widthIconSpring = useSpring(
    useTransform(distance, [-150, 0, 150], [20, 40, 20]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );
  const heightIconSpring = useSpring(
    useTransform(distance, [-150, 0, 150], [20, 40, 20]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );
  const [hovered, setHovered] = useState(false);

  return (
    <div>
      {onClick ? (
        <motion.div
          ref={ref}
          style={{ width, height }}
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "relative flex aspect-square items-center justify-center rounded-full cursor-pointer bg-card border dark:bg-neutral-800 dark:border-neutral-800"
          )}
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 2, x: "-50%" }}
                className="absolute -top-8 left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
              >
                {title}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            style={{ width: widthIconSpring, height: heightIconSpring }}
            className="flex items-center justify-center"
          >
            {icon}
          </motion.div>
        </motion.div>
      ) : (
        <a href={href}>
          <motion.div
            ref={ref}
            style={{ width, height }}
            className={cn(
              "relative flex aspect-square items-center justify-center rounded-full border bg-card dark:bg-neutral-800 dark:border-neutral-800"
            )}
          >
            {icon}
          </motion.div>
        </a>
      )}
    </div>
  );
}
