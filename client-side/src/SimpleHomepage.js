import React, { Component } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal } from 'react-bootstrap';
import './homepage.css';
import 'bootstrap/dist/css/bootstrap.css';

class SimpleHomepage extends Component {

    constructor(props) {
		super(props);
		this.state = {
            showModalOne: false,
            showModalTwo: false,
            sessionTitle: "Untitled Session",
            name: ""
		}

    };

    showModalOne = () => this.setState({showModalOne: true});
    closeModalOne = () => this.setState({showModalOne: false});

    openModalTwo = (e) => {
        this.setState({ showModalOne: false });
        this.setState({ showModalTwo: true });
    }
    closeModalTwo = () => this.setState({showModalTwo: false});


    setTitle = (e) => {
        this.setState({ sessionTitle: e.target.value });
    }

    setName = (e) => {
        this.setState({ name: e.target.value });
    }
    copy_link = (e) => {
        const copy_text = document.getElementById("copy_text");
        copy_text.select();
        document.execCommand("copy");
    }

    render() {
        const roomId = uuidv4();
        const { name, sessionTitle } = this.state;
        return(
            <>
                <Navbar />
                <div className="website-content">
                    <div class="jumbotron">
                        <h1 class="display-4">MeetApp</h1>
                        <p class="lead">A text and video chatting/calling webapp based on WebRTC. It has been built using React(frontend), ExpressJS(backend) and MongoDB(database).</p>
                        <hr class="my-4"></hr>
                        <p>Create a room for chatting and video calling and get a link to share it with anyone!</p>

                        <button type='button' className="btn btn-primary lg" onClick={this.showModalOne}>
                            Create New Room
                        </button>

                    </div>
                </div>
                
                
                <Modal show={this.state.showModalOne} onHide={this.closeModalOne} className="homepage_modalOne">
                    <Modal.Header closeButton>
                        <Modal.Title>Create a Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Hello User</h4>,
                        <h5>Please enter the following details to create a new chatroom</h5>
                        <h5>Join as - <input type='text' placeholder="Your name" value={name} onChange={this.setName} autoComplete="off"></input></h5>
                        <h5>Session Title - <input type="text" id="session-title-input" value={sessionTitle} onChange={ this.setTitle } placeholder="(optional)" autoComplete="off"></input></h5>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.openModalTwo}>Generate Link</Button>

                        <Button onClick={this.closeModalOne}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showModalTwo} onHide={this.closeModalTwo} className="homepage_modalTwo">
                    <Modal.Header closeButton>
                        <Modal.Title>Created a Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <h4>{name},</h4>
                            <h5>
                                Your link is - <br></br>
                                <input id="copy_text" value={"my-meetapp-webrtc.netlify.app/"+roomId+"/"+sessionTitle} ></input>

                            </h5>                        
                            </div>                   
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.copy_link}>Copy Link</Button>
                        <Button>
                            <Link to={"/"+roomId+"/"+sessionTitle+"/"+name} className="button-link">Enter the Room</Link>
                        </Button>
                       
                    </Modal.Footer>
                </Modal>

            </>
           
        )
    }
}

export default SimpleHomepage;