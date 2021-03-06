import "./forgotPassword.css";
import { Card, Steps } from "antd";

import React, { Component } from "react";

import PropTypes from "prop-types";

import EmailFormContainer from "../../containers/emailForm/emailForm";
import OTPFormContainer from "../../containers/otpForm/otpForm";

const { Step } = Steps;

class ForgotPassword extends Component {
  steps = [
    {
      title: "Email Verification",
      component: EmailFormContainer,
    },
    {
      title: "Reset Password",
      component: OTPFormContainer,
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
        <Card title="Forgot Password" bordered={false} className="form-card">
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
ForgotPassword.propTypes = {
  history: PropTypes.object,
};

export default ForgotPassword;
