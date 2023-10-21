import { Container, Nav, NavItem, NavLink, Navbar } from "reactstrap";

const NavBar = () => {
    return (
        <Navbar color="primary" dark expand="lg" fixed="top">
            <Container>
                <NavLink to="/" className={'navbar-brand'} aria-hidden='true'>Quotefault</NavLink>
            </Container>
        </Navbar>
    )
}

export default NavBar;
