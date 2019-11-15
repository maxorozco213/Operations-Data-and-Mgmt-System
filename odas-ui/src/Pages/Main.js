import React from 'react';
import {Link} from "react-router-dom";
// Stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
import {Button, Popover, PopoverContent, Modal, Form} from "react-bootstrap";
import "../Layout/Main.css"

// TODO Check for correct email format
export default class Main extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modalState: false
        }
    }

    setModalState(state) {
        this.setState({
            modalState: state
        });
    }

    // handleSubmit = () =>

    render() {
        const infoPop = (
            <Popover id={"popover-basic"}>
                <PopoverContent>
                    Sign up to save your work and get weekly reports by email!
                </PopoverContent>
            </Popover>
        );

        return (
            <div className={"main-page"}>
                <div className={"main-container"}>
                    <div className={"main-content"}>
                        <span className={"main-text"}>Welcome to <br/> ODAS Report Generator</span>
                        <div className={"main-button"}>
                            <span className={"sub-text"}>Get started by signing in</span>
                            <Link to={""}>
                                <Button size={"lg"}
                                        variant={"info"}
                                        className={"query-button"}
                                >
                                    Generate a Report
                                </Button>
                            </Link>
                        </div>
                        {/*<div className={"email-input"}>*/}
                            <div className={"email-button-container"}>
                                <div className={"email-button"}>
                                    <Button
                                        variant={"info"}
                                        type={"submit"}
                                        size={"lg"}
                                        onClick={() => this.setModalState(true)}
                                    >
                                        Login
                                    </Button>
                                </div>
                                <div className={"email-button"}>
                                    <Button
                                        variant={"info"}
                                        type={"submit"}
                                        size={"lg"}
                                        onClick={() => this.setModalState(true)}
                                    >
                                        Sign up
                                    </Button>
                                </div>
                                <div className={"email-button"}>
                                    <Link to={""}>
                                        <Button
                                            variant={"info"}
                                            type={"submit"}
                                            size={"lg"}
                                        >
                                            About
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        {/*</div>*/}
                    </div>
                    <div id={"img"} className={"main-image"}>
                        <img src={require("../Images/front-page.gif")} alt={""} />
                    </div>
                </div>
                <Modal
                    size="sm"
                    show={this.state.modalState}
                    onHide={() => this.setModalState(false)}
                    aria-labelledby="example-modal-sizes-title-sm"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-sm">
                            User Login
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <div className={"email-form"}>
                                <Form.Control type={"text"} placeholder={"Email"} />
                            </div>
                            <div>
                                <Form.Control type={"password"} placeholder={"Password"} />
                            </div>
                            <div className={"modal-btn"}>
                                <Button
                                    variant={"info"}
                                    type={"submit"}
                                    onClick={() => console.log("Submit")}
                                >
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}