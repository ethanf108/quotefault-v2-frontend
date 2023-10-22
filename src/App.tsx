import { Container } from "reactstrap"
import Home from "./pages/Home"
import NavBar from "./components/NavBar"

function App() {

    return (
        <Container className="main" fluid>
            <NavBar />
            <Container style={{ marginTop: "90px" }}>
                <Home />
            </Container>
        </Container>
    )
}

export default App
