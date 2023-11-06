import { faArrowUpRightFromSquare, faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetch } from "../../API/API";
import { GitData } from "../../API/Types";

// I don't like this :(
const frontendGitCommitURL = "%%%URL%%%";
const frontendGitCommitHash = "%%%COMMIT%%%";

const GitFooter = () => {

    const backendGit = useFetch<GitData>("/api/version");

    return (
        <div className="mt-3 text-center">
            <p className="text-monospace">
                <a href={`${frontendGitCommitURL}/tree/${frontendGitCommitHash}`} rel="noopener" target="_blank">
                    <FontAwesomeIcon icon={faCodeBranch} />
                    <span className="mx-1">Frontend</span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
            </p>

            {backendGit &&
                <p className="text-monospace">
                    <a href={`${backendGit.url}/tree/${backendGit.revision}`} rel="noopener" target="_blank">
                        <FontAwesomeIcon icon={faCodeBranch} />
                        <span className="mx-1">Backend</span>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </a>
                </p>
            }
        </div>
    )
}

export default GitFooter;
