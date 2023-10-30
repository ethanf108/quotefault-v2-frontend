import { useEffect, useState } from "react";
import { Quote, Vote } from "../../API/Types";
import InfiniteScroll from "react-infinite-scroll-component";
import { toastError, useApi } from "../../API/API";
import { Button, Card, CardBody, Container, Input } from "reactstrap";
import { toast } from "react-toastify";
import QuoteCard from "../../components/QuoteCard/QuoteCard";
import { useOidcUser } from "@axa-fr/react-oidc";
import ConfirmDialog from "../../components/ConfirmDialog";
import { isEboardOrRTP } from "../../util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const pageSize = 5;

interface Props {
    storageType: "STORAGE" | "HIDDEN" | "SELF",
}

type QuoteDict = { [key: number]: Quote };

const Storage = (props: Props) => {

    const { oidcUser } = useOidcUser();

    const { apiGet, apiPut, apiDelete, apiPost } = useApi();

    const [quotes, setQuotes] = useState<QuoteDict>([]);

    const getQuotes = (q?: QuoteDict) => Object.values(q || quotes);

    const [isMore, setIsMore] = useState<boolean>(true);

    //search = the actual contents of the teext box, searchQuery = after submit is pressed
    const [search, setSearch] = useState<string>("");

    const [searchQuery, setSearchQuery] = useState<string>("");

    const fetchQuotes = (quotes?: QuoteDict) => {
        if (!oidcUser) { return; }
        apiGet<Quote[]>("/api/quotes", {
            lt: getQuotes(quotes).reduce((a, b) => a.id < b.id && a.id != 0 ? a : b, { id: 0 }).id,
            limit: pageSize,
            ...(props.storageType !== "SELF" ? { hidden: props.storageType === "HIDDEN" } : { involved: oidcUser.preferred_username }),
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

    const reportQuote = (quote: Quote) => window.location.assign(`/report?id=${quote.id}`);

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

    return (
        <Container>
            <Card className="mb-5">
                <CardBody className="d-flex py-1">
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

                    {
                        getQuotes().sort(sortQuotes).map((q, i) =>
                            <QuoteCard key={i} quote={q} onVoteChange={voteChange(q)}>
                                {oidcUser.preferred_username === q.submitter.uid &&
                                    <ConfirmDialog onClick={() => deleteQuote(q)} buttonClassName="btn-danger">Delete</ConfirmDialog>}

                                {canHide(q)
                                    && <ConfirmDialog onClick={() => hideQuote(q)} buttonClassName="btn-warning ml-1">Hide</ConfirmDialog>}

                                {props.storageType === "STORAGE" &&
                                    <Button className="btn-danger ml-1" onClick={() => reportQuote(q)}>Report</Button>}
                            </QuoteCard>)
                    }

                    {canBeFunny() && <div className="text-center mb-3">How did you read ALL of the quotes lol</div>}
                </Container>
            </InfiniteScroll>
        </Container>
    )
}

export default Storage;
