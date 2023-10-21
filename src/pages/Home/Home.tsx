import { Container } from "reactstrap";
import SubmitQuote from "../../components/SubmitQuote";

const Home = () => {
    return (
        <Container style={{ marginTop: "90px" }}>
            <div className="plug-body">
                <a href="https://plug.csh.rit.edu" title="Advertisements by CSH: Plug">
                    <img className="w-100" src="https://plug.csh.rit.edu/data"
                        alt="Advertisements by CSH: Plug" />
                </a>
            </div>
            <SubmitQuote />
        </Container>
    )
}

export default Home;
