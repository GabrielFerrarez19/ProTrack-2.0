import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Key, Lock } from "lucide-react";

export function AlterarSenha() {
  const [mostrar, setMostrar] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleAlterarSenha = () => {
    if (novaSenha !== confirmar) return console.log("Senhas não coincidem");
    if (novaSenha.length < 8) return console.log("Senha muito curta");
    console.log("Senha alterada com sucesso");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmar("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Alterar Senha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="senha-atual">Senha Atual</Label>
          <div className="relative">
            <Input
              type={mostrar ? "text" : "password"}
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="Digite sua senha atual"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setMostrar(!mostrar)}
            >
              {mostrar ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div>
          <Label>Nova Senha</Label>
          <Input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
        </div>

        <div>
          <Label>Confirmar Nova Senha</Label>
          <Input
            type="password"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />
        </div>

        <Button onClick={handleAlterarSenha} className="w-full">
          <Lock className="h-4 w-4 mr-2" />
          Alterar Senha
        </Button>
      </CardContent>
    </Card>
  );
}
