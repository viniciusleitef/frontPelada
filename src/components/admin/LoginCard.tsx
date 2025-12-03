import { useState } from "react";
import { ShieldCheck, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

type Props = { onSuccess: () => void };

const LoginCard = ({ onSuccess }: Props) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  async function handleLogin() {
    if (!user.trim() || !pass.trim()) {
      toast("Credenciais inválidas", { description: "Preencha e-mail e senha" });
      return;
    }
    try {
      const data = await api.post<{ access_token: string }>("/auth/login", { email: user.trim(), senha: pass.trim() });
      localStorage.setItem("auth_token", data.access_token);
      toast("Login realizado", { description: "Bem-vindo ao painel administrativo" });
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro de autenticação";
      toast("Erro", { description: msg });
    }
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <CardTitle>Acesso Administrativo</CardTitle>
        </div>
        <CardDescription>Área restrita. Autentique-se para continuar.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm">E-mail</label>
          <Input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Seu e-mail" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Senha</label>
          <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Sua senha" />
        </div>
        <Button onClick={handleLogin} className="w-full">
          <LogIn className="w-4 h-4 mr-2" /> Entrar
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
import { api } from "@/lib/api";
