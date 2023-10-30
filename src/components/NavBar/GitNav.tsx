import { faArrowUpRightFromSquare, faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, UncontrolledDropdown } from "reactstrap";
import { useFetch } from "../../API/API";
import { GitData } from "../../API/Types";

// I don't like this :(
const frontendGitCommitURL = "%%%URL%%%";
const frontendGitCommitHash = "%%%COMMIT%%%";

const GitNav = () => {

    const backendGit = useFetch<GitData>("/api/version");

    return (
        <Nav navbar>
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                    <span className="ml-2 d-none d-md-inline">
                        <FontAwesomeIcon icon={faCodeBranch} />
                    </span>
                </DropdownToggle>

                <DropdownMenu>
                    <a href={`${frontendGitCommitURL}/tree/${frontendGitCommitHash}`} rel="noopener" target="_blank">
                        <DropdownItem>
                            Frontend
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ml-1" />
                        </DropdownItem>
                    </a>

                    {backendGit &&
                        <a href={`${backendGit.url}/tree/${backendGit.revision}`} rel="noopener" target="_blank">
                            <DropdownItem>
                                Backend
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ml-1" />
                            </DropdownItem>
                        </a>
                    }
                </DropdownMenu>
            </UncontrolledDropdown>
        </Nav>
    )
}

export default GitNav;
