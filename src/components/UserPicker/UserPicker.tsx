import { useEffect, useId, useState } from "react";
import { Input } from "reactstrap";

export interface Props {
    value: string,
    onChange: (e: string) => void,
    userList?: string[]
}

const UserPicker = (props: Props) => {

    const userListId = useId();

    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        if (!props.userList) {
            // TODO: Implement API
        } else {
            setUsers(props.userList);
        }
    }, [props.userList]);

    const updateSearch = (e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)

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
                value={props.value}
                placeholder="Username"
                onChange={updateSearch}
            />

            <datalist id={`userList-${userListId}`}>
                {getFilteredUsers(props.value).map((u, i) => <option key={i} value={u} />)}
            </datalist>
        </>
    )
}

export default UserPicker;
