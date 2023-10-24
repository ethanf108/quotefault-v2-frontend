import { useEffect, useId, useState } from "react";
import { Input } from "reactstrap";
import { CSHUser } from "../../API/Types";

export interface Props {
    value: string,
    onChange: (e: string) => void,
    userList?: CSHUser[]
}

const UserPicker = (props: Props) => {

    const userListId = useId();

    const [users, setUsers] = useState<CSHUser[]>([]);

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

        const filteredUsers = users.filter(u => u.uid.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            || u.cn.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
        if (filteredUsers.length <= 1 && filteredUsers[0].uid === query) {
            return [];
        } else {
            return filteredUsers.sort((a, b) => a.cn.localeCompare(b.cn)).slice(0, 10);
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
                {getFilteredUsers(props.value).map((u, i) => <option key={i} value={u.uid}>{u.cn}</option>)}
            </datalist>
        </>
    )
}

export default UserPicker;
