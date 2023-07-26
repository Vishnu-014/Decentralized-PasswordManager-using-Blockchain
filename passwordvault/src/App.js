import { ConnectWallet } from "@thirdweb-dev/react";
import "./styles/Home.css";
import toast, { Toaster } from 'react-hot-toast';
import Login from "./pages/Login";
import { ThirdwebProvider, useContract } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Add from "./pages/Add";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<Add />} />
      </Routes>
    </div>
  );
}
