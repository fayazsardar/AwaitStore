import { ToastContainer } from "react-toastify"
import AppRoutes from "./routes/AppRoutes"
import PwaPrompts from "../components/pwa/PwaPrompts"
import InstallBanner from "../components/pwa/InstallBanner"
import OfflineBanner from "../components/pwa/OfflineBanner"


function App() {


  return (
    <>
    <OfflineBanner />
    <AppRoutes />
    <ToastContainer />
    <InstallBanner />
    <PwaPrompts />
    </>
    
    
  )
}

export default App
