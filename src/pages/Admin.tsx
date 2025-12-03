import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Settings, Calendar, Newspaper, UserCog, History, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginCard from "@/components/admin/LoginCard";
import NewMatchForm from "@/components/admin/NewMatchForm";
import HistoryTable from "@/components/admin/HistoryTable";
import PlayersPanel from "@/components/admin/PlayersPanel";
import type { Match, Post } from "@/lib/types";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm, useFieldArray } from "react-hook-form";
import { Select as PlayerSelect, SelectContent as PlayerSelectContent, SelectItem as PlayerSelectItem, SelectTrigger as PlayerSelectTrigger, SelectValue as PlayerSelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";

function uid() {
  // @ts-ignore
  return (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`) as string;
}

const LoginView = ({ onSuccess }: { onSuccess: () => void }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <section className="flex-1 flex items-center justify-center bg-muted/30">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <LoginCard onSuccess={onSuccess} />
      </motion.div>
    </section>
    <Footer />
  </div>
);

const Admin = () => {
  const [authed, setAuthed] = useState<boolean>(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [playersCatalog, setPlayersCatalog] = useState<{ id: number; nome: string }[]>([]);
  const [loadingEditPlayers, setLoadingEditPlayers] = useState(false);
  const editForm = useForm<Match>({
    defaultValues: {
      id: "",
      data: "",
      horarioInicio: "",
      horarioFim: "",
      local: "",
      teveArbitro: false,
      custoDoCampo: 0,
      custoDoArbitro: 0,
      custoAdicional: 0,
      custoTotal: 0,
      players: [],
      comentarios: "",
    },
  });
  const editPlayersField = useFieldArray({ control: editForm.control, name: "players" });

  useEffect(() => {
    // Verifica token salvo
    const token = localStorage.getItem("auth_token");
    if (token) {
      api.get("/auth/me")
        .then(() => setAuthed(true))
        .catch(() => setAuthed(false));
    }
    async function fetchPeladas() {
      try {
        const data = await api.get<any[]>("/peladas/");
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
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao carregar partidas";
        toast("Erro", { description: msg });
      }
    }
    fetchPeladas();
  }, []);

  

  async function openEditModal(id: string) {
    const m = matches.find((x) => x.id === id);
    if (!m) return;
    editForm.reset({
      id: m.id,
      data: m.data,
      horarioInicio: m.horarioInicio || "",
      horarioFim: m.horarioFim || "",
      local: m.local || "",
      teveArbitro: !!m.teveArbitro,
      custoDoCampo: m.custoDoCampo || 0,
      custoDoArbitro: m.custoDoArbitro || 0,
      custoAdicional: m.custoAdicional || 0,
      custoTotal: m.custoTotal || 0,
      players: [],
      comentarios: m.comentarios || "",
    });
    setEditOpen(true);
    setLoadingEditPlayers(true);
    try {
      const [playersRes, scoutsRes] = await Promise.all([
        api.get<any[]>("/jogadores/"),
        api.get<any[]>(`/pelada-scouts/by-pelada/${id}`),
      ]);
      let players: { id: number; nome: string }[] = [];
      players = playersRes || [];
      setPlayersCatalog(players);
      if (scoutsRes) {
        const scouts = scoutsRes;
        const initialPlayers = (scouts || []).map((s: any) => {
          const p = players.find((opt) => opt.id === s.jogador_id);
          return {
            playerId: s.jogador_id,
            name: p?.nome || "",
            gols: Number(s.gols || 0),
            assistencias: Number(s.assistencias || 0),
            desarmes: Number(s.desarmes || 0),
            defesas: Number(s.defesas_dificeis || 0),
            faltas: Number(s.faltas || 0),
          };
        });
        editForm.setValue("players", initialPlayers);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingEditPlayers(false);
  }

  async function submitNewMatch(values: Match) {
    try {
      setMatches((prev) => [values, ...prev]);
      toast("Jogo cadastrado", { description: "O jogo foi salvo com sucesso" });
    } finally {
      try {
        const data = await api.get<any[]>("/peladas/");
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
      } catch (e) {
        console.error(e);
      }
    }
  }


  async function removeMatch(id: string) {
    try {
      await api.del(`/peladas/${id}`);
      setMatches((prev) => prev.filter((m) => m.id !== id));
      toast("Jogo removido", { description: "Partida excluída do servidor" });
      try {
        const data = await api.get<any[]>("/peladas/");
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
      } catch (e) {
        console.error(e);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir partida";
      toast("Erro", { description: msg });
    }
  }

  

  function logout() {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        api.post<void>("/auth/logout", {});
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("auth_token");
    setAuthed(false);
    toast("Sessão encerrada", { description: "Você saiu do painel" });
  }

  if (!authed) {
    return <LoginView onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 pt-24 pb-10 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </motion.div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl">Resumo</CardTitle>
              <CardDescription>Visão rápida das atividades</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">{matches.length}</p>
                <p className="text-muted-foreground">Partidas</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{posts.length}</p>
                <p className="text-muted-foreground">Postagens</p>
              </div>
              <div>
                <p className="text-3xl font-bold">—</p>
                <p className="text-muted-foreground">Jogadores</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl">Acesso Rápido</CardTitle>
              <CardDescription>Links úteis para o ADM</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <a href="/rankings" className="inline-flex items-center text-primary hover:underline">
                <Trophy className="w-4 h-4 mr-2" /> Rankings
              </a>
              <a href="/posts" className="inline-flex items-center text-primary hover:underline">
                <Newspaper className="w-4 h-4 mr-2" /> Posts
              </a>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl">Status</CardTitle>
              <CardDescription>Configurações rápidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Autenticação ativa</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="novo" className="mt-10">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="novo" className="mr-2">
              <Calendar className="w-4 h-4 mr-2" /> Cadastrar Jogo
            </TabsTrigger>
            <TabsTrigger value="posts" className="mr-2 opacity-50 pointer-events-none" disabled title="Em breve">
              <Newspaper className="w-4 h-4 mr-2" /> Criar Postagens
            </TabsTrigger>
            <TabsTrigger value="historico" className="mr-2">
              <History className="w-4 h-4 mr-2" /> Histórico de Partidas
            </TabsTrigger>
            <TabsTrigger value="jogadores">
              <UserCog className="w-4 h-4 mr-2" /> Jogadores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="novo" className="mt-6">
            <NewMatchForm onCreate={submitNewMatch} />
          </TabsContent>


          

          <TabsContent value="historico" className="mt-6">
            <HistoryTable matches={matches} onEdit={openEditModal} onDelete={removeMatch} />
          </TabsContent>

          <TabsContent value="jogadores" className="mt-6">
            <PlayersPanel />
          </TabsContent>
        </Tabs>
      </section>

      <Footer />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Editar partida</DialogTitle>
            <DialogDescription>Altere informações da pelada e os scouts dos jogadores</DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-6"
            onSubmit={editForm.handleSubmit(async (values) => {
              if (!values.data) {
                toast("Campo obrigatório", { description: "Preencha a data da partida" });
                return;
              }
              if ((values.players || []).length < 2) {
                toast("Mínimo de jogadores", { description: "Adicione pelo menos 2 jogadores" });
                return;
              }
              const ids = (values.players || [])
                .map((p) => p.playerId)
                .filter((v): v is number => typeof v === "number");
              const uniqueIds = new Set(ids);
              if (ids.length !== uniqueIds.size) {
                toast("Jogadores duplicados", { description: "Remova duplicatas na lista de jogadores" });
                return;
              }
              const custoTotal = (values.custoDoCampo || 0) + (values.custoDoArbitro || 0) + (values.custoAdicional || 0);
              try {
                await api.put(`/peladas/${values.id}`, {
                  data: values.data,
                  horario_inicio: values.horarioInicio || null,
                  horario_fim: values.horarioFim || null,
                  local: values.local || "",
                  teve_arbitro: !!values.teveArbitro,
                  comentarios: values.comentarios || null,
                  custo_do_campo: values.custoDoCampo || 0,
                  custo_do_arbitro: values.custoDoArbitro || 0,
                  custo_adicional: values.custoAdicional || 0,
                  jogadores: (values.players || []).map((p) => ({
                    jogador_id: p.playerId,
                    gols: p.gols || 0,
                    assistencias: p.assistencias || 0,
                    desarmes: p.desarmes || 0,
                    defesas_dificeis: p.defesas || 0,
                    faltas: p.faltas || 0,
                  })),
                });
                const data = await api.get<any[]>("/peladas/");
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
                setEditOpen(false);
                toast("Partida atualizada", { description: "Alterações salvas no servidor" });
              } catch (err) {
                const msg = err instanceof Error ? err.message : "Erro ao atualizar partida";
                toast("Erro", { description: msg });
              }
            })}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <label className="text-sm">Data</label>
                <Input type="date" {...editForm.register("data", { required: true })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Hora de Início</label>
                <Input type="time" {...editForm.register("horarioInicio")} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Hora de Término</label>
                <Input type="time" {...editForm.register("horarioFim")} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm">Local</label>
                <Input placeholder="Ex: Quadra do Centro" {...editForm.register("local")} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Teve árbitro?</label>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={!!editForm.watch("teveArbitro")}
                    onCheckedChange={(v) => {
                      editForm.setValue("teveArbitro", v);
                      if (!v) editForm.setValue("custoDoArbitro", 0);
                    }}
                  />
                  <span className="text-sm text-muted-foreground">{editForm.watch("teveArbitro") ? "Sim" : "Não"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <label className="text-sm">Custo do Campo</label>
                <Input type="number" min={0} step="0.01" {...editForm.register("custoDoCampo", { valueAsNumber: true })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Custo do Árbitro</label>
                <Input type="number" min={0} step="0.01" {...editForm.register("custoDoArbitro", { valueAsNumber: true })} disabled={!editForm.watch("teveArbitro")} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Custo Adicional</label>
                <Input type="number" min={0} step="0.01" {...editForm.register("custoAdicional", { valueAsNumber: true })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Custo Total</label>
                <Input type="number" readOnly value={(
                  (editForm.watch("custoDoCampo") || 0) +
                  (editForm.watch("custoDoArbitro") || 0) +
                  (editForm.watch("custoAdicional") || 0)
                ).toFixed(2)} />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm">Comentários</label>
              <Textarea rows={3} placeholder="Observações gerais da partida" {...editForm.register("comentarios")} />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Jogadores e estatísticas</h3>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const selected = new Set(
                    (editForm.getValues("players") || [])
                      .map((p) => p?.playerId)
                      .filter((v): v is number => typeof v === "number"),
                  );
                  const available = playersCatalog.filter((p) => !selected.has(p.id));
                  if (available.length === 0) {
                    toast("Jogadores esgotados", { description: "Todos os jogadores já foram adicionados" });
                    return;
                  }
                  const first = available[0];
                  editPlayersField.append({ playerId: first.id, name: first.nome, gols: 0, assistencias: 0, desarmes: 0, defesas: 0, faltas: 0 });
                }}
              >
                + Adicionar jogador
              </Button>
            </div>
            <div className="hidden md:grid grid-cols-6 gap-2 px-1">
              <div className="text-xs text-muted-foreground">Jogador</div>
              <div className="text-xs text-muted-foreground text-center">Gols</div>
              <div className="text-xs text-muted-foreground text-center">Assistências</div>
              <div className="text-xs text-muted-foreground text-center">Desarmes</div>
              <div className="text-xs text-muted-foreground text-center">Defesas Difíceis</div>
              <div className="text-xs text-muted-foreground text-center">Faltas / Ações</div>
            </div>
            <div className="grid gap-3">
              {editPlayersField.fields.map((field, idx) => (
                <div key={field.id} className="grid grid-cols-2 md:grid-cols-6 gap-2">
                  <PlayerSelect
                    value={String(editForm.watch(`players.${idx}.playerId`) || "")}
                    onValueChange={(v) => {
                      const id = parseInt(v, 10);
                      if (!id || Number.isNaN(id)) return;
                      const currentId = editForm.getValues(`players.${idx}.playerId`) as number | undefined;
                      const others = new Set(
                        (editForm.getValues("players") || [])
                          .map((p, i) => (i === idx ? null : p?.playerId))
                          .filter((n): n is number => typeof n === "number"),
                      );
                      if (others.has(id)) {
                        toast("Jogador já selecionado", { description: "Escolha outro jogador" });
                        return;
                      }
                      const opt = playersCatalog.find((o) => o.id === id);
                      editForm.setValue(`players.${idx}.playerId`, id, { shouldValidate: true, shouldDirty: true });
                      editForm.setValue(`players.${idx}.name`, opt?.nome || "", { shouldValidate: false, shouldDirty: true });
                    }}
                  >
                    <PlayerSelectTrigger>
                      <PlayerSelectValue placeholder={loadingEditPlayers ? "Carregando..." : "Selecione jogador"} />
                    </PlayerSelectTrigger>
                    <PlayerSelectContent>
                      {playersCatalog.map((opt) => {
                        const currentId = editForm.watch(`players.${idx}.playerId`) as number | undefined;
                        const selectedOthers = new Set(
                          (editForm.watch("players") || [])
                            .map((p, i) => (i === idx ? null : p?.playerId))
                            .filter((n): n is number => typeof n === "number"),
                        );
                        const disabled = selectedOthers.has(opt.id) && currentId !== opt.id;
                        return (
                          <PlayerSelectItem key={opt.id} value={String(opt.id)} disabled={disabled}>
                            {opt.nome}
                          </PlayerSelectItem>
                        );
                      })}
                    </PlayerSelectContent>
                  </PlayerSelect>
                  <Input type="number" min={0} placeholder="Gols" {...editForm.register(`players.${idx}.gols` as const, { valueAsNumber: true })} />
                  <Input type="number" min={0} placeholder="Assist." {...editForm.register(`players.${idx}.assistencias` as const, { valueAsNumber: true })} />
                  <Input type="number" min={0} placeholder="Desarmes" {...editForm.register(`players.${idx}.desarmes` as const, { valueAsNumber: true })} />
                  <Input type="number" min={0} placeholder="Defesas" {...editForm.register(`players.${idx}.defesas` as const, { valueAsNumber: true })} />
                  <div className="flex gap-2">
                    <Input type="number" min={0} placeholder="Faltas" className="flex-1" {...editForm.register(`players.${idx}.faltas` as const, { valueAsNumber: true })} />
                    <Button type="button" variant="ghost" onClick={() => editPlayersField.remove(idx)}>
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar alterações</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
