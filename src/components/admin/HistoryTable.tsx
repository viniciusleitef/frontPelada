import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import type { Match } from "@/lib/types";

type Props = {
  matches: Match[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const HistoryTable = ({ matches, onEdit, onDelete }: Props) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Histórico de partidas</CardTitle>
        <CardDescription>Lista de jogos cadastrados</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Local</TableHead>
              <TableHead className="text-right">Custo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((m) => (
              <TableRow key={m.id} className="hover:bg-muted/30">
                <TableCell>{m.data || "—"}</TableCell>
                <TableCell>
                  {m.horarioInicio && m.horarioFim ? `${m.horarioInicio} - ${m.horarioFim}` : "—"}
                </TableCell>
                <TableCell>{m.local || "—"}</TableCell>
                <TableCell className="text-right">R$ {Number(m.custoTotal || 0).toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" onClick={() => onEdit(m.id)}>Editar</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Excluir</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir partida</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação removerá a partida, seus scouts e resultado. Deseja continuar?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(m.id)}>Confirmar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {matches.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nenhuma partida cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HistoryTable;
