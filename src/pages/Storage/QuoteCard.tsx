import { Button, Card, CardBody, CardFooter } from "reactstrap";
import { Quote, formatUser } from "../../API/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { isEboardOrRTP } from "../../util";
import { useOidcUser } from "@axa-fr/react-oidc";

interface Props {
    quote: Quote
}

const QuoteCard = (props: Props) => {

    const { oidcUser } = useOidcUser();

    return (
        <Card className="mb-3">
            <CardBody>
                <span className="float-left w-75">
                    {
                        props.quote.shards.map((s, i) =>
                            <p key={i}>
                                &quot;{s.body}&quot; - &nbsp;
                                <a href={`https://profiles.csh.rit.edu/user/${s.speaker.uid}`} rel="noopener" target="_blank" className="text-primary">
                                    <b>{formatUser(s.speaker)}</b>
                                    &nbsp;
                                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="fa-xs" />
                                </a>
                            </p>
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
                <p className="float-left">
                    Submitted By &nbsp;
                    <a href={`https://profiles.csh.rit.edu/user/${props.quote.submitter.uid}`} rel="noopener" target="_blank" className="text-primary">
                        <b>{formatUser(props.quote.submitter)}</b>
                        &nbsp;
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="fa-xs" />
                    </a>
                    &nbsp; on {new Date(props.quote.timestamp).toLocaleString().replace(", ", " at ")}
                </p>
                <span className="float-right">
                    <Button className="btn-danger float-right">Report</Button>
                    {isEboardOrRTP(oidcUser) && <Button className="btn-warning mx-1 float-right">Hide</Button>}
                </span>
            </CardFooter>
        </Card>
    )
}

export default QuoteCard;
