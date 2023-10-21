import { useEffect, useId, useState } from "react";
import { Input } from "reactstrap";

export interface Props {
    onPickUser: (username: string) => void
}

const UserPicker = (props: Props) => {

    const userListId = useId();

    const [users, setUsers] = useState<string[]>([]);

    // TODO: Implement API
    useEffect(() => {
    }, []);

    const [search, setSearch] = useState<string>("");

    const updateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value.toLocaleLowerCase());
    }

    useEffect(() => {
        if (users.includes(search)) {
            props.onPickUser(search);
        }
    }, [search]);

    const getFilteredUsers = (query: string) => {
        if (!query) {
            return [];
        }

        const filteredUsers = users.filter(u => u.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
        if (filteredUsers.length <= 1 && filteredUsers[0] === query) {
            return [];
        } else {
            return filteredUsers.sort((a, b) => a.localeCompare(b)).slice(0, 10);
        }
    }

    return (
        <>
            <Input
                type="text"
                list={`userList-${userListId}`}
                value={search}
                placeholder="Username"
                onChange={updateSearch}
            />

            <datalist id={`userList-${userListId}`}>
                {getFilteredUsers(search).map((u, i) => <option key={i} value={u} />)}
            </datalist>
        </>
    )
}

export default UserPicker;
