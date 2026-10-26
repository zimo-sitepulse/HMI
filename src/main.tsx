import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./style.css";

const root = document.getElementById("root");
if (!root) throw new Error("The HMI root element is missing from index.html.");
createRoot(root).render(<App />);
