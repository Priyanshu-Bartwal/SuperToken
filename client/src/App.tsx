import {useState, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";
import { ethers } from "ethers";

import { ContextProvider } from "./Context/TokenContext";
import Home from "./Pages/Home";
import AdminPanel from "./Pages/AdminPanel";
import PartnerPanel from "./Pages/PartnerPanel";
import History from './Pages/History'
import abi from "./Contract/abi.json";

export interface contractProp{
  contract: ethers.Contract | null;
}

function App() {
  // const { setContract } = useContext(TokenContext);
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  const contractAddress = "0x227c385a651d764c04f78243996d817b73aa5586";

  useEffect(() => {
    const getContract = ()=>{
      // Getting provider
      const providerURL: string = import.meta.env.VITE_QUICKNODE_URI;
      const provider = ethers.getDefaultProvider(providerURL!);
      // Metamask private key
      const privateKey: string = import.meta.env.VITE_PRIVATE_KEY;
      // Getting signer
      const signer = new ethers.Wallet(privateKey!, provider);
  
      // Getting the deployed contract
      const contract = new ethers.Contract(contractAddress, abi, signer);

      setContract(contract);
    }
    !contract && getContract();

  }, [contract]);

  // Defining router
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home contract={contract}/>} />
        <Route path="/admin" element={<AdminPanel contract={contract}/>} />
        <Route path="/partner" element={<PartnerPanel contract={contract}/>} />
        <Route path="/history" element={<History/>} />
      </Route>
    )
  );

  return (
    <div className="mx-2 sm: lg:mx-10 ">
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </div>
  );
}

function Root() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
