import { Button, Card, CardBody, CardFooter } from "reactstrap";
import { Quote } from "../../API/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

interface Props {
    quote: Quote
}

const QuoteCard = (props: Props) => {
    return (
        <Card className="mb-3">
            <CardBody>
                <span className="float-left w-75">
                    {
                        props.quote.shards.map((s, i) =>
                            <p key={i}>&quot;{s.body}&quot; - <a href="#" className="text-primary"><b>{s.speaker}</b></a></p>
                        )
                    }
                </span>
                <span className="float-right">
                    <FontAwesomeIcon icon={faCaretUp} className="fa-3x w-100" />
                    <h2 className="text-center my-0">-1</h2>
                    <FontAwesomeIcon icon={faCaretDown} className="fa-3x w-100" />
                </span>
            </CardBody>
            <CardFooter>
                <p className="float-left">Submitted By <a className="text-primary"><b>{props.quote.submitter}</b></a> on {props.quote.timestamp.toLocaleString().replace(", ", " at ")}</p>
                <span className="float-right">
                    <Button className="btn-danger float-right">Report</Button>
                    <Button className="btn-warning mx-1 float-right">Hide</Button>
                </span>
            </CardFooter>
        </Card>
    )
}

export default QuoteCard;
