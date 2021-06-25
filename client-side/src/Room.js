import React, { Component } from 'react';
import { io } from 'socket.io-client';
import Peer from 'peerjs';


class Room extends Component {
  constructor(props) {
		super(props);
		this.state = {
          Users: [{'userId':'Vaidehi'}],
          MyId: "",
          MyStream: null,
          MyPeer:null,
          Streams: [],
		};
    this.socket = io("http://localhost:5000");
	};

  componentDidMount() {
    const roomId = this.props.match.params.id;

    this.socket.on("connect", () => {
      this.setState({ MyId: this.socket.id});
      console.log('my id', this.state.MyId);
      this.setState({MyPeer: new Peer(this.socket.id)});
      console.log('peer - ',this.state.MyPeer);
      this.socket.emit("join-room", { roomId: roomId, userName: 'Vaidehi', userId: this.socket.id} ); 
      this.getAllUsers(roomId);
      this.AcceptConnection();
    });

    this.getMyStream();

    this.socket.on("all-users", (array) => {
      this.setState({ Users:array });
      console.log('existing users updated in state');
    });

    this.HandleNewConn(roomId);
  };

  getMyStream = () => {
    navigator.mediaDevices.getUserMedia({'video':true, 'audio': true})
    .then(stream => {
      this.setState({ MyStream: stream });
      this.setState({ Streams: [...this.state.Streams, stream.id]});
      this.addMyVideo(stream);
    })
    .catch(error => {
      console.error('Error accessing media devices.', error);
    });
  };

  getAllUsers = (roomId) => {
    this.socket.emit("getAllUsers", roomId);
  };

  HandleNewConn = (roomId) => {
    this.socket.on("user-connected", (userId) => {
      this.getAllUsers(roomId);
      this.MakeConnection(userId);
      this.AcceptConnection();
    })
  };

  MakeConnection = (id) => {
    var call = this.state.MyPeer.call(id, this.state.MyStream);
    call.on("stream", (stream) => {
      if (!this.state.Streams.includes(stream.id)) {
        this.setState({ Streams: [...this.state.Streams, stream.id]})
        this.addMemberVideo(stream);
      }
    })
  };

  AcceptConnection = () => {
    this.state.MyPeer.on("call", (call) => {
      call.answer(this.state.MyStream);
      call.on("stream", (stream) => {
        if (!this.state.Streams.includes(stream.id)) {
          this.setState({ Streams: [...this.state.Streams, stream.id]})
          this.addMemberVideo(stream);
        }
      })     
    })
  };

  addMyVideo = (stream) => {
    const video = document.getElementById('myStream');
      video.srcObject = stream;
      video.play();
      video.muted = true;
  };

  addMemberVideo = (stream) => {
    const container = document.getElementById("stream-container");
    const video = document.createElement("video");
    container.appendChild(video);
    video.srcObject = stream;
    video.play();
  };

  myVideoControl = (stream) => {
    if(stream!=null){
      stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled);
      console.log("stream set", stream.getVideoTracks()[0])
    }
  };

  myAudioControl = (stream) => {
    if(stream!=null){
      stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
      console.log("stream set", stream.getAudioTracks()[0])
    }
  };


  render() {
    const { Users } = this.state;
    const { MyId } = this.state;
    const { MyStream } = this.state;

    return(
      <>
        <h3>My id is - {MyId}</h3>
        <h3>Connected users-  { Users.map(user => <div>{user.userId}</div>) }</h3>
        <div className='stream-container d-flex' id='stream-container'>
          <video id="myStream">

          </video>
          <button onClick={() => {this.myVideoControl(MyStream)}} id="video-btn" >Video</button>
          <button onClick={() => {this.myAudioControl(MyStream)}} id="audio-btn" >Audio</button>

        </div>
      </>
    )
  };
};


export default Room;
