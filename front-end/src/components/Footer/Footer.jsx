import "./Footer.css";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-section company-info">
                    <div className="footer-logo">
                        <img src="/src/assets/vynil.png" alt="Logo" className="footer-logo-img" />
                        <h3>
                            Troca Discos
                        </h3>
                    </div>
                    <p className="company-description">
                        Sua loja de discos de vinil favorita. Encontre os melhores álbuns clássicos e lançamentos modernos com a melhor qualidade e preços justos.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-link" aria-label="Facebook">
                            <FaFacebook />
                        </a>
                        <a href="#" className="social-link" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="#" className="social-link" aria-label="Twitter">
                            <FaTwitter />
                        </a>
                        <a href="#" className="social-link" aria-label="LinkedIn">
                            <FaLinkedin />
                        </a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4 className="footer-title">Links Rápidos</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/">Catálogo</Link></li>
                        <li><Link to="/profile">Meu Perfil</Link></li>
                        <li><Link to="/shopping-cart">Carrinho</Link></li>
                    </ul>
                </div>

                <div className="footer-section contact-info">
                    <h4 className="footer-title">Contato</h4>
                    <div className="contact-item">
                        <FaMapMarkerAlt className="contact-icon" />
                        <span>
                            Rua Jacinto Pereira, 123<br />
                            São Carlos, SP - 13560-000
                        </span>
                    </div>
                    <div className="contact-item">
                        <FaPhone className="contact-icon" />
                        <span>
                            (16) 99999-9999
                        </span>
                    </div>
                    <div className="contact-item">
                        <FaEnvelope className="contact-icon" />
                        <span>
                            contato@trocadiscos.com.br
                        </span>
                    </div>
                    <div className="business-hours">
                        <h5>Horário de Funcionamento:</h5>
                        <p>Segunda a Sexta: 9h às 18h</p>
                        <p>Sábado: 9h às 14h</p>
                        <p>Domingo: Fechado</p>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>
                        © 2025
                        <strong>Loja Troca Discos</strong>.
                        Todos os direitos reservados.
                    </p>
                    <div className="payment-methods">
                        <span>Formas de Pagamento:</span>
                        <div className="payment-icons">
                            <span className="payment-icon">💳</span>
                            <span className="payment-icon">🏦</span>
                            <span className="payment-icon">📱</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}