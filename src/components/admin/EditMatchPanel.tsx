import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Match } from "@/lib/types";

type Props = {
  match?: Match;
  onUpdate: (updated: Match) => void;
  onDelete: (id: string) => void;
};

const EditMatchPanel = ({ match, onUpdate, onDelete }: Props) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Editar estatísticas</CardTitle>
        <CardDescription>Selecione um jogo e ajuste os dados</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {match ? (
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <label className="text-sm">Data</label>
                <Input type="date" value={match.data} onChange={(e) => onUpdate({ ...match, data: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Hora de Início</label>
                <Input type="time" value={match.horarioInicio} onChange={(e) => onUpdate({ ...match, horarioInicio: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Hora de Término</label>
                <Input type="time" value={match.horarioFim} onChange={(e) => onUpdate({ ...match, horarioFim: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">Local</label>
                <Input value={match.local} onChange={(e) => onUpdate({ ...match, local: e.target.value })} />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm">Jogadores</label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-center">Gols</TableHead>
                    <TableHead className="text-center">Assist.</TableHead>
                    <TableHead className="text-center">Desarmes</TableHead>
                    <TableHead className="text-center">Defesas</TableHead>
                    <TableHead className="text-center">Faltas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {match.players.map((p, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Input value={p.name} onChange={(e) => {
                          const updated = { ...match };
                          updated.players[idx].name = e.target.value;
                          onUpdate(updated);
                        }} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input type="number" min={0} value={p.gols} onChange={(e) => {
                          const updated = { ...match } as Match;
                          updated.players[idx].gols = Number(e.target.value);
                          onUpdate(updated);
                        }} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input type="number" min={0} value={p.assistencias} onChange={(e) => {
                          const updated = { ...match } as Match;
                          updated.players[idx].assistencias = Number(e.target.value);
                          onUpdate(updated);
                        }} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input type="number" min={0} value={p.desarmes} onChange={(e) => {
                          const updated = { ...match } as Match;
                          updated.players[idx].desarmes = Number(e.target.value);
                          onUpdate(updated);
                        }} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input type="number" min={0} value={p.defesas} onChange={(e) => {
                          const updated = { ...match } as Match;
                          updated.players[idx].defesas = Number(e.target.value);
                          onUpdate(updated);
                        }} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input type="number" min={0} value={p.faltas} onChange={(e) => {
                          const updated = { ...match } as Match;
                          updated.players[idx].faltas = Number(e.target.value);
                          onUpdate(updated);
                        }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-2">
              <label className="text-sm">Comentários</label>
              <Textarea rows={3} value={match.comentarios || ""} onChange={(e) => onUpdate({ ...match, comentarios: e.target.value })} />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="destructive" onClick={() => onDelete(match.id)}>Excluir jogo</Button>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">Selecione um jogo acima.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditMatchPanel;
