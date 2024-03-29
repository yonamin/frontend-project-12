import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { uniqueId } from 'lodash';

const MainNavbar = () => {
  const { t, i18n } = useTranslation();
  const { resolvedLanguage } = i18n;

  const handleSwitchLng = (lng) => async () => {
    await i18n.changeLanguage(lng);
  };

  const buildLanguageList = () => {
    const lngs = i18n.languages;
    const cn = (curLng) => classNames({
      'visually-hidden': curLng === resolvedLanguage,
    });
    return lngs.map((lng) => (
      <NavDropdown.Item
        key={uniqueId()}
        className={cn(lng)}
        onClick={handleSwitchLng(lng)}
      >
        {t(`languages.${lng}`)}
      </NavDropdown.Item>
    ));
  };

  return (
    <Navbar bg="light" className="border-bottom border-dark border-3" expand="lg">
      <Container>
        <Navbar.Brand className="pe-2 me-1 rounded-2 border-bottom border-end border-primary border-3">ChatKit</Navbar.Brand>
        <Navbar.Toggle aria-controls="lng" />
        <Navbar.Collapse id="lng">
          <Nav>
            <NavDropdown
              id="changeLng"
              title={t(`languages.${resolvedLanguage}`)}
              menuVariant="dark"
            >
              {buildLanguageList()}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Button className="border-dark border-start-0 border-top-0 border-3">{t('mainPage.logOut')}</Button>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
