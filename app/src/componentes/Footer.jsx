import '../stylesheets/Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className="contenedor-footer">
            <div className="footer-links">
                <div className="links-columnas">
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/recetas">Recetas</Link></li>
                    <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
                </div>
                <div className="links-columnas">
                    <li><Link to="/contacto">Contacto</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                    <li><Link to="/faq">FAQ</Link></li>
                </div>
                <div className="links-columnas">
                    <li><Link to="/terminos">Términos y Condiciones</Link></li>
                    <li><Link to="/privacidad">Política de Privacidad</Link></li>
                </div>
            </div>
            <div className="footer-bio">
                <p>Bienvenidos a nuestra web de recetas, donde encontrarás una variedad de platos deliciosos y fáciles de preparar.</p>
            </div>
            <div className="footer-copyright">
                <p>© жор. Todos los derechos reservados.</p>
            </div>
        </div>
    );
}

export default Footer;