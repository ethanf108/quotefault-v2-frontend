import { Card, CardBody, CardFooter } from "reactstrap";
import { Quote, formatUser } from "../../API/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faCaretDown, faCaretUp, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import { ReactNode, useState } from "react";

export type ActionType = "UPVOTE" | "DOWNVOTE" | "UNVOTE";

interface Props {
    quote: Quote,
    onVoteChange?: (type: ActionType) => void,
    children?: ReactNode,
}

type VoteState = "UP" | "DOWN" | null;

const QuoteCard = (props: Props) => {

    const [vote, setVote] = useState<VoteState>(null);

    const updateVote = (state: VoteState) => {
        props.onVoteChange!(`${state || "UN"}VOTE`);
        setVote(state);
    }

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
                {props.onVoteChange &&
                    <span className="float-right ml-4 mr d-flex flex-column">
                        <FontAwesomeIcon
                            icon={vote === "UP" ? faSquareCaretUp : faCaretUp}
                            onClick={() => updateVote(vote === "UP" ? null : "UP")}
                            className={`fa-3x ${vote === "UP" ? "text-success" : ""}`} />
                        <h2 className="text-center my-0 mx-2">999</h2>
                        <FontAwesomeIcon
                            icon={vote === "DOWN" ? faSquareCaretDown : faCaretDown}
                            onClick={() => updateVote(vote === "DOWN" ? null : "DOWN")}
                            className={`fa-3x dw-100 ${vote === "DOWN" ? "text-danger" : ""}`} />
                    </span>
                }
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
                    {props.children}
                </span>
            </CardFooter>
        </Card>
    )
}

export default QuoteCard;
