import React, { Component } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal } from 'react-bootstrap';
import './homepage.css';
import 'bootstrap/dist/css/bootstrap.css';

class Homepage extends Component {

    constructor(props) {
		super(props);
		this.state = {
            showModalOne: false,
            showModalTwo: false,
            videoStream: false,
            audioStream: false,
            sessionTitle: "Untitled Session",
		}
        this.name = localStorage.getItem("meetapp-username");
    };

    showModalOne = () => this.setState({showModalOne: true});
    closeModalOne = () => this.setState({showModalOne: false});

    openModalTwo = (e) => {
        this.setState({ showModalOne: false });
        this.setState({ showModalTwo: true });
    }
    closeModalTwo = () => this.setState({showModalTwo: false});


    handleVideo = (e) => {
        this.setState({ videoStream: e.target.checked })
      }
    handleAudio = (e) => {
        this.setState({ audioStream: e.target.checked })
    }

    setTitle = (e) => {
        this.setState({ sessionTitle: e.target.value });
    }
    copy_link = () => {
        const copy_text = document.getElementById("copy_text");
        copy_text.select();
        document.execCommand("copy");
    }

    render() {
        const roomId = uuidv4();
        const name = this.name;
        const { videoStream, audioStream, sessionTitle } = this.state;
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

                        <br></br><br></br>
                        <p>See your saved session's chats and notes. Note that you can only save them if you are logged in.</p>

                        <button type='button' className=" btn btn-primary lg">
                            <Link to={'/sessions'} className="button-link">Your Sessions</Link>
                        </button>
                    </div>

                    
                </div>
                
                <Modal show={this.state.showModalOne} onHide={this.closeModalOne} className="homepage_modalOne">
                    <Modal.Header closeButton>
                        <Modal.Title>Create a Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Hi <strong>{name}</strong>,</h5>
                        <h5>Please enter a name for your session/call -</h5>
                        <br></br>
                        <h5>Session Title - <span><input type="text" id="session-title-input" value={sessionTitle} onChange={ this.setTitle } placeholder="(optional)" autoComplete="off"></input></span></h5>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.openModalTwo()}>
                            Generate Link
                        </Button>
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
                            <h6>
                                Your link is - <br></br>
                                <strong style={{color: '#3965bd'}}>my-meetapp.netlify.app/{roomId}/{sessionTitle}</strong>
                                <textarea id="copy_text" value={"my-meetapp-webrtc.netlify.app/"+roomId+"/"+sessionTitle}></textarea>

                            </h6>
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

export default Homepage;