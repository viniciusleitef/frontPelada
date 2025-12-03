import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "@/components/ui/sonner";
import type { Match } from "@/lib/types";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Props = { onCreate: (match: Match) => void };

const NewMatchForm = ({ onCreate }: Props) => {
  const today = new Date().toISOString().slice(0, 10);
  const form = useForm<Match>({
    defaultValues: {
      id: "",
      data: today,
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
  const playersField = useFieldArray({ control: form.control, name: "players" });
  const [playersCatalog, setPlayersCatalog] = useState<{ id: number; nome: string }[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadPlayers() {
      setLoadingPlayers(true);
      try {
        const res = await api.get<{ id: number; nome: string }[]>(`/jogadores/`);
        if (mounted) setPlayersCatalog(res);
      } catch {
      } finally {
        if (mounted) setLoadingPlayers(false);
      }
    }
    loadPlayers();
    return () => {
      mounted = false;
    };
  }, []);

  async function submit(values: Match) {
    if (!values.data) {
      toast("Campo obrigatório", { description: "Preencha a data da partida" });
      return;
    }
    if ((values.players || []).length < 2) {
      toast("Mínimo de jogadores", { description: "Adicione pelo menos 2 jogadores" });
      return;
    }
    const selectedIds = (values.players || []).map((p) => p.playerId).filter((v): v is number => typeof v === "number");
    const uniqueIds = new Set(selectedIds);
    if (selectedIds.length !== uniqueIds.size) {
      toast("Jogadores duplicados", { description: "Remova duplicatas na lista de jogadores" });
      return;
    }
    if ((values.players || []).some((p) => !p.playerId)) {
      toast("Campo obrigatório", { description: "Selecione um jogador para cada linha adicionada" });
      return;
    }
    const custoTotal = (values.custoDoCampo || 0) + (values.custoDoArbitro || 0) + (values.custoAdicional || 0);
    try {
      const saved = await api.post<any>(`/peladas/`, {
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
      const match: Match = {
        ...values,
        id: String(saved.id ?? (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`)),
        custoTotal,
      };
      onCreate(match);
      toast("Jogo cadastrado", { description: "Partida salva no servidor" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar jogo";
      toast("Erro", { description: msg });
      return;
    }
    form.reset({
      id: "",
      data: today,
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
    });
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Cadastrar novo jogo</CardTitle>
        <CardDescription>Preencha os dados e salve</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form onSubmit={form.handleSubmit(submit)} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <label className="text-sm">Data</label>
              <Input type="date" {...form.register("data", { required: true })} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Hora de Início</label>
              <Input type="time" {...form.register("horarioInicio")} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Hora de Término</label>
              <Input type="time" {...form.register("horarioFim")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2 md:col-span-2">
              <label className="text-sm">Local</label>
              <Input placeholder="Ex: Quadra do Centro" {...form.register("local")} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Teve árbitro?</label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={!!form.watch("teveArbitro")}
                  onCheckedChange={(v) => {
                    form.setValue("teveArbitro", v);
                    if (!v) form.setValue("custoDoArbitro", 0);
                  }}
                />
                <span className="text-sm text-muted-foreground">{form.watch("teveArbitro") ? "Sim" : "Não"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="grid gap-2">
              <label className="text-sm">Custo do Campo</label>
              <Input type="number" min={0} step="0.01" {...form.register("custoDoCampo", { valueAsNumber: true })} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Custo do Árbitro</label>
              <Input
                type="number"
                min={0}
                step="0.01"
                {...form.register("custoDoArbitro", { valueAsNumber: true })}
                disabled={!form.watch("teveArbitro")}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Custo Adicional</label>
              <Input type="number" min={0} step="0.01" {...form.register("custoAdicional", { valueAsNumber: true })} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Custo Total</label>
              <Input
                type="number"
                readOnly
                value={(
                  (form.watch("custoDoCampo") || 0) +
                  (form.watch("custoDoArbitro") || 0) +
                  (form.watch("custoAdicional") || 0)
                ).toFixed(2)}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Jogadores e estatísticas</h3>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const selected = new Set(
                    (form.getValues("players") || [])
                      .map((p) => p?.playerId)
                      .filter((v): v is number => typeof v === "number"),
                  );
                  const available = playersCatalog.filter((p) => !selected.has(p.id));
                  if (available.length === 0) {
                    toast("Jogadores esgotados", { description: "Todos os jogadores já foram adicionados" });
                    return;
                  }
                  const first = available[0];
                  playersField.append({ playerId: first.id, name: first.nome, gols: 0, assistencias: 0, desarmes: 0, defesas: 0, faltas: 0 });
                }}
              >
                + Adicionar jogador
              </Button>
            </div>
            <div className="hidden md:grid grid-cols-6 gap-2 px-1">
              <div className="text-xs text-muted-foreground">Jogador</div>
              <div className="text-xs text-muted-foreground">Gols</div>
              <div className="text-xs text-muted-foreground">Assistências</div>
              <div className="text-xs text-muted-foreground">Desarmes</div>
              <div className="text-xs text-muted-foreground">Defesas Difíceis</div>
              <div className="text-xs text-muted-foreground">Faltas</div>
            </div>
            <div className="grid gap-3">
              {playersField.fields.map((field, idx) => (
                <div key={field.id} className="grid grid-cols-2 md:grid-cols-6 gap-2">
                <Select
                  value={String(form.watch(`players.${idx}.playerId`) || "")}
                  onValueChange={(v) => {
                    const id = parseInt(v, 10);
                    if (!id || Number.isNaN(id)) return;
                    const currentId = form.getValues(`players.${idx}.playerId`) as number | undefined;
                    const others = new Set(
                      (form.getValues("players") || [])
                        .map((p, i) => (i === idx ? null : p?.playerId))
                        .filter((n): n is number => typeof n === "number"),
                    );
                    if (others.has(id)) {
                      toast("Jogador já selecionado", { description: "Escolha outro jogador" });
                      return;
                    }
                    const opt = playersCatalog.find((o) => o.id === id);
                    form.setValue(`players.${idx}.playerId`, id, { shouldValidate: true, shouldDirty: true });
                    form.setValue(`players.${idx}.name`, opt?.nome || "", { shouldValidate: false, shouldDirty: true });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingPlayers ? "Carregando..." : "Selecione jogador"} />
                  </SelectTrigger>
                  <SelectContent>
                    {playersCatalog.map((opt) => {
                      const currentId = form.watch(`players.${idx}.playerId`) as number | undefined;
                      const selectedOthers = new Set(
                        (form.watch("players") || [])
                          .map((p, i) => (i === idx ? null : p?.playerId))
                          .filter((n): n is number => typeof n === "number"),
                      );
                      const disabled = selectedOthers.has(opt.id) && currentId !== opt.id;
                      return (
                        <SelectItem key={opt.id} value={String(opt.id)} disabled={disabled}>
                          {opt.nome}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Input type="number" min={0} placeholder="Gols" {...form.register(`players.${idx}.gols` as const, { valueAsNumber: true })} />
                <Input type="number" min={0} placeholder="Assist." {...form.register(`players.${idx}.assistencias` as const, { valueAsNumber: true })} />
                <Input type="number" min={0} placeholder="Desarmes" {...form.register(`players.${idx}.desarmes` as const, { valueAsNumber: true })} />
                <Input type="number" min={0} placeholder="Defesas" {...form.register(`players.${idx}.defesas` as const, { valueAsNumber: true })} />
                <div className="flex gap-2">
                  <Input type="number" min={0} placeholder="Faltas" className="flex-1" {...form.register(`players.${idx}.faltas` as const, { valueAsNumber: true })} />
                  <Button type="button" variant="ghost" onClick={() => playersField.remove(idx)}>
                    Remover
                  </Button>
                </div>
                </div>
              ))}
          </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Comentários</label>
            <Textarea rows={3} placeholder="Observações gerais da partida" {...form.register("comentarios")} />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="submit">Salvar jogo</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewMatchForm;
