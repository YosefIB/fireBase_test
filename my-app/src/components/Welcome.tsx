import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Welcome: React.FC = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} className="text-center">
          <h1 className="display-4">שלום</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
