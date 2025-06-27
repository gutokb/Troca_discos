// Importa o componente da página de perfil e a Navbar para reutilização
import ProfilePage from "../../components/ProfilePage/ProfilePage.jsx";
import Navbar from "/src/components/Navbar/Navbar.jsx";

// Componente que renderiza a página do carrinho (embora use o componente ProfilePage)
// Exibe a Navbar no topo e o conteúdo principal dentro da estrutura de perfil
export default function Cart() {
    return (
        <>
            <Navbar />
            <main className="profile-main">
                <div className="profile-container">
                    {/* Renderiza o componente de perfil (possivelmente para mostrar informações do usuário no carrinho) */}
                    <ProfilePage />
                </div>
            </main>
        </>
    );
}
