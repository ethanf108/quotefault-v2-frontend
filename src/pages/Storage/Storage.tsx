import { useEffect, useState } from "react";
import { Quote } from "../../API/Types";
import QuoteCard from "./QuoteCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { toastError, useApi } from "../../API/API";
import { Button, Card, CardBody, Container, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const pageSize = 5;

const Storage = () => {

    const { apiGet } = useApi();

    const [quotes, setQuotes] = useState<Quote[]>([]);

    const [page, setPage] = useState<number>(0);

    const [isMore, setIsMore] = useState<boolean>(true);

    const [search, setSearch] = useState<string>("");

    const fetchQuotes = () => {
        if (!isMore) {
            return;
        }
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
            .then(q => setQuotes([...quotes, ...q]))
            .catch(toastError("Error fetching Quotes"))
    }

    useEffect(fetchQuotes, [page]);

    const fetchSearch = () => {
        setQuotes([]);
        fetchQuotes();
    }

    const updateQuote = (id: number) => () =>
        apiGet<Quote>(`/api/quote/${id}`)
            .then(q => setQuotes(quotes.map(o => o.id === q.id ? q : o)))
            .catch(toastError("Failed to update quote"));

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
                        quotes.map((q, i) => <QuoteCard key={i} quote={q} onAction={_ => updateQuote(q.id)} />)
                    }
                    {!isMore && <div className="text-center mb-3">How did you read ALL of the quotes lol</div>}
                </Container>
            </InfiniteScroll>
        </>
    )
}

export default Storage;
