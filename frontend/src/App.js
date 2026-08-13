import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "@/components/landing/Hero";
import Sections from "@/components/landing/Sections";

const Landing = () => (
  <main data-testid="landing-page">
    <Hero />
    <Sections />
  </main>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
