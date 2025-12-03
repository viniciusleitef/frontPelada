import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users, Target, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "@/components/StatCard";
import DirectorCard from "@/components/DirectorCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

type InicioResumo = {
  total_peladas: number;
  jogadores_ativos: number;
  total_gols: number;
};

const Index = () => {
  const [resumo, setResumo] = useState<InicioResumo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadResumo() {
      setLoading(true);
      try {
        const data = await api.get<InicioResumo>("/inicio/");
        if (isMounted) setResumo(data);
      } catch {}
      if (isMounted) setLoading(false);
    }
    loadResumo();
    return () => {
      isMounted = false;
    };
  }, []);

  function format(n: number | undefined) {
    return (n ?? 0).toLocaleString("pt-BR");
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background com gradiente */}
        <div className="absolute inset-0 gradient-dark opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-white"
            >
              Pelada dos <span className="text-primary">Sicks</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto"
            >
              Todos os domingos, os melhores jogadores se reúnem para disputar partidas épicas. 
              Acompanhe as estatísticas, rankings e momentos inesquecíveis!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/rankings">
                <Button size="lg" className="shadow-glow text-lg">
                  <Trophy className="mr-2" />
                  Ver Rankings
                </Button>
              </Link>
              <Link to="/historico">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white text-lg">
                  <Calendar className="mr-2" />
                  Últimas Peladas
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-10 w-64 h-64 rounded-full gradient-hero opacity-10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-10 w-64 h-64 rounded-full gradient-hero opacity-10 blur-3xl"
        />
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Números da <span className="text-primary">Pelada</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full gradient-hero shadow-glow" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full gradient-hero shadow-glow" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full gradient-hero shadow-glow" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <StatCard icon={Calendar} title="Peladas Realizadas" value={format(resumo?.total_peladas)} delay={0.1} />
                <StatCard icon={Users} title="Jogadores Ativos" value={format(resumo?.jogadores_ativos)} delay={0.2} />
                <StatCard icon={Target} title="Gols Marcados" value={format(resumo?.total_gols)} delay={0.3} />
              </>
            )}
          </div>
        </div>
      </section>
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Nossa <span className="text-primary">Organização</span>
          </motion.h2>

          <div className="relative overflow-hidden">
            {(() => {
              const equipe = [
                { name: "Suderley Filho", role: "CEO", imageUrl: "https://i.imgur.com/wFkswTk.png" },
                { name: "Vinícius Leite", role: "Vice-CEO e Diretor de tecnologia", imageUrl: "https://i.imgur.com/5kfBra5.png" },
                { name: "Thales Ramalho", role: "Diretor de Competições", imageUrl: "https://i.imgur.com/yvXROIy.png" },
                { name: "Ryan Duarte", role: "Tesoureiro", imageUrl: "https://i.imgur.com/CGmF5Rl.png" },
                { name: "Eduardo Henrique", role: "Diretor de Mídias Digitais", imageUrl: "https://i.imgur.com/MKb5PZj.png" },
                { name: "Miguel Bezerra", role: "Diretor Jurídico", imageUrl: "https://i.imgur.com/HUKFh7U.png" },
                { name: "João manoel", role: "Diretor de Saúde e Performance", imageUrl: "https://i.imgur.com/WBPvG3o.png" },
              ];
              const items = [...equipe, ...equipe];
              return (
                <motion.div
                  className="flex items-center gap-8 min-w-[200%]"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  {items.map((m, idx) => (
                    <div key={`${m.name}-${idx}`} className="shrink-0">
                      <DirectorCard name={m.name} role={m.role} imageUrl={m.imageUrl} />
                    </div>
                  ))}
                </motion.div>
              );
            })()}
          </div>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6"
            >
              Sobre a <span className="text-primary">Pelada dos Sicks</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Fundada em 2025, a Pelada dos Sicks nasceu da paixão de amigos pelo futebol. 
              O que começou como um simples encontro aos domingos se transformou em uma tradição 
              com jogadores dedicados, estatísticas detalhadas e momentos inesquecíveis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="p-6 rounded-xl bg-card border border-border">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold text-xl mb-2">Evolução Constante</h3>
                <p className="text-muted-foreground">
                  Acompanhamos cada jogo e evolução dos jogadores
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold text-xl mb-2">Fair Play</h3>
                <p className="text-muted-foreground">
                  Valorizamos o respeito e o espírito esportivo
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold text-xl mb-2">Comunidade</h3>
                <p className="text-muted-foreground">
                  Mais que um jogo, somos uma família
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
