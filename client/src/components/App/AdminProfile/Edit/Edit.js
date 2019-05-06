import React, { Component } from 'react'
import axios from 'axios'
import './Edit.css'
const bycrypt = require('bcryptjs')

class AdminProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            oldPass: '',
            newPass: '',
            confPass: '',
            firstname: '',
            lastname: '',
            cond: ""
        };

    }

    increment = async () => {

        await this.setState({
            oldPass: this.state.oldPass + '',
            newPass: this.state.newPass + '',
            confPass: this.state.confPass + ''

        })

        let newPasword = this.state.newPass;
        let oldPassword = this.state.oldPass;
        let confirmedPassword = this.state.confPass;

        let tokenData = JSON.parse(localStorage.getItem('token')).data;
        let userid = tokenData.userData.userId;
        let currentPass = await axios.get(`http://localhost:3001/api/profile/${userid}/GetPassword`, { headers: { Authorization: 'Bearer ' + tokenData.authData } });
        let flag = bycrypt.compare(oldPassword, currentPass.data, function (error, flag) {

            if (!flag) {
                document.getElementById("box1").value = ""
                document.getElementById("box2").value = ""
                document.getElementById("box3").value = ""
                window.alert("Old Password is incorrect. Please enter your current password")
            }
            else
                if (newPasword !== confirmedPassword) {
                    document.getElementById("box1").value = ""
                    document.getElementById("box2").value = ""
                    document.getElementById("box3").value = ""
                    window.alert("Confirmed Password does not match New Password, Please try again");
                }

                else
                    if (oldPassword === newPasword) {
                        document.getElementById("box1").value = ""
                        document.getElementById("box2").value = ""
                        document.getElementById("box3").value = ""
                        window.alert("Old Password is the same as New Password, Please choose a different New Password")
                    }
                    else {

                        let tokenData = JSON.parse(localStorage.getItem('token')).data;
                        console.log("NEW PASS" + newPasword)
                        let hashedPass = new Promise((resolve, reject) => {
                            bycrypt.hash(newPasword, 10, async function (err, hash) {
                                if (err) reject(err)
                                else {
                                    await axios.put(`http://localhost:3001/api/profile/${userid}/password`, { 'userType': 'Admin', 'password': hash }, { headers: { Authorization: 'Bearer ' + tokenData.authData } })
                                        .then(res => {
                                            console.log(res);
                                            console.log(res.data);
                                            document.getElementById("box1").value = ""
                                            document.getElementById("box2").value = ""
                                            document.getElementById("box3").value = ""
                                            window.alert("Password Updated Successfully!")
                                        })
                                }
                            })
                        })
                    }
        });


    }


    increment1 = async () => {
        this.setState({
            firstname: this.state.firstname + '',
            lastname: this.state.lastname + ''

        })

        let updatedFN = this.state.firstname;
        let updatedLN = this.state.lastname;

        console.log(updatedFN)
        console.log(updatedLN)

        let tokenData = JSON.parse(localStorage.getItem('token')).data;
        let userid = tokenData.userData.userId;
        await axios.put(`http://localhost:3001/api/profile/${userid}/name`, { 'userType': 'Admin', 'fname': updatedFN, 'lname': updatedLN }, { headers: { Authorization: 'Bearer ' + tokenData.authData } })
            .then(res => {
                console.log(res);
                console.log(res.data);
                document.getElementById("box4").value = ""
                document.getElementById("box5").value = ""
                window.alert("Name Updated Successfully!")
            })
    }

    handlerender = () => {

        this.setState({ cond: "button1" })

    }
    handlerender1 = () => {

        this.setState({ cond: "button2" })

    }

    handleChange(value1) {
        this.setState({
            oldPass: value1
        });
    }

    handleChange1(value2) {
        this.setState({
            newPass: value2
        });
    }

    handleChange2(value3) {
        this.setState({
            confPass: value3
        });
    }

    handleChange3(value4) {
        this.setState({
            firstname: value4
        });
    }

    handleChange4(value5) {
        this.setState({
            lastname: value5
        });
    }

    render() {

        let button;
        if (this.state.cond === "button1") {


            button = <div className="card profileCard">
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <div className="card-body">
                    <label>
                        <p>Old Password: </p>
                        <input id="box1" type="password" value1={this.state.oldPass} onChange={(event) => this.handleChange(event.target.value)} />
                        <p>New Password: </p>
                        <input id="box2" type="password" value2={this.state.newPass} onChange={(event) => this.handleChange1(event.target.value)} />
                        <p>Confirm New Password: </p>
                        <input id="box3" type="password" value3={this.state.confPass} onChange={(event) => this.handleChange2(event.target.value)} />
                        <label>
                            <button type="submit" onClick={() => this.increment()} className="btn btn-primary" >UPDATE PASSWORD </button>
                        </label>
                    </label>
                    <br />

                </div>
            </div>




        }
        else {

            if (this.state.cond === "button2") {

                button = <div className="card profileCard">
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <div className="card-body">
                        <label>
                            <p>New First Name: </p>
                            <input id="box4" type="text" value4={this.state.firstname} onChange={(event) => this.handleChange3(event.target.value)} />
                            <p>New Last Name: </p>
                            <input id="box5" type="text" value5={this.state.lastname} onChange={(event) => this.handleChange4(event.target.value)} />
                            <button type="submit" onClick={() => this.increment1()} className="btn btn-primary" >UPDATE NAME </button>
                        </label>
                        <br />

                    </div>
                </div>

            }
        }
        return (
            <div className='card-group'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='side-bar col-sm-2 ' >
                            <div className="list-group">

                                <button onClick={this.handlerender} type="submit" >Change Password</button><br />
                                <button onClick={this.handlerender1} type="submit">Change Name</button><br />

                            </div>
                        </div>
                        <div className='profile-window col-sm-10'>
                            {button}
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
export default AdminProfile