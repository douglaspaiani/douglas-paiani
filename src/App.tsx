/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import ScrollToTop from "@/src/components/ScrollToTop";
import WhatsappFlutuante from "@/src/components/WhatsappFlutuante";
import Inicio from "@/src/pages/Inicio";
import Sobre from "@/src/pages/Sobre";
import Projetos from "@/src/pages/Projetos";
import Sites from "@/src/pages/servicos/Sites";
import LojasVirtuais from "@/src/pages/servicos/LojasVirtuais";
import Aplicativos from "@/src/pages/servicos/Aplicativos";
import Plataformas from "@/src/pages/servicos/Plataformas";
import Blog from "@/src/pages/Blog";
import BlogPost from "@/src/pages/BlogPost";
import Privacidade from "@/src/pages/Privacidade";
import Termos from "@/src/pages/Termos";

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Posts from './pages/admin/Posts';
import PostEditor from './pages/admin/PostEditor';
import Categories from './pages/admin/Categories';
import Profile from './pages/admin/Profile';
import Orcamentos from './pages/admin/Orcamentos';

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <WhatsappFlutuante />
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><Inicio /><Footer /></>} />
            <Route path="/sobre" element={<><Navbar /><Sobre /><Footer /></>} />
            <Route path="/projetos" element={<><Navbar /><Projetos /><Footer /></>} />
            <Route path="/servicos/sites" element={<><Navbar /><Sites /><Footer /></>} />
            <Route path="/servicos/lojas-virtuais" element={<><Navbar /><LojasVirtuais /><Footer /></>} />
            <Route path="/servicos/aplicativos" element={<><Navbar /><Aplicativos /><Footer /></>} />
            <Route path="/servicos/plataformas" element={<><Navbar /><Plataformas /><Footer /></>} />
            <Route path="/blog" element={<><Navbar /><Blog /><Footer /></>} />
            <Route path="/blog/:slug" element={<><Navbar /><BlogPost /><Footer /></>} />
            <Route path="/privacidade" element={<><Navbar /><Privacidade /><Footer /></>} />
            <Route path="/termos" element={<><Navbar /><Termos /><Footer /></>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/orcamentos" element={<Orcamentos />} />
            <Route path="/admin/posts" element={<Posts />} />
            <Route path="/admin/posts/new" element={<PostEditor />} />
            <Route path="/admin/posts/edit/:id" element={<PostEditor />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}
