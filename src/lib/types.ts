export type PlayerStats = {
  playerId?: number;
  name: string;
  gols: number;
  assistencias: number;
  desarmes: number;
  defesas: number;
  faltas: number;
};

export type Match = {
  id: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  local: string;
  teveArbitro: boolean;
  custoDoCampo: number;
  custoDoArbitro: number;
  custoAdicional: number;
  custoTotal: number;
  players: PlayerStats[];
  comentarios?: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};
