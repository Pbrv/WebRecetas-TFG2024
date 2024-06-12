import '../stylesheets/Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="contenedor-footer">
            <div className="footer-links">
                <div className="links-columnas">
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/recetas">Recetas</Link></li>
                    <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
                </div>
                <div className="links-columnas">
                    <li><Link to="/footer-links">Contacto</Link></li>
                    <li><Link to="/footer-links">Blog</Link></li>
                    <li><Link to="/footer-links">FAQ</Link></li>
                </div>
                <div className="links-columnas">
                    <li><Link to="/footer-links">Términos y Condiciones</Link></li>
                    <li><Link to="/footer-links">Política de Privacidad</Link></li>
                </div>
            </div>
            <div className="footer-bio">
                <p>Bienvenidos a nuestra web de recetas, donde encontrarás una variedad de platos deliciosos y fáciles de preparar.</p>
            </div>
            <div className="footer-copyright">
                <p>© жор. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;