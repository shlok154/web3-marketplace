import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ethers } from "ethers";

/* ============================================
   Sidebar
============================================ */

function AppSidebar() {
  const location = useLocation();

  const links = [
    { href: "/", label: "Marketplace" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/upload", label: "Upload" },
    { href: "/wallet", label: "Wallet" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 p-6">
      <h1 className="text-xl font-semibold mb-8">ModelChain</h1>
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.href;

          return (
            <Link
              key={link.href}
              to={link.href}
              className={`block w-full px-4 py-2 rounded-xl transition ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

/* ============================================
   Marketplace
============================================ */

function MarketplacePage() {
  const navigate = useNavigate();

  const models = [
    { id: 1, name: "Sentiment Analyzer Pro", price: "0.8 ETH" },
    { id: 2, name: "VisionNet Edge", price: "1.4 ETH" },
    { id: 3, name: "LLM Mini", price: "2.2 ETH" },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Marketplace</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {models.map((model) => (
          <div
            key={model.id}
            onClick={() => navigate(`/model/${model.id}`)}
            className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-indigo-500 transition"
          >
            <h3 className="text-lg">{model.name}</h3>
            <p className="mt-2">{model.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   Dashboard (Stable Chart)
============================================ */

function DashboardPage() {
  const [withdrawStatus, setWithdrawStatus] = useState<string | null>(null);

  const handleWithdraw = () => {
    setWithdrawStatus("Pending");
    setTimeout(() => setWithdrawStatus("Confirmed"), 2000);
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h3 className="mb-4 text-lg">Monthly Revenue</h3>

        <div className="flex items-end gap-6 h-40">
          <div className="flex flex-col items-center">
            <div className="bg-indigo-500 w-8 h-12 rounded"></div>
            <span className="text-xs mt-2">Jan</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-indigo-500 w-8 h-20 rounded"></div>
            <span className="text-xs mt-2">Feb</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-indigo-500 w-8 h-28 rounded"></div>
            <span className="text-xs mt-2">Mar</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-indigo-500 w-8 h-36 rounded"></div>
            <span className="text-xs mt-2">Apr</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <p>Available Earnings: 1.2 ETH</p>
        <button
          onClick={handleWithdraw}
          className="mt-3 px-4 py-2 bg-indigo-600 rounded-xl"
        >
          Withdraw
        </button>

        {withdrawStatus && (
          <p className="mt-2 text-sm text-green-400">
            Status: {withdrawStatus}
          </p>
        )}
      </div>
    </section>
  );
}

/* ============================================
   Upload
============================================ */

function UploadPage() {
  const [royalty, setRoyalty] = useState(10);
  const [gas, setGas] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setGas((0.003 + Math.random() * 0.002).toFixed(5));
  }, []);

  const deploy = () => {
    setStatus("Pending");
    setTimeout(() => setStatus("Confirmed"), 2000);
  };

  return (
    <section className="space-y-6 max-w-xl">
      <h2 className="text-2xl">Upload Model</h2>
      <div className="bg-zinc-900 p-6 rounded-2xl space-y-4">
        <input
          placeholder="Model Name"
          className="w-full p-3 bg-black rounded-xl"
        />
        <textarea
          placeholder="Description"
          className="w-full p-3 bg-black rounded-xl"
        />

        <div>
          <label className="text-sm">Royalty %</label>
          <input
            type="number"
            value={royalty}
            onChange={(e) => setRoyalty(Number(e.target.value))}
            className="w-full p-3 bg-black rounded-xl mt-1"
          />
        </div>

        <div className="text-sm text-zinc-400">
          Estimated Gas: {gas ? `${gas} ETH` : "Calculating..."}
        </div>

        <button
          onClick={deploy}
          className="w-full py-3 bg-indigo-600 rounded-xl"
        >
          Deploy
        </button>

        {status && (
          <p className="text-sm text-green-400">Status: {status}</p>
        )}
      </div>
    </section>
  );
}

/* ============================================
   Wallet
============================================ */

async function connectWallet(): Promise<string | null> {
  if (!(window as any).ethereum) return null;
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  return signer.getAddress();
}

function WalletPage({
  address,
  setAddress,
}: {
  address: string | null;
  setAddress: any;
}) {
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);

  const connect = async () => {
    const addr = await connectWallet();
    setAddress(addr);

    if (addr && (window as any).ethereum) {
      const provider = new ethers.BrowserProvider(
        (window as any).ethereum
      );
      const bal = await provider.getBalance(addr);
      setBalance(ethers.formatEther(bal));
    }
  };

  const copy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="space-y-6 max-w-md">
      <h2 className="text-2xl">Wallet</h2>

      {address ? (
        <div className="bg-zinc-900 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm break-all">{address}</p>
            <button
              onClick={copy}
              className="text-xs bg-zinc-800 px-2 py-1 rounded"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <p>Balance: {balance ? `${balance} ETH` : "Loading..."}</p>

          <button
            onClick={() => setAddress(null)}
            className="w-full bg-red-600 py-2 rounded-xl"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          className="px-6 py-3 bg-indigo-600 rounded-xl"
        >
          Connect Wallet
        </button>
      )}
    </section>
  );
}

/* ============================================
   Profile
============================================ */

function ProfilePage({ address }: { address: string | null }) {
  return (
    <section className="space-y-6 max-w-3xl">
      <h2 className="text-2xl">Profile</h2>

      <div className="bg-zinc-900 p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3>ModelChain User</h3>
          <span className="text-green-400">✔ Verified Creator</span>
        </div>

        <p>Wallet: {address || "Not Connected"}</p>
      </div>
    </section>
  );
}

/* ============================================
   Model Detail
============================================ */

function ModelDetailPage() {
  return (
    <section className="space-y-6 max-w-3xl">
      <h2 className="text-2xl">Model Detail</h2>
      <div className="bg-zinc-900 p-6 rounded-2xl space-y-3">
        <p>Version: 1.2.0</p>
        <p>IPFS: QmX...demoHash</p>
        <p>License: MIT</p>
        <button className="mt-3 bg-indigo-600 px-4 py-2 rounded-xl">
          Purchase
        </button>
      </div>
    </section>
  );
}

/* ============================================
   App Root
============================================ */

export default function App() {
  const [address, setAddress] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AppSidebar />
      <main className="flex-1 p-10">
        <Routes>
          <Route path="/" element={<MarketplacePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route
            path="/wallet"
            element={
              <WalletPage address={address} setAddress={setAddress} />
            }
          />
          <Route
            path="/profile"
            element={<ProfilePage address={address} />}
          />
          <Route path="/model/:id" element={<ModelDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}
