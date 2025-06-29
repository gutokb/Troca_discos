// Componente React que representa a página de "Acesso negado" (401/403)
// Usado quando um usuário tenta acessar uma rota protegida sem as permissões necessárias
export default function Unauthorized() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>⛔ Acesso negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
    </main>
  );
}
