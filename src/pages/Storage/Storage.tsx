import { useEffect, useState } from "react";
import { Quote } from "../../API/Types";
import InfiniteScroll from "react-infinite-scroll-component";
import { toastError, useApi } from "../../API/API";
import { Button, Card, CardBody, Container, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import QuoteCard, { ActionType } from "../../components/QuoteCard/QuoteCard";
import { useOidcUser } from "@axa-fr/react-oidc";
import ConfirmDialog from "../../components/ConfirmDialog";
import { isEboardOrRTP } from "../../util";

const pageSize = 5;

const Storage = () => {

    const { oidcUser } = useOidcUser();

    const { apiGet, apiPut, apiDelete } = useApi();

    const [quotes, setQuotes] = useState<Quote[]>([]);

    const [page, setPage] = useState<number>(0);

    const [isMore, setIsMore] = useState<boolean>(true);

    //TODO Fix search
    const [search, setSearch] = useState<string>("");

    const fetchQuotes = () => {
        if (!isMore) {
            return;
        }
        // TODO Fix 9999
        apiGet<Quote[]>("/api/quotes", {
            lt: quotes.reduce((a, b) => a.id < b.id ? a : b, { id: 9999 }).id,
            limit: pageSize,
            ...(search === "" ? {} : {
                q: search,
            })
        })
            .then(q => {
                if (q.length < pageSize) {
                    setIsMore(false);
                }
                return q;
            })
            .then(q => setQuotes(quotes => [...quotes, ...q]))
            .catch(toastError("Error fetching Quotes"))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fetchQuotes, [page]);

    const fetchSearch = () => {
        setQuotes([]);
        fetchQuotes();
    }

    const updateQuote = (id: number) => () =>
        apiGet<Quote>(`/api/quote/${id}`)
            .then(q => setQuotes(quotes.map(o => o.id === q.id ? q : o)))
            .catch(toastError("Failed to update quote"));


    const canHide = (q: Quote) => isEboardOrRTP(oidcUser)
        || q.shards.map(s => s.speaker.uid).includes(oidcUser.preferred_username || "");


    const deleteQuote = (quote: Quote) =>
        apiDelete(`/api/quote/${quote.id}`)
            .then(() => toast.success("Deleted Quote!", { theme: "colored" }))
            .then(() => setQuotes(quotes.filter(q => q.id !== quote.id)))
            .catch(toastError("Failed to delete quote"));

    const hideQuote = (quote: Quote) =>
        apiPut(`/api/quote/${quote.id}/hide`)
            .then(() => updateQuote(quote.id))
            .catch(toastError("Failed to hide quote"));

    const reportQuote = (quote: Quote) => window.location.assign(`/report?id=${quote.id}`);


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dispatchAction = (_quote: Quote) => (action: ActionType) => {
        switch (action) {
            default: {
                toast.info(`Action (${action}) not yet implemented :( (coles fault tbh)`, { theme: "colored" })
            }
        }
    }

    return (
        <>
            <Container>
                <Card className="mb-5">
                    <CardBody className="d-flex py-1">
                        <Input type="text" placeholder="Search" className="mx-2" value={search} onChange={e => setSearch(e.target.value)} />
                        <Button className="btn-sm shadow-none btn-info d-flex align-items-center" onClick={fetchSearch}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2 py-0" />
                            Search
                        </Button>
                    </CardBody>
                </Card>
            </Container>
            <InfiniteScroll
                dataLength={quotes.length}
                next={() => setPage(page + 1)}
                hasMore={isMore}
                loader={<p>Loading ...</p>}
            >
                <Container>
                    {
                        quotes.map((q, i) =>
                            <QuoteCard key={i} quote={q} onAction={dispatchAction(q)} >

                                {oidcUser.preferred_username === q.submitter.uid &&
                                    <ConfirmDialog onClick={() => deleteQuote(q)} buttonClassName="btn-danger">Delete</ConfirmDialog>}

                                {canHide(q)
                                    && <ConfirmDialog onClick={() => hideQuote(q)} buttonClassName="btn-warning ml-1">Hide</ConfirmDialog>}

                                <Button className="btn-danger ml-1" onClick={() => reportQuote(q)}>Report</Button>
                            </QuoteCard>)
                    }
                    {!isMore && <div className="text-center mb-3">How did you read ALL of the quotes lol</div>}
                </Container>
            </InfiniteScroll>
        </>
    )
}

export default Storage;
