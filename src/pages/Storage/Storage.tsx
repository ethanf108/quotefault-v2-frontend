import { useEffect, useState } from "react";
import { Quote } from "../../API/Types";
import QuoteCard from "./QuoteCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { toastError, useApi } from "../../API/API";
import { Container } from "reactstrap";

const pageSize = 5;

const Storage = () => {

    const { apiGet } = useApi();

    const [quotes, setQuotes] = useState<Quote[]>([]);

    const [page, setPage] = useState<number>(0);

    const [isMore, setIsMore] = useState<boolean>(true);

    const fetchQuotes = () => {
        if (!isMore) {
            return;
        }
        apiGet<Quote[]>("/api/quotes", {
            page: page,
            limit: pageSize,
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

    useEffect(() => fetchQuotes(), [page]);

    return (
        <InfiniteScroll
            dataLength={quotes.length}
            next={() => setPage(page + 1)}
            hasMore={isMore}
            loader={<p>Loading ...</p>}
        >
            <Container>
                {
                    quotes.map((q, i) => <QuoteCard key={i} quote={q} />)
                }
                {!isMore && <div className="text-center mb-3">How did you read ALL of the quotes lol</div>}
            </Container>
        </InfiniteScroll>
    )
}

export default Storage;
