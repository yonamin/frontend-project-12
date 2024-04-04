import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { isEmpty } from 'lodash';
import { signup } from '../services/usersApi';
import useAuth from '../hooks/useAuth';
import MainNavbar from './MainNavbar';

const SignUp = () => {
  const { t } = useTranslation();
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const [signingUp] = signup();

  const signupSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('validationFeedback.required'))
      .min(3, t('validationFeedback.invalidLength'))
      .max(20, t('validationFeedback.invalidLength')),
    password: Yup.string()
      .required(t('validationFeedback.required'))
      .min(6, t('validationFeedback.invalidPassword')),
    passwordConfirmation: Yup.string()
      .required(t('validationFeedback.required'))
      .oneOf([Yup.ref('password')], t('validationFeedback.mustMatch')),
  });

  // const usernameSchema = Yup.string()
  //   .required(t('validationFeedback.required'))
  //   .min(3, t('validationFeedback.invalidLength'))
  //   .max(20, t('validationFeedback.invalidLength'));

  const formikObj = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    onSubmit: ({ username, password }) => {
      signingUp({ username, password })
        .unwrap()
        .then((data) => {
          const { token } = data;
          logIn(username, token);
          navigate('/');
        })
        .catch((e) => {
          if (e.status === 409) {
            formikObj.setFieldError('username', t('validationFeedback.userExists'));
          }
        });
    },
    validationSchema: signupSchema,
  });

  const { errors, touched } = formikObj;

  return (
    <div className="d-flex flex-column h-100">
      <MainNavbar />
      <Container fluid="sm" className="justify-content-center d-flex pt-5">
        <Card
          bg="light"
          style={{ width: '30rem' }}
        >
          <Card.Header as="h3" className="text-center py-3">
            {t('signUpPage.signingUp')}
          </Card.Header>
          <Card.Body className="m-3">
            <Form onSubmit={formikObj.handleSubmit} className="d-flex flex-column justify-content-center mt-2">
              <Form.Group className="mb-4">
                <FloatingLabel
                  htmlFor="username"
                  label={t('signUpPage.username')}
                >
                  <Form.Control
                    name="username"
                    id="username"
                    placeholder={t('signUpPage.username')}
                    onChange={formikObj.handleChange}
                    onBlur={formikObj.handleBlur}
                    value={formikObj.values.username}
                    isInvalid={errors.username && touched.username}
                  // validate={usernameSchema.validate}
                //   ref={inputRef}
                //   isInvalid={authFailed}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-4">
                <FloatingLabel
                  htmlFor="password"
                  label={t('signUpPage.password')}
                >
                  <Form.Control
                    name="password"
                    id="password"
                    type="password"
                    placeholder={t('signUpPage.password')}
                    onChange={formikObj.handleChange}
                    onBlur={formikObj.handleBlur}
                    value={formikObj.values.password}
                    isInvalid={errors.password && touched.password}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-4">
                <FloatingLabel
                  htmlFor="passwordConfirmation"
                  label={t('signUpPage.confirmPassword')}
                >
                  <Form.Control
                    name="passwordConfirmation"
                    id="confirmation"
                    type="password"
                    placeholder={t('signUpPage.confirmPassword')}
                    onChange={formikObj.handleChange}
                    onBlur={formikObj.handleBlur}
                    value={formikObj.values.passwordConfirmation}
                    isInvalid={errors.passwordConfirmation && touched.passwordConfirmation}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{errors.passwordConfirmation}</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Button variant="outline-dark" type="submit" disabled={!isEmpty(errors)}>
                {t('signUpPage.toSignUp')}
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer className="text-center p-3">
            {/* <Button variant="link" onClick={() => navigate('/signup')}>
            {t('signUpPage.signingUp')}
          </Button> */}
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
};
export default SignUp;