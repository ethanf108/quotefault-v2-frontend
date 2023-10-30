import { Card, CardBody, CardFooter } from "reactstrap";
import { Quote, Vote, formatUser } from "../../API/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faCaretDown, faCaretUp, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import { ReactNode, useEffect, useState } from "react";

interface Props {
    quote: Quote,
    onVoteChange?: (type: Vote) => void,
    children?: ReactNode,
}

const QuoteCard = (props: Props) => {

    const [vote, setVote] = useState<Vote>(null);

    const updateVote = (state: Vote) => {
        props.onVoteChange!(state);
        setVote(state);
    }

    useEffect(() => {
        setVote(props.quote.vote);
    }, [props.quote]);

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
                    <span className="float-right ml-4 mr- d-flex flex-column">
                        <FontAwesomeIcon
                            icon={vote === "upvote" ? faSquareCaretUp : faCaretUp}
                            onClick={() => updateVote(vote === "upvote" ? null : "upvote")}
                            className={`fa-3x ${vote === "upvote" ? "text-success" : ""}`} />
                        <h2 className="text-center my-0 mx-2" style={{ minWidth: "2rem" }}>{props.quote.score}</h2>
                        <FontAwesomeIcon
                            icon={vote === "downvote" ? faSquareCaretDown : faCaretDown}
                            onClick={() => updateVote(vote === "downvote" ? null : "downvote")}
                            className={`fa-3x dw-100 ${vote === "downvote" ? "text-danger" : ""}`} />
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
