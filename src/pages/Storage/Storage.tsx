import { useEffect, useState } from "react";
import { Quote } from "../../API/Types";
import InfiniteScroll from "react-infinite-scroll-component";
import { toastError, useApi } from "../../API/API";
import { Button, Container } from "reactstrap";
import { toast } from "react-toastify";
import QuoteCard, { ActionType } from "../../components/QuoteCard/QuoteCard";
import { useOidcUser } from "@axa-fr/react-oidc";
import ConfirmDialog from "../../components/ConfirmDialog";
import { isEboardOrRTP } from "../../util";

const pageSize = 5;

interface Props {
    storageType: "STORAGE" | "HIDDEN",
}

type QuoteDict = { [key: number]: Quote };

const Storage = (props: Props) => {

    const { oidcUser } = useOidcUser();

    const { apiGet, apiPut, apiDelete } = useApi();

    const [quotes, setQuotes] = useState<QuoteDict>([]);

    const getQuotes = (q?: QuoteDict) => Object.values(q || quotes);

    const [page, setPage] = useState<number>(0);

    const [isMore, setIsMore] = useState<boolean>(true);

    const fetchQuotes = () => {
        if (!isMore) {
            return;
        }
        // TODO Fix 9999
        apiGet<Quote[]>(`/api/${props.storageType === "STORAGE" ? "quotes" : "hidden"}`, {
            lt: getQuotes().reduce((a, b) => a.id < b.id ? a : b, { id: 9999 }).id,
            limit: pageSize,
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
    useEffect(fetchQuotes, [page]);

    const updateQuote = (id: number) => () =>
        apiGet<Quote>(`/api/quote/${id}`)
            .then(q => setQuotes(getQuotes().map(o => o.id === q.id ? q : o)))
            .catch(toastError("Failed to update quote"));


    const canHide = (q: Quote) =>
        props.storageType === "STORAGE" &&
        (isEboardOrRTP(oidcUser)
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
            .then(() => updateQuote(quote.id))
            .catch(toastError("Failed to hide quote"));
        setQuotes(quotes => getQuotes(quotes).filter(q => q.id !== quote.id));
    }

    const reportQuote = (quote: Quote) => window.location.assign(`/report?id=${quote.id}`);


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dispatchAction = (_quote: Quote) => (action: ActionType) => {
        switch (action) {
            default: {
                toast.info(`Action (${action}) not yet implemented :( (coles fault tbh)`, { theme: "colored" })
            }
        }
    }

    const sortQuotes = (a: Quote, b: Quote) =>
        ((a, b) => b.getTime() - a.getTime())(new Date(a.timestamp), new Date(b.timestamp));

    return (
        <InfiniteScroll
            dataLength={getQuotes().length}
            next={() => setPage(page + 1)}
            hasMore={isMore}
            loader={<p>Loading ...</p>}
        >
            <Container>
                {
                    getQuotes().sort(sortQuotes).map((q, i) =>
                        <QuoteCard key={i} quote={q} onAction={dispatchAction(q)} >

                            {oidcUser.preferred_username === q.submitter.uid &&
                                <ConfirmDialog onClick={() => deleteQuote(q)} buttonClassName="btn-danger">Delete</ConfirmDialog>}

                            {canHide(q)
                                && <ConfirmDialog onClick={() => hideQuote(q)} buttonClassName="btn-warning ml-1">Hide</ConfirmDialog>}
                            {props.storageType === "STORAGE" &&
                                <Button className="btn-danger ml-1" onClick={() => reportQuote(q)}>Report</Button>}
                        </QuoteCard>)
                }
                {!isMore && <div className="text-center mb-3">How did you read ALL of the quotes lol</div>}
            </Container>
        </InfiniteScroll>
    )
}

export default Storage;
