import {
    Collapse,
    Container,
    Nav,
    NavItem,
    NavLink,
    Navbar,
    NavbarToggler,
} from "reactstrap"
import Profile from "../Profile"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faDatabase,
    faFlag,
    faStar,
    faUser,
    faWarning,
} from "@fortawesome/free-solid-svg-icons"
import { useOidcUser } from "@axa-fr/react-oidc"
import { isEboardOrRTP } from "../../util"

const NavBar = () => {
    const { oidcUser } = useOidcUser()

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const toggle = () => setIsOpen(!isOpen)

    return (
        <Navbar color="primary" dark expand="lg" fixed="top">
            <Container>
                <NavLink href="/" className="navbar-brand" aria-hidden="true">
                    Quotefault
                </NavLink>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav navbar>
                        <NavItem>
                            <NavLink href="/storage">
                                <FontAwesomeIcon
                                    icon={faDatabase}
                                    className="mr-1"
                                />
                                Storage
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink href="/personal">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="mr-1"
                                />
                                Personal
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink href="/favorites">
                                <FontAwesomeIcon
                                    icon={faStar}
                                    className="mr-1"
                                />
                                Favorites
                            </NavLink>
                        </NavItem>
                        {isEboardOrRTP(oidcUser) && (
                            <>
                                <NavItem>
                                    <NavLink href="/hidden">
                                        <FontAwesomeIcon
                                            icon={faWarning}
                                            className="mr-1"
                                        />
                                        Hidden
                                    </NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink href="/reports">
                                        <FontAwesomeIcon
                                            icon={faFlag}
                                            className="mr-1"
                                        />
                                        Reports
                                    </NavLink>
                                </NavItem>
                            </>
                        )}
                    </Nav>
                    <Nav navbar className="ml-auto">
                        <Profile />
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar
