import { Card, Steps } from "antd";

import React, { Component } from "react";

import PropTypes from "prop-types";

import NewEmailFormContainer from "../../containers/newEmailForm/newEmailForm";
import TokenFormContainer from "../../containers/tokenForm/tokenForm";

const { Step } = Steps;

class ChangeEmail extends Component {
  steps = [
    {
      title: "New Email",
      component: NewEmailFormContainer,
    },
    {
      title: "Email Verification",
      component: TokenFormContainer,
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      step: 0,
    };
  }

  handleStepChange = (step) => this.setState({ step });

  handleEmailChange = (email) => this.setState({ email });

  render() {
    const { step: currentStep, email } = this.state;
    const { history } = this.props;
    const CurrentComponent = this.steps[currentStep].component;
    return (
      <div className="container">
        <Card title="Change Email" bordered={false} className="form-card">
          <Steps current={currentStep} size="small">
            {this.steps.map((step) => (
              <Step key={step.title} title={step.title} />
            ))}
          </Steps>
          <div className="steps-content">
            <CurrentComponent
              currentStep={currentStep}
              setCurrentStep={this.handleStepChange}
              email={email}
              onMailChange={this.handleEmailChange}
              history={history}
            />
          </div>
        </Card>
      </div>
    );
  }
}
ChangeEmail.propTypes = {
  history: PropTypes.object,
};

export default ChangeEmail;
