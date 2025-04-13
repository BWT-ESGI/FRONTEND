import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MacbookScroll } from '@/components/ui/macbook-scroll';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { APP_NAME, APP_SLOGAN } from '@/config';
import { useTheme } from '@/hooks/theme-provider';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  const { theme } = useTheme();
  const images = [
    "/demo-1.png",
    "/demo-2.png",
    "/demo-3.png",
    "/demo-1.png",
    "/demo-2.png",
    "/demo-3.png",
    "/demo-1.png",
    "/demo-2.png",
    "/demo-3.png",
    "/demo-1.png",
    "/demo-2.png",
    "/demo-3.png",
    "/demo-1.png",
    "/demo-2.png",
    "/demo-3.png",
    "/demo-1.png",
    "/demo-2.png",
    "/demo-3.png",
    "/demo-1.png",
    "/demo-2.png",
    "/demo-3.png",
    "/demo-1.png",
    "/demo-2.png",
    "/demo-3.png",
    "/demo-1.png",
    "/demo-2.png",
    "/demo-3.png",
    "/demo-1.png",
    "/demo-2.png",
    "/demo-3.png",
  ];
  const imagesDark = [
    "/demo-dark-1.png",
    "/demo-dark-2.png",
    "/demo-dark-3.png",
    "/demo-dark-4.png",
    "/demo-dark-1.png",
    "/demo-dark-2.png",
    "/demo-dark-3.png",
    "/demo-dark-4.png",
    "/demo-dark-1.png",
    "/demo-dark-2.png",
    "/demo-dark-3.png",
    "/demo-dark-4.png",
    "/demo-dark-1.png",
    "/demo-dark-2.png",
    "/demo-dark-3.png",
    "/demo-dark-4.png",
    "/demo-dark-1.png",
    "/demo-dark-2.png",
    "/demo-dark-3.png",
    "/demo-dark-4.png",
    "/demo-dark-1.png",
    "/demo-dark-2.png",
    "/demo-dark-3.png",
    "/demo-dark-4.png",
    "/demo-dark-1.png",
    "/demo-dark-2.png",
    "/demo-dark-3.png",
    "/demo-dark-4.png",
    "/demo-dark-1.png",
    "/demo-dark-2.png",
    "/demo-dark-3.png",
    "/demo-dark-4.png",
  ];
    const words = [
    {
      text: "Gérez",
    },
    {
      text: "vos"
    },
    {
      text: "projets",
    },
    {
      text: "en",
    },
    {
      text: "toute ",
    },
    {
      text: "simplicité",
    },
    {
      text: "avec",
    },
    {
      text: "EduProManager",
      className: "text-emerald-500 dark:text-emerald-500",
    },

  ];
  return (
    <>
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
            Bienvenue sur {APP_NAME}
          </div>
          <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
            {APP_SLOGAN}
          </div>
          <Link to={"/auth/login"}>
            <Button>Démarrer maintenant</Button>
          </Link>
        </motion.div>
      </AuroraBackground>
      <TypewriterEffect words={words} className='mt-8'/>
      <div className="mx-auto my-10 max-w-7xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
        <ThreeDMarquee images={theme === 'dark' ? imagesDark : images} />
      </div>
      <div className="dark:bg-[#0B0B0F] bg-white w-full py-8">
        <MacbookScroll
          title={
            <span>
              Gestion complète de vos projets
              <span className="text-emerald-500">.</span>
              <br />
              <span className="text-gray-500 text-sm">
                Un outil fait pour vous
                <span className="text-emerald-500">.</span>
              </span>
            </span>
          }
          badge={
            <Link to="/auth/login">
              <Badge className="h-10 w-10 transform -rotate-12" />
            </Link>
          }
          src={`/demo-3.png`}
          showGradient={true}
        />
      </div>
      <footer className="py-4 bg-gray-800 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.
        </p>
      </footer>
    </>
  );
}
