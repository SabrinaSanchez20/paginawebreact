import Footer from './components/footer/footer';
import Nav from './components/nav/nav';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './App.css'
import AppRoutes from './routes/routes';
import AlertasGlobales from './components/alertas/alertas';

function App() {
  return (
    <>
      <Nav />
      <AlertasGlobales />
      <AppRoutes />
      <Footer />
    </>
  )
}

export default App
