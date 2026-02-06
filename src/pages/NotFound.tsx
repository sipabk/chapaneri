import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TreeDeciduous } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24 flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <TreeDeciduous className="w-12 h-12 text-primary" />
          </motion.div>
          <h1 className="font-display text-6xl font-bold text-foreground mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            This branch of the family tree hasn't been discovered yet.
          </p>
          <Link to="/">
            <Button size="lg" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
