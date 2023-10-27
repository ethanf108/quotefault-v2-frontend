import { Button, Card, CardBody, CardFooter } from "reactstrap";
import { Quote, formatUser } from "../../API/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faCaretDown, faCaretUp, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import { isEboardOrRTP } from "../../util";
import { useOidcUser } from "@axa-fr/react-oidc";
import { useEffect, useState } from "react";
import ConfirmDialog from "../../components/ConfirmDialog";

export type ActionType = "HIDE" | "UNHIDE" | "REPORT" | "UPVOTE" | "DOWNVOTE" | "UNVOTE" | "DELETE";

interface Props {
    quote: Quote,
    onAction: (type: ActionType) => void,
    readonly?: boolean
}

const QuoteCard = (props: Props) => {

    const { oidcUser } = useOidcUser();

    const [vote, setVote] = useState<"UP" | "DOWN" | null>(null);

    useEffect(() => props.onAction(`${vote || "UN"}VOTE`), [vote]);

    const canHide = () => isEboardOrRTP(oidcUser)
        || props.quote.shards.map(s => s.speaker.uid).includes(oidcUser.preferred_username || "");

    if (!oidcUser) return <></>;

    return (
        <Card className="mb-3">
            <CardBody className="d-flex">
                <span className="float-left flex-grow-1">
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
                <span className="float-right ml-4 mr d-flex flex-column">
                    <FontAwesomeIcon
                        icon={vote === "UP" ? faSquareCaretUp : faCaretUp}
                        onClick={() => setVote(vote === "UP" ? null : "UP")}
                        className={`fa-3x ${vote === "UP" ? "text-success" : ""}`} />
                    <h2 className="text-center my-0 mx-2">999</h2>
                    <FontAwesomeIcon
                        icon={vote === "DOWN" ? faSquareCaretDown : faCaretDown}
                        onClick={() => setVote(vote === "DOWN" ? null : "DOWN")}
                        className={`fa-3x dw-100 ${vote === "DOWN" ? "text-danger" : ""}`} />
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
                {!props.readonly &&
                    <span className="float-right">
                        {oidcUser.preferred_username === props.quote.submitter.uid &&
                            <ConfirmDialog onClick={() => props.onAction("DELETE")} buttonClassName="btn-danger">Delete</ConfirmDialog>}

                        {canHide()
                            && <ConfirmDialog onClick={() => props.onAction("HIDE")} buttonClassName="btn-warning ml-1">Hide</ConfirmDialog>}

                        <Button className="btn-danger ml-1" onClick={() => props.onAction("REPORT")}>Report</Button>
                    </span>
                }
            </CardFooter>
        </Card>
    )
}

export default QuoteCard;
