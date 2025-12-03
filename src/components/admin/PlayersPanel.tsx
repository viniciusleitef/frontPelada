import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

type Player = {
  id: number;
  nome: string;
  total_gols: number;
  total_assistencias: number;
  total_desarmes: number;
  total_defesas_dificeis: number;
  total_faltas: number;
  total_partidas: number;
};


const PlayersPanel = () => {
  const qc = useQueryClient();
  const [nome, setNome] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [totalGols, setTotalGols] = useState(0);
  const [totalAssistencias, setTotalAssistencias] = useState(0);
  const [totalDesarmes, setTotalDesarmes] = useState(0);
  const [totalDefesasDificeis, setTotalDefesasDificeis] = useState(0);
  const [totalFaltas, setTotalFaltas] = useState(0);
  const [totalPartidas, setTotalPartidas] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editGols, setEditGols] = useState(0);
  const [editAssist, setEditAssist] = useState(0);
  const [editDesarmes, setEditDesarmes] = useState(0);
  const [editDefesas, setEditDefesas] = useState(0);
  const [editFaltas, setEditFaltas] = useState(0);
  const [editPartidas, setEditPartidas] = useState(0);

  const playersQuery = useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: async () => {
      return api.get<Player[]>(`/jogadores/`);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { nome: string; total_gols: number; total_assistencias: number; total_desarmes: number; total_defesas_dificeis: number; total_faltas: number; total_partidas: number }) => {
      return api.post<Player>(`/jogadores/`, payload);
    },
    onSuccess: () => {
      toast("Jogador criado", { description: "Cadastro realizado com sucesso" });
      setNome("");
      setErrorMsg(null);
      setTotalGols(0);
      setTotalAssistencias(0);
      setTotalDesarmes(0);
      setTotalDefesasDificeis(0);
      setTotalFaltas(0);
      setTotalPartidas(0);
      qc.invalidateQueries({ queryKey: ["players"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Não foi possível criar o jogador";
      setErrorMsg(msg);
      toast("Erro ao criar jogador", { description: msg });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: number; nome: string; total_gols: number; total_assistencias: number; total_desarmes: number; total_defesas_dificeis: number; total_faltas: number; total_partidas: number }) => {
      return api.put<Player>(`/jogadores/${payload.id}`, {
        nome: payload.nome,
        total_gols: payload.total_gols,
        total_assistencias: payload.total_assistencias,
        total_desarmes: payload.total_desarmes,
        total_defesas_dificeis: payload.total_defesas_dificeis,
        total_faltas: payload.total_faltas,
        total_partidas: payload.total_partidas,
      });
    },
    onSuccess: () => {
      toast("Jogador atualizado", { description: "Alterações salvas com sucesso" });
      setEditOpen(false);
      setEditError(null);
      setEditPlayer(null);
      qc.invalidateQueries({ queryKey: ["players"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Não foi possível atualizar o jogador";
      setEditError(msg);
      toast("Erro ao atualizar jogador", { description: msg });
    },
  });

  function submit() {
    if (!nome.trim()) {
      toast("Campo obrigatório", { description: "Informe o nome do jogador" });
      return;
    }
    createMutation.mutate({
      nome: nome.trim(),
      total_gols: totalGols,
      total_assistencias: totalAssistencias,
      total_desarmes: totalDesarmes,
      total_defesas_dificeis: totalDefesasDificeis,
      total_faltas: totalFaltas,
      total_partidas: totalPartidas,
    });
  }

  function openEdit(p: Player) {
    setEditPlayer(p);
    setEditNome(p.nome);
    setEditGols(p.total_gols);
    setEditAssist(p.total_assistencias);
    setEditDesarmes(p.total_desarmes);
    setEditDefesas(p.total_defesas_dificeis);
    setEditFaltas(p.total_faltas);
    setEditPartidas(p.total_partidas);
    setEditError(null);
    setEditOpen(true);
  }

  function saveEdit() {
    if (!editPlayer) return;
    if (!editNome.trim()) {
      setEditError("Informe o nome do jogador");
      return;
    }
    updateMutation.mutate({
      id: editPlayer.id,
      nome: editNome.trim(),
      total_gols: editGols,
      total_assistencias: editAssist,
      total_desarmes: editDesarmes,
      total_defesas_dificeis: editDefesas,
      total_faltas: editFaltas,
      total_partidas: editPartidas,
    });
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Gerenciar jogadores</CardTitle>
        <CardDescription>Cadastre e visualize jogadores</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="grid gap-2 md:col-span-2">
              <label className="text-sm">Nome do jogador</label>
              <Input
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                aria-invalid={!!errorMsg}
                className={errorMsg ? "border-destructive focus-visible:ring-destructive" : undefined}
                placeholder="Ex: Vinícius"
              />
              {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
            </div>
            <div className="flex items-end">
              <Button onClick={submit} className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Salvando..." : "Cadastrar"}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <div className="grid gap-2">
              <label className="text-sm">Gols</label>
              <Input type="number" min={0} value={totalGols} onChange={(e) => setTotalGols(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Assistências</label>
              <Input type="number" min={0} value={totalAssistencias} onChange={(e) => setTotalAssistencias(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Desarmes</label>
              <Input type="number" min={0} value={totalDesarmes} onChange={(e) => setTotalDesarmes(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Defesas Difíceis</label>
              <Input type="number" min={0} value={totalDefesasDificeis} onChange={(e) => setTotalDefesasDificeis(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Faltas</label>
              <Input type="number" min={0} value={totalFaltas} onChange={(e) => setTotalFaltas(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Total de Partidas</label>
              <Input type="number" min={0} value={totalPartidas} onChange={(e) => setTotalPartidas(Number(e.target.value))} />
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm">Lista de jogadores</label>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-center">Gols</TableHead>
                  <TableHead className="text-center">Assist.</TableHead>
                  <TableHead className="text-center">Desarmes</TableHead>
                  <TableHead className="text-center">Defesas Difíceis</TableHead>
                  <TableHead className="text-center">Faltas</TableHead>
                  <TableHead className="text-center">Partidas</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playersQuery.isLoading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">Carregando...</TableCell>
                  </TableRow>
                )}
                {playersQuery.isError && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-destructive">Erro ao carregar jogadores</TableCell>
                  </TableRow>
                )}
                {playersQuery.data?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    <TableCell className="text-center">{p.total_gols}</TableCell>
                    <TableCell className="text-center">{p.total_assistencias}</TableCell>
                    <TableCell className="text-center">{p.total_desarmes}</TableCell>
                    <TableCell className="text-center">{p.total_defesas_dificeis}</TableCell>
                    <TableCell className="text-center">{p.total_faltas}</TableCell>
                    <TableCell className="text-center">{p.total_partidas}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => openEdit(p)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {playersQuery.data && playersQuery.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">Nenhum jogador cadastrado.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar jogador</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm">Nome</label>
              <Input
                value={editNome}
                onChange={(e) => {
                  setEditNome(e.target.value);
                  if (editError) setEditError(null);
                }}
                aria-invalid={!!editError}
                className={editError ? "border-destructive focus-visible:ring-destructive" : undefined}
              />
              {editError && <p className="text-sm text-destructive">{editError}</p>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              <div className="grid gap-2">
                <label className="text-sm">Gols</label>
                <Input type="number" min={0} value={editGols} onChange={(e) => setEditGols(Number(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Assistências</label>
                <Input type="number" min={0} value={editAssist} onChange={(e) => setEditAssist(Number(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Desarmes</label>
                <Input type="number" min={0} value={editDesarmes} onChange={(e) => setEditDesarmes(Number(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Defesas Difíceis</label>
                <Input type="number" min={0} value={editDefesas} onChange={(e) => setEditDefesas(Number(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Faltas</label>
                <Input type="number" min={0} value={editFaltas} onChange={(e) => setEditFaltas(Number(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Total de Partidas</label>
                <Input type="number" min={0} value={editPartidas} onChange={(e) => setEditPartidas(Number(e.target.value))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={saveEdit} disabled={updateMutation.isPending}>{updateMutation.isPending ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PlayersPanel;
