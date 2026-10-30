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
    <ToastContainer
      position="top-center"
      autoClose={2500}
      hideProgressBar
      newestOnTop
      limit={2}
      closeButton={false}
    />
    <InstallBanner />
    <PwaPrompts />
    </>
    
    
  )
}

export default App
