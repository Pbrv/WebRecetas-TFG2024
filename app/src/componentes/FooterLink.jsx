import '../stylesheets/Footer.css';
import { Link } from 'react-router-dom';

function FooterLink() {
    return (
        <div className="contenedor-footerLinks">
            <section className="footer-link-section">
                <h2>Contacto</h2>
                <p>Para cualquier consulta, puedes contactarnos a través de nuestro correo electrónico:</p>
                <h4>pilarimanol27@gmail.com</h4>
            </section>
            <section className="footer-link-section">
                <h2>Blog</h2>
                <p>Visita nuestro <Link to="/blog">Blog</Link> para estar al tanto de las últimas noticias y actualizaciones.</p>
            </section>
            <section className="footer-link-section">
                <h2>FAQ</h2>
                <p>Encuentra respuestas a las preguntas más frecuentes en nuestra <Link to="/faq">sección de FAQ</Link>.</p>
            </section>
            <section className="footer-link-section">
                <h2>Términos y Condiciones</h2>
                <p>Lee nuestros <Link to="/terminos-y-condiciones">Términos y Condiciones</Link> para entender nuestras políticas y procedimientos.</p>
            </section>
            <section className="footer-link-section">
                <h2>Política de Privacidad</h2>
                <p>Conoce cómo manejamos tu información personal en nuestra <Link to="/politica-de-privacidad">Política de Privacidad</Link>.</p>
            </section>
        </div>

    );
}

export default FooterLink;