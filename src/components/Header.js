import "../styles.css"

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>MineralTech</h1>
            <p>Extracción y Procesamiento de Minerales</p>
          </div>
          <nav className="main-nav">
            <ul>
              <li>
                <a href="/">Inicio</a>
              </li>
              
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
