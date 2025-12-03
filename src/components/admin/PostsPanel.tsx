import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import type { Post } from "@/lib/types";
import { useState } from "react";

type Props = { posts: Post[]; onCreate: (title: string, content: string) => void };

const PostsPanel = ({ posts, onCreate }: Props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function submit() {
    if (!title.trim() || !content.trim()) {
      toast("Campos obrigatórios", { description: "Preencha título e conteúdo" });
      return;
    }
    onCreate(title.trim(), content.trim());
    setTitle("");
    setContent("");
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Criar postagem</CardTitle>
        <CardDescription>Notícias, recados e avisos</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm">Título</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Aviso importante" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Conteúdo</label>
            <Textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Texto da postagem" />
          </div>
          <div className="flex items-center justify-end">
            <Button onClick={submit}>Publicar</Button>
          </div>
        </div>

        <div className="grid gap-3">
          <h3 className="text-lg font-semibold">Postagens recentes</h3>
          <div className="grid gap-3">
            {posts.map((p) => (
              <Card key={p.id} className="border-muted">
                <CardHeader>
                  <CardTitle className="text-xl">{p.title}</CardTitle>
                  <CardDescription>
                    {new Date(p.createdAt).toLocaleString("pt-BR")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{p.content}</p>
                </CardContent>
              </Card>
            ))}
            {posts.length === 0 && (
              <div className="text-sm text-muted-foreground">Nenhuma postagem criada ainda.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostsPanel;

