import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data
const postsData = [
  {
    id: 1,
    title: "Pelada do dia 28/01 - Goleada histórica!",
    excerpt: "O time verde marcou 12 gols em uma das partidas mais emocionantes da temporada. João Silva brilhou com hat-trick.",
    date: "28 Jan 2025",
    readTime: "5 min",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
  },
  {
    id: 2,
    title: "Defesa do século! Lucas faz milagre",
    excerpt: "Em lance improvável, Lucas Oliveira fez defesa que salvou o empate nos últimos segundos da partida.",
    date: "21 Jan 2025",
    readTime: "4 min",
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
  },
  {
    id: 3,
    title: "Nova temporada começa com tudo",
    excerpt: "Começou a temporada 2025 da Pelada dos Sicks com recorde de público e muitos gols. Confira os melhores momentos.",
    date: "14 Jan 2025",
    readTime: "6 min",
    imageUrl: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
  },
  {
    id: 4,
    title: "Artilheiro do ano é coroado",
    excerpt: "João Silva conquista o título de artilheiro de 2024 com 45 gols. Veja a entrevista exclusiva.",
    date: "31 Dez 2024",
    readTime: "7 min",
    imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",
  },
];

const Posts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-dark opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Calendar className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              Últimas <span className="text-primary">Peladas</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Fique por dentro dos melhores momentos e histórias da pelada
            </p>
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8 p-4 rounded-lg border border-border bg-muted/30 text-center">
            <p className="text-lg font-medium">Em breve</p>
            <p className="text-sm text-muted-foreground">Esta seção está em construção. Os cards abaixo são uma prévia.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-60 pointer-events-none">
            {postsData.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-glow transition-smooth"
              >
                <Link to={`/posts/${post.id}`}>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-smooth">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <Button variant="ghost" className="group-hover:text-primary">
                      Ler mais
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                    </Button>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
};

export default Posts;
