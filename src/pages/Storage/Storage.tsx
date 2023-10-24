import { useEffect, useState } from "react";
import { Quote } from "../../API/Types";
import QuoteCard from "./QuoteCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { toastError, useApi } from "../../API/API";

const pageSize = 5;

const Storage = () => {

    const { apiGet } = useApi();

    const [quotes, setQuotes] = useState<Quote[]>([]);

    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        apiGet<Quote[]>("/api/quotes", {
            page: page,
            limit: pageSize,
        })
            .then(q => setQuotes([...quotes, ...q]))
            .catch(toastError("Error fetching Quotes"))
    }, [page]);

    return (
        <InfiniteScroll
            dataLength={quotes.length}
            next={() => setPage(page + 1)}
            hasMore={true}
            loader={<p>Loading ...</p>}
        >
            {
                quotes.map((q, i) => <QuoteCard key={i} quote={q} />)
            }
        </InfiniteScroll>
    )
}

export default Storage;
