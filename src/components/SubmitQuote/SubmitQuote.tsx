import { Button, Card, CardBody, Col, Container, Input, Row } from "reactstrap";
import UserPicker from "../UserPicker";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCircleMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useApi, useFetchArray } from "../../API/API";
import { CSHUser, QuoteShard } from "../../API/Types";

interface QuoteEntry extends QuoteShard {
    id: number,
}

const SubmitQuote = () => {

    const { apiPost } = useApi();

    const userList = useFetchArray<CSHUser>("/api/users");

    const [quoteEntries, setQuoteEntries] = useState<QuoteEntry[]>([
        {
            id: 0,
            body: "",
            speaker: "",
        }
    ]);

    const addQuoteEntry = () =>
        setQuoteEntries([...quoteEntries, {
            id: quoteEntries.reduce((a, b) => a.id > b.id ? a : b).id + 1,
            body: "",
            speaker: "",
        }]);

    const deleteQuoteEntry = (quote: QuoteEntry) =>
        setQuoteEntries(
            quoteEntries
                .filter(q => q.id !== quote.id)
        );

    const changeQuoteText = (id: number, quote: string) =>
        setQuoteEntries(
            quoteEntries.map(q => ({
                ...q,
                body: q.id === id ? quote : q.body
            }))
        )

    const changeQuoteUsername = (id: number, username: string) =>
        setQuoteEntries(
            quoteEntries.map(q => ({
                ...q,
                speaker: q.id === id ? username : q.speaker
            }))
        );

    const canSubmit = () => quoteEntries.every(q => q.body.length > 0 && userList.map(u => u.uid).includes(q.speaker));

    // TODO implement API route
    const submit = () => {
        apiPost("/api/quote", {
            shards: quoteEntries.map(s => ({
                body: s.body,
                speaker: s.speaker,
            }))
        }).then(_ => console.log("G"))
            .catch(e => console.warn(e))
    }

    return (
        <Card>
            <CardBody>
                <ReactSortable list={quoteEntries} setList={setQuoteEntries}>
                    {quoteEntries.map((q, i) =>
                        <Row key={i} className="drag-item cursor-move">
                            <Col className="col-1  move-quote-handle d-flex align-items-center">
                                {
                                    quoteEntries.length > 1 &&
                                    <FontAwesomeIcon icon={faBars} className="fa-lg flex-grow-1" />
                                }
                            </Col>
                            <Col className="col-10 d-flex">
                                <Input
                                    className="mr-3"
                                    type="text"
                                    placeholder="Quote"
                                    value={q.body}
                                    onChange={e => changeQuoteText(q.id, e.target.value)}
                                />
                                <UserPicker value={q.speaker} onChange={e => changeQuoteUsername(q.id, e)} userList={userList} />
                            </Col>
                            <Col className="col-1 d-flex align-items-center">
                                <Button className="shadow-none" onClick={_ => deleteQuoteEntry(q)} disabled={quoteEntries.length <= 1}>
                                    <FontAwesomeIcon
                                        icon={faCircleMinus}
                                        className={`${quoteEntries.length > 1 && "text-danger"} flex-grow-1`}
                                    />
                                </Button>
                            </Col>

                        </Row>
                    )}
                </ReactSortable>
                <Row className="d-flex flex-row-reverse">
                    <Col className="col-1">
                        <Button className="float-ednd mt-2 shadow-none text-success" onClick={addQuoteEntry}><FontAwesomeIcon icon={faCirclePlus} /></Button>
                    </Col>
                </Row>
                <Container className="d-flex px-0 pt-3">
                    <Button disabled={!canSubmit()} onClick={submit} size="sm" color="primary" className="flex-grow-1">Submit</Button>
                </Container>
            </CardBody>
        </Card>
    )
}

export default SubmitQuote;
