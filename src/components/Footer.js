import "../styles.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
   
      

        <div className="footer-bottom">
          <p>&copy; {currentYear} MineralTech. Todos los derechos reservados.</p>
        </div>
     
    </footer>
  )
}

export default Footer
