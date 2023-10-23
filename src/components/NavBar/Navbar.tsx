import { Collapse, Container, Nav, NavItem, NavLink, Navbar, NavbarToggler } from "reactstrap";
import Profile from "../Profile";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggle = () => setIsOpen(!isOpen);

    const profile = (cn: string) => (
        <Nav navbar className={cn}>
            <Profile />
        </Nav>
    );

    return (
        <Navbar color="primary" dark expand="lg" fixed="top">
            <Container>
                <NavLink to="/" className="navbar-brand" aria-hidden="true">Quotefault</NavLink>
                <NavbarToggler onClick={toggle} />
                {profile("d-md-none")}
                <Collapse isOpen={isOpen} navbar >
                    <Nav navbar>
                        <NavItem>
                            <NavLink to="/">
                                <FontAwesomeIcon icon={faDatabase} className="mr-1" />
                                Storage
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
                {profile("d-none d-md-inline")}
            </Container>
        </Navbar>
    )
}

export default NavBar;
