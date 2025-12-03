import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, MapPin, Wallet, ShieldCheck } from "lucide-react";
import type { Match } from "@/lib/types";

const History = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [playersCatalog, setPlayersCatalog] = useState<{ id: number; nome: string }[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsMatchId, setDetailsMatchId] = useState<string>("");
  type Scout = { jogador_id: number; gols: number; assistencias: number; desarmes: number; defesas_dificeis: number; faltas: number };
  const [detailsScouts, setDetailsScouts] = useState<Scout[]>([]);
  const [statFilter, setStatFilter] = useState<"todos" | keyof Omit<Scout, "jogador_id">>("todos");
  const [onlyWithValue, setOnlyWithValue] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        try {
          const [peladasData, playersData] = await Promise.all([
            api.get<any[]>("/peladas/"),
            api.get<any[]>("/jogadores/"),
          ]);
          const data = peladasData;
          const mapped: Match[] = (data || []).map((p: any) => {
            const horarioStr = typeof p.horario === "string" ? p.horario : String(p.horario || "");
            const [inicio, fim] = horarioStr.includes("-") ? horarioStr.split("-").map((s: string) => s.trim()) : [horarioStr.trim(), ""];
            return {
              id: String(p.id),
              data: String(p.data),
              horarioInicio: inicio || "",
              horarioFim: fim || "",
              local: p.local || "",
              teveArbitro: !!p.teve_arbitro,
              custoDoCampo: Number(p.custo_do_campo || 0),
              custoDoArbitro: Number(p.custo_do_arbitro || 0),
              custoAdicional: Number(p.custo_adicional || 0),
              custoTotal: Number(p.custo_total || 0),
              players: [],
              comentarios: p.comentarios || "",
            } as Match;
          });
          setMatches(mapped);
          setPlayersCatalog(playersData || []);
        } catch {}
      } catch {}
    }
    load();
  }, []);

  async function openDetails(id: string) {
    setDetailsMatchId(id);
    setDetailsOpen(true);
    try {
      const scouts = await api.get<Scout[]>(`/pelada-scouts/by-pelada/${id}`);
      setDetailsScouts(scouts || []);
    } catch {}
  }

  const selected = matches.find((m) => m.id === detailsMatchId);
  const filteredScouts = (() => {
    const list = [...detailsScouts];
    if (statFilter === "todos") return list;
    const key = statFilter;
    let arr = list.sort((a, b) => (b[key] || 0) - (a[key] || 0));
    if (onlyWithValue) arr = arr.filter((s) => (s[key] || 0) > 0);
    return arr;
  })();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1 pt-24 pb-12 container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Histórico de Partidas</h1>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((m) => (
            <Card key={m.id} className="shadow-card hover:shadow-lg transition-smooth cursor-pointer" onClick={() => openDetails(m.id)}>
              <CardHeader>
                <CardTitle className="text-xl">{m.data}</CardTitle>
                <CardDescription>
                  {m.horarioInicio && m.horarioFim ? `${m.horarioInicio} - ${m.horarioFim}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{m.local || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{m.teveArbitro ? "Com árbitro" : "Sem árbitro"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="w-4 h-4" />
                  <span>R$ {Number(m.custoTotal || 0).toFixed(2)}</span>
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full">Ver detalhes</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {matches.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">Nenhuma partida cadastrada.</div>
          )}
        </div>
      </section>
      <Footer />

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="w-[95vw] sm:max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da partida</DialogTitle>
            <DialogDescription>Informações do jogo e scouts dos jogadores</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-1">
                  <span className="text-sm text-muted-foreground">Data</span>
                  <span className="font-medium">{selected.data}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm text-muted-foreground">Horário</span>
                  <span className="font-medium">{selected.horarioInicio && selected.horarioFim ? `${selected.horarioInicio} - ${selected.horarioFim}` : "—"}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm text-muted-foreground">Local</span>
                  <span className="font-medium">{selected.local || "—"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="grid gap-1">
                  <span className="text-sm text-muted-foreground">Custo do Campo</span>
                  <span className="font-medium">R$ {Number(selected.custoDoCampo || 0).toFixed(2)}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm text-muted-foreground">Custo do Árbitro</span>
                  <span className="font-medium">R$ {Number(selected.custoDoArbitro || 0).toFixed(2)}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm text-muted-foreground">Custo Adicional</span>
                  <span className="font-medium">R$ {Number(selected.custoAdicional || 0).toFixed(2)}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm text-muted-foreground">Custo Total</span>
                  <span className="font-medium">R$ {Number(selected.custoTotal || 0).toFixed(2)}</span>
                </div>
              </div>

              {selected.comentarios && (
                <div className="grid gap-1">
                  <span className="text-sm text-muted-foreground">Comentários</span>
                  <span className="font-medium">{selected.comentarios}</span>
                </div>
              )}

              <div className="grid gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h3 className="text-lg font-semibold">Scouts dos jogadores</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Estatística</label>
                      <Select value={statFilter} onValueChange={(v) => setStatFilter(v as any)}>
                        <SelectTrigger className="w-full sm:w-[220px]">
                          <SelectValue placeholder="Selecionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="gols">Gols</SelectItem>
                          <SelectItem value="assistencias">Assistências</SelectItem>
                          <SelectItem value="desarmes">Desarmes</SelectItem>
                          <SelectItem value="defesas_dificeis">Defesas Difíceis</SelectItem>
                          <SelectItem value="faltas">Faltas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={onlyWithValue} onCheckedChange={setOnlyWithValue} />
                      <span className="text-sm text-muted-foreground">Somente com valor</span>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jogador</TableHead>
                      <TableHead className="text-center">Gols</TableHead>
                      <TableHead className="text-center">Assistências</TableHead>
                      <TableHead className="text-center">Desarmes</TableHead>
                      <TableHead className="text-center">Defesas Difíceis</TableHead>
                      <TableHead className="text-center">Faltas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScouts.map((s, idx) => {
                      const p = playersCatalog.find((pp) => pp.id === s.jogador_id);
                      return (
                        <TableRow key={`${s.jogador_id}-${idx}`}>
                          <TableCell>{p?.nome || `Jogador #${s.jogador_id}`}</TableCell>
                          <TableCell className="text-center">{s.gols || 0}</TableCell>
                          <TableCell className="text-center">{s.assistencias || 0}</TableCell>
                          <TableCell className="text-center">{s.desarmes || 0}</TableCell>
                          <TableCell className="text-center">{s.defesas_dificeis || 0}</TableCell>
                          <TableCell className="text-center">{s.faltas || 0}</TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredScouts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">Nenhum scout encontrado para o filtro selecionado</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
