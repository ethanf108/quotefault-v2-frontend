import { Card, Container } from "reactstrap";
import Plug from "../../components/Plug";
import SubmitQuote from "../../components/SubmitQuote";

const Home = () => {
    return (
        <Container>
            <Card className="my-3">
                <Plug />
            </Card>
            <SubmitQuote />
        </Container>
    )
}

export default Home;
