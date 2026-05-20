import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Waitlist from "./Waitlist";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/waitlist" element={<Waitlist />} />
      </Routes>
    </BrowserRouter>
  );
}
