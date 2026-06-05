import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/About";
import WhyUs from "@/pages/WhyUs";
import Team from "@/pages/Team";
import Careers from "@/pages/Careers";
import Partners from "@/pages/Partners";
import Blog from "@/pages/Blog";
import BlogAll from "@/pages/BlogAll";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import Solutions from "@/pages/Solutions";
import SolutionDetail from "@/pages/SolutionDetail";
import Industries from "@/pages/Industries";
import NotFound from "@/pages/NotFound";

const AdminRouter = lazy(() => import("@/admin/AdminRouter"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/why-us" element={<WhyUs />} />
      <Route path="/team" element={<Team />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/all" element={<BlogAll />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/solutions/:slug" element={<SolutionDetail />} />
      <Route path="/industries" element={<Industries />} />
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminRouter />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
