import { Card, Container } from "reactstrap";
import Plug from "../../components/Plug";
import SubmitQuote from "../../components/SubmitQuote";
import GitFooter from "./GitFooter";

const Home = () => {
    return (
        <Container>
            <Card className="my-3">
                <Plug />
            </Card>
            <SubmitQuote />
            <GitFooter />
        </Container>
    )
}

export default Home;
