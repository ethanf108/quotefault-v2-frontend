import { Container } from "reactstrap"
import Home from "./pages/Home"
import NavBar from "./components/NavBar"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Storage from "./pages/Storage"

function App() {

    return (
        <Container className="main" fluid>
            <NavBar />
            <Container style={{ marginTop: "90px" }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/storage" element={<Storage />} />
                    </Routes>
                </BrowserRouter>
            </Container>
        </Container>
    )
}

export default App
