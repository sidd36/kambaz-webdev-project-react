import Kambaz from "./Kambaz";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import store from "./Kambaz/store";
import { Provider } from "react-redux";
export default function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="Kambaz" />} />
            <Route path="/Kambaz/*" element={<Kambaz />} />
          </Routes>
        </div>
      </HashRouter>
    </Provider>
  );
}
