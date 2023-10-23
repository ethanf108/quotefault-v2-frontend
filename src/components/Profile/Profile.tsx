import { OidcUserStatus, useOidcUser } from "@axa-fr/react-oidc";
import { DropdownToggle, UncontrolledDropdown } from "reactstrap";

const Profile = () => {
    const { oidcUser, oidcUserLoadingState } = useOidcUser();

    if (oidcUserLoadingState !== OidcUserStatus.Loaded) {
        return (<></>);
    }

    return (
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav>
                <img
                    className="rounded-circle"
                    src={`https://profiles.csh.rit.edu/image/${oidcUser.preferred_username}`}
                    alt=""
                    aria-hidden={true}
                    width={32}
                    height={32}
                />

                <span className="ml-2 d-none d-md-inline">{oidcUser.name} ({oidcUser.preferred_username})</span>

            </DropdownToggle>
        </UncontrolledDropdown>
    )
}

export default Profile;
