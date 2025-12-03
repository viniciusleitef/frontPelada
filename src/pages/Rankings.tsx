import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Trophy, Target, Zap, AlertTriangle, Shield, TrendingUp, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type ApiPlayer = {
  id: number;
  nome: string;
  total_gols: number;
  total_assistencias: number;
  total_desarmes: number;
  total_defesas_dificeis: number;
  total_faltas: number;
  total_partidas: number;
};

type StatType = "gols" | "assistencias" | "desarmes" | "faltas" | "defesas" | "total";

const Rankings = () => {
  const [selectedStat, setSelectedStat] = useState<StatType>("total");
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<ApiPlayer[]>([]);
  const [loading, setLoading] = useState(false);

  const statIcons = {
    gols: Target,
    assistencias: Zap,
    desarmes: Shield,
    faltas: AlertTriangle,
    defesas: Shield,
    total: Trophy,
  };

  const statLabels = {
    gols: "Gols",
    assistencias: "Assistências",
    desarmes: "Desarmes",
    faltas: "Faltas",
    defesas: "Defesas",
    total: "Total",
  };

  function getStatValue(p: ApiPlayer, stat: StatType): number {
    switch (stat) {
      case "gols":
        return p.total_gols || 0;
      case "assistencias":
        return p.total_assistencias || 0;
      case "desarmes":
        return p.total_desarmes || 0;
      case "defesas":
        return p.total_defesas_dificeis || 0;
      case "faltas":
        return p.total_faltas || 0;
      case "total":
        return p.total_partidas || 0;
    }
  }

  const sortedPlayers = [...players]
    .filter((player) => player.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => getStatValue(b, selectedStat) - getStatValue(a, selectedStat));

  useEffect(() => {
    async function loadPlayers() {
      setLoading(true);
      try {
        const data = await api.get<ApiPlayer[]>("/jogadores/");
        setPlayers(Array.isArray(data) ? data : []);
      } catch {}
      setLoading(false);
    }
    loadPlayers();
  }, []);

  const StatIcon = statIcons[selectedStat];

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
            <Trophy className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              Rankings e <span className="text-primary">Estatísticas</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Acompanhe o desempenho dos jogadores em todas as categorias
            </p>
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Buscar jogador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStat} onValueChange={(value) => setSelectedStat(value as StatType)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="total">Total Geral</SelectItem>
                <SelectItem value="gols">Gols</SelectItem>
                <SelectItem value="assistencias">Assistências</SelectItem>
                <SelectItem value="desarmes">Desarmes</SelectItem>
                <SelectItem value="defesas">Defesas</SelectItem>
                <SelectItem value="faltas">Faltas</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8"
          >
            {(Object.keys(statLabels) as StatType[]).map((stat) => {
              const Icon = statIcons[stat];
              return (
                <button
                  key={stat}
                  onClick={() => setSelectedStat(stat)}
                  className={`p-4 rounded-xl border transition-smooth ${
                    selectedStat === stat
                      ? "bg-primary text-white border-primary shadow-glow"
                      : "bg-card border-border hover:border-primary"
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{statLabels[stat]}</p>
                </button>
              );
            })}
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border overflow-hidden shadow-card"
          >
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Jogador</TableHead>
                    <TableHead className="text-center">Gols</TableHead>
                    <TableHead className="text-center">Assist.</TableHead>
                    <TableHead className="text-center">Desarmes</TableHead>
                    <TableHead className="text-center">Defesas</TableHead>
                    <TableHead className="text-center">Faltas</TableHead>
                    <TableHead className="text-center font-bold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPlayers.map((player, index) => (
                    <TableRow key={player.id} className="hover:bg-muted/30 transition-smooth">
                      <TableCell className="font-bold">
                        {index === 0 && (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">
                            1
                          </span>
                        )}
                        {index === 1 && (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground text-sm">
                            2
                          </span>
                        )}
                        {index === 2 && (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground text-sm">
                            3
                          </span>
                        )}
                        {index > 2 && <span className="pl-2">{index + 1}</span>}
                      </TableCell>
                      <TableCell className="font-medium">{player.nome}</TableCell>
                      <TableCell className="text-center">{player.total_gols}</TableCell>
                      <TableCell className="text-center">{player.total_assistencias}</TableCell>
                      <TableCell className="text-center">{player.total_desarmes}</TableCell>
                      <TableCell className="text-center">{player.total_defesas_dificeis}</TableCell>
                      <TableCell className="text-center">{player.total_faltas}</TableCell>
                      <TableCell className="text-center font-bold text-primary">
                        {getStatValue(player, "total")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </motion.div>

          {/* Top 3 Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {loading
              ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)
              : sortedPlayers.slice(0, 3).map((player, index) => (
                  <div
                    key={player.id}
                    className={`p-6 rounded-xl border transition-smooth ${
                      index === 0
                        ? "bg-primary text-white border-primary shadow-glow"
                        : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                          index === 0 ? "bg-white/20" : "bg-primary/10 text-primary"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{player.nome}</h3>
                        <p className={index === 0 ? "text-white/80" : "text-muted-foreground"}>
                          {statLabels[selectedStat]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <StatIcon className="w-8 h-8" />
                      <span className="text-4xl font-bold">{getStatValue(player, selectedStat)}</span>
                    </div>
                  </div>
                ))}
          </motion.div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
};

export default Rankings;
