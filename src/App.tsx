import Footer from './components/footer/footer';
import Nav from './components/nav/nav';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './App.css'
import AppRoutes from './routes/routes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Nav />
      <AppRoutes />
      <Footer />
    </AuthProvider>
  )
}

export default App
