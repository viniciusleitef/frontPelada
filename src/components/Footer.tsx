import { Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="gradient-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-xl">PS</span>
              </div>
              <span className="font-bold text-xl">Pelada dos Sicks</span>
            </div>
            <p className="text-white/80">
              A melhor pelada da região. Junte-se a nós todos os domingos para um futebol de alto nível!
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-white/80 hover:text-primary transition-smooth">
                  Início
                </a>
              </li>
              <li>
                <a href="/rankings" className="text-white/80 hover:text-primary transition-smooth">
                  Rankings
                </a>
              </li>
              <li>
                <a href="/posts" className="text-white/80 hover:text-primary transition-smooth">
                  Posts
                </a>
              </li>
            </ul>
          </div>

          {/* Contatos */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contatos</h3>
            <div className="flex gap-4">
              <Button
                size="icon"
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-primary hover:border-primary transition-smooth"
                asChild
              >
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-primary hover:border-primary transition-smooth"
                asChild
              >
                <a
                  href="https://instagram.com/peladadossicks"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60">
          <p>&copy; 2025 Pelada dos Sicks. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
