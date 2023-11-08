import { useEffect, useState } from "react";
import { Quote, Vote } from "../../API/Types";
import InfiniteScroll from "react-infinite-scroll-component";
import { toastError, useApi } from "../../API/API";
import { Button, Card, CardBody, Container, DropdownItem, Input } from "reactstrap";
import { toast } from "react-toastify";
import QuoteCard from "../../components/QuoteCard/QuoteCard";
import { useOidcUser } from "@axa-fr/react-oidc";
import ConfirmModal from "../../components/ConfirmModal"
import { isEboardOrRTP } from "../../util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFlag, faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";

const pageSize = parseInt(process.env.QUOTEFAULT_STORAGE_PAGE_SIZE || "10");

interface Props {
    storageType: "STORAGE" | "HIDDEN" | "SELF",
}

type QuoteDict = { [key: number]: Quote };

const Storage = (props: Props) => {

    const { oidcUser } = useOidcUser();

    const [queryParams] = useSearchParams();

    const { apiGet, apiPut, apiDelete, apiPost } = useApi();

    const [quotes, setQuotes] = useState<QuoteDict>([]);

    const getQuotes = (q?: QuoteDict) => Object.values(q || quotes);

    const [isMore, setIsMore] = useState<boolean>(true);

    //search = the actual contents of the teext box, searchQuery = after submit is pressed
    const [search, setSearch] = useState<string>("");

    const [searchQuery, setSearchQuery] = useState<string>("");

    const [hideModal, setHideModal] = useState<boolean>(false);

    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    const [reportModal, setReportModal] = useState<boolean>(false);

    const [targetQuote, setTargetQuote] = useState<Quote | undefined>(undefined);

    const [reportText, setReportText] = useState<string>("");

    const fetchQuotes = (quotes?: QuoteDict) => {
        if (!oidcUser) { return; }

        const getVar = (name: string) => (queryParams.has(name) ? { [name]: queryParams.get(name) } : {});

        apiGet<Quote[]>("/api/quotes", {
            lt: getQuotes(quotes).reduce((a, b) => a.id < b.id && a.id != 0 ? a : b, { id: 0 }).id,
            limit: pageSize,
            ...(props.storageType !== "SELF" ? { hidden: props.storageType === "HIDDEN" } : { involved: oidcUser.preferred_username }),
            ...getVar("involved"),
            ...getVar("submitter"),
            ...getVar("speaker"),
            ...(search === "" ? {} : { q: search })
        })
            .then(q => {
                if (q.length < pageSize) {
                    setIsMore(false);
                }
                return q;
            })
            .then(qs => setQuotes(quotes => ({
                ...qs.map(q => ({ [q.id]: q })).reduce((a, b) => ({ ...a, ...b }), {}),
                ...quotes,
            })))
            .catch(toastError("Error fetching Quotes"))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fetchQuotes, [oidcUser]);

    const updateQuote = (id: number) =>
        apiGet<Quote>(`/api/quote/${id}`)
            .then(q => setQuotes(getQuotes().map(o => o.id === q.id ? q : o)))
            .catch(toastError("Failed to update quote"));


    const canHide = (q: Quote) =>
        props.storageType !== "HIDDEN"
        && !q.hidden
        && (isEboardOrRTP(oidcUser)
            || q.shards.map(s => s.speaker.uid).includes(oidcUser.preferred_username || ""));


    const deleteQuote = (quote: Quote) => {
        apiDelete(`/api/quote/${quote.id}`)
            .then(() => toast.success("Deleted Quote!", { theme: "colored" }))
            .then(() => setQuotes(getQuotes().filter(q => q.id !== quote.id)))
            .catch(toastError("Failed to delete quote"));
        setQuotes(quotes => getQuotes(quotes).filter(q => q.id !== quote.id));
    }

    const hideQuote = (quote: Quote) => {
        apiPut(`/api/quote/${quote.id}/hide`)
            .then(() => setQuotes(getQuotes().filter(q => q.id !== quote.id)))
            .catch(toastError("Failed to hide quote"));
        setQuotes(quotes => getQuotes(quotes).filter(q => q.id !== quote.id));
    }

    const reportQuote = (quote: Quote) =>
        apiPost(`/api/quote/${quote?.id}/report`, {
            reason: reportText
        })
        .then(() => toast.success("Submitted report!", { theme: "colored" }))
        .catch(toastError("Failed to submit report"));

    const confirmHide = (quote: Quote) => {
      setTargetQuote(quote)
      setHideModal(true);
    }
    const confirmDelete = (quote: Quote) => {
      setTargetQuote(quote)
      setDeleteModal(true);
    }
    const confirmReport = (quote: Quote) => {
      setTargetQuote(quote)
      setReportModal(true);
    }

    const voteChange = (quote: Quote) => (action: Vote) => {
        switch (action) {
            case null: {
                apiDelete(`/api/quote/${quote.id}/vote`)
                    .then(() => updateQuote(quote.id))
                    .catch(toastError("Failed to alter vote"))
                break;
            }
            default: {
                apiPost(`/api/quote/${quote.id}/vote`, undefined, { vote: action })
                    .then(() => updateQuote(quote.id))
                    .catch(toastError("Failed to alter vote"))
            }
        }
    }

    useEffect(() => {
        setQuotes([]);
        setIsMore(true);
        fetchQuotes({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const sortQuotes = (a: Quote, b: Quote) =>
        ((a, b) => b.getTime() - a.getTime())(new Date(a.timestamp), new Date(b.timestamp));

    const canBeFunny = () => !isMore && searchQuery === "" && props.storageType === "STORAGE";

    const headerText = (() => {
        let ret;
        if (queryParams.has("involved")) {
            ret = `Quotes from ${queryParams.get("involved")}`;
        } else {
            ret = (() => {
                switch (props.storageType) {
                    case "STORAGE":
                        return "Storage"
                    case "SELF":
                        return "My Quotes"
                    case "HIDDEN":
                        return "Hidden Quotes 😳"
                }
            })()
        }
        if (searchQuery) {
            return `Searching for "${searchQuery}" in ${ret}`;
        }
        return ret;
    })();

    return (
        <Container className="px-0">
            <Card className="mx-3">
                <CardBody className="d-flex py-1 px-1">
                    <Input type="text" placeholder="Search" className="mx-2" value={search} onChange={e => setSearch(e.target.value)} />
                    <Button className="btn-sm shadow-none btn-info d-flex align-items-center" onClick={() => setSearchQuery(search)}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2 py-0" />
                        Search
                    </Button>
                </CardBody>
            </Card>

            <InfiniteScroll
                dataLength={getQuotes().length}
                next={fetchQuotes}
                hasMore={isMore}
                loader={<p className="text-center">Loading ...</p>}
            >
                <Container>

                    <h1 className="my-5">{headerText}</h1>

                    {
                        getQuotes().sort(sortQuotes).map((q, i) =>
                            <QuoteCard key={i} quote={q} onVoteChange={voteChange(q)}>
                                {oidcUser.preferred_username === q.submitter.uid &&
                                    <DropdownItem onClick={() => confirmDelete(q)} className="text-danger">
                                      <FontAwesomeIcon icon={faTrash} className="mr-2" fixedWidth/>
                                      Delete
                                    </DropdownItem>}

                                {canHide(q)
                                    &&
                                    <DropdownItem onClick={() => confirmHide(q)} className="text-warning">
                                      <FontAwesomeIcon icon={faEyeSlash} className="mr-2" fixedWidth/>
                                      Hide
                                    </DropdownItem>}

                                {props.storageType === "STORAGE" &&
                                    <DropdownItem onClick={() => confirmReport(q)} className="text-danger">
                                      <FontAwesomeIcon icon={faFlag} className="mr-2" fixedWidth/>
                                      Report
                                    </DropdownItem>}
                            </QuoteCard>)
                    }
                    {
                        isMore && <div className="d-flex justify-content-center mb-3">
                            <Button onClick={() => fetchQuotes()} className="btn-info">Load more</Button>
                        </div>
                    }
                    {canBeFunny() && <div className="text-center mb-3">How did you read ALL of the quotes lol</div>}
                    <ConfirmModal
                      onConfirm={() => targetQuote && deleteQuote(targetQuote)}
                      isOpen={deleteModal}
                      toggle={() => setDeleteModal(!deleteModal)}
                      color="danger"
                      headerText="Are you sure you want to delete this quote?"
                      confirmText="Delete"
                    >
                      <QuoteCard quote={targetQuote!}/>
                    </ConfirmModal>
                    <ConfirmModal
                      onConfirm={() => targetQuote && hideQuote(targetQuote)}
                      isOpen={hideModal}
                      toggle={() => setHideModal(!hideModal)}
                      color="warning"
                      headerText="Are you sure you want to hide this quote?"
                      confirmText="Hide"
                    >
                      <QuoteCard quote={targetQuote!}/>
                    </ConfirmModal>
                    <ConfirmModal
                      onConfirm={() => targetQuote && reportQuote(targetQuote)}
                      isOpen={reportModal}
                      toggle={() => setReportModal(!reportModal)}
                      color="primary"
                      headerText="Why do you want to report this Quote?"
                      confirmText="Report"
                    >
                      <QuoteCard quote={targetQuote!}/>
                      <Input
                          type="text"
                          placeholder="Why do you want to report this Quote?"
                          value={reportText}
                          onChange={e => setReportText(e.target.value)}
                      />
                    </ConfirmModal>
                </Container>
            </InfiniteScroll>
        </Container>
    )
}

export default Storage;
