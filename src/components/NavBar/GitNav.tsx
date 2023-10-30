import { faArrowUpRightFromSquare, faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavItem, NavLink } from "reactstrap";

// I don't like this :(
const gitCommitURL = "%%%URL%%%";
const gitCommitHash = "%%%COMMIT%%%";

const GitNav = () => {

    if (gitCommitHash.startsWith("%")) {
        return <></>;
    }

    return (

        <NavItem>
            <NavLink href={`${gitCommitURL}/tree/${gitCommitHash}`} rel="noopener" target="_blank">
                <FontAwesomeIcon icon={faCodeBranch} className="mr-" />
                <span className="mx-1">{gitCommitHash.substring(0, 7)}</span>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="fa-xs" />
            </NavLink>
        </NavItem>
    )
}

export default GitNav;
