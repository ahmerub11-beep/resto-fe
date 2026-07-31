import "./App.scss"
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Routes from "@/pages/Routes";
import { ConfigProvider, App as AntApp } from 'antd';
import { useAuth } from "@/context/Auth";
import ScreenLoader from "@/components/ScreenLoader";

const ToastifyHolder = () => {
  const { message } = AntApp.useApp();
  window.toastify = (msg, type = "info") => {
    if (message && typeof message[type] === 'function') {
      message[type](msg);
    } else if (message && typeof message.info === 'function') {
      message.info(msg);
    }
  };
  return null;
}

const App = () => {
  const { isAppLoading } = useAuth()
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1d3557" }, components: { Button: { controlOutline: 0 } } }}>
      <AntApp>
        <ToastifyHolder />
        {!isAppLoading ? <Routes /> : <ScreenLoader />}
      </AntApp>
    </ConfigProvider>
  )
}

export default App