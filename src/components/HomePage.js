import ReportForm from "./ReportForm"
import "../styles.css"

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="report-section">
        <div className="container">
          <h2 className="section-title">Sistema de Reportes</h2>
          <ReportForm />
        </div>
      </section>
    </div>
  )
}

export default HomePage
