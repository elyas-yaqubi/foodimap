import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

function App() {
    return (
        <Router>
            {/* Navbar stays visible on every page */}

            {/* Define page routes here */}
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
